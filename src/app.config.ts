export default defineAppConfig({
  pages: [
    'pages/loading/index',
    'pages/index/index',
    'pages/game/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '拼图游戏',
    navigationBarTextStyle: 'black'
  },
  style: 'v2',
  usingComponents: {}
})

// 定义全局样式变量
export const theme = {
  font: {
    family: "'Fredoka One', 'Baloo 2', 'Comic Sans MS', 'Microsoft YaHei', sans-serif",
    weight: 800
  },
  color: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D'
  }
}
