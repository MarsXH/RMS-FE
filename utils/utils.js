/**
 * 深拷贝函数
 * @param {*要深复制的对象} obj
 */
export const DeepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj
  const cpObj = Array.isArray(obj) ? [] : {}
  for (const key in obj) cpObj[key] = DeepClone(obj[key])
  return cpObj
}

/**
 * 时间戳 -> 时间格式函数
 * @param {*要格式化的时间} time
 */
export const FormatDate = time => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const d = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return year + '-' + month + '-' + d + ' ' + hour + ':' + minute + ':' + second
}
