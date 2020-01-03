
export default async function ({ app, store, error, redirect, req }) {
  if (req && (req.url === '/__webpack_hmr' || req.url === '/__webpack_hmr/client' || req.url === '/api/v1/validateToken')) return
  if (!store.state.auth.user.user_id) {
    await store.dispatch('auth/validateToken')
    if (!store.state.auth.user.user_id) return redirect('/login')
  }
}
