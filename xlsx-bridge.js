(function (global) {
  "use strict";

  const decoder = new TextDecoder("utf-8");

  function u16(view, offset) { return view.getUint16(offset, true); }
  function u32(view, offset) { return view.getUint32(offset, true); }

  function decodeXml(text) {
    return String(text || "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&amp;/g, "&")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  }

  function attr(text, name) {
    const match = String(text).match(new RegExp(`(?:^|\\s)${name.replace(":", "\\:")}=(["'])([\\s\\S]*?)\\1`));
    return match ? decodeXml(match[2]) : null;
  }

  function normalisePath(base, target) {
    if (target.startsWith("/")) return target.replace(/^\//, "");
    const parts = `${base}/${target}`.split("/");
    const out = [];
    parts.forEach((part) => { if (!part || part === ".") return; if (part === "..") out.pop(); else out.push(part); });
    return out.join("/");
  }

  async function inflateRaw(bytes) {
    if (typeof DecompressionStream === "undefined") throw new Error("当前浏览器不支持本地Excel解压，请使用Chrome、Edge或一键更新脚本");
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function unzip(buffer) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
      if (u32(view, i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("文件不是有效的XLSX工作簿");
    const entries = u16(view, eocd + 10);
    let cursor = u32(view, eocd + 16);
    const files = new Map();
    for (let index = 0; index < entries; index++) {
      if (u32(view, cursor) !== 0x02014b50) throw new Error("Excel压缩目录损坏");
      const method = u16(view, cursor + 10);
      const compressedSize = u32(view, cursor + 20);
      const fileNameLength = u16(view, cursor + 28);
      const extraLength = u16(view, cursor + 30);
      const commentLength = u16(view, cursor + 32);
      const localOffset = u32(view, cursor + 42);
      const fileName = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + fileNameLength));
      if (u32(view, localOffset) !== 0x04034b50) throw new Error(`Excel数据项损坏：${fileName}`);
      const localNameLength = u16(view, localOffset + 26);
      const localExtraLength = u16(view, localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(start, start + compressedSize);
      let content;
      if (method === 0) content = compressed;
      else if (method === 8) content = await inflateRaw(compressed);
      else throw new Error(`暂不支持Excel压缩方式：${method}`);
      files.set(fileName, content);
      cursor += 46 + fileNameLength + extraLength + commentLength;
    }
    return files;
  }

  function textFile(files, path) {
    const value = files.get(path);
    return value ? decoder.decode(value) : "";
  }

  function parseSharedStrings(xml) {
    const values = [];
    for (const match of xml.matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)) {
      let value = "";
      for (const text of match[1].matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)) value += decodeXml(text[1]);
      values.push(value);
    }
    return values;
  }

  function columnIndex(ref) {
    const letters = String(ref).match(/^[A-Z]+/i)?.[0]?.toUpperCase() || "A";
    let value = 0;
    for (const letter of letters) value = value * 26 + letter.charCodeAt(0) - 64;
    return value - 1;
  }

  function parseSheet(xml, sharedStrings) {
    const cells = new Map();
    let maxRow = 0, maxCol = 0;
    for (const match of xml.matchAll(/<(?:\w+:)?c\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/g)) {
      const attributes = match[1], body = match[2];
      const ref = attr(attributes, "r");
      if (!ref) continue;
      const type = attr(attributes, "t") || "n";
      const raw = body.match(/<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1];
      let value = null;
      if (type === "inlineStr") {
        value = Array.from(body.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)).map((x) => decodeXml(x[1])).join("");
      } else if (raw !== undefined) {
        if (type === "s") value = sharedStrings[Number(raw)] ?? "";
        else if (type === "b") value = raw === "1";
        else if (type === "str" || type === "e") value = decodeXml(raw);
        else value = raw === "" || Number.isNaN(Number(raw)) ? decodeXml(raw) : Number(raw);
      }
      cells.set(ref.toUpperCase(), value);
      const row = Number(ref.match(/\d+$/)?.[0] || 0);
      const col = columnIndex(ref);
      maxRow = Math.max(maxRow, row); maxCol = Math.max(maxCol, col);
    }
    return { cells, maxRow, maxCol };
  }

  function parseWorkbook(files) {
    const workbookXml = textFile(files, "xl/workbook.xml");
    const relsXml = textFile(files, "xl/_rels/workbook.xml.rels");
    if (!workbookXml || !relsXml) throw new Error("工作簿缺少必要的Excel结构文件");
    const rels = {};
    for (const match of relsXml.matchAll(/<(?:\w+:)?Relationship\b([^>]*)\/?\s*>/g)) {
      const id = attr(match[1], "Id"), target = attr(match[1], "Target");
      if (id && target) rels[id] = normalisePath("xl", target);
    }
    const sharedStrings = parseSharedStrings(textFile(files, "xl/sharedStrings.xml"));
    const sheets = new Map();
    for (const match of workbookXml.matchAll(/<(?:\w+:)?sheet\b([^>]*)\/?\s*>/g)) {
      const name = attr(match[1], "name"), relId = attr(match[1], "r:id");
      const path = rels[relId];
      if (name && path && files.has(path)) sheets.set(name, parseSheet(textFile(files, path), sharedStrings));
    }
    return sheets;
  }

  function cell(sheets, sheetName, ref, fallback = null) {
    return sheets.get(sheetName)?.cells.get(ref.toUpperCase()) ?? fallback;
  }

  function colLetter(index) {
    let value = index + 1, result = "";
    while (value > 0) { const r = (value - 1) % 26; result = String.fromCharCode(65 + r) + result; value = Math.floor((value - 1) / 26); }
    return result;
  }

  function excelDate(value) {
    if (typeof value !== "number" || value < 1000) return value;
    const date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    return date.toISOString().replace("T", " ").slice(0, 16);
  }

  function records(sheets, sheetName) {
    const sheet = sheets.get(sheetName);
    if (!sheet) return [];
    const headers = [];
    for (let c = 0; c <= sheet.maxCol; c++) headers[c] = sheet.cells.get(`${colLetter(c)}5`);
    const rows = [];
    for (let r = 6; r <= sheet.maxRow; r++) {
      const row = {};
      let hasValue = false;
      headers.forEach((header, c) => {
        if (!header) return;
        let value = sheet.cells.get(`${colLetter(c)}${r}`);
        if (value !== undefined && value !== null && value !== "") hasValue = true;
        if (typeof value === "number" && /(date|time|_at$|updated|created|approved|validated)/i.test(String(header))) value = excelDate(value);
        row[header] = value ?? null;
      });
      if (hasValue) rows.push(row);
    }
    return rows;
  }

  const n = (value) => Number(value || 0);
  const sum = (rows, field, predicate = () => true) => rows.filter(predicate).reduce((total, row) => total + n(row[field]), 0);
  const countDistinct = (rows, field, predicate = () => true) => new Set(rows.filter(predicate).map((row) => row[field]).filter(Boolean)).size;
  const percent = (value, total) => total ? value / total : 0;

  function localTimestamp(date = new Date()) {
    const parts = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(date);
    const get = (type) => parts.find((x) => x.type === type)?.value || "00";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
  }

  function syncPayload(sheets, file, baseData) {
    const payload = JSON.parse(JSON.stringify(baseData));
    const dash = (ref) => n(cell(sheets, "01_管理驾驶舱", ref));
    const m = {
      noi_budget: dash("B6"), noi_income: dash("B7"), noi_cost: dash("B8"), noi_forecast: dash("B9"), noi_gap: dash("B10"), noi_achievement: dash("B11"),
      sales_reported: dash("D6"), sales_comparable_current: dash("D7"), sales_comparable_prior: dash("D8"), sales_yoy: dash("D9"), sales_merchant_coverage: dash("D10"), sales_area_coverage: dash("D11"),
      traffic: dash("F6"), traffic_baseline: dash("F7"), traffic_vs_baseline: dash("F8"), traffic_target: dash("F9"), traffic_achievement: dash("F10"), traffic_online_rate: dash("F11"),
      lettable_area: dash("H6"), signed_area: dash("H7"), effective_area: dash("H8"), billing_area: dash("H9"), effective_area_rate: dash("H10"), signed_effective_gap: dash("H11"),
      receivable: dash("J6"), cash_received: dash("J7"), cash_collection_rate: dash("J8"), cash_risk: dash("J9"), scenario_b_noi: dash("J10"), validated_noi: dash("J11"),
    };
    if (!m.noi_budget || !m.lettable_area) throw new Error("Excel关键指标为空。请先在Excel中完成计算并保存，再重新导入");
    payload.metrics = m;

    const now = localTimestamp();
    const snapshot = `XLSX-${now.replace(/[-: ]/g, "").slice(0, 12)}`;
    const mode = String(cell(sheets, "00_使用说明", "B4", "Excel导入数据"));
    payload.meta = { ...payload.meta, snapshot_id: snapshot, snapshot_time: now, source_file: file.name, data_mode: "网页内Excel转换", imported_via: "excel", demo: mode.includes("演示") };

    const starMap = Object.fromEntries(payload.north_stars.map((x) => [x.id, x]));
    Object.assign(starMap.noi, { value: m.noi_forecast, target: m.noi_budget, achievement: m.noi_achievement, delta: m.noi_gap, status: m.noi_achievement < .95 ? "risk" : m.noi_achievement < 1 ? "watch" : "good" });
    Object.assign(starMap.sales, { value: m.sales_reported, achievement: m.sales_yoy, delta: m.sales_comparable_current - m.sales_comparable_prior, coverage: { merchant: m.sales_merchant_coverage, area: m.sales_area_coverage }, status: m.sales_area_coverage < .85 ? "watch" : "good" });
    Object.assign(starMap.traffic, { value: m.traffic, target: m.traffic_target, achievement: m.traffic_achievement, delta: m.traffic - m.traffic_baseline, coverage: { device_online: m.traffic_online_rate }, status: m.traffic_achievement < .98 ? "watch" : "good" });
    Object.assign(starMap.area, { value: m.effective_area, target: m.lettable_area, achievement: m.effective_area_rate, delta: m.effective_area - m.signed_area, status: m.effective_area_rate < .9 ? "watch" : "good" });

    payload.noi_bridge = [{ label: "预算NOI", value: m.noi_budget, kind: "total" }, { label: "收入差异", value: -(m.noi_budget - m.noi_forecast) * .35, kind: "negative" }, { label: "成本差异", value: -(m.noi_budget - m.noi_forecast) * .65, kind: "negative" }, { label: "预测NOI", value: m.noi_forecast, kind: "total" }];
    payload.area_funnel = [{ label: "可租赁面积", value: m.lettable_area }, { label: "已签约面积", value: m.signed_area }, { label: "起租计费面积", value: m.billing_area }, { label: "有效开业面积", value: m.effective_area }];

    const trafficRows = records(sheets, "16_客流数据");
    const daily = {};
    trafficRows.filter((r) => r.flow_type === "项目入口" && n(r.valid_flag) === 1).forEach((r) => {
      const day = String(r.date_key || "").slice(0, 10);
      daily[day] ||= { date: day, actual: 0, baseline: 0, target: 0, online: [], online_rate: 0 };
      daily[day].actual += n(r.in_count); daily[day].baseline += n(r.baseline_count); daily[day].target += n(r.target_count); daily[day].online.push(n(r.online_rate));
    });
    payload.traffic_trend = Object.values(daily).sort((a, b) => a.date.localeCompare(b.date)).map((x) => ({ ...x, online_rate: x.online.reduce((a, b) => a + b, 0) / Math.max(1, x.online.length), online: undefined }));

    const salesRows = records(sheets, "15_销售日报");
    const salesStatus = {};
    salesRows.forEach((r) => { const key = r.report_status || "未标注"; salesStatus[key] = (salesStatus[key] || 0) + 1; });
    payload.sales_status = Object.entries(salesStatus).map(([label, value]) => ({ label, value }));

    const statusRows = records(sheets, "14_营业状态");
    const operating = {};
    statusRows.forEach((r) => { const key = r.operating_status || "未标注"; operating[key] ||= { label: key, count: 0, area: 0 }; operating[key].count += 1; operating[key].area += n(r.gross_leasable_area); });
    payload.operating_status = Object.values(operating);

    const incomeRows = records(sheets, "11_经营收入"), expenseRows = records(sheets, "12_运营支出"), energyRows = records(sheets, "18_物业能耗");
    const incomeByCode = Object.fromEntries(incomeRows.map((r) => [r.account_code, n(r.amount)]));
    const expenseByCode = Object.fromEntries(expenseRows.map((r) => [r.account_code, n(r.amount)]));
    const nodeMap = Object.fromEntries(payload.causal_nodes.map((x) => [x.id, x]));
    Object.assign(nodeMap.noi, { value: m.noi_forecast, impact: m.noi_gap }); Object.assign(nodeMap.income, { value: m.noi_income }); Object.assign(nodeMap.cost, { value: m.noi_cost });
    Object.assign(nodeMap.rent, { value: incomeByCode.INC_RENT || 0 }); Object.assign(nodeMap.other_income, { value: incomeByCode.INC_OTHER || 0 });
    Object.assign(nodeMap.energy, { value: expenseByCode.EXP_ENERGY || 0 }); Object.assign(nodeMap.maintenance, { value: expenseByCode.EXP_MAINT || 0 }); Object.assign(nodeMap.other_cost, { value: expenseByCode.EXP_OTHER || 0 });
    Object.assign(nodeMap.area, { value: m.effective_area }); Object.assign(nodeMap.traffic, { value: m.traffic }); Object.assign(nodeMap.sales, { value: m.sales_reported });

    const tasks = records(sheets, "21_责任任务"), effects = records(sheets, "22_效果验证");
    if (tasks.length) payload.tasks = tasks;
    if (effects.length) payload.effects = effects;
    const actualNet = effects.length ? sum(effects, "actual_value") : m.validated_noi - m.noi_forecast;
    const expectedNet = effects.length ? sum(effects, "expected_value") : m.scenario_b_noi - m.noi_forecast;
    payload.scenario.baseline = m.noi_forecast; payload.scenario.budget = m.noi_budget;
    payload.scenario.validated = { choice: "B", actual_net: actualNet, forecast_after: m.noi_forecast + actualNet, attainment: percent(actualNet, expectedNet || 12) };

    const energyActual = sum(energyRows, "cost_amount"), energyBudget = sum(energyRows, "budget_cost");
    const decisions = Object.fromEntries(payload.decision_queue.map((x) => [x.id, x]));
    Object.assign(decisions.D001, { impact: `预计缺口${Math.abs(m.noi_gap).toFixed(1)}万元`, fact: `预算NOI ${m.noi_budget.toFixed(1)}万元，预测${m.noi_forecast.toFixed(1)}万元，达成${(m.noi_achievement * 100).toFixed(1)}%。` });
    Object.assign(decisions.D002, { impact: `回款风险${m.cash_risk.toFixed(1)}万元`, fact: `当期应收${m.receivable.toFixed(1)}万元、实收${m.cash_received.toFixed(1)}万元，收缴率${(m.cash_collection_rate * 100).toFixed(1)}%。` });
    Object.assign(decisions.D003, { impact: `较预算增加${(energyActual - energyBudget).toFixed(1)}万元`, fact: `能耗及水务费用${energyActual.toFixed(1)}万元，预算${energyBudget.toFixed(1)}万元。` });
    Object.assign(decisions.D004, { fact: `商户覆盖率${(m.sales_merchant_coverage * 100).toFixed(1)}%，面积覆盖率${(m.sales_area_coverage * 100).toFixed(1)}%。` });
    Object.assign(decisions.D005, { impact: `转化差额${m.signed_effective_gap.toFixed(0)}㎡`, fact: `已签约${m.signed_area.toFixed(0)}㎡，有效开业${m.effective_area.toFixed(0)}㎡，差额${m.signed_effective_gap.toFixed(0)}㎡。` });

    const domains = Object.fromEntries(payload.domains.map((x) => [x.id, x]));
    domains.finance.metrics = [{ label: "预测NOI", value: m.noi_forecast, unit: "万元" }, { label: "缺口", value: m.noi_gap, unit: "万元" }, { label: "收缴率", value: m.cash_collection_rate, format: "percent" }];
    domains.asset.metrics = [{ label: "签约面积", value: m.signed_area, unit: "㎡" }, { label: "有效开业面积", value: m.effective_area, unit: "㎡" }, { label: "起租计费面积", value: m.billing_area, unit: "㎡" }];
    domains.merchant.metrics = [{ label: "可统计销售", value: m.sales_reported, unit: "万元" }, { label: "固定样本同比", value: m.sales_yoy, format: "percent" }, { label: "面积覆盖", value: m.sales_area_coverage, format: "percent" }];
    domains.growth.metrics = [{ label: "项目入口客流", value: m.traffic, unit: "人次" }, { label: "目标达成", value: m.traffic_achievement, format: "percent" }, { label: "设备在线", value: m.traffic_online_rate, format: "percent" }];
    domains.property.metrics = [{ label: "实际费用", value: energyActual, unit: "万元" }, { label: "预算费用", value: energyBudget, unit: "万元" }, { label: "偏差", value: energyActual - energyBudget, unit: "万元" }];
    domains.execution.metrics = [{ label: "任务完成率", value: percent(tasks.filter((r) => ["已完成", "已关闭"].includes(r.task_status)).length, tasks.length), format: "percent" }, { label: "实际净改善", value: actualNet, unit: "万元" }, { label: "验证达成", value: percent(actualNet, expectedNet || 12), format: "percent" }];

    payload.data_availability = records(sheets, "04_数据盘点") || payload.data_availability;
    payload.metric_definitions = records(sheets, "02_指标口径") || payload.metric_definitions;
    payload.responsibilities = records(sheets, "03_数据责任") || payload.responsibilities;
    payload.ai_decisions = records(sheets, "23_AI决策日志") || payload.ai_decisions;
    payload.quality = { ...payload.quality, status: String(cell(sheets, "24_模型检查", "B2", "待检查")), sales_merchant_coverage: m.sales_merchant_coverage, sales_area_coverage: m.sales_area_coverage, traffic_online_rate: m.traffic_online_rate };
    return payload;
  }

  async function parse(file, baseData, onProgress = () => {}) {
    if (!file || !/\.xlsx$/i.test(file.name || "")) throw new Error("请选择.xlsx格式的Excel工作簿");
    onProgress("正在读取Excel文件…");
    const files = await unzip(await file.arrayBuffer());
    onProgress("正在解析工作表与公式结果…");
    const sheets = parseWorkbook(files);
    const required = ["00_使用说明", "01_管理驾驶舱", "14_营业状态", "15_销售日报", "16_客流数据", "24_模型检查"];
    const missing = required.filter((name) => !sheets.has(name));
    if (missing.length) throw new Error(`Excel模板不匹配，缺少工作表：${missing.join("、")}`);
    onProgress("正在生成看板数据契约…");
    const payload = syncPayload(sheets, file, baseData);
    onProgress("Excel转换完成");
    return payload;
  }

  global.XlsxBridge = { parse };
})(window);
