#!/bin/zsh
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="8765"
cd "$ROOT"

if command -v python3 >/dev/null 2>&1; then
  PYTHON="$(command -v python3)"
else
  osascript -e 'display dialog "未找到Python 3。请直接双击单文件演示版HTML。" buttons {"确定"} default button "确定"'
  exit 1
fi

while lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

"$PYTHON" -m http.server "$PORT" --bind 127.0.0.1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT INT TERM
sleep 1
open "http://127.0.0.1:${PORT}/index.html"
echo "重百宜宾商都 AI经营决策中枢已启动"
echo "地址：http://127.0.0.1:${PORT}/index.html"
echo "关闭本窗口即可停止本地服务"
wait "$SERVER_PID"
