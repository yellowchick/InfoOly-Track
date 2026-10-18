const fs = require('fs');
const html = fs.readFileSync('/tmp/abc477_results.html', 'utf8');

// var results 变量在 17284，查看其后内容确定 JSON 起始
const varIdx = html.indexOf('var results');
console.log('var results 上下文:');
console.log(JSON.stringify(html.slice(varIdx, varIdx + 120)));

// 找到 var results = 之后的 [ 起始
const eqIdx = html.indexOf('=', varIdx);
let arrStart = html.indexOf('[', eqIdx);
console.log('数组起始位置:', arrStart, '首字符:', html.slice(arrStart, arrStart + 30));

// 括号匹配提取完整 JSON 数组
let depth = 0, end = -1, inStr = false, esc = false;
for (let i = arrStart; i < html.length; i++) {
  const c = html[i];
  if (esc) { esc = false; continue; }
  if (c === '\\') { esc = true; continue; }
  if (c === '"') { inStr = !inStr; continue; }
  if (inStr) continue;
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
}

console.log('数组结束位置:', end);
const jsonStr = html.slice(arrStart, end + 1);
console.log('JSON 长度:', jsonStr.length);

const data = JSON.parse(jsonStr);
console.log('总参赛人数:', data.length);

// 提取关键字段结构（第一条记录的全部字段名）
console.log('\n第一条记录字段:', Object.keys(data[0]).join(', '));

const targets = ['Remielle', 'solitaire', 'Tiancheng'];
console.log('\n=== 目标学生数据 ===');
for (const r of data) {
  if (targets.includes(r.UserScreenName)) {
    console.log(JSON.stringify({
      user: r.UserScreenName,
      rank: r.Place,
      isRated: r.IsRated,
      oldRating: r.OldRating,
      newRating: r.NewRating,
      performance: r.Performance,
      totalScore: r.TotalResult ? r.TotalResult.Score : undefined,
      atcoderRank: r.AtCoderRank,
    }));
  }
}
