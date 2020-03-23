
export default async function ({ app, store, error, redirect, req }) {
  if (req && (req.url === '/__webpack_hmr' || req.url === '/__webpack_hmr/client' || req.url === '/api/v1/validateToken')) return
  await store.dispatch('auth/validateToken')
  console.log('middleware', store.state.auth)
  console.log('middleware', store.state.auth.user)
  if (!store.state.auth.user.user_id) {
    console.log('middleware redirect login')
    return redirect('/login')
  } else if (store.state.auth.user.user_role === 0) {
    alert('您的账户被冻结，请联系管理员！')
    return redirect('/login')
  }
  console.log('middleware next')
}
