const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  permission: state => state.user.permission,
  name: state => state.user.name,
  addRouters: state => state.user.addRouters
}
export default getters
