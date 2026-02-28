export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '游戏设置'
    })
  : { navigationBarTitleText: '游戏设置' }
