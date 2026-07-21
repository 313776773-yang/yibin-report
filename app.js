(function () {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const DEFAULT_DATA = clone(window.DEFAULT_DASHBOARD_DATA || {});
  let DATA = clone(DEFAULT_DATA);
  let activePage = "overview";
  let selectedDecisionId = "D001";
  let selectedDomainId = "finance";
  let toastTimer;
  let tourIndex = 0;

  const PAGE_META = {
    overview: ["经营总览", "GM COMMAND VIEW"],
    causal: ["北极星因果树", "DRIVER EXPLORER"],
    decision: ["AI决策中心", "DECISION COPILOT"],
    domains: ["七大经营域", "OPERATING DOMAINS"],
    actions: ["行动闭环", "ACTION & EFFECT"],
    governance: ["数据治理", "TRUST & GOVERNANCE"],
  };

  const STATUS_NAME = { risk: "偏离", watch: "关注", good: "健康", limited: "受限" };
  const statusClass = (s) => ["risk", "watch", "good", "limited"].includes(s) ? s : "limited";
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
  const num = (value, digits = 1) => Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const int = (value) => Math.round(Number(value || 0)).toLocaleString("zh-CN");
  const pct = (value, digits = 1) => `${(Number(value || 0) * 100).toFixed(digits)}%`;
  const compact = (value, unit = "") => {
    const n = Number(value || 0);
    if (unit === "人次" && Math.abs(n) >= 10000) return `${(n / 10000).toFixed(2).replace(/0$/, "")}万`;
    if (Number.isInteger(n)) return int(n);
    return num(n, 1);
  };
  const signed = (value, unit = "") => {
    const n = Number(value || 0);
    return `${n > 0 ? "+" : ""}${Number.isInteger(n) ? int(n) : num(n, 1)}${unit}`;
  };
  const formatMetric = (item) => item.format === "percent" ? pct(item.value) : `${compact(item.value, item.unit)}${item.unit || ""}`;

  function $id(id) { return document.getElementById(id); }
  function setHTML(id, html) { const el = $id(id); if (el) el.innerHTML = html; }
  function toast(message) {
    const el = $id("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function validatePayload(payload) {
    const required = ["meta", "metrics", "north_stars", "decision_queue", "domains", "quality"];
    const missing = required.filter((key) => !(key in payload));
    if (missing.length) throw new Error(`JSON缺少字段：${missing.join("、")}`);
    if (!Array.isArray(payload.north_stars) || payload.north_stars.length !== 4) throw new Error("north_stars必须包含四项指标");
    if (!Array.isArray(payload.domains) || payload.domains.length !== 7) throw new Error("domains必须包含七大经营域");
    return true;
  }

  function updateMeta() {
    const meta = DATA.meta || {};
    $id("brandVersion").textContent = meta.version || "V3.0";
    $id("snapshotTime").textContent = meta.snapshot_time || "—";
    $id("sourceFile").textContent = meta.source_file || "数据源未标注";
    if (meta.imported_via === "excel") $id("loadStatus").textContent = `已在网页内完成Excel→JSON转换：${meta.source_file}；文件未上传`;
    else if (meta.imported_via === "json" || meta.demo === false) $id("loadStatus").textContent = "已导入外部JSON快照；请核对数据口径与质量状态";
    else $id("loadStatus").textContent = "当前为内置演示数据；可直接“导入Excel”完成本地转换";
    $id("sideQuality").textContent = DATA.quality?.status || "—";
    $id("qualityStatus").textContent = DATA.quality?.status || "—";
    $id("footerSnapshot").textContent = `SNAPSHOT ${meta.snapshot_id || "—"}`;
    $id("boundaryText").textContent = meta.boundary || "数据边界未说明";
  }

  function gotoPage(page) {
    if (!PAGE_META[page]) return;
    activePage = page;
    document.querySelectorAll(".page").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    $id("pageTitle").textContent = PAGE_META[page][0];
    $id("pageEyebrow").textContent = PAGE_META[page][1];
    document.querySelector(".main-stage").scrollTo({ top: 0, behavior: "smooth" });
    $id("appShell").classList.remove("sidebar-open");
  }

  function renderCausalRibbon() {
    const order = ["area", "traffic", "sales", "noi"];
    const items = order.map((id) => DATA.north_stars.find((x) => x.id === id)).filter(Boolean);
    setHTML("causalRibbon", items.map((item, i) => {
      const context = item.id === "area" ? "形成空间产能" : item.id === "traffic" ? "形成到场机会" : item.id === "sales" ? "形成可观测转化" : "形成经营结果";
      return `${i ? '<div class="ribbon-arrow" aria-hidden="true"></div>' : ""}<div class="ribbon-node"><div><small>${esc(context)}</small><b>${esc(item.name)}</b></div><em>${esc(compact(item.value, item.unit))}${esc(item.unit)}</em></div>`;
    }).join(""));
  }

  function renderNorthStars() {
    setHTML("northStarGrid", DATA.north_stars.map((item) => {
      const isSales = item.id === "sales";
      const progress = Math.max(0, Math.min(100, (item.target ? item.value / item.target : item.achievement + 1) * 100));
      let meta = "";
      if (isSales) {
        meta = `<span>固定样本同比 <b>${pct(item.achievement)}</b></span><span>覆盖 ${pct(item.coverage?.merchant || 0)}</span>`;
      } else if (item.id === "noi") {
        meta = `<span>预算 <b>${num(item.target, 0)}万元</b></span><span>达成 ${pct(item.achievement)}</span>`;
      } else if (item.id === "traffic") {
        meta = `<span>目标 <b>${int(item.target)}</b></span><span>达成 ${pct(item.achievement)}</span>`;
      } else {
        meta = `<span>可租赁 <b>${int(item.target)}㎡</b></span><span>有效率 ${pct(item.achievement)}</span>`;
      }
      const deltaText = isSales ? `固定样本 ${signed(item.delta, "万元")}` : item.id === "area" ? `较签约 ${signed(item.delta, "㎡")}` : item.id === "traffic" ? `较基线 ${signed(item.delta, "人次")}` : `较预算 ${signed(item.delta, "万元")}`;
      return `<article class="north-card ${statusClass(item.status)}" title="${esc(item.definition)}">
        <div class="north-head"><span class="north-name">${esc(item.name)}</span><span class="confidence"><i style="--confidence:${Math.round(item.confidence * 100)}%"></i>判断可信度 ${pct(item.confidence,0)}</span></div>
        <div class="north-value">${esc(compact(item.value, item.unit))}<small>${esc(item.unit)}</small></div>
        <div class="north-meta">${meta}</div>
        <div class="progress-track"><span style="width:${progress}%"></span></div>
        <div class="north-foot"><span>${esc(item.source)}</span><span class="delta ${Number(item.delta) < 0 ? "neg" : "pos"}">${esc(deltaText)}</span></div>
      </article>`;
    }).join(""));
  }

  function renderAIBrief() {
    const m = DATA.metrics;
    const decisions = DATA.decision_queue.slice(0, 3);
    setHTML("aiBrief", `<div class="brief-lead">
      <div class="brief-rank">01</div>
      <div><b>本月NOI预测${num(m.noi_forecast,0)}万元，较预算缺口${num(Math.abs(m.noi_gap),0)}万元；今天优先处理可干预的成本与收入确认事项。</b><p>客流与有效开业面积同时偏离，但销售数据覆盖不足，AI不把销售当作确定性缺口来源；回款风险${num(m.cash_risk,0)}万元单列为经营现金问题。</p></div>
    </div>
    <div class="brief-columns">
      <div class="brief-column"><h5>已确认事实 <span>FACT</span></h5><ul><li>NOI预测达成${pct(m.noi_achievement)}</li><li>客流目标达成${pct(m.traffic_achievement)}</li><li>有效开业率${pct(m.effective_area_rate)}</li></ul></div>
      <div class="brief-column"><h5>AI推断 <span>INFERENCE</span></h5><ul><li>能耗、维保是高可干预项</li><li>签约差额需按状态分层</li><li>销售增长仅能确认固定样本</li></ul></div>
      <div class="brief-column"><h5>建议决策 <span>ACTION</span></h5><ul>${decisions.map((d) => `<li>${esc(d.title)}</li>`).join("")}</ul></div>
    </div>`);
  }

  function renderNOIBridge() {
    const data = DATA.noi_bridge || [];
    const width = 440, height = 220, base = 180, top = 24, max = Math.max(...data.map((x) => Math.abs(x.value)), 1) * 1.06;
    const y = (v) => base - (v / max) * (base - top);
    const gap = 28, barW = 64;
    let cumulative = data[0]?.value || 0;
    let bars = "";
    data.forEach((item, index) => {
      const x = 32 + index * (barW + gap);
      let rectY, rectH, color;
      if (item.kind === "total") {
        rectY = y(item.value); rectH = base - rectY; color = index === data.length - 1 ? "#d6ae62" : "#5ec9d7";
      } else {
        const next = cumulative + item.value;
        rectY = Math.min(y(cumulative), y(next)); rectH = Math.max(7, Math.abs(y(next) - y(cumulative))); color = item.value < 0 ? "#f0727d" : "#5cd6a1";
        cumulative = next;
      }
      bars += `<rect x="${x}" y="${rectY}" width="${barW}" height="${rectH}" rx="6" fill="${color}" opacity=".84"></rect>
        <text x="${x + barW / 2}" y="${Math.max(14, rectY - 7)}" text-anchor="middle" class="chart-value">${item.value > 0 && item.kind !== "total" ? "+" : ""}${item.value}</text>
        <text x="${x + barW / 2}" y="204" text-anchor="middle" class="chart-label">${esc(item.label)}</text>`;
    });
    setHTML("noiBridgeChart", `<svg viewBox="0 0 ${width} ${height}" class="svg-chart" role="img" aria-label="NOI预算到预测桥图">
      <defs><linearGradient id="noiBg" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#d6ae62" stop-opacity=".2"/><stop offset="1" stop-color="#d6ae62" stop-opacity=".02"/></linearGradient></defs>
      <line x1="20" y1="${base}" x2="420" y2="${base}" class="chart-grid"></line>${bars}
      <text x="420" y="16" text-anchor="end" class="chart-label">单位：万元</text>
    </svg>`);
  }

  function renderTrafficChart() {
    const data = DATA.traffic_trend || [];
    if (!data.length) return setHTML("trafficChart", "<p>暂无客流趋势数据</p>");
    const w = 470, h = 240, pad = { l: 22, r: 10, t: 16, b: 30 };
    const values = data.flatMap((d) => [d.actual, d.baseline]);
    const min = Math.min(...values) * .93, max = Math.max(...values) * 1.05;
    const x = (i) => pad.l + (i / Math.max(1, data.length - 1)) * (w - pad.l - pad.r);
    const y = (v) => pad.t + (max - v) / Math.max(1, max - min) * (h - pad.t - pad.b);
    const line = (key) => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
    const area = `${line("actual")} L${x(data.length - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`;
    const ticks = [0, Math.floor((data.length - 1) / 2), data.length - 1];
    setHTML("trafficChart", `<svg viewBox="0 0 ${w} ${h}" class="svg-chart" role="img" aria-label="项目入口客流15日趋势">
      <defs><linearGradient id="trafficGradient" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#d6ae62" stop-opacity=".25"/><stop offset="1" stop-color="#d6ae62" stop-opacity="0"/></linearGradient></defs>
      ${[0,1,2,3].map((i) => `<line x1="${pad.l}" x2="${w-pad.r}" y1="${pad.t+i*(h-pad.t-pad.b)/3}" y2="${pad.t+i*(h-pad.t-pad.b)/3}" class="chart-grid"></line>`).join("")}
      <path d="${area}" class="chart-area"></path><path d="${line("baseline")}" class="chart-line-baseline"></path><path d="${line("actual")}" class="chart-line-actual"></path>
      ${data.map((d,i)=>`<circle cx="${x(i)}" cy="${y(d.actual)}" r="2.2" fill="#f0cf8c"></circle>`).join("")}
      ${ticks.map((i)=>`<text x="${x(i)}" y="${h-8}" text-anchor="middle" class="chart-label">${esc(data[i].date.slice(5))}</text>`).join("")}
      <text x="${w-10}" y="12" text-anchor="end" class="chart-label">实线：实际　虚线：动态基线</text>
    </svg>`);
  }

  function renderDecisionQueue() {
    setHTML("decisionQueue", DATA.decision_queue.map((d) => `<div class="decision-row" data-open-decision="${esc(d.id)}">
      <span class="priority-badge ${esc(d.priority)}">${esc(d.priority)}</span>
      <div class="decision-main"><b>${esc(d.title)}</b><small>${esc(d.domain)}</small></div>
      <div class="decision-impact">${esc(d.impact)}</div><div class="decision-deadline">${esc(d.deadline)}</div>
      <div class="score-ring" style="--score:${Number(d.score)}"><span>${Number(d.score)}</span></div><span class="row-chevron">›</span>
    </div>`).join(""));
  }

  function renderDomainPulse() {
    setHTML("domainPulse", DATA.domains.map((d, i) => `<div class="pulse-card" data-domain="${esc(d.id)}">
      <div class="pulse-top"><span class="pulse-number">0${i + 1}</span><i class="status-orb ${statusClass(d.status)}"></i></div>
      <h5>${esc(d.name)}</h5><p>${esc(d.headline)}</p>
      <div class="pulse-score"><b>${Number(d.score)}</b><div class="mini-track"><span style="width:${Number(d.score)}%"></span></div></div>
    </div>`).join(""));
  }

  function renderOverview() {
    renderCausalRibbon(); renderNorthStars(); renderAIBrief(); renderNOIBridge(); renderDecisionQueue(); renderTrafficChart(); renderDomainPulse();
    const p0 = (DATA.domains.find((d) => d.id === "risk")?.metrics || []).find((m) => m.label === "P0事件")?.value || 0;
    $id("p0Status").innerHTML = p0 ? `<span>安全护栏</span><b>${p0}项P0事件</b><small>已强制置顶</small>` : `<span>安全护栏</span><b>当前无P0事件</b><small>重大事件将强制置顶</small>`;
  }

  function renderCausalTree() {
    const groups = [
      ["noi"],
      ["income", "cost"],
      ["rent", "other_income", "energy", "maintenance", "other_cost"],
      ["area", "traffic", "sales"],
    ];
    const nodeMap = Object.fromEntries(DATA.causal_nodes.map((n) => [n.id, n]));
    setHTML("causalTree", `<div class="causal-tree">${groups.map((ids) => `<div class="tree-column">${ids.map((id) => {
      const n = nodeMap[id]; if (!n) return "";
      return `<button class="tree-node ${n.parent ? "" : "root"}" data-driver="${esc(n.id)}"><div class="tree-node-head"><small>${esc(n.label)}</small><i class="${statusClass(n.status)}"></i></div><div class="tree-node-value">${esc(compact(n.value, n.unit))}<small>${esc(n.unit)}</small></div><div class="tree-impact">${n.impact === null ? "影响暂不量化" : `缺口影响 ${signed(n.impact, "万元")}`}</div></button>`;
    }).join("")}</div>`).join("")}<div class="tree-note">说明：主链用于解释经营传导；AI同时读取预算、合同、成本、日历、设备与风险变量，不进行单一线性归因。</div></div>`);
  }

  function inspectDriver(id) {
    const n = DATA.causal_nodes.find((x) => x.id === id); if (!n) return;
    document.querySelectorAll(".tree-node").forEach((el) => el.classList.toggle("active", el.dataset.driver === id));
    const interpret = {
      noi: ["预算NOI520万元，当前预测486万元。", "收入与成本差异共同造成34万元缺口。", "选择项目权限内、证据充分且可验证的改善组合。"],
      income: ["预测收入940万元。", "收入确认与其他经营收入存在可改善空间。", "核验可确认起租事项与合同/凭证完整性。"],
      cost: ["预测成本454万元。", "成本端差异约22万元，是当前主要缺口来源。", "优先处理能耗与维保，同时设置体验护栏。"],
      rent: ["固定租金预测608万元。", "有效开业、起租计费与合同确认共同影响收入。", "按铺位核对计费、开业与合同状态。"],
      other_income: ["物管费及其他收入预测332万元。", "收入结构需要证据支持，不以销售覆盖不足推断。", "核验已发生但未确认的可计收入。"],
      energy: ["能耗预测126万元。", "实际较预算增加，运行策略是高可干预变量。", "先校正天气和营业时长，再试行分时控制。"],
      maintenance: ["维保预测94万元。", "重复性工单与设备效率可能推高成本。", "按设备识别重复故障与停业影响。"],
      other_cost: ["其他运营成本预测234万元。", "需拆分可控与不可控、一次性与经常性。", "按科目验证差异，不做笼统压降。"],
      area: ["有效开业面积36540㎡。", "签约与有效开业差额3360㎡，原因不能统一归为装修。", "按暂停、筹备、空置、门槛问题逐铺处理。"],
      traffic: ["项目入口客流286400人次。", "较动态基线低2.8%，需考虑天气、活动和设备状态。", "先判断真实偏差，再决定营销与现场动作。"],
      sales: ["可统计销售1268万元。", "商户覆盖79.3%、面积覆盖76.0%，仅能确认固定样本增长。", "优先提升迟报商户覆盖，不外推未覆盖商户。"],
    }[id] || ["事实待确认", "推断待确认", "动作待确认"];
    setHTML("driverInspector", `<div class="panel-heading"><div><span class="panel-kicker">DRIVER INSPECTOR</span><h4>驱动项解释</h4></div><span class="status-chip ${statusClass(n.status)}">${STATUS_NAME[n.status] || "—"}</span></div>
      <div class="inspector-content"><div class="driver-title"><small>${esc(n.label)}</small><b>${esc(compact(n.value, n.unit))}${esc(n.unit)}</b></div>
      <div class="inspector-section"><h5>已确认事实</h5><p>${esc(interpret[0])}</p></div>
      <div class="inspector-section"><h5>AI推断</h5><p>${esc(interpret[1])}</p></div>
      <div class="inspector-section"><h5>可干预动作</h5><p>${esc(interpret[2])}</p></div>
      <div class="inspector-section"><h5>证据与边界</h5><div class="evidence-list"><div class="evidence-item"><span>数据源</span><b>${esc(n.source)}</b></div><div class="evidence-item"><span>量化影响</span><b>${n.impact === null ? "暂不量化" : signed(n.impact, "万元")}</b></div><div class="evidence-item"><span>判断状态</span><b>${esc(STATUS_NAME[n.status] || "—")}</b></div></div></div></div>`);
  }

  function renderAreaFunnel() {
    const data = DATA.area_funnel || [];
    const max = Math.max(...data.map((x) => x.value), 1);
    setHTML("areaFunnel", `<div class="funnel">${data.map((x, i) => `<div class="funnel-row"><label>0${i + 1}　${esc(x.label)}</label><div class="funnel-bar-wrap"><div class="funnel-bar" style="width:${x.value / max * 100}%"></div></div><b>${int(x.value)}㎡</b></div>`).join("")}</div>`);
  }

  function scenarioResult(values) {
    const gain = Number(values.energy) + Number(values.maintenance) + Number(values.billing) + Number(values.other_income) - Number(values.cost);
    const forecast = Number(DATA.scenario.baseline) + gain;
    const gap = forecast - Number(DATA.scenario.budget);
    $id("scenarioGain").textContent = `${gain >= 0 ? "+" : ""}${num(gain, 1)}万元`;
    $id("scenarioForecast").textContent = `${num(forecast, 1)}万元`;
    $id("scenarioGap").textContent = `${gap >= 0 ? "+" : ""}${num(gap, 1)}万元`;
  }

  function readScenarioControls() {
    const values = {};
    document.querySelectorAll("[data-scenario-input]").forEach((input) => { values[input.dataset.scenarioInput] = Number(input.value); const out = document.querySelector(`[data-scenario-output="${input.dataset.scenarioInput}"]`); if (out) out.textContent = `${Number(input.value).toFixed(1)}万`; });
    scenarioResult(values);
  }

  function applyScenarioPreset(id) {
    const preset = DATA.scenario.presets.find((x) => x.id === id); if (!preset) return;
    document.querySelectorAll(".scenario-preset").forEach((el) => el.classList.toggle("active", el.dataset.preset === id));
    ["energy", "maintenance", "billing", "other_income", "cost"].forEach((key) => { const el = document.querySelector(`[data-scenario-input="${key}"]`); if (el) el.value = preset[key]; });
    readScenarioControls();
  }

  function renderScenarioEngine() {
    const presets = DATA.scenario.presets || [];
    setHTML("scenarioEngine", `<div class="scenario-presets">${presets.map((p) => `<button class="scenario-preset ${p.id === "B" ? "active" : ""}" data-preset="${esc(p.id)}"><b>方案${esc(p.id)}｜${esc(p.name)}</b><small>预计净改善 ${num(p.expected,0)}万 · 风险${esc(p.risk)}</small></button>`).join("")}</div>
      <div class="scenario-controls">
        ${[["energy","能耗压降",0,10],["maintenance","维保优化",0,6],["billing","起租/收入确认",0,10],["other_income","其他经营收入",0,10],["cost","执行成本",0,5]].map(([key,label,min,max]) => `<div class="scenario-control"><label>${label}</label><input type="range" min="${min}" max="${max}" step=".5" data-scenario-input="${key}"><output data-scenario-output="${key}">0.0万</output></div>`).join("")}
      </div>
      <div class="scenario-result"><div class="improve"><small>预计净改善</small><b id="scenarioGain">—</b></div><div><small>方案后NOI预测</small><b id="scenarioForecast">—</b></div><div class="gap"><small>较预算差额</small><b id="scenarioGap">—</b></div><div><small>已验证方案B</small><b>${num(DATA.scenario.validated.actual_net,1)}万元</b></div></div>
      <div class="scenario-footnote">推演值用于方案比较，不等同于财务承诺；最终需由责任部门确认假设、成本和授权边界。</div>`);
    applyScenarioPreset("B");
  }

  function renderCausalPage() { renderCausalTree(); renderAreaFunnel(); renderScenarioEngine(); }

  function renderPipeline() {
    setHTML("aiPipeline", DATA.ai_pipeline.map((x) => `<div class="pipeline-step" data-pipeline-step="${x.step}"><span>0${x.step}</span><b>${esc(x.name)}</b><p>${esc(x.detail)}</p><small>${esc(x.owner)}</small></div>`).join(""));
  }

  function renderDecisionInbox() {
    setHTML("decisionInbox", DATA.decision_queue.map((d) => `<div class="inbox-item ${d.id === selectedDecisionId ? "active" : ""}" data-select-decision="${esc(d.id)}"><div class="inbox-top"><span class="priority-badge ${esc(d.priority)}">${esc(d.priority)}</span><span class="inbox-score">${Number(d.score)}分</span></div><h5>${esc(d.title)}</h5><p>${esc(d.impact)} · ${esc(d.deadline)}</p></div>`).join(""));
  }

  function renderDecisionCard() {
    const d = DATA.decision_queue.find((x) => x.id === selectedDecisionId) || DATA.decision_queue[0]; if (!d) return;
    selectedDecisionId = d.id;
    const options = d.id === "D001" ? [
      ["A", "维持路径", "维持当前路径，不追加专项动作。", "NOI预测486万元", false],
      ["B", "稳健改善", "能耗、维保、起租确认与其他收入组合改善。", "预计净改善12万元", true],
      ["C", "进取改善", "扩大干预范围，潜在改善更高但证据和成本风险上升。", "预计净改善24万元", false],
    ] : [
      ["A", "观察", "维持当前节奏，补充证据后再决策。", "风险：可能延误", false],
      ["B", "推荐动作", d.recommendation, d.impact, true],
      ["C", "升级协同", "将事项升级为跨部门专项并增加管理资源。", "影响待测算", false],
    ];
    setHTML("decisionCard", `<div class="decision-card-header"><div><span class="panel-kicker">AI DECISION CARD · ${esc(d.id)}</span><h4>${esc(d.title)}</h4><p>${esc(d.domain)} · ${esc(d.deadline)} · ${esc(d.authorization)}</p></div><div class="decision-confidence"><small>AI判断可信度</small><b>${pct(d.confidence,0)}</b></div></div>
      <div class="decision-tabs"><button class="decision-tab active">决策全景</button><button class="decision-tab" data-show-trace="${esc(d.id)}">证据链</button><button class="decision-tab" data-goto="actions">执行验证</button></div>
      <div class="fact-inference-grid"><div class="reason-card"><span>01 / FACT</span><h5>已确认事实</h5><p>${esc(d.fact)}</p></div><div class="reason-card"><span>02 / INFERENCE</span><h5>AI推断</h5><p>${esc(d.inference)}</p></div></div>
      <div class="options-grid">${options.map((o) => `<div class="option-card ${o[4] ? "recommended" : ""}">${o[4] ? '<span class="recommended-label">AI推荐</span>' : ""}<h5>方案${o[0]}｜${esc(o[1])}</h5><p>${esc(o[2])}</p><div class="option-effect">${esc(o[3])}</div></div>`).join("")}</div>
      <div class="decision-controls"><div class="authorization">授权边界：<b>${esc(d.authorization)}</b>　影响北极星：<b>${esc((d.affected || []).join("、"))}</b></div><div class="manager-actions"><button class="button ghost" data-manager-action="reject">暂不采纳</button><button class="button secondary" data-manager-action="revise">修正建议</button><button class="button primary" data-manager-action="accept">采纳方案B</button></div></div>`);
  }

  function answerQuery(query) {
    const normalized = query.trim(); if (!normalized) return;
    let preset = DATA.query_presets.find((x) => x.q === normalized);
    if (!preset) {
      const keywords = [
        ["NOI", 0], ["缺口", 0], ["销售", 1], ["覆盖", 1], ["京东", 2], ["有效开业", 3], ["面积", 3],
      ];
      const match = keywords.find(([key]) => normalized.includes(key));
      preset = match ? DATA.query_presets[match[1]] : null;
    }
    const answer = preset?.answer || "当前快照中没有足够证据回答这个问题。建议将问题限定为NOI、可统计销售额、项目入口客流、有效开业面积、经营现金或任务效果；正式系统可通过API接入大模型和知识库扩展问答。";
    setHTML("queryAnswer", `<span class="answer-label">AI</span><p>${esc(answer)}</p>`);
  }

  function renderQuery() {
    setHTML("queryChips", DATA.query_presets.map((x) => `<button class="query-chip" data-query="${esc(x.q)}">${esc(x.q)}</button>`).join(""));
  }

  function renderDecisionPage() { renderPipeline(); renderDecisionInbox(); renderDecisionCard(); renderQuery(); }

  const DOMAIN_LOGIC = {
    finance: { rules: [["结果", "NOI预测与预算缺口"],["分解", "收入端、成本端、经营现金分离"],["AI", "差异归因、预测区间、项目权限内方案"],["护栏", "回款风险不直接写成NOI增益"]], steps: [["读取","预算/实绩"],["识别","差异科目"],["测算","月末预测"],["推演","改善组合"],["验证","实际效果"]] },
    asset: { rules: [["资产漏斗", "可租赁→签约→起租→有效开业"],["租约", "到期预警、续约与替补招商"],["下钻", "暂停、筹备、空置、开业门槛"],["边界", "装修仅为生命周期环节"]], steps: [["读取","铺位/合同"],["校验","营业状态"],["定位","差额铺位"],["测算","NOI影响"],["下达","分层任务"]] },
    merchant: { rules: [["口径", "仅统计有效报数商户"],["比较", "固定样本与动态全量并存"],["诊断", "商户偏离自身基线"],["边界", "不外推京东及未覆盖商户"]], steps: [["接入","商户报数"],["校验","覆盖质量"],["识别","异常商户"],["生成","一商一策"],["复盘","策略效果"]] },
    growth: { rules: [["客流", "不同客流类型不得相加"],["基线", "工作日、天气、节假日和活动"],["营销", "活动前预测与活动后归因"],["护栏", "设备离线先校正再判断"]], steps: [["接入","客流日历"],["校正","设备状态"],["对比","动态基线"],["归因","天气活动"],["建议","增长动作"]] },
    property: { rules: [["成本", "能耗、维保与其他成本"],["现场", "设备工单、营业中断与体验"],["效率", "预算、营业时长与单耗"],["护栏", "降耗不得损害舒适度"]], steps: [["接入","能耗工单"],["识别","偏差设备"],["排除","外部因素"],["测算","压降潜力"],["验证","成本体验"]] },
    risk: { rules: [["优先级", "P0安全事件独立置顶"],["升级", "按授权矩阵与时限处理"],["复发", "聚类重复问题和关联区域"],["证据", "结案必须有取证与验证"]], steps: [["接入","客诉风险"],["分类","严重等级"],["聚类","重复问题"],["升级","责任权限"],["追踪","闭环复发"]] },
    execution: { rules: [["转化", "决策转责任任务"],["证据", "完成须有证据编号"],["验证", "预期、实际、成本与干扰因素"],["学习", "结果回写模型与案例库"]], steps: [["确认","管理选择"],["分解","责任任务"],["执行","过程证据"],["验证","效果归因"],["学习","规则更新"]] },
  };

  function renderDomainTabs() {
    setHTML("domainTabs", DATA.domains.map((d, i) => `<button class="domain-tab ${d.id === selectedDomainId ? "active" : ""}" data-domain-tab="${esc(d.id)}"><span>DOMAIN 0${i + 1}</span><b>${esc(d.name)}</b><em><i class="status-orb ${statusClass(d.status)}"></i>${esc(STATUS_NAME[d.status] || "—")} · ${Number(d.score)}分</em></button>`).join(""));
  }

  function renderDomainDetail() {
    const d = DATA.domains.find((x) => x.id === selectedDomainId) || DATA.domains[0]; if (!d) return;
    selectedDomainId = d.id;
    const logic = DOMAIN_LOGIC[d.id] || DOMAIN_LOGIC.finance;
    setHTML("domainDetail", `<div class="domain-hero"><div class="domain-title-card"><div class="domain-title-top"><div><span class="panel-kicker">${esc(d.owner)}</span><h4>${esc(d.name)}</h4><p>${esc(d.headline)}</p></div><div class="domain-score-large"><small>经营状态分</small><b>${Number(d.score)}</b><span class="status-chip ${statusClass(d.status)}">${esc(STATUS_NAME[d.status] || "—")}</span></div></div><div class="domain-metric-strip">${d.metrics.map((m) => `<div class="domain-metric"><small>${esc(m.label)}</small><b>${esc(formatMetric(m))}</b></div>`).join("")}</div></div>
      <div class="gm-questions"><h5>总经理必须回答的问题</h5>${d.questions.map((q, i) => `<div class="gm-question"><span>0${i + 1}</span><div>${esc(q)}</div></div>`).join("")}</div></div>
      <div class="domain-detail-grid"><div class="domain-data-panel"><span class="panel-kicker">MANAGEMENT LOGIC</span><h5>管控逻辑与边界</h5><div class="domain-rule-list">${logic.rules.map((r) => `<div class="domain-rule"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join("")}</div><div class="subtle-callout"><b>数据来源</b><span>${esc(d.source)}</span></div></div>
      <div class="domain-ai-panel"><span class="panel-kicker">AI ENABLEMENT</span><h5>AI如何在该经营域发挥作用</h5><div class="domain-ai-flow">${logic.steps.map((s) => `<div class="domain-ai-step"><b>${esc(s[0])}</b><small>${esc(s[1])}</small></div>`).join("")}</div><div class="subtle-callout"><b>人机边界</b><span>AI输出事实、推断、选项与可信度；责任部门核验数据，总经理在授权范围内决策。</span></div></div></div>`);
  }

  function renderDomainsPage() { renderDomainTabs(); renderDomainDetail(); }

  function renderActionStory() {
    const actual = DATA.scenario.validated.actual_net;
    const stages = [
      ["01", "异常识别", "NOI预测486万元，较预算缺口34万元。", "P1"],
      ["02", "方案推演", "AI比较维持、稳健和进取三套方案。", "推荐B"],
      ["03", "管理者确认", "总经理采纳稳健方案并明确验证要求。", "已确认"],
      ["04", "任务执行", `${DATA.tasks.length}项任务拆解到责任部门并回传证据。`, "100%"],
      ["05", "效果验证", "核验预期、实际、成本、置信度和干扰因素。", `${num(actual,1)}万元`],
    ];
    setHTML("actionStory", stages.map((s) => `<div class="story-stage"><span>${s[0]}</span><h5>${esc(s[1])}</h5><p>${esc(s[2])}</p><b>${esc(s[3])}</b></div>`).join(""));
  }

  function renderTaskTable() {
    setHTML("taskTable", `<table class="data-table"><thead><tr><th>任务</th><th>责任人</th><th>协同</th><th>截止</th><th>状态</th><th>进度</th><th>预期影响</th><th>证据</th></tr></thead><tbody>${DATA.tasks.map((t) => `<tr><td><strong>${esc(t.task_name)}</strong></td><td>${esc(t.owner)}</td><td>${esc(t.collaborators)}</td><td>${esc(String(t.due_date || "").slice(0,10))}</td><td><span class="status-chip success">${esc(t.task_status)}</span></td><td class="progress-cell"><span class="mini-track"><span style="width:${Number(t.progress || 0) * 100}%"></span></span>${pct(t.progress || 0,0)}</td><td>${signed(t.expected_effect || 0, "万")}</td><td>${esc(t.completion_evidence || "—")}</td></tr>`).join("")}</tbody></table>`);
  }

  function renderEffectChart() {
    const data = DATA.effects || [];
    const max = Math.max(...data.flatMap((x) => [Math.abs(Number(x.expected_value || 0)), Math.abs(Number(x.actual_value || 0))]), 1);
    setHTML("effectChart", `<div class="effect-bars">${data.map((x) => `<div class="effect-item"><label>${esc(x.task_id)}</label><div class="effect-dual"><span class="expected" style="width:${Math.abs(Number(x.expected_value || 0))/max*100}%"></span><span class="actual" style="width:${Math.abs(Number(x.actual_value || 0))/max*100}%"></span></div><b>${num(x.actual_value,1)}</b></div>`).join("")}</div><div class="effect-legend"><span><i class="expected"></i>预期</span><span><i class="actual"></i>实际</span></div><div class="subtle-callout"><b>验证结论</b><span>方案B实际净改善${num(DATA.scenario.validated.actual_net,1)}万元，达成${pct(DATA.scenario.validated.attainment)}；未达部分需结合天气、供应商结算与客流干扰复盘。</span></div>`);
  }

  function renderActionsPage() {
    $id("validatedEffect").textContent = `${num(DATA.scenario.validated.actual_net,1)}万元`;
    renderActionStory(); renderTaskTable(); renderEffectChart();
  }

  function availabilityLevel(raw) {
    const value = String(raw || "");
    if (value.startsWith("A")) return "A";
    if (value.startsWith("B")) return "B";
    if (value.startsWith("C")) return "C";
    if (value.startsWith("D")) return "D";
    return "B";
  }

  function renderAvailability() {
    const rows = DATA.data_availability || [];
    setHTML("availabilityTable", `<table class="data-table"><thead><tr><th>数据项</th><th>现载体</th><th>责任人</th><th>可得等级</th><th>历史深度</th><th>颗粒度</th><th>完整性</th><th>导出能力</th><th>审计状态</th><th>说明</th></tr></thead><tbody>${rows.map((r) => { const level = availabilityLevel(r.availability_level); return `<tr><td><strong>${esc(r.data_item)}</strong></td><td>${esc(r.current_carrier)}</td><td>${esc(r.owner)}</td><td><span class="availability-level ${level}">${level}</span> ${esc(r.availability_level)}</td><td>${esc(r.historical_depth)}</td><td>${esc(r.grain)}</td><td>${esc(r.completeness)}</td><td>${esc(r.exportability)}</td><td>${esc(r.audit_status)}</td><td>${esc(r.notes)}</td></tr>`; }).join("")}</tbody></table>`);
  }

  function renderQuality() {
    const q = DATA.quality;
    const items = [
      ["销售商户覆盖率", q.sales_merchant_coverage],
      ["销售面积覆盖率", q.sales_area_coverage],
      ["客流设备在线率", q.traffic_online_rate],
      ["模型关键勾稽", q.status === "PASS" ? 1 : 0],
    ];
    setHTML("qualityGuardrails", `<div class="guardrail-list">${items.map((x) => `<div class="guardrail-item"><div class="guardrail-head"><span>${esc(x[0])}</span><b>${pct(x[1])}</b></div><div class="progress-track"><span style="width:${Math.max(0, Math.min(100, x[1]*100))}%"></span></div></div>`).join("")}</div><div class="limitation-list"><b>当前限制</b><ul>${q.limitations.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`);
  }

  function renderSourceMap() {
    setHTML("sourceMapTable", `<table class="data-table"><thead><tr><th>页面指标</th><th>来源表</th><th>刷新</th><th>责任人</th><th>核心规则</th></tr></thead><tbody>${DATA.source_map.map((r) => `<tr><td><strong>${esc(r.display)}</strong></td><td>${esc(r.sources.join("、"))}</td><td>${esc(r.refresh)}</td><td>${esc(r.owner)}</td><td>${esc(r.rule)}</td></tr>`).join("")}</tbody></table>`);
  }

  function renderMetricContracts() {
    const keyIds = ["NS_NOI_FCST", "NS_SALES", "NS_TRAFFIC", "NS_EFFECTIVE_AREA", "CASH_COLLECTION", "SALES_COVER_M", "SALES_COVER_A", "TASK_EFFECTIVE"];
    const rows = keyIds.map((id) => DATA.metric_definitions.find((x) => x.metric_id === id)).filter(Boolean);
    setHTML("metricContracts", rows.map((r) => `<div class="contract-card"><span>${esc(r.metric_id)}</span><h5>${esc(r.metric_name)}</h5><p>${esc(r.definition)}</p><small>公式：${esc(r.formula_text)}<br>来源：${esc(r.source_sheet)} · 责任：${esc(r.owner)}</small></div>`).join(""));
  }

  function renderGovernancePage() { renderAvailability(); renderQuality(); renderSourceMap(); renderMetricContracts(); }

  function openDecisionModal(id) {
    const d = DATA.decision_queue.find((x) => x.id === id); if (!d) return;
    openModal(`<span class="panel-kicker">AI DECISION TRACE · ${esc(d.id)}</span><h3 id="modalTitle">${esc(d.title)}</h3><p>${esc(d.domain)} · 优先级${esc(d.priority)} · 判断可信度${pct(d.confidence,0)}</p><div class="modal-grid"><div class="modal-section"><h5>已确认事实</h5><p>${esc(d.fact)}</p></div><div class="modal-section"><h5>AI推断</h5><p>${esc(d.inference)}</p></div><div class="modal-section"><h5>推荐动作</h5><p>${esc(d.recommendation)}</p></div><div class="modal-section"><h5>授权与边界</h5><p>${esc(d.authorization)}；影响${esc((d.affected || []).join("、"))}。事实、推断与建议必须分别核验。</p></div></div><div class="decision-controls"><span class="authorization">优先级评分 ${d.score} / 100</span><button class="button primary" data-modal-goto-decision="${esc(d.id)}">进入AI决策中心</button></div>`);
  }

  function openTraceModal() {
    openModal(`<span class="panel-kicker">EXPLAINABLE AI PIPELINE</span><h3 id="modalTitle">AI如何生成一张决策卡</h3><p>计算与预测由后台指标服务完成，大模型读取结构化结果、运营手册、授权矩阵和历史案例，负责解释与方案生成。</p><div class="trace-flow">${DATA.ai_pipeline.map((x) => `<div class="trace-row"><span>0${x.step}</span><div><b>${esc(x.name)}</b><small>${esc(x.detail)} · ${esc(x.owner)}</small></div><em>可追溯</em></div>`).join("")}</div>`);
  }

  function openModal(html) { setHTML("modalContent", html); $id("modalBackdrop").hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal() { $id("modalBackdrop").hidden = true; document.body.style.overflow = ""; }

  const TOUR = [
    { page: "overview", title: "先看四大结果", text: "总经理首页只突出NOI预测、可统计销售额、项目入口客流、有效开业面积。经营现金是重要护栏，但不与NOI混算。" },
    { page: "causal", title: "再找缺口驱动", text: "从NOI结果下钻到收入、成本和经营传导变量。点击节点能看到事实、AI推断、可干预动作和数据边界。" },
    { page: "decision", title: "展示AI真正做了什么", text: "AI不是一句话摘要，而是经历数据更新、指标计算、异常识别、影响测算、知识推理和结构化决策卡生成。" },
    { page: "actions", title: "一策到底", text: "总经理确认后，建议被拆成责任任务；完成后回传证据，再验证实际效果和干扰因素。" },
    { page: "governance", title: "最后证明可信与可落地", text: "数据可得性矩阵、指标口径、刷新步骤和京东边界都被明确写入产品，避免靠模拟数据制造智能。" },
  ];

  function showTourStep(index) {
    tourIndex = Math.max(0, Math.min(TOUR.length - 1, index));
    const item = TOUR[tourIndex]; gotoPage(item.page);
    $id("tourStepLabel").textContent = `0${tourIndex + 1} / 0${TOUR.length}`;
    $id("tourTitle").textContent = item.title;
    $id("tourText").textContent = item.text;
    $id("tourNext").textContent = tourIndex === TOUR.length - 1 ? "完成" : "下一步";
    setHTML("tourProgress", TOUR.map((_, i) => `<i class="${i <= tourIndex ? "active" : ""}"></i>`).join(""));
  }
  function startTour() { $id("tourOverlay").hidden = false; showTourStep(0); }
  function endTour() { $id("tourOverlay").hidden = true; }

  function renderAll() {
    updateMeta(); renderOverview(); renderCausalPage(); renderDecisionPage(); renderDomainsPage(); renderActionsPage(); renderGovernancePage();
  }

  function handleImport(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        validatePayload(payload);
        payload.meta = { ...payload.meta, demo: payload.meta.demo ?? false, data_mode: payload.meta.data_mode || "外部JSON快照", imported_via: "json" };
        DATA = payload;
        selectedDecisionId = DATA.decision_queue[0]?.id || "";
        selectedDomainId = DATA.domains[0]?.id || "";
        renderAll();
        toast("JSON已导入，六个页面与指标联动已刷新");
      } catch (error) { toast(`导入失败：${error.message}`); }
    };
    reader.readAsText(file, "utf-8");
  }

  async function handleExcelImport(file) {
    if (!file) return;
    if (!window.XlsxBridge) return toast("Excel转换组件未加载，请使用一键更新脚本");
    const status = $id("loadStatus");
    try {
      const payload = await window.XlsxBridge.parse(file, DEFAULT_DATA, (message) => { status.textContent = message; });
      validatePayload(payload);
      DATA = payload;
      selectedDecisionId = DATA.decision_queue[0]?.id || "";
      selectedDomainId = DATA.domains[0]?.id || "";
      renderAll();
      const quality = DATA.quality?.status || "待检查";
      toast(`Excel已转换并刷新看板；模型检查：${quality}`);
      if (quality !== "PASS") status.textContent += "；警告：模型检查未通过，请先核对Excel";
    } catch (error) {
      updateMeta();
      toast(`Excel转换失败：${error.message}`);
    }
  }

  function downloadCurrentJSON() {
    const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `dashboard_data_${DATA.meta?.snapshot_id || "snapshot"}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("当前JSON快照已生成");
  }

  function bindEvents() {
    $id("navList").addEventListener("click", (e) => { const btn = e.target.closest("[data-page]"); if (btn) gotoPage(btn.dataset.page); });
    $id("mobileMenu").addEventListener("click", () => $id("appShell").classList.toggle("sidebar-open"));
    $id("jsonInput").addEventListener("change", (e) => handleImport(e.target.files[0]));
    $id("excelInput").addEventListener("change", (e) => handleExcelImport(e.target.files[0]));
    document.querySelectorAll("[data-secondary-import]").forEach((el) => el.addEventListener("change", (e) => handleImport(e.target.files[0])));
    document.querySelectorAll("[data-secondary-excel]").forEach((el) => el.addEventListener("change", (e) => handleExcelImport(e.target.files[0])));
    $id("resetDataBtn").addEventListener("click", () => { DATA = clone(DEFAULT_DATA); selectedDecisionId = "D001"; selectedDomainId = "finance"; renderAll(); toast("已恢复内置演示数据"); });
    $id("downloadSampleBtn").addEventListener("click", downloadCurrentJSON);
    $id("traceBtn").addEventListener("click", openTraceModal);
    $id("modalClose").addEventListener("click", closeModal);
    $id("modalBackdrop").addEventListener("click", (e) => { if (e.target === $id("modalBackdrop")) closeModal(); });
    $id("tourBtn").addEventListener("click", startTour);
    $id("tourExit").addEventListener("click", endTour);
    $id("tourNext").addEventListener("click", () => { if (tourIndex >= TOUR.length - 1) endTour(); else showTourStep(tourIndex + 1); });
    $id("queryForm").addEventListener("submit", (e) => { e.preventDefault(); answerQuery($id("queryInput").value); });

    document.addEventListener("click", (e) => {
      const goto = e.target.closest("[data-goto]"); if (goto) gotoPage(goto.dataset.goto);
      const open = e.target.closest("[data-open-decision]"); if (open) openDecisionModal(open.dataset.openDecision);
      const modalGoto = e.target.closest("[data-modal-goto-decision]"); if (modalGoto) { selectedDecisionId = modalGoto.dataset.modalGotoDecision; closeModal(); gotoPage("decision"); renderDecisionInbox(); renderDecisionCard(); }
      const driver = e.target.closest("[data-driver]"); if (driver) inspectDriver(driver.dataset.driver);
      const preset = e.target.closest("[data-preset]"); if (preset) applyScenarioPreset(preset.dataset.preset);
      const inbox = e.target.closest("[data-select-decision]"); if (inbox) { selectedDecisionId = inbox.dataset.selectDecision; renderDecisionInbox(); renderDecisionCard(); }
      const domain = e.target.closest("[data-domain]"); if (domain) { selectedDomainId = domain.dataset.domain; gotoPage("domains"); renderDomainTabs(); renderDomainDetail(); }
      const domainTab = e.target.closest("[data-domain-tab]"); if (domainTab) { selectedDomainId = domainTab.dataset.domainTab; renderDomainTabs(); renderDomainDetail(); }
      const query = e.target.closest("[data-query]"); if (query) { $id("queryInput").value = query.dataset.query; answerQuery(query.dataset.query); }
      const trace = e.target.closest("[data-show-trace]"); if (trace) openDecisionModal(trace.dataset.showTrace);
      const manager = e.target.closest("[data-manager-action]"); if (manager) {
        const messages = { accept: "已模拟采纳方案B：正式系统将生成责任任务并写入决策日志", revise: "已进入人机协同修正：管理者意见将作为新约束重新推演", reject: "已模拟暂不采纳：AI将记录原因并等待新数据触发" };
        toast(messages[manager.dataset.managerAction]);
      }
    });
    document.addEventListener("input", (e) => { if (e.target.matches("[data-scenario-input]")) readScenarioControls(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); endTour(); } });
  }

  function init() {
    validatePayload(DATA);
    renderAll();
    bindEvents();
    gotoPage("overview");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
