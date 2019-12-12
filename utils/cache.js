export const getCookie = key => {
  const arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'))
  if (arr != null) return unescape(arr[2])
  return null
}

export const deleteCookie = key => {
  const exp = new Date()
  exp.setTime(exp.getTime() - 1)
  const cval = getCookie(key)
  if (cval != null) {
    // 这里删除操作其实是将expires过期时间设置为当前时间，使cookie立即过期
    document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString()
  }
}
