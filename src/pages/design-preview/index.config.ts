export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '设计预览'
    })
  : { navigationBarTitleText: '设计预览' }
