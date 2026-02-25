export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '选择关卡'
    })
  : { navigationBarTitleText: '选择关卡' }
