// utils/formatTime.uts

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

/** 时间戳格式化 yyyy-MM-dd HH:mm:ss */
export function formatTimes(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 按日历月份回退，日期超出目标月份时取目标月最后一天。 */
export function subtractMonths(timestamp: number, months: number): number {
  const date = new Date(timestamp)
  const originalDay = date.getDate()
  date.setDate(1)
  date.setMonth(date.getMonth() - months)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  date.setDate(Math.min(originalDay, lastDay))
  return date.getTime()
}

/** 将日期时间限制在指定的本地时间范围内。 */
export function clampLocalDateTime(timestamp: string, minTimestamp: string, maxTimestamp: string): string {
  const value = parseLocalDateTime(timestamp)
  const min = parseLocalDateTime(minTimestamp)
  const max = parseLocalDateTime(maxTimestamp)
  if (value == null) return minTimestamp
  if (min != null && value < min) return minTimestamp
  if (max != null && value > max) return maxTimestamp
  return formatTimes(value)
}

/**
 * 解析本地日期时间。支持 yyyy-MM-dd、yyyy/MM/dd 及其 HH:mm[:ss] 形式。
 * 不使用 Date 的字符串构造，避免部分 iOS 平台解析失败。
 */
export function parseLocalDateTime(timestamp: string): number | null {
  const match = timestamp.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/)
  if (match == null) return null

  const year = parseInt(match[1] ?? "0")
  const month = parseInt(match[2] ?? "0")
  const day = parseInt(match[3] ?? "0")
  const hour = match[4] == null ? 0 : parseInt(match[4] ?? "0")
  const minute = match[5] == null ? 0 : parseInt(match[5] ?? "0")
  const second = match[6] == null ? 0 : parseInt(match[6] ?? "0")
  const date = new Date(year, month - 1, day, hour, minute, second)

  if (date.getFullYear() != year || date.getMonth() != month - 1 || date.getDate() != day ||
    date.getHours() != hour || date.getMinutes() != minute || date.getSeconds() != second) {
    return null
  }
  return date.getTime()
}

/** 将有效本地日期时间统一为接口使用的 yyyy-MM-dd HH:mm:ss 格式。 */
export function normalizeLocalDateTime(timestamp: string): string {
  const milliseconds = parseLocalDateTime(timestamp)
  return milliseconds == null ? timestamp : formatTimes(milliseconds)
}

/** 将有效本地日期时间格式化为 HH:mm:ss。 */
export function formatLocalTime(timestamp: string): string {
  const milliseconds = parseLocalDateTime(timestamp)
  if (milliseconds == null) return ''
  const date = new Date(milliseconds)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
