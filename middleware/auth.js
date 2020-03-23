
export default function ({ app, store, error, redirect, req }) {
  if (req && (req.url === '/__webpack_hmr' || req.url === '/__webpack_hmr/client' || req.url === '/api/v1/validateToken')) return
  await store.dispatch('auth/validateToken')
  if (!store.state.auth.user.user_id) {
    return redirect('/login')
  } else if (store.state.auth.user.user_role === 0) {
    alert('您的账户被冻结，请联系管理员！')
    return redirect('/login')
  }
}
