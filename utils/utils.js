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
