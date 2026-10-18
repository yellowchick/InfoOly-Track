/**
 * 学生详情页访问验证
 *
 * 规则：
 *   - 管理员代码（默认 admin）：可访问所有学生详情
 *   - 学生代码（默认姓名全拼）：仅可访问对应学生
 *
 * 新学生加入时在 NAME_TO_CODE 中追加映射。
 */

// 管理员代码
export const ADMIN_CODE = 'admin'

// 学生姓名 → 访问代码（姓名全拼）
const NAME_TO_CODE: Record<string, string> = {
  '马天成': 'matiancheng',
  '党皓天': 'danghaotian',
  '陆臻': 'luzhen',
  '张赫桐': 'zhanghetong',
  '梁芮棠': 'liangruitang',
}

export function getStudentCode(name: string): string {
  return NAME_TO_CODE[name] || ''
}

/**
 * 验证访问代码
 * @param code 用户输入的代码
 * @param studentName 目标学生姓名
 * @returns 'admin' | 'student' | null
 */
export function verifyAccessCode(code: string, studentName: string): 'admin' | 'student' | null {
  const normalized = code.trim().toLowerCase()
  if (!normalized) return null
  if (normalized === ADMIN_CODE.toLowerCase()) return 'admin'
  if (normalized === getStudentCode(studentName)) return 'student'
  return null
}

/** localStorage 键 */
export const ACCESS_STORAGE_KEY = 'student_detail_access'

export interface AccessState {
  role: 'admin' | 'student'
  code: string
}

export function saveAccess(state: AccessState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(state))
}

export function loadAccess(): AccessState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && (parsed.role === 'admin' || parsed.role === 'student') && typeof parsed.code === 'string') {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function clearAccess(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_STORAGE_KEY)
}
