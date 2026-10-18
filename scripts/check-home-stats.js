const html = require('fs').readFileSync('/tmp/home.html', 'utf8');
// 首页统计卡片: label -> value
const re = /"label":"([^"]+)","value":(\d+),"href":"([^"]+)"/g;
let m;
let found = false;
while ((m = re.exec(html))) {
  console.log(m[1] + ': ' + m[2]);
  found = true;
}
if (!found) {
  // 从RSC payload中提取: children数字紧跟label文本
  for (const label of ['学生人数', '比赛场数', '知识点数', '总任务数']) {
    const idx = html.indexOf(label);
    if (idx === -1) { console.log(label + ': 未找到'); continue; }
    const before = html.slice(Math.max(0, idx - 500), idx);
    const nums = before.match(/"children":(\d+)/g);
    console.log(label + ': ' + (nums ? nums[nums.length - 1].replace(/\D/g, '') : '未找到数字'));
  }
}
