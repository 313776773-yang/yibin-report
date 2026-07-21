#!/bin/zsh
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$ROOT/data_source/宜宾商都AI经营决策中枢_数据确认与演示模板_v1.0.xlsx"
JSON_OUT="$ROOT/data/dashboard_data.json"
JS_OUT="$ROOT/assets/default-data.js"
HTML_OUT="$ROOT/宜宾商都_AI总经理经营决策中枢_单文件演示版.html"

if [[ ! -f "$SOURCE" ]]; then
  osascript -e 'display dialog "未找到Excel数据源。请确认data_source文件夹中的工作簿名称未被修改。" buttons {"确定"} default button "确定"'
  exit 1
fi

if command -v python3 >/dev/null 2>&1; then
  PYTHON="$(command -v python3)"
else
  open "$ROOT/index.html"
  osascript -e 'display dialog "当前电脑未找到Python 3，已打开网页。请点击右上角“导入Excel”完成转换。" buttons {"确定"} default button "确定"'
  exit 0
fi

export PYTHONPATH="$ROOT/vendor${PYTHONPATH:+:$PYTHONPATH}"

if ! "$PYTHON" -c 'import openpyxl' >/dev/null 2>&1; then
  open "$ROOT/index.html"
  osascript -e 'display dialog "本地转换组件不可用，已打开网页。请点击右上角“导入Excel”完成转换。" buttons {"确定"} default button "确定"'
  exit 0
fi

"$PYTHON" "$ROOT/scripts/export_dashboard_data.py" \
  --input "$SOURCE" \
  --output "$JSON_OUT" \
  --js-output "$JS_OUT"

"$PYTHON" "$ROOT/scripts/build_single_file.py"
open "$HTML_OUT"
osascript -e 'display notification "Excel已转换，JSON与单文件看板已同步更新" with title "宜宾商都AI经营决策中枢"'

