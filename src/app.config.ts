export default defineAppConfig({
  pages: [
    'pages/loading/index',
    'pages/index/index',
    'pages/game/index',
    'pages/level-select/index',
    'pages/rank/index',
    'pages/dev-tools/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '拼图游戏',
    navigationBarTextStyle: 'black'
  }
})
