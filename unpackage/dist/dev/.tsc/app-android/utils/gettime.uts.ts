/**
 * 获取 当前时间戳 + 今日0点整时间戳
 * @returns { nowTime: 当前时间戳(ms), todayZero: 今日0点时间戳(ms) }
 */
export function getTodayZeroTime() {
  const now = new Date();
  // 当前时间戳 毫秒
  const nowTime = now.getTime();

  // 构造 今日 00:00:00
  const todayZero = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0
  ).getTime();

  return {
    nowTime,
    todayZero
  };
}