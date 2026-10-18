/**
 * 姓名转拼音（服务端专用，勿在客户端组件中引用）
 * 新增学生时用于自动生成访问代码（姓名全拼）
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pinyin } = require('pinyin')

export function nameToPinyin(name: string): string {
  return pinyin(name, { style: 'normal' }).join('').toLowerCase()
}
