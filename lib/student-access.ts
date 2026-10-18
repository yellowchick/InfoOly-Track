/**
 * 学生详情页访问验证
 *
 * 规则：
 *   - 管理员代码（默认 admin）：可访问所有学生详情
 *   - 学生访问代码：创建学生时自动生成（默认姓名全拼），存于 Student.accessCode
 *
 * 旧版静态映射 NAME_TO_CODE 仅作兜底；新增学生无需修改本文件，
 * 创建时自动写入 accessCode 即可。
 */

// 管理员代码
export const ADMIN_CODE = 'admin'

// 学生姓名 → 访问代码（旧数据兜底；新学生以数据库 accessCode 为准）
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
 * 服务端异步校验访问代码（优先数据库 accessCode，兼容旧静态映射）
 * @returns 'admin' | 'student' | null
 */
export async function verifyStudentAccess(
  code: string,
  student: { name: string; accessCode?: string | null }
): Promise<'admin' | 'student' | null> {
  const normalized = code.trim().toLowerCase()
  if (!normalized) return null
  if (normalized === ADMIN_CODE.toLowerCase()) return 'admin'
  if (student.accessCode && normalized === student.accessCode.toLowerCase()) return 'student'
  // 兜底：旧静态映射
  if (normalized === getStudentCode(student.name)) return 'student'
  return null
}

/** 前端同步校验（仅用于已知的静态映射场景；详情页请走 /api/students/verify-code） */
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
