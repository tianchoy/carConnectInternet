// utils/formatTime.uts
/** 时间戳格式化 yyyy-MM-dd HH:mm:ss */
export function formatTimes(timestamp: number) {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${mi}:${s}`;
}