# 海海拼图大作战 - 趣味卡通风设计指南

## 1. 品牌定位

**应用定位**：一款充满海洋趣味元素的拼图小游戏，通过自由拖拽碎片完成图片拼合

**设计风格**：高饱和卡通风格、海洋趣味元素、活泼动态交互、强视觉记忆点

**目标用户**：大众休闲玩家，追求轻松有趣、色彩鲜明的游戏体验

**设计关键词**：
- 活力橙：温暖阳光，代表行动和成功
- 海洋蓝：清新海洋，代表探索和专注
- 卡通元素：小鱼、海浪、贝壳、螃蟹，营造趣味氛围
- 动态交互：丰富的动画效果，增强沉浸感

## 2. 配色方案

### 主色调（RGB/十六进制）

| 色彩名称 | 色值 | Tailwind 类名 | 应用场景 |
|----------|------|---------------|----------|
| 活力橙 | #FF9500 | bg-[#FF9500] text-[#FF9500] | 开始游戏按钮、选中态、数字高亮、徽章、成功提示 |
| 海洋蓝 | #007AFF | bg-[#007AFF] text-[#007AFF] | 关卡/设置按钮、图标、拼图边框、高亮背景、排行榜背景 |
| 草绿 | #34C759 | bg-[#34C759] text-[#34C759] | 排行榜按钮、成功状态、绿植装饰、正确反馈 |

### 辅助色

| 色彩名称 | 色值 | Tailwind 类名 | 应用场景 |
|----------|------|---------------|----------|
| 沙滩黄 | #F5DEB3 | bg-[#F5DEB3] text-[#F5DEB3] | 背景纹理、设置按钮、底部装饰、卡片底色 |
| 贝壳粉 | #FFB6C1 | bg-[#FFB6C1] text-[#FFB6C1] | 装饰元素、女性化图标点缀、气泡、装饰点缀 |
| 天空蓝 | #E6F4FF | bg-[#E6F4FF] text-[#E6F4FF] | 进度条容器、浅色背景、装饰背景 |

### 中性色

| 色彩名称 | 色值 | Tailwind 类名 | 应用场景 |
|----------|------|---------------|----------|
| 深灰 | #333333 | text-[#333333] | 正文文字、标题阴影、图标描边、主要文字 |
| 浅灰 | #E5E5EA | bg-[#E5E5EA] text-[#E5E5EA] | 未解锁态、分隔线、背景浅层次、禁用态 |
| 透明白 | rgba(255,255,255,0.8) | bg-white/80 | 弹窗背景、卡片遮罩、半透明遮罩 |
| 纯白 | #FFFFFF | bg-white text-white | 卡片背景、按钮文字、图标填充 |

### 特殊色

| 色彩名称 | 色值 | Tailwind 类名 | 应用场景 |
|----------|------|---------------|----------|
| 金色 | #FFD700 | bg-[#FFD700] text-[#FFD700] | 第一名、徽章、高亮装饰 |
| 银色 | #C0C0C0 | bg-[#C0C0C0] text-[#C0C0C0] | 第二名、徽章 |
| 铜色 | #CD7F32 | bg-[#CD7F32] text-[#CD7F32] | 第三名、徽章 |

## 3. 字体规范

**注意**：由于小程序和 H5 平台对自定义字体的限制，使用系统字体模拟效果

### 字体家族定义

```css
/* 卡通标题字体（模拟站酷快乐体） */
.font-title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* 圆角按钮字体（模拟思源黑体圆角版） */
.font-button {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', sans-serif;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* 正文字体（模拟思源黑体圆角版） */
.font-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', sans-serif;
  font-weight: 400;
}

/* 数字字体（模拟汉仪粗圆体） */
.font-number {
  font-family: 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
}
```

### 字号应用规范

| 文字类型 | Tailwind 类名 | 颜色 | 应用场景 |
|----------|---------------|------|----------|
| 主标题 | text-[36px] leading-tight | 海洋蓝/活力橙 | 游戏名称、页面大标题 |
| 副标题 | text-[28px] font-title font-bold | 深灰 | 页面小标题、关卡名称 |
| 按钮文字 | text-[22px] font-button font-semibold | 白色/深灰 | 所有按钮文案 |
| 正文/提示 | text-[18px] font-body | 深灰/浅灰 | 说明文字、加载提示、排名信息 |
| 数字/关卡号 | text-[32px] font-number font-bold | 主色调轮换 | 关卡号、计时器、排名数字 |
| 小号文字 | text-[16px] font-body | 浅灰/深灰 | 次要信息、备注 |

## 4. 间距系统

| 间距类型 | Tailwind 类名 | 应用场景 |
|----------|---------------|----------|
| 页面边距 | p-4 (16px) | 页面整体内边距 |
| 页面大边距 | p-6 (24px) | 大型容器内边距 |
| 卡片内边距 | p-5 (20px) | 卡片内容内边距 |
| 按钮内边距 | py-4 px-8 (16px 32px) | 按钮内边距 |
| 组件间距 | gap-4 (16px) | 垂直/水平组件间距 |
| 小间距 | gap-2 (8px) | 小型元素间距 |
| 中间距 | gap-6 (24px) | 中等元素间距 |
| 大间距 | gap-8 (32px) | 大型元素间距 |

## 5. 按钮组件规范

### 主按钮（开始游戏、返回首页）

```tsx
/* 橙色渐变主按钮 */
<Button className="
  w-full h-20
  bg-gradient-to-r from-[#FF9500] to-[#FFB700]
  text-white
  rounded-[24px]
  text-[22px] font-button font-semibold
  border-2 border-white
  shadow-lg shadow-[#FF9500]/30
  active:scale-95 active:shadow-md
  transition-all duration-150
">
  开始游戏
</Button>

/* 海洋蓝渐变按钮 */
<Button className="
  w-full h-20
  bg-gradient-to-r from-[#007AFF] to-[#409EFF]
  text-white
  rounded-[24px]
  text-[22px] font-button font-semibold
  border-2 border-white
  shadow-lg shadow-[#007AFF]/30
  active:scale-95 active:shadow-md
  transition-all duration-150
">
  关卡选择
</Button>

/* 草绿渐变按钮 */
<Button className="
  w-full h-20
  bg-gradient-to-r from-[#34C759] to-[#6FE788]
  text-white
  rounded-[24px]
  text-[22px] font-button font-semibold
  border-2 border-white
  shadow-lg shadow-[#34C759]/30
  active:scale-95 active:shadow-md
  transition-all duration-150
">
  排行榜
</Button>

/* 沙滩黄渐变按钮（设置） */
<Button className="
  w-full h-20
  bg-gradient-to-r from-[#F5DEB3] to-[#FFFFE0]
  text-[#333333]
  rounded-[24px]
  text-[22px] font-button font-semibold
  border-2 border-[#333333]
  shadow-lg
  active:scale-95 active:shadow-md
  transition-all duration-150
">
  设置
</Button>
```

### 功能按钮（提示、原图、冻结）

```tsx
/* 海洋蓝功能按钮 */
<Button className="
  flex-1 h-16
  bg-gradient-to-r from-[#007AFF] to-[#409EFF]
  text-white
  rounded-[20px]
  text-[20px] font-button font-medium
  border-2 border-white
  shadow-md shadow-[#007AFF]/20
  active:scale-95 active:shadow-sm
  transition-all duration-150
  flex items-center justify-center gap-2
">
  <View className="w-8 h-8"> {/* 图标占位 */} </View>
  <Text>提示</Text>
</Button>

/* 带徽章的功能按钮 */
<View className="relative">
  <Button className="
    flex-1 h-16
    bg-gradient-to-r from-[#007AFF] to-[#409EFF]
    text-white
    rounded-[20px]
    text-[20px] font-button font-medium
    border-2 border-white
    shadow-md shadow-[#007AFF]/20
    active:scale-95 active:shadow-sm
    transition-all duration-150
    flex items-center justify-center gap-2
  ">
    <View className="w-8 h-8"> {/* 图标占位 */} </View>
    <Text>提示</Text>
  </Button>
  {/* 红色圆形徽章 */}
  <View className="
    absolute -top-1 -right-1
    w-6 h-6
    bg-[#FF4444]
    rounded-full
    flex items-center justify-center
    border-2 border-white
  ">
    <Text className="text-[16px] font-number font-bold text-white">0</Text>
  </View>
</View>
```

### 小按钮（关闭、返回）

```tsx
/* 关闭按钮 */
<Button className="
  w-12 h-12
  bg-[#007AFF]
  text-white
  rounded-full
  flex items-center justify-center
  active:scale-90
  transition-transform duration-150
">
  ✕
</Button>

/* 返回按钮 */
<Button className="
  w-12 h-12
  flex items-center justify-center
  active:scale-90
  transition-transform duration-150
">
  <Text className="text-[#007AFF] text-2xl">←</Text>
</Button>
```

## 6. 卡片组件规范

### 信息卡片

```tsx
<View className="
  w-full max-w-[700px]
  bg-white/90
  rounded-[20px]
  p-5
  border-2 border-white
  shadow-lg
  backdrop-blur-sm
">
  <Text className="block text-[20px] font-body text-[#333333]">
    卡片内容
  </Text>
</View>
```

### 关卡卡片

```tsx
/* 已解锁关卡 */
<View className="
  w-[220px] h-[220px]
  bg-gradient-to-br from-[#007AFF] to-[#409EFF]
  rounded-[12px]
  flex flex-col items-center justify-center
  border-2 border-white
  shadow-lg shadow-[#007AFF]/20
  active:scale-95
  transition-all duration-200
">
  <Text className="text-[28px] font-number font-bold text-white">
    1
  </Text>
  <Text className="text-[16px] font-button font-medium text-[#FF9500] mt-2">
    可挑战
  </Text>
</View>

/* 未解锁关卡 */
<View className="
  w-[220px] h-[220px]
  bg-[#E5E5EA]
  rounded-[12px]
  flex flex-col items-center justify-center
  border-2 border-[#E5E5EA]
  opacity-60
">
  <Text className="text-[48px]">🔒</Text>
</View>

/* 选中态 */
<View className="
  w-[220px] h-[220px]
  bg-gradient-to-br from-[#007AFF] to-[#409EFF]
  rounded-[12px]
  flex flex-col items-center justify-center
  border-4 border-[#FF9500]
  shadow-lg shadow-[#FF9500]/30
  scale-105
  transition-all duration-200
">
  <Text className="text-[28px] font-number font-bold text-white">
    1
  </Text>
  <Text className="text-[16px] font-button font-medium text-[#FF9500] mt-2">
    可挑战
  </Text>
</View>
```

## 7. 导航结构

### 顶部导航

```tsx
<View className="
  fixed top-0 left-0 right-0
  h-[60px]
  bg-white
  flex items-center justify-between px-4
  z-50
  shadow-sm
">
  {/* 左侧返回按钮 */}
  <Button className="w-12 h-12 flex items-center justify-center">
    <Text className="text-[#007AFF] text-2xl">←</Text>
  </Button>

  {/* 中间标题 */}
  <Text className="text-[32px] font-title font-bold text-[#333333]">
    选择关卡
  </Text>

  {/* 右侧菜单按钮 */}
  <Button className="w-12 h-12 flex items-center justify-center">
    <Text className="text-[#E5E5EA] text-2xl">⋮</Text>
  </Button>
</View>
```

### 页面列表

```typescript
export default defineAppConfig({
  pages: [
    'pages/loading/index',
    'pages/index/index',
    'pages/game/index',
    'pages/level-select/index',
    'pages/rank/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '海海拼图大作战',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF'
  }
})
```

## 8. 拼图区域规范

### 拼图容器

```tsx
<View className="
  w-full max-w-[600px] aspect-square
  bg-white
  rounded-[8px]
  border-2 border-[#007AFF]
  shadow-lg
  overflow-hidden
  relative
  mx-auto
">
  {/* 拼图碎片 */}
</View>
```

### 拼图碎片

```tsx
/* 正常状态 */
<View className="
  absolute
  bg-white
  border-[2px] border-[#007AFF]
  rounded-[8px]
  shadow-md
  overflow-hidden
  transition-all duration-200
">
  <Image className="w-full h-full" src={pieceSrc} mode="aspectFill" />
</View>

/* 拖拽中 */
<View className="
  absolute
  bg-white
  border-[2px] border-[#007AFF]
  rounded-[8px]
  shadow-xl
  scale-105 opacity-90
  overflow-hidden
  transition-all duration-200
">
  <Image className="w-full h-full" src={pieceSrc} mode="aspectFill" />
</View>

/* 正确位置（烟花特效） */
<View className="
  absolute
  bg-white
  border-[2px] border-[#007AFF]
  rounded-[8px]
  shadow-md
  overflow-hidden
  transition-all duration-300
  animate-correct-flash
">
  <Image className="w-full h-full" src={pieceSrc} mode="aspectFill" />
</View>
```

### 拼图完成状态

```tsx
/* 游戏完成时隐藏所有边框，实现无缝拼接 */
<View className="
  puzzle-board game-complete
  w-full max-w-[600px] aspect-square
  bg-white
  rounded-[8px]
  border-2 border-[#007AFF]
  shadow-lg
  overflow-hidden
  relative
  mx-auto
">
  {/* 完成后的无缝图片 */}
  <Image className="w-full h-full" src={originalImage} mode="aspectFill" />
</View>
```

```css
/* 拼图板完成状态 - 隐藏所有图块边框 */
.puzzle-board.game-complete .puzzle-piece {
  border: none !important;
  border-radius: 0 !important;
}
```

## 9. 弹窗组件规范

### 设置弹窗

```tsx
<View className="
  fixed inset-0
  bg-black/30
  flex items-center justify-center
  z-50
  backdrop-blur-sm
">
  <View className="
    w-[600px]
    bg-white/90
    rounded-[20px]
    p-6
    border-2 border-white
    shadow-2xl
    backdrop-blur-sm
  ">
    {/* 标题区 */}
    <View className="flex items-center justify-between mb-8">
      <Text className="text-[28px] font-title font-bold text-[#333333]">
        设置
      </Text>
      <Button className="w-12 h-12 flex items-center justify-center">
        <Text className="text-[#007AFF] text-2xl">✕</Text>
      </Button>
    </View>

    {/* 设置项 */}
    <View className="flex flex-col gap-10">
      {/* 音效开关 */}
      <View className="flex items-center justify-between">
        <View className="flex items-center gap-3">
          <View className="w-12 h-12"> {/* 图标占位 */} </View>
          <Text className="text-[22px] font-body text-[#333333]">音效</Text>
        </View>
        {/* 开关组件 */}
        <View className="
          w-20 h-10
          bg-[#007AFF]
          rounded-full
          flex items-center px-1
          transition-all duration-200
        ">
          <View className="
            w-8 h-8
            bg-white
            rounded-full
            shadow-md
          " />
        </View>
      </View>

      {/* 震动开关 */}
      <View className="flex items-center justify-between">
        <View className="flex items-center gap-3">
          <View className="w-12 h-12"> {/* 图标占位 */} </View>
          <Text className="text-[22px] font-body text-[#333333]">震动</Text>
        </View>
        {/* 开关组件 */}
        <View className="
          w-20 h-10
          bg-[#E5E5EA]
          rounded-full
          flex items-center justify-start px-1
          transition-all duration-200
        ">
          <View className="
            w-8 h-8
            bg-white
            rounded-full
            shadow-md
          " />
        </View>
      </View>
    </View>

    {/* 底部按钮 */}
    <View className="mt-8 flex justify-center">
      <Button className="
        w-[200px] h-12
        bg-gradient-to-r from-[#007AFF] to-[#409EFF]
        text-white
        rounded-[20px]
        text-[20px] font-button font-semibold
        border-2 border-white
        shadow-md
      ">
        关闭
      </Button>
    </View>
  </View>
</View>
```

## 10. 动效系统

### 全局动效

```css
/* 页面切换动画 */
.page-enter {
  opacity: 0;
  transform: scale(0.95);
}

.page-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
}

.page-exit {
  opacity: 1;
  transform: scale(1);
}

.page-exit-active {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
}

/* 元素从下往上入场 */
.fade-up-enter {
  opacity: 0;
  transform: translateY(50px);
}

.fade-up-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

/* 按钮点击下沉 */
.button-click {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

/* 关卡卡片弹跳 */
.level-card-hover {
  transform: translateY(-8px) rotate(1deg);
  box-shadow: 0 12px 24px rgba(0, 122, 255, 0.3);
  transition: all 200ms ease-out;
}

/* 漂浮动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

/* 海浪滚动动画 */
@keyframes wave-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-wave {
  animation: wave-scroll 10s linear infinite;
}
```

### 游戏特定动效

```css
/* 图块位置正确 - 烟花爆炸效果 */
@keyframes fireworks {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.puzzle-piece.correct {
  animation: fireworks 0.6s ease-out;
  position: relative;
}

.puzzle-piece.correct::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle, rgba(255, 149, 0, 0.6) 0%, transparent 70%);
  border-radius: 12px;
  animation: glow-pulse 0.6s ease-out;
}

.puzzle-piece.correct::after {
  content: '✨';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  animation: spark-rotate 0.6s ease-out;
}

@keyframes glow-pulse {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

@keyframes spark-rotate {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(0deg) scale(0);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(180deg) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(360deg) scale(0.5);
  }
}

/* 提示道具 - 全屏脉冲光晕效果 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.hint-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 122, 255, 0.3) 0%, transparent 70%);
  pointer-events: none;
  animation: pulse-glow 0.8s ease-in-out;
  z-index: 40;
}

/* 拼图块拖拽 - 弹性跟随 */
.puzzle-piece.dragging {
  transition: none;
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.puzzle-piece.dragging::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #FF9500, #007AFF);
  border-radius: 10px;
  z-index: -1;
  animation: border-rotate 1s linear infinite;
}

@keyframes border-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 开关切换动画 */
@keyframes switch-bounce {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

.switch-handle {
  transition: transform 200ms ease-in-out;
}

.switch-handle.active {
  transform: translateX(32px);
}

/* 气泡弹出动画 */
@keyframes bubble-pop {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(1.2);
  }
}

.bubble {
  animation: bubble-pop 0.6s ease-out;
}
```

## 11. 小程序约束

### 包体积限制
- 图片资源使用网络图片，避免打包进小程序
- SVG 图标内联，避免增加包体积
- 压缩代码，避免不必要的依赖

### 图片策略
- 使用 `https://picsum.photos/` 获取随机图片
- 图片尺寸：正方形，建议 800×800
- 图片缓存：利用小程序缓存机制
- 预加载：在加载页面使用 `Taro.getImageInfo` 预缓存图片

### 性能优化
- 拼图碎片使用绝对定位，避免频繁重排
- 拖拽时使用 `transform` 替代 `left/top`，启用 GPU 加速
- 动画数量控制在 10 个以内，避免过度绘制
- 使用 `will-change` 优化动画性能

### 跨端兼容
- Text 组件添加 `block` 类：`<Text className="block">`
- Input 组件使用 View 包裹：`<View className="bg-gray-50"><Input /></View>`
- 平台检测：`const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP`
- Canvas 统一使用 Taro Canvas API

## 12. 装饰元素规范

### 漂浮装饰元素

```tsx
<View className="fixed top-20 left-10 animate-float z-0">
  <Text className="text-4xl opacity-40">🐟</Text>
</View>

<View className="fixed top-40 right-20 animate-float z-0" style={{ animationDelay: '0.5s' }}>
  <Text className="text-4xl opacity-40">🐚</Text>
</View>

<View className="fixed bottom-40 left-20 animate-float z-0" style={{ animationDelay: '1s' }}>
  <Text className="text-4xl opacity-40">🦀</Text>
</View>
```

### 海浪装饰

```tsx
<View className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#007AFF]/20 to-transparent z-0">
  {/* 海浪 SVG 装饰 */}
</View>
```

### 进度条小鱼装饰

```tsx
<View className="relative w-full">
  <View className="absolute top-1/2 -translate-y-1/2 text-2xl animate-fish-swim">
    🐠
  </View>
</View>
```

```css
@keyframes fish-swim {
  0% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(calc(100% + 20px));
  }
}
```

## 13. 交互反馈规范

### 触控反馈
- 所有可点击元素触控区域 ≥ 48×48px
- 按钮点击时下沉 2px（`active:scale-95`）
- 卡片 hover 时上浮 8px（`hover:-translate-y-2`）

### 视觉反馈
- 成功操作：绿色闪光 + "✓" 图标
- 错误操作：红色抖动 + "✗" 图标
- 提示操作：蓝色脉冲光晕
- 加载状态：进度条 + 加载文字

### 音效反馈
- 成功：轻快的 "叮" 音效
- 错误：柔和的 "嗒" 音效
- 点击：短促的 "嗒" 音效
- 完成：欢快的庆祝音效

### 震动反馈
- 轻微点击：`Taro.vibrateShort({ type: 'light' })`
- 成功反馈：`Taro.vibrateShort({ type: 'medium' })`
- 错误提示：`Taro.vibrateShort({ type: 'heavy' })`

## 14. 响应式适配

### 屏幕适配基准
- 设计稿基准尺寸：750×1334px
- 适配范围：375×667px 至 1080×2400px
- 横屏适配：限制为竖屏模式

### 适配策略
- 使用百分比布局：`w-[90%]`、`max-w-[700px]`
- 使用相对单位：`text-[36px]`、`rounded-[24px]`
- 使用 Flex 布局：`flex flex-col items-center justify-center`
- 使用 SafeArea：`pt-[env(safe-area-inset-top)]`

### 关键断点
- 小屏幕：≤ 375px
- 中屏幕：376px - 414px
- 大屏幕：≥ 415px

## 15. 可访问性

### 色彩对比度
- 所有文字与背景对比度 ≥ 4.5:1
- 重点文字与背景对比度 ≥ 7:1
- 按钮边框确保轮廓清晰

### 焦点状态
- 所有可聚焦元素有明显的焦点状态
- 焦点轮廓使用海洋蓝或活力橙

### 触控区域
- 最小触控区域：48×48px
- 按钮间距：≥ 16px
- 避免触控区域重叠
