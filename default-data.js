window.DEFAULT_DASHBOARD_DATA = {
  "meta": {
    "project": "重百宜宾商都",
    "product": "AI总经理经营决策中枢",
    "version": "V3.0 成品版",
    "snapshot_id": "S20260715-0900",
    "snapshot_time": "2026-07-15 09:00",
    "analysis_period": "2026年7月",
    "data_mode": "内置演示数据",
    "demo": true,
    "source_file": "宜宾商都AI经营决策中枢_数据确认与演示模板_v1.0.xlsx",
    "boundary": "京东家电经营数据不可得；仅使用项目可确认的铺位、合同与营业状态，不进入销售、会员及顾客分析。"
  },
  "metrics": {
    "noi_budget": 520.0,
    "noi_income": 940.0,
    "noi_cost": 454.0,
    "noi_forecast": 486.0,
    "noi_gap": -34.0,
    "noi_achievement": 0.9346153846153846,
    "sales_reported": 1268.0,
    "sales_comparable_current": 1230.0,
    "sales_comparable_prior": 1205.0,
    "sales_yoy": 0.020746887966804906,
    "sales_merchant_coverage": 0.7931034482758621,
    "sales_area_coverage": 0.7597902097902098,
    "traffic": 286400.0,
    "traffic_baseline": 294800.0,
    "traffic_vs_baseline": -0.028493894165535938,
    "traffic_target": 300000.0,
    "traffic_achievement": 0.9546666666666667,
    "traffic_online_rate": 0.987,
    "lettable_area": 42000.0,
    "signed_area": 39900.0,
    "effective_area": 36540.0,
    "billing_area": 37800.0,
    "effective_area_rate": 0.87,
    "signed_effective_gap": 3360.0,
    "receivable": 600.0,
    "cash_received": 572.0,
    "cash_collection_rate": 0.9533333333333334,
    "cash_risk": 28.0,
    "scenario_b_noi": 498.0,
    "validated_noi": 496.7
  },
  "north_stars": [
    {
      "id": "noi",
      "name": "NOI预测",
      "value": 486.0,
      "unit": "万元",
      "target": 520.0,
      "achievement": 0.9346153846153846,
      "delta": -34.0,
      "status": "risk",
      "confidence": 0.86,
      "definition": "本月预计经营收入减预计运营支出；经营现金回款单独展示，不与权责发生制NOI混算。",
      "source": "10_NOI预算、11_经营收入、12_运营支出"
    },
    {
      "id": "sales",
      "name": "可统计销售额",
      "value": 1268.0,
      "unit": "万元",
      "target": null,
      "achievement": 0.020746887966804906,
      "delta": 25.0,
      "status": "watch",
      "confidence": 0.78,
      "definition": "仅统计已有效报数商户；必须同时显示商户与面积覆盖率，不外推未覆盖商户。",
      "source": "15_销售日报",
      "coverage": {
        "merchant": 0.7931034482758621,
        "area": 0.7597902097902098
      }
    },
    {
      "id": "traffic",
      "name": "项目入口客流",
      "value": 286400.0,
      "unit": "人次",
      "target": 300000.0,
      "achievement": 0.9546666666666667,
      "delta": -8400.0,
      "status": "watch",
      "confidence": 0.91,
      "definition": "有效入口设备客流合计；项目入口、楼层、商户、活动与停车客流不得相加。",
      "source": "16_客流数据、09_经营日历",
      "coverage": {
        "device_online": 0.987
      }
    },
    {
      "id": "area",
      "name": "有效开业面积",
      "value": 36540.0,
      "unit": "㎡",
      "target": 42000.0,
      "achievement": 0.87,
      "delta": -3360.0,
      "status": "watch",
      "confidence": 0.95,
      "definition": "完成开业检查、无一票否决项、当前正常营业且能持续产生经营价值的租赁面积。",
      "source": "06_铺位主档、08_合同租约、14_营业状态"
    }
  ],
  "traffic_trend": [
    {
      "date": "2026-07-01",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-02",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-03",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-04",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-05",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-06",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-07",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-08",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-09",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-10",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-11",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-12",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-13",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-14",
      "actual": 19000,
      "baseline": 19600,
      "target": 20000,
      "online_rate": 0.987
    },
    {
      "date": "2026-07-15",
      "actual": 20400,
      "baseline": 20400,
      "target": 20000,
      "online_rate": 0.987
    }
  ],
  "noi_bridge": [
    {
      "label": "预算NOI",
      "value": 520.0,
      "kind": "total"
    },
    {
      "label": "收入差异",
      "value": -12,
      "kind": "negative"
    },
    {
      "label": "成本差异",
      "value": -22,
      "kind": "negative"
    },
    {
      "label": "预测NOI",
      "value": 486.0,
      "kind": "total"
    }
  ],
  "area_funnel": [
    {
      "label": "可租赁面积",
      "value": 42000.0
    },
    {
      "label": "已签约面积",
      "value": 39900.0
    },
    {
      "label": "起租计费面积",
      "value": 37800.0
    },
    {
      "label": "有效开业面积",
      "value": 36540.0
    }
  ],
  "sales_status": [
    {
      "label": "已报",
      "value": 46
    },
    {
      "label": "迟报",
      "value": 12
    }
  ],
  "operating_status": [
    {
      "label": "正常营业",
      "count": 57,
      "area": 36540.0
    },
    {
      "label": "暂停营业",
      "count": 2,
      "area": 660.0
    },
    {
      "label": "筹备中",
      "count": 2,
      "area": 2700.0
    },
    {
      "label": "空置",
      "count": 1,
      "area": 2100.0
    }
  ],
  "causal_nodes": [
    {
      "id": "noi",
      "label": "NOI预测",
      "value": 486.0,
      "unit": "万元",
      "parent": null,
      "direction": "result",
      "impact": -34.0,
      "status": "risk",
      "source": "11_经营收入、12_运营支出"
    },
    {
      "id": "income",
      "label": "预测收入",
      "value": 940.0,
      "unit": "万元",
      "parent": "noi",
      "direction": "positive",
      "impact": -12,
      "status": "watch",
      "source": "11_经营收入"
    },
    {
      "id": "cost",
      "label": "预测成本",
      "value": 454.0,
      "unit": "万元",
      "parent": "noi",
      "direction": "negative",
      "impact": -22,
      "status": "risk",
      "source": "12_运营支出"
    },
    {
      "id": "rent",
      "label": "固定租金",
      "value": 608.0,
      "unit": "万元",
      "parent": "income",
      "direction": "positive",
      "impact": -4,
      "status": "watch",
      "source": "11_经营收入"
    },
    {
      "id": "other_income",
      "label": "物管费及其他收入",
      "value": 332.0,
      "unit": "万元",
      "parent": "income",
      "direction": "positive",
      "impact": -8,
      "status": "watch",
      "source": "11_经营收入"
    },
    {
      "id": "energy",
      "label": "能耗",
      "value": 126.0,
      "unit": "万元",
      "parent": "cost",
      "direction": "negative",
      "impact": -8,
      "status": "risk",
      "source": "12_运营支出、18_物业能耗"
    },
    {
      "id": "maintenance",
      "label": "维保",
      "value": 94.0,
      "unit": "万元",
      "parent": "cost",
      "direction": "negative",
      "impact": -6,
      "status": "watch",
      "source": "12_运营支出、19_设备工单"
    },
    {
      "id": "other_cost",
      "label": "其他运营成本",
      "value": 234.0,
      "unit": "万元",
      "parent": "cost",
      "direction": "negative",
      "impact": -8,
      "status": "watch",
      "source": "12_运营支出"
    },
    {
      "id": "area",
      "label": "有效开业面积",
      "value": 36540.0,
      "unit": "㎡",
      "parent": "rent",
      "direction": "driver",
      "impact": -3.5,
      "status": "watch",
      "source": "14_营业状态"
    },
    {
      "id": "traffic",
      "label": "项目入口客流",
      "value": 286400.0,
      "unit": "人次",
      "parent": "other_income",
      "direction": "driver",
      "impact": -2.1,
      "status": "watch",
      "source": "16_客流数据"
    },
    {
      "id": "sales",
      "label": "可统计销售额",
      "value": 1268.0,
      "unit": "万元",
      "parent": "other_income",
      "direction": "driver",
      "impact": null,
      "status": "limited",
      "source": "15_销售日报"
    }
  ],
  "decision_queue": [
    {
      "id": "D001",
      "priority": "P1",
      "title": "本月NOI预测缺口改善",
      "domain": "NOI、预算与经营现金",
      "impact": "预计缺口34万元",
      "deadline": "今日决策",
      "score": 91,
      "confidence": 0.86,
      "fact": "预算NOI 520万元，预测486万元，达成93.5%。",
      "inference": "目前更可干预的变量集中在能耗、维保、可确认起租事项与其他经营收入；销售覆盖不足，不作为确定性缺口原因。",
      "recommendation": "采纳稳健方案B，预计净改善12万元，并将每项动作拆成任务后验证。",
      "affected": [
        "NOI预测",
        "有效开业面积"
      ],
      "authorization": "项目权限内"
    },
    {
      "id": "D002",
      "priority": "P1",
      "title": "经营现金风险专项跟踪",
      "domain": "NOI、预算与经营现金",
      "impact": "回款风险28万元",
      "deadline": "今日确认",
      "score": 86,
      "confidence": 0.93,
      "fact": "当期应收600万元、实收572万元，收缴率95.3%。",
      "inference": "风险首先影响现金，不应直接写成NOI增益；需按账龄、争议与履约状态分层。",
      "recommendation": "财务牵头形成28万元风险清单，区分可催收、争议待确认和坏账风险。",
      "affected": [
        "经营现金"
      ],
      "authorization": "项目权限内"
    },
    {
      "id": "D003",
      "priority": "P1",
      "title": "能耗费用偏差压降",
      "domain": "物业工程、能耗与现场品质",
      "impact": "较预算增加8.0万元",
      "deadline": "24小时内",
      "score": 82,
      "confidence": 0.88,
      "fact": "能耗及水务费用126.0万元，预算118.0万元。",
      "inference": "公共区域空调运行时长与重点设备效率是当前高可干预项，需先排除天气与营业时长影响。",
      "recommendation": "核验运行策略并试行分时控制，保留舒适度和客诉作为护栏指标。",
      "affected": [
        "NOI预测",
        "客流"
      ],
      "authorization": "项目权限内"
    },
    {
      "id": "D004",
      "priority": "P2",
      "title": "销售数据覆盖率治理",
      "domain": "商户经营、销售与一商一策",
      "impact": "限制销售归因可信度",
      "deadline": "本周推进",
      "score": 75,
      "confidence": 0.78,
      "fact": "商户覆盖率79.3%，面积覆盖率76.0%。",
      "inference": "覆盖率变化可能被误判为销售增长；未覆盖商户不得外推。",
      "recommendation": "优先补齐已约定报数但迟报商户，固定样本与全量口径同时保留。",
      "affected": [
        "可统计销售额"
      ],
      "authorization": "部门协同"
    },
    {
      "id": "D005",
      "priority": "P2",
      "title": "签约面积向有效开业面积转化",
      "domain": "资产、出租、租约与招商",
      "impact": "转化差额3360㎡",
      "deadline": "本周排查",
      "score": 73,
      "confidence": 0.95,
      "fact": "已签约39900㎡，有效开业36540㎡，差额3360㎡。",
      "inference": "差额由暂停营业、筹备中、空置及检查门槛等不同状态构成，不能统一归因为装修延期。",
      "recommendation": "按铺位状态和经济影响分层处理；装修筹开仅作为其中一个下钻环节。",
      "affected": [
        "有效开业面积",
        "NOI预测"
      ],
      "authorization": "跨部门协同"
    }
  ],
  "domains": [
    {
      "id": "finance",
      "name": "NOI、预算与经营现金",
      "owner": "财务/总经办",
      "status": "risk",
      "score": 72,
      "headline": "预测NOI达成93.5%，现金风险需单列",
      "metrics": [
        {
          "label": "预测NOI",
          "value": 486.0,
          "unit": "万元"
        },
        {
          "label": "缺口",
          "value": -34.0,
          "unit": "万元"
        },
        {
          "label": "收缴率",
          "value": 0.9533333333333334,
          "format": "percent"
        }
      ],
      "questions": [
        "缺口来自收入端还是成本端？",
        "哪些差异可以在项目权限内追回？",
        "回款风险是否被错误计入NOI？"
      ],
      "source": "10_NOI预算、11_经营收入、12_运营支出、13_应收回款"
    },
    {
      "id": "asset",
      "name": "资产、出租、租约与招商",
      "owner": "招商/租约/运营",
      "status": "watch",
      "score": 81,
      "headline": "有效开业率87.0%，需提升签约转化质量",
      "metrics": [
        {
          "label": "签约面积",
          "value": 39900.0,
          "unit": "㎡"
        },
        {
          "label": "有效开业面积",
          "value": 36540.0,
          "unit": "㎡"
        },
        {
          "label": "起租计费面积",
          "value": 37800.0,
          "unit": "㎡"
        }
      ],
      "questions": [
        "哪些面积未形成经营产能？",
        "租约到期与空置风险在哪里？",
        "筹开、暂停和空置分别如何处理？"
      ],
      "source": "06_铺位主档、08_合同租约、14_营业状态"
    },
    {
      "id": "merchant",
      "name": "商户经营、销售与一商一策",
      "owner": "运营",
      "status": "watch",
      "score": 77,
      "headline": "固定样本销售同比+2.1%，但覆盖仍不足",
      "metrics": [
        {
          "label": "可统计销售",
          "value": 1268.0,
          "unit": "万元"
        },
        {
          "label": "固定样本同比",
          "value": 0.020746887966804906,
          "format": "percent"
        },
        {
          "label": "面积覆盖",
          "value": 0.7597902097902098,
          "format": "percent"
        }
      ],
      "questions": [
        "增长来自真实经营还是覆盖率变化？",
        "哪些商户偏离自身基线？",
        "一商一策动作是否产生效果？"
      ],
      "source": "07_商户主档、15_销售日报"
    },
    {
      "id": "growth",
      "name": "客流、会员与营销增长",
      "owner": "营销/会员",
      "status": "watch",
      "score": 79,
      "headline": "客流达成95.5%，需解释基线偏差",
      "metrics": [
        {
          "label": "项目入口客流",
          "value": 286400.0,
          "unit": "人次"
        },
        {
          "label": "目标达成",
          "value": 0.9546666666666667,
          "format": "percent"
        },
        {
          "label": "设备在线",
          "value": 0.987,
          "format": "percent"
        }
      ],
      "questions": [
        "偏差是否来自天气、节假日或活动？",
        "不同入口变化能否被设备状态解释？",
        "活动增量是否有可信对照？"
      ],
      "source": "09_经营日历、16_客流数据、17_会员营销"
    },
    {
      "id": "property",
      "name": "物业工程、能耗与现场品质",
      "owner": "物业工程",
      "status": "risk",
      "score": 70,
      "headline": "能耗费用较预算增加8.0万元",
      "metrics": [
        {
          "label": "实际费用",
          "value": 126.0,
          "unit": "万元"
        },
        {
          "label": "预算费用",
          "value": 118.0,
          "unit": "万元"
        },
        {
          "label": "偏差",
          "value": 8.0,
          "unit": "万元"
        }
      ],
      "questions": [
        "偏差是营业变化还是效率问题？",
        "工单是否影响营业与顾客体验？",
        "降耗动作是否触发舒适度护栏？"
      ],
      "source": "18_物业能耗、19_设备工单"
    },
    {
      "id": "risk",
      "name": "服务、安全、合规与风险",
      "owner": "客服/安全/物业",
      "status": "watch",
      "score": 84,
      "headline": "当前3项风险事件，P0为0",
      "metrics": [
        {
          "label": "风险事件",
          "value": 3,
          "unit": "项"
        },
        {
          "label": "P0事件",
          "value": 0,
          "unit": "项"
        },
        {
          "label": "处理中",
          "value": 2,
          "unit": "项"
        }
      ],
      "questions": [
        "是否存在一票否决或重大安全事项？",
        "相同问题是否重复发生？",
        "风险升级是否符合授权矩阵？"
      ],
      "source": "20_客诉风险"
    },
    {
      "id": "execution",
      "name": "组织执行、任务与复盘",
      "owner": "总经办/各部门",
      "status": "good",
      "score": 89,
      "headline": "任务已完成并进入效果验证",
      "metrics": [
        {
          "label": "任务完成率",
          "value": 1.0,
          "format": "percent"
        },
        {
          "label": "实际净改善",
          "value": 10.700000000000001,
          "unit": "万元"
        },
        {
          "label": "验证达成",
          "value": 0.7925925925925926,
          "format": "percent"
        }
      ],
      "questions": [
        "决策是否转化为明确责任任务？",
        "完成是否有证据而非口头确认？",
        "实际效果能否归因于本次动作？"
      ],
      "source": "21_责任任务、22_效果验证、23_AI决策日志"
    }
  ],
  "tasks": [
    {
      "task_id": "T001",
      "decision_id": "D001",
      "task_name": "调整非高峰设备运行",
      "affected_metric_id": "NS_NOI_FCST",
      "owner": "物业负责人",
      "collaborators": "财务/运营",
      "start_date": "2026-07-15 00:00:00",
      "due_date": "2026-07-18 00:00:00",
      "task_status": "已完成",
      "progress": 1,
      "completion_evidence": "EV_T001",
      "completed_at": "2026-07-18 00:00:00",
      "expected_effect": 4.5,
      "demo_flag": 1,
      "updated_at": "2026-07-18 10:00:00"
    },
    {
      "task_id": "T002",
      "decision_id": "D001",
      "task_name": "落实维保费用控制",
      "affected_metric_id": "NS_NOI_FCST",
      "owner": "物业负责人",
      "collaborators": "财务",
      "start_date": "2026-07-15 00:00:00",
      "due_date": "2026-07-20 00:00:00",
      "task_status": "已完成",
      "progress": 1,
      "completion_evidence": "EV_T002",
      "completed_at": "2026-07-20 00:00:00",
      "expected_effect": 2,
      "demo_flag": 1,
      "updated_at": "2026-07-20 10:00:00"
    },
    {
      "task_id": "T003",
      "decision_id": "D001",
      "task_name": "处理可确认起租事项",
      "affected_metric_id": "NS_NOI_FCST",
      "owner": "资产负责人",
      "collaborators": "财务/运营",
      "start_date": "2026-07-15 00:00:00",
      "due_date": "2026-07-22 00:00:00",
      "task_status": "已完成",
      "progress": 1,
      "completion_evidence": "EV_T003",
      "completed_at": "2026-07-22 00:00:00",
      "expected_effect": 4,
      "demo_flag": 1,
      "updated_at": "2026-07-22 10:00:00"
    },
    {
      "task_id": "T004",
      "decision_id": "D001",
      "task_name": "落实其他经营收入",
      "affected_metric_id": "NS_NOI_FCST",
      "owner": "经营负责人",
      "collaborators": "财务",
      "start_date": "2026-07-15 00:00:00",
      "due_date": "2026-07-24 00:00:00",
      "task_status": "已完成",
      "progress": 1,
      "completion_evidence": "EV_T004",
      "completed_at": "2026-07-24 00:00:00",
      "expected_effect": 3,
      "demo_flag": 1,
      "updated_at": "2026-07-24 10:00:00"
    },
    {
      "task_id": "T005",
      "decision_id": "D001",
      "task_name": "控制方案执行投入",
      "affected_metric_id": "NS_NOI_FCST",
      "owner": "总经办",
      "collaborators": "财务",
      "start_date": "2026-07-15 00:00:00",
      "due_date": "2026-07-24 00:00:00",
      "task_status": "已完成",
      "progress": 1,
      "completion_evidence": "EV_T005",
      "completed_at": "2026-07-24 00:00:00",
      "expected_effect": -1.5,
      "demo_flag": 1,
      "updated_at": "2026-07-24 10:00:00"
    }
  ],
  "effects": [
    {
      "effect_id": "EF001",
      "decision_id": "D001",
      "task_id": "T001",
      "metric_id": "NS_NOI_FCST",
      "baseline_value": 486,
      "expected_value": 4.5,
      "actual_value": 4.2,
      "actual_cost": 0,
      "attribution_confidence": 0.85,
      "interference_factors": "天气及营业时长",
      "validation_result": "部分达到",
      "validator": "财务/总经办",
      "validated_at": "2026-07-31 00:00:00",
      "demo_flag": 1
    },
    {
      "effect_id": "EF002",
      "decision_id": "D001",
      "task_id": "T002",
      "metric_id": "NS_NOI_FCST",
      "baseline_value": 486,
      "expected_value": 2,
      "actual_value": 1.8,
      "actual_cost": 0,
      "attribution_confidence": 0.9,
      "interference_factors": "供应商结算差异",
      "validation_result": "部分达到",
      "validator": "财务/总经办",
      "validated_at": "2026-07-31 00:00:00",
      "demo_flag": 1
    },
    {
      "effect_id": "EF003",
      "decision_id": "D001",
      "task_id": "T003",
      "metric_id": "NS_NOI_FCST",
      "baseline_value": 486,
      "expected_value": 4,
      "actual_value": 3.5,
      "actual_cost": 0,
      "attribution_confidence": 0.8,
      "interference_factors": "起租确认时间差",
      "validation_result": "部分达到",
      "validator": "财务/总经办",
      "validated_at": "2026-07-31 00:00:00",
      "demo_flag": 1
    },
    {
      "effect_id": "EF004",
      "decision_id": "D001",
      "task_id": "T004",
      "metric_id": "NS_NOI_FCST",
      "baseline_value": 486,
      "expected_value": 3,
      "actual_value": 2.7,
      "actual_cost": 0,
      "attribution_confidence": 0.75,
      "interference_factors": "部分收入跨期",
      "validation_result": "部分达到",
      "validator": "财务/总经办",
      "validated_at": "2026-07-31 00:00:00",
      "demo_flag": 1
    },
    {
      "effect_id": "EF005",
      "decision_id": "D001",
      "task_id": "T005",
      "metric_id": "NS_NOI_FCST",
      "baseline_value": 486,
      "expected_value": -1.5,
      "actual_value": -1.5,
      "actual_cost": 1.5,
      "attribution_confidence": 1,
      "interference_factors": "无",
      "validation_result": "达到预期",
      "validator": "财务/总经办",
      "validated_at": "2026-07-31 00:00:00",
      "demo_flag": 1
    }
  ],
  "ai_decisions": [
    {
      "decision_id": "D001",
      "snapshot_id": "S20260715-0900",
      "anomaly_ids": "AN_NOI_001",
      "decision_title": "本月NOI预测缺口改善方案",
      "affected_stars": "NOI预测",
      "fact_summary": "预算NOI520万元，预测486万元，缺口34万元；另有28万元回款风险影响现金而非直接增加NOI。",
      "inference_summary": "最具可干预性的因素集中在能耗、维保、可确认起租事项和其他经营收入；销售覆盖不足，不作为确定性缺口原因。",
      "option_a": "维持当前路径：预测NOI486万元。",
      "option_b": "稳健改善：预计净改善12万元，方案后预测NOI498万元。",
      "option_c": "进取改善：预计净改善24万元，方案后预测NOI510万元，但证据和成本风险较高。",
      "recommended_option": "方案B",
      "confidence": 0.82,
      "authorization_level": "项目权限内",
      "manager_choice": "方案B",
      "manager_comment": "采纳稳健方案并要求每项动作形成效果验证。",
      "decision_status": "效果验证中",
      "model_version": "V1.0",
      "created_at": "2026-07-15 01:10:00",
      "decided_at": "2026-07-15 02:00:00",
      "final_result": "实际净改善10.7万元，达成89.2%。",
      "correction_flag": 0,
      "demo_flag": 1
    }
  ],
  "scenario": {
    "baseline": 486.0,
    "budget": 520.0,
    "presets": [
      {
        "id": "A",
        "name": "维持路径",
        "energy": 0,
        "maintenance": 0,
        "billing": 0,
        "other_income": 0,
        "cost": 0,
        "expected": 0,
        "risk": "低"
      },
      {
        "id": "B",
        "name": "稳健改善",
        "energy": 4.5,
        "maintenance": 2,
        "billing": 4,
        "other_income": 3,
        "cost": 1.5,
        "expected": 12,
        "risk": "中低"
      },
      {
        "id": "C",
        "name": "进取改善",
        "energy": 7,
        "maintenance": 4,
        "billing": 8,
        "other_income": 8,
        "cost": 3,
        "expected": 24,
        "risk": "中高"
      }
    ],
    "validated": {
      "choice": "B",
      "actual_net": 10.700000000000001,
      "forecast_after": 496.7,
      "attainment": 0.8916666666666667
    }
  },
  "data_availability": [
    {
      "data_item": "NOI预算",
      "current_carrier": "财务预算表",
      "owner": "财务",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "月/科目",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "首版必须"
    },
    {
      "data_item": "财务实际",
      "current_carrier": "财务系统/报表",
      "owner": "财务",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "月/科目",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "关账有时滞"
    },
    {
      "data_item": "经营收入",
      "current_carrier": "财务/经营快报",
      "owner": "财务",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "日/月/科目",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "需统一预测方式"
    },
    {
      "data_item": "运营支出",
      "current_carrier": "财务/物业台账",
      "owner": "财务",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "日/月/科目",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "区分可控成本"
    },
    {
      "data_item": "应收回款",
      "current_carrier": "财务台账",
      "owner": "财务",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "商户/月",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "与NOI分开"
    },
    {
      "data_item": "铺位面积",
      "current_carrier": "铺位台账",
      "owner": "招商/租约",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "铺位",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "面积口径确认"
    },
    {
      "data_item": "合同租约",
      "current_carrier": "合同/租约台账",
      "owner": "招商/租约",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "合同",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "非标条款"
    },
    {
      "data_item": "营业状态",
      "current_carrier": "运营台账",
      "owner": "运营",
      "availability_level": "B",
      "historical_depth": "待盘点",
      "grain": "铺位/日",
      "completeness": "待核验",
      "exportability": "人工可维护",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "事件更新"
    },
    {
      "data_item": "商户销售",
      "current_carrier": "商户报数",
      "owner": "运营",
      "availability_level": "C",
      "historical_depth": "待盘点",
      "grain": "商户/日",
      "completeness": "部分覆盖",
      "exportability": "人工可导入",
      "sensitivity": "商业敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "显示覆盖率"
    },
    {
      "data_item": "京东经营数据",
      "current_carrier": "不可得",
      "owner": "外部主力店",
      "availability_level": "D",
      "historical_depth": "无",
      "grain": "不适用",
      "completeness": "不可得",
      "exportability": "不可得",
      "sensitivity": "高度敏感",
      "mvp_required": "否",
      "audit_status": "已确认边界",
      "notes": "禁止推算"
    },
    {
      "data_item": "项目入口客流",
      "current_carrier": "客流系统",
      "owner": "营销/系统管理员",
      "availability_level": "A/B",
      "historical_depth": "待盘点",
      "grain": "入口/时段",
      "completeness": "待核验",
      "exportability": "可导出待确认",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "设备在线率"
    },
    {
      "data_item": "会员数据",
      "current_carrier": "会员系统",
      "owner": "营销",
      "availability_level": "C",
      "historical_depth": "待盘点",
      "grain": "会员/活动",
      "completeness": "授权待确认",
      "exportability": "可导出待确认",
      "sensitivity": "个人敏感",
      "mvp_required": "否",
      "audit_status": "待盘点",
      "notes": "非首版硬依赖"
    },
    {
      "data_item": "营销活动",
      "current_carrier": "活动台账",
      "owner": "营销",
      "availability_level": "B",
      "historical_depth": "待盘点",
      "grain": "活动",
      "completeness": "待核验",
      "exportability": "人工可维护",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "归因可信度"
    },
    {
      "data_item": "能耗",
      "current_carrier": "物业台账",
      "owner": "物业",
      "availability_level": "B",
      "historical_depth": "待盘点",
      "grain": "区域/日月",
      "completeness": "待核验",
      "exportability": "人工可导入",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "首版接入"
    },
    {
      "data_item": "设备工单",
      "current_carrier": "工单/线下台账",
      "owner": "物业",
      "availability_level": "B",
      "historical_depth": "待盘点",
      "grain": "工单",
      "completeness": "待核验",
      "exportability": "人工可维护",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "重复故障"
    },
    {
      "data_item": "客诉风险",
      "current_carrier": "客诉/安全台账",
      "owner": "运营/物业",
      "availability_level": "B",
      "historical_depth": "待盘点",
      "grain": "事件",
      "completeness": "待核验",
      "exportability": "人工可维护",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待盘点",
      "notes": "P0事件"
    },
    {
      "data_item": "责任任务",
      "current_carrier": "待新建",
      "owner": "总经办",
      "availability_level": "B",
      "historical_depth": "无",
      "grain": "任务",
      "completeness": "新建",
      "exportability": "模板维护",
      "sensitivity": "一般",
      "mvp_required": "是",
      "audit_status": "待建立",
      "notes": "系统核心"
    },
    {
      "data_item": "效果验证",
      "current_carrier": "待新建",
      "owner": "总经办/财务",
      "availability_level": "B",
      "historical_depth": "无",
      "grain": "决策/任务",
      "completeness": "新建",
      "exportability": "模板维护",
      "sensitivity": "敏感",
      "mvp_required": "是",
      "audit_status": "待建立",
      "notes": "ROI证据"
    }
  ],
  "metric_definitions": [
    {
      "metric_id": "NS_NOI_FCST",
      "metric_name": "月末NOI预测",
      "definition": "基于当前经营进度形成的月末经营口径预测",
      "formula_text": "预测收入-预测运营支出",
      "unit": "万元",
      "update_frequency": "数据更新触发",
      "source_sheet": "10_NOI预算/11_经营收入/12_运营支出",
      "owner": "财务/总经办",
      "guardrail": "实际、测算、预测必须分开",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "NS_SALES",
      "metric_name": "可统计销售额",
      "definition": "有效报数商户销售额合计",
      "formula_text": "SUM(有效已报销售)",
      "unit": "万元",
      "update_frequency": "每日",
      "source_sheet": "15_销售日报",
      "owner": "运营",
      "guardrail": "不含京东；未报数不填0",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "NS_TRAFFIC",
      "metric_name": "项目入口客流",
      "definition": "有效入口设备统计的进入人次",
      "formula_text": "SUM(有效入口in_count)",
      "unit": "人次",
      "update_frequency": "小时/每日",
      "source_sheet": "16_客流数据",
      "owner": "营销/系统管理员",
      "guardrail": "不同流量类型不可混加",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "NS_EFFECTIVE_AREA",
      "metric_name": "有效开业面积",
      "definition": "通过检查、无否决项、正常营业的可租赁面积",
      "formula_text": "SUM(满足有效营业规则的面积)",
      "unit": "㎡",
      "update_frequency": "每日/事件",
      "source_sheet": "06_铺位主档/14_营业状态",
      "owner": "运营",
      "guardrail": "不等于签约面积或计费面积",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "NOI_BUDGET",
      "metric_name": "预算NOI",
      "definition": "经批准的期间经营预算",
      "formula_text": "预算收入-预算运营支出",
      "unit": "万元",
      "update_frequency": "年度/调整",
      "source_sheet": "10_NOI预算",
      "owner": "财务",
      "guardrail": "预算版本不得覆盖",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "CASH_COLLECTION",
      "metric_name": "当期收缴率",
      "definition": "当期应收对应的实际回款比例",
      "formula_text": "当期实收/当期应收",
      "unit": "%",
      "update_frequency": "每日",
      "source_sheet": "13_应收回款",
      "owner": "财务",
      "guardrail": "与历史欠费回收分开",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "SALES_COVER_M",
      "metric_name": "销售商户覆盖率",
      "definition": "有效报数商户数占应报商户数",
      "formula_text": "已报商户数/应报商户数",
      "unit": "%",
      "update_frequency": "每日",
      "source_sheet": "15_销售日报",
      "owner": "运营",
      "guardrail": "覆盖率变化先于经营归因",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "SALES_COVER_A",
      "metric_name": "销售面积覆盖率",
      "definition": "有效报数面积占应报面积",
      "formula_text": "报数面积/应报面积",
      "unit": "%",
      "update_frequency": "每日",
      "source_sheet": "15_销售日报",
      "owner": "运营",
      "guardrail": "京东面积不进入分母",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "TRAFFIC_ONLINE",
      "metric_name": "客流设备在线率",
      "definition": "设备有效运行时段比例",
      "formula_text": "有效运行时段/应运行时段",
      "unit": "%",
      "update_frequency": "小时",
      "source_sheet": "16_客流数据",
      "owner": "营销/物业",
      "guardrail": "离线期间不得视为客流下降",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "AREA_SIGNED",
      "metric_name": "已签约面积",
      "definition": "有效合同覆盖面积",
      "formula_text": "SUM(有效租约面积)",
      "unit": "㎡",
      "update_frequency": "事件",
      "source_sheet": "08_合同租约",
      "owner": "招商/租约",
      "guardrail": "面积口径优先",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "AREA_BILLING",
      "metric_name": "起租计费面积",
      "definition": "已进入合同计费状态面积",
      "formula_text": "SUM(已起租面积)",
      "unit": "㎡",
      "update_frequency": "事件",
      "source_sheet": "14_营业状态",
      "owner": "财务/招商",
      "guardrail": "与有效营业面积分开",
      "confirmation_status": "待确认"
    },
    {
      "metric_id": "TASK_EFFECT",
      "metric_name": "效果验证率",
      "definition": "已验证决策事项占应验证事项",
      "formula_text": "已验证/应验证",
      "unit": "%",
      "update_frequency": "每日",
      "source_sheet": "22_效果验证",
      "owner": "总经办",
      "guardrail": "任务完成不等于效果实现",
      "confirmation_status": "待确认"
    }
  ],
  "responsibilities": [
    {
      "data_domain": "财务",
      "data_item": "NOI预算",
      "R_update": "财务经办",
      "A_accountable": "财务负责人",
      "C_consulted": "总经理/事业部",
      "I_informed": "各经营域",
      "suggested_frequency": "年度及调整时",
      "signoff_status": "待确认",
      "notes": "预算版本留痕"
    },
    {
      "data_domain": "财务",
      "data_item": "财务实际与测算",
      "R_update": "财务经办",
      "A_accountable": "财务负责人",
      "C_consulted": "总经理",
      "I_informed": "部门负责人",
      "suggested_frequency": "每日快报/月度关账",
      "signoff_status": "待确认",
      "notes": "实际与测算分开"
    },
    {
      "data_domain": "财务",
      "data_item": "应收与回款",
      "R_update": "财务经办",
      "A_accountable": "财务负责人",
      "C_consulted": "招商/运营",
      "I_informed": "总经理",
      "suggested_frequency": "每日",
      "signoff_status": "待确认",
      "notes": "现金与NOI分开"
    },
    {
      "data_domain": "资产",
      "data_item": "铺位主档",
      "R_update": "租约经办",
      "A_accountable": "招商负责人",
      "C_consulted": "运营/物业",
      "I_informed": "财务/总经办",
      "suggested_frequency": "事件触发",
      "signoff_status": "待确认",
      "notes": "物理铺位唯一"
    },
    {
      "data_domain": "资产",
      "data_item": "合同租约",
      "R_update": "租约管理员",
      "A_accountable": "招商负责人",
      "C_consulted": "财务/法务/运营",
      "I_informed": "总经理",
      "suggested_frequency": "事件触发",
      "signoff_status": "待确认",
      "notes": "非标条款审批"
    },
    {
      "data_domain": "运营",
      "data_item": "商户营业状态",
      "R_update": "楼管",
      "A_accountable": "运营负责人",
      "C_consulted": "招商/物业",
      "I_informed": "财务/总经办",
      "suggested_frequency": "每日/事件",
      "signoff_status": "待确认",
      "notes": "重大变化复核"
    },
    {
      "data_domain": "运营",
      "data_item": "商户销售",
      "R_update": "商户/运营经办",
      "A_accountable": "运营负责人",
      "C_consulted": "财务/营销",
      "I_informed": "总经理",
      "suggested_frequency": "每日",
      "signoff_status": "待确认",
      "notes": "覆盖率同时显示"
    },
    {
      "data_domain": "营销",
      "data_item": "项目入口客流",
      "R_update": "系统管理员",
      "A_accountable": "营销负责人",
      "C_consulted": "运营/物业",
      "I_informed": "总经理",
      "suggested_frequency": "小时/每日",
      "signoff_status": "待确认",
      "notes": "设备质量监控"
    },
    {
      "data_domain": "营销",
      "data_item": "会员及活动",
      "R_update": "营销经办",
      "A_accountable": "营销负责人",
      "C_consulted": "财务/运营",
      "I_informed": "总经理",
      "suggested_frequency": "活动/每日",
      "signoff_status": "待确认",
      "notes": "归因可信度"
    },
    {
      "data_domain": "物业",
      "data_item": "能耗",
      "R_update": "物业经办",
      "A_accountable": "物业负责人",
      "C_consulted": "财务",
      "I_informed": "总经理",
      "suggested_frequency": "每日/每周",
      "signoff_status": "待确认",
      "notes": "预算与实际分开"
    },
    {
      "data_domain": "物业",
      "data_item": "设备工单",
      "R_update": "工程经办",
      "A_accountable": "物业负责人",
      "C_consulted": "运营",
      "I_informed": "总经理",
      "suggested_frequency": "事件触发",
      "signoff_status": "待确认",
      "notes": "重大故障即时上报"
    },
    {
      "data_domain": "服务风险",
      "data_item": "客诉",
      "R_update": "客服/运营经办",
      "A_accountable": "运营负责人",
      "C_consulted": "商户/物业",
      "I_informed": "总经理",
      "suggested_frequency": "事件触发",
      "signoff_status": "待确认",
      "notes": "重复问题聚类"
    },
    {
      "data_domain": "安全",
      "data_item": "安全风险",
      "R_update": "安全经办",
      "A_accountable": "安全责任负责人",
      "C_consulted": "运营/综合",
      "I_informed": "总经理",
      "suggested_frequency": "事件触发",
      "signoff_status": "待确认",
      "notes": "P0硬门槛"
    },
    {
      "data_domain": "执行",
      "data_item": "责任任务",
      "R_update": "任务责任人",
      "A_accountable": "部门负责人",
      "C_consulted": "协同部门",
      "I_informed": "总经办",
      "suggested_frequency": "状态变化时",
      "signoff_status": "待确认",
      "notes": "任务引用决策编号"
    },
    {
      "data_domain": "执行",
      "data_item": "效果验证",
      "R_update": "指标责任部门",
      "A_accountable": "经营域负责人",
      "C_consulted": "财务/总经办",
      "I_informed": "总经理",
      "suggested_frequency": "完成后",
      "signoff_status": "待确认",
      "notes": "价值认定需复核"
    }
  ],
  "source_map": [
    {
      "display": "NOI预测",
      "sources": [
        "10_NOI预算",
        "11_经营收入",
        "12_运营支出"
      ],
      "refresh": "数据更新触发",
      "owner": "财务/总经办",
      "rule": "预测收入-预测支出"
    },
    {
      "display": "可统计销售额",
      "sources": [
        "15_销售日报"
      ],
      "refresh": "每日/报数后",
      "owner": "运营",
      "rule": "只统计已报；同时显示双覆盖率"
    },
    {
      "display": "项目入口客流",
      "sources": [
        "16_客流数据",
        "09_经营日历"
      ],
      "refresh": "小时/每日",
      "owner": "营销/系统管理员",
      "rule": "有效设备；不同客流类型不可相加"
    },
    {
      "display": "有效开业面积",
      "sources": [
        "06_铺位主档",
        "08_合同租约",
        "14_营业状态"
      ],
      "refresh": "事件/每日",
      "owner": "运营/租约",
      "rule": "正常营业+检查通过+无否决项"
    },
    {
      "display": "经营现金",
      "sources": [
        "13_应收回款"
      ],
      "refresh": "每日",
      "owner": "财务",
      "rule": "与NOI分开表达"
    },
    {
      "display": "行动效果",
      "sources": [
        "21_责任任务",
        "22_效果验证"
      ],
      "refresh": "任务完成后",
      "owner": "总经办/验证部门",
      "rule": "证据+归因置信度+干扰因素"
    }
  ],
  "quality": {
    "status": "PASS",
    "checks": 14,
    "sales_merchant_coverage": 0.7931034482758621,
    "sales_area_coverage": 0.7597902097902098,
    "traffic_online_rate": 0.987,
    "limitations": [
      "销售数据覆盖不足，不外推未覆盖商户",
      "京东经营数据不可得",
      "当前为结构验证用演示数据"
    ]
  },
  "ai_pipeline": [
    {
      "step": 1,
      "name": "数据更新",
      "detail": "Excel基础表或系统接口产生新快照",
      "owner": "数据责任部门"
    },
    {
      "step": 2,
      "name": "指标计算",
      "detail": "指标引擎按统一口径重算四大北极星",
      "owner": "计算服务"
    },
    {
      "step": 3,
      "name": "异常识别",
      "detail": "规则与异常模型识别偏差、覆盖与风险",
      "owner": "规则/异常模型"
    },
    {
      "step": 4,
      "name": "影响测算",
      "detail": "预测模型估算NOI、客流与空间产能影响",
      "owner": "预测模型"
    },
    {
      "step": 5,
      "name": "知识推理",
      "detail": "AI读取运营手册、授权矩阵与历史案例",
      "owner": "大模型+知识库"
    },
    {
      "step": 6,
      "name": "决策卡生成",
      "detail": "严格区分事实、推断、方案与可信度",
      "owner": "AI决策编排"
    },
    {
      "step": 7,
      "name": "管理者确认",
      "detail": "总经理选择、修正或拒绝建议",
      "owner": "总经理"
    },
    {
      "step": 8,
      "name": "执行验证",
      "detail": "任务下达、证据回传并判断动作是否有效",
      "owner": "责任部门+验证部门"
    }
  ],
  "query_presets": [
    {
      "q": "本月NOI缺口在哪里？",
      "answer": "本月预算NOI 520万元，预测486万元，缺口34万元。当前证据显示收入端差异约12万元、成本端差异约22万元。更可干预的变量是能耗、维保、可确认起租事项和其他经营收入。28万元回款风险影响现金，不直接写成NOI增益。"
    },
    {
      "q": "销售增长可靠吗？",
      "answer": "固定样本本期1230万元、同期1205万元，同比+2.1%。但商户覆盖率仅79.3%、面积覆盖率76.0%，因此可确认固定样本增长，不宜外推全场。"
    },
    {
      "q": "京东数据如何处理？",
      "answer": "京东家电是项目主力店，但其销售、会员和顾客经营数据目前不可得。本系统只使用项目能够确认的铺位、租约与营业状态，不将京东经营数据模拟进销售分析，也不以京东作为核心联动假设。"
    },
    {
      "q": "有效开业面积为什么重要？",
      "answer": "可租赁面积42000㎡、已签约39900㎡、起租计费37800㎡、有效开业36540㎡。有效开业面积代表当前真正形成经营产能的空间，签约与有效开业之间的3360㎡需按暂停、筹备、空置和门槛问题分别处理。"
    }
  ]
};
