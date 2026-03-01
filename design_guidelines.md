# 海海拼图大作战 - 卡通海洋风格设计指南

## 1. 品牌定位

**应用定位**：一款高饱和度卡通风格的海洋主题拼图小游戏，通过拖拽碎片完成图片拼合

**设计风格**：高饱和卡通、海洋趣味元素、活泼动态交互、强视觉记忆点

**目标用户**：大众休闲玩家，追求轻松有趣、色彩鲜艳的游戏体验

## 2. 配色方案

### 主色调
- **主色1（活力橙）**：`#FF9500` → 开始游戏按钮、选中态、数字高亮、徽章
  - 意象来源：温暖的阳光，代表活力和行动
  - Tailwind: `bg-[#FF9500]`、`text-[#FF9500]`

- **主色2（海洋蓝）**：`#007AFF` → 关卡/设置按钮、图标、拼图边框、高亮背景
  - 意象来源：深邃的海洋，代表广阔和探索
  - Tailwind: `bg-[#007AFF]`、`text-[#007AFF]`

- **主色3（草绿）**：`#34C759` → 排行榜按钮、成功提示、绿植装饰
  - 意象来源：海边的草地，代表成功和生机
  - Tailwind: `bg-[#34C759]`、`text-[#34C759]`

### 辅助色
- **辅助色1（沙滩黄）**：`#F5DEB3` → 背景纹理、设置按钮、底部装饰
  - 意象来源：金色的沙滩，代表温暖和休息
  - Tailwind: `bg-[#F5DEB3]`、`text-[#F5DEB3]`

- **辅助色2（贝壳粉）**：`#FFB6C1` → 装饰元素、图标点缀、气泡
  - 意象来源：粉色贝壳，代表可爱和温馨
  - Tailwind: `bg-[#FFB6C1]`、`text-[#FFB6C1]`

### 中性色
- **中性色1（深灰）**：`#333333` → 正文文字、标题阴影、图标描边
  - Tailwind: `bg-[#333333]`、`text-[#333333]`

- **中性色2（浅灰）**：`#E5E5EA` → 未解锁态、分隔线、背景浅层次
  - Tailwind: `bg-[#E5E5EA]`、`text-[#E5E5EA]`

- **中性色3（透明白）**：`rgba(255,255,255,0.8)` → 弹窗背景、卡片遮罩
  - Tailwind: `bg-white/80`

### 背景渐变
- **海洋渐变**：从浅蓝到深蓝的线性渐变，模拟海洋深度
  - `linear-gradient(315deg, #E6F4FF 0%, #007AFF 100%)`
  - 适用于页面背景

- **沙滩渐变**：从浅黄到沙滩黄的线性渐变
  - `linear-gradient(315deg, #FFF8E1 0%, #F5DEB3 100%)`

## 3. 字体规范

### 标题字体
- **主标题（游戏名称）**：优先使用 PNG 图片替代（卡通字体），备选加粗字体
  - 字号：72rpx（36px）
  - 字重：700 (加粗)
  - 颜色：`#007AFF`（海洋蓝）或 `#FF9500`（活力橙）
  - 示例：「海海拼图大作战」

- **副标题**：加粗字体
  - 字号：48-56rpx（24-28px）
  - 字重：600 (半粗)
  - 颜色：`#333333`（深灰）
  - 示例：「拖拽碎片，完成拼图」

### 按钮字体
- **按钮文字**：圆角版字体
  - 字号：40-44rpx（20-22px）
  - 字重：600 (半粗)
  - 颜色：白色或深灰
  - 示例：「开始游戏」「提示」

### 正文/提示字体
- **正文**：常规字体
  - 字号：32-36rpx（16-18px）
  - 字重：400 (常规)
  - 颜色：`#333333`（深灰）或 `#E5E5EA`（浅灰）
  - 示例：说明文字、加载提示、排名信息

- **辅助文字**：小号字体
  - 字号：28-32rpx（14-16px）
  - 字重：400 (常规)
  - 颜色：`#E5E5EA`（浅灰）
  - 示例：次级信息、提示文字

### 数字/关卡号
- **关卡号、计时器、排名数字**：加粗字体（可选 PNG 图片替代）
  - 字号：56-64rpx（28-32px）
  - 字重：700 (加粗)
  - 颜色：主色调轮换
  - 示例：「第 5 关」「00:45」

### 特殊文字
- **徽章数字**：加粗字体
  - 字号：32rpx（16px）
  - 字重：700 (加粗)
  - 颜色：白色
  - 示例：道具剩余次数

## 4. 间距系统

### 页面边距
- **标准页面边距**：`px-6 py-8`（24rpx × 32rpx）
- **宽松页面边距**：`px-10 py-12`（40rpx × 48rpx）

### 卡片内边距
- **标准卡片内边距**：`p-6`（24rpx）
- **宽松卡片内边距**：`p-8`（32rpx）

### 组件间距
- **小间距**：`gap-2`（8rpx）
- **中间距**：`gap-4`（16rpx）
- **大间距**：`gap-6`（24rpx）
- **超大间距**：`gap-8`（32rpx）

### 元素间距
- **行间距**：`space-y-4`（16rpx）
- **列间距**：`space-x-4`（16rpx）

## 5. 组件规范

### 按钮样式

#### 主按钮（开始游戏、下一关）
```tsx
<Button className="
  w-full bg-[#FF9500] text-white
  rounded-[48rpx] py-4 px-6
  text-[44rpx] font-semibold
  border-2 border-white
  shadow-lg shadow-[#FF9500]/30
  active:translate-y-1 active:shadow-md
">
  开始游戏
</Button>
```

**配色变化**：
- 活力橙：`bg-[#FF9500]`
- 海洋蓝：`bg-[#007AFF]`
- 草绿：`bg-[#34C759]`

#### 次按钮（关卡选择、排行榜、设置）
```tsx
<Button className="
  w-full bg-[#007AFF] text-white
  rounded-[48rpx] py-4 px-6
  text-[44rpx] font-semibold
  border-2 border-white
  shadow-lg shadow-[#007AFF]/30
  active:translate-y-1 active:shadow-md
">
  关卡选择
</Button>
```

#### 功能按钮（提示、查看原图、冻结）
```tsx
<View className="
  flex-1 h-[120rpx]
  bg-[#007AFF] text-white
  rounded-[40rpx]
  border-2 border-white
  flex items-center justify-center gap-2
  shadow-lg shadow-[#007AFF]/30
  active:translate-y-1 active:shadow-md
  relative
">
  <View className="w-[64rpx] h-[64rpx] text-white" />
  <Text className="text-[40rpx] font-semibold">提示</Text>
  <View className="
    absolute -top-1 -right-1
    w-[40rpx] h-[40rpx]
    bg-red-500 rounded-full
    flex items-center justify-center
  ">
    <Text className="text-[32rpx] font-bold text-white">3</Text>
  </View>
</View>
```

### 卡片样式

```tsx
<View className="
  bg-white rounded-[32rpx]
  p-6 shadow-xl
  border-4 border-[#E5E5EA]
">
  {/* 卡片内容 */}
</View>
```

### 列表项样式

```tsx
<View className="
  flex items-center justify-between
  p-4 bg-white rounded-[24rpx] mb-3
  border-2 border-[#E5E5EA]
  active:bg-[#F5DEB3] active:translate-y-[-4rpx]
  transition-all
">
  <Text className="block text-[36rpx] font-semibold">内容</Text>
  <Text className="block text-[32rpx] text-[#E5E5EA]">辅助信息</Text>
</View>
```

### 进度条样式

```tsx
<View className="w-[600rpx] h-[60rpx] bg-[#E6F4FF] rounded-[30rpx] relative">
  <View
    className="absolute left-0 top-0 h-full bg-[#007AFF] rounded-[30rpx]"
    style={{ width: `${progressPercent}%` }}
  />
  <Text className="absolute right-0 top-1/2 -translate-y-1/2 text-[48rpx] font-bold text-[#FF9500]">
    {progressPercent}%
  </Text>
</View>
```

### 图标规范

#### 图标尺寸
- **按钮内图标**：96×96rpx
- **列表/装饰图标**：64×64rpx
- **迷你图标**：48×48rpx

#### 图标样式
- **造型**：圆润描边+填充风格
- **边角**：无尖锐，统一圆角
- **线条粗细**：4rpx
- **颜色**：白色或主色调

#### 功能图标
- 拼图块、奖杯、灯泡（提示）、眼睛（原图）、雪花（冻结）、齿轮（设置）、喇叭（音效）、铃铛（震动）、锁（未解锁）

#### 装饰图标
- 小鱼、海浪、贝壳、螃蟹、气泡、闪光、浪花

## 6. 导航结构

### 页面路由
1. **加载页面**：`pages/loading/index` → 首次进入显示
2. **首页**：`pages/index/index` → 游戏入口
3. **游戏页面**：`pages/game/index` → 拼图主界面
4. **关卡选择页**：`pages/level-select/index` → 关卡列表
5. **排行榜页**：`pages/rank/index` → 排名列表

### 页面跳转规范
- 加载页 → 首页：`Taro.redirectTo({ url: '/pages/index/index' })`
- 首页 → 游戏页面：`Taro.navigateTo({ url: '/pages/game/index' })`
- 首页 → 关卡选择页：`Taro.navigateTo({ url: '/pages/level-select/index' })`
- 首页 → 排行榜页：`Taro.navigateTo({ url: '/pages/rank/index' })`
- 关卡选择页 → 游戏页面：`Taro.navigateTo({ url: '/pages/game/index?level=X&mode=free' })`
- 游戏页面 → 首页：`Taro.redirectTo({ url: '/pages/index/index' })`

## 7. 动效规范

### 页面切换动画
- **淡入淡出+缩放**：透明度从 0 → 1，缩放从 0.95 → 1
- **时长**：300ms
- **缓动**：ease-in-out

### 按钮点击反馈
- **下沉动画**：translateY 4rpx，阴影模糊从 8rpx → 4rpx
- **时长**：150ms
- **松开回弹**：自动恢复原状

### 关卡卡片触摸
- **位移动画**：上浮 16rpx，旋转 1°
- **时长**：200ms
- **缓动**：ease-out

### 拼图块拖拽
- **缩放动画**：放大 1.1 倍
- **时长**：100ms
- **缓动**：ease-out

### 海浪流动
- **循环位移动画**：X 轴从 -750rpx → 0
- **时长**：10s
- **缓动**：linear（线性）
- **循环播放**：无限循环

### 首页漂浮元素
- **循环位移动画**：上下浮动 20rpx
- **时长**：2s
- **缓动**：ease-in-out
- **循环播放**：无限循环

### 鱼尾摆动
- **循环旋转动画**：±5° 旋转
- **时长**：2s
- **缓动**：ease-in-out
- **循环播放**：无限循环

## 8. 空状态与加载态

### 加载态
```tsx
<View className="
  min-h-screen flex flex-col items-center justify-center
  bg-gradient-to-br from-[#E6F4FF] to-[#007AFF]
  px-6 py-8
">
  {/* 标题 */}
  <Text className="block text-[72rpx] font-bold text-[#007AFF] mb-16">
    海海拼图大作战
  </Text>

  {/* 进度条 */}
  <View className="w-[600rpx] h-[60rpx] bg-[#E6F4FF] rounded-[30rpx] relative mb-16">
    <View
      className="absolute left-0 top-0 h-full bg-[#007AFF] rounded-[30rpx]"
      style={{ width: `${progressPercent}%` }}
    />
    <Text className="absolute right-0 top-1/2 -translate-y-1/2 text-[48rpx] font-bold text-[#FF9500]">
      {progressPercent}%
    </Text>
  </View>

  {/* 加载文字 */}
  <Text className="block text-[36rpx] text-[#333333]">
    正在加载图片... {loadedCount}/10
  </Text>
  <Text className="block text-[32rpx] text-[#E5E5EA] mt-4">
    💡 首次加载可能需要几秒钟
  </Text>
</View>
```

### 空状态
```tsx
<View className="
  flex flex-col items-center justify-center
  py-12 bg-white rounded-[24rpx]
  border-2 border-[#E5E5EA]
">
  <Text className="block text-[#E5E5EA] text-[36rpx]">暂无内容</Text>
</View>
```

## 9. 拼图区域规范

### 拼图容器
```tsx
<View className="
  w-full aspect-square
  bg-white rounded-[32rpx]
  shadow-xl overflow-hidden relative
  border-4 border-[#007AFF]
">
  {/* 拼图碎片 */}
</View>
```

### 拼图碎片
- **尺寸**：根据关卡动态计算（3×3 / 4×4 / 5×5 / 6×6 / 7×7）
- **边框**：白色边框 `border-2 border-white` 用于区分碎片
- **阴影**：`shadow-lg` 增加立体感
- **圆角**：`rounded-lg` 圆润边角
- **吸附效果**：动画过渡 `transition-all duration-200 ease-out`

### 拖拽状态
- **正常状态**：`opacity-100 scale-100`
- **拖拽中**：`opacity-90 scale-110 shadow-2xl`
- **吸附成功**：`opacity-100 scale-100`

### 拼图完成状态
- **隐藏所有边框**：通过 `.puzzle-board.game-complete .puzzle-tile` 隐藏所有图块边框
- **烟花爆炸效果**：光晕扩散 + 粒子旋转

## 10. 跨端兼容性

### H5/小程序兼容
- **Text 组件**：所有需要垂直排列的 Text 添加 `block` 类
- **Input 组件**：必须用 View 包裹，样式放在 View 上
- **Fixed + Flex**：必须使用 inline style
- **平台检测**：`const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP`

### Canvas 兼容
- 使用 Taro Canvas API
- 图片绘制使用 `createImage()` 加载
- 碎片切割使用 `ctx.drawImage()`

### 触摸事件兼容
- 小程序：`onTouchStart`、`onTouchMove`、`onTouchEnd`
- H5：自动转换为对应的事件
- 使用 `transform` 实现平滑拖拽

## 11. 小程序约束

### 包体积限制
- 图标使用 SVG 格式（内联在代码中）
- 图片资源使用网络图片，避免打包进小程序
- 压缩代码，避免不必要的依赖

### 图片策略
- 使用 `https://picsum.photos/` 获取随机图片
- 图片尺寸：正方形，建议 800×800
- 图片缓存：利用小程序缓存机制

### 性能优化
- 拼图碎片使用绝对定位，避免频繁重排
- 拖拽时使用 `transform` 替代 `left/top`，启用 GPU 加速
- 计时器使用 `requestAnimationFrame` 优化性能
- 限制同时播放的动画数量（单页面 ≤ 5 个）

## 12. 全局变量配置

### 关键全局变量
- `currentLevel`：当前关卡号（默认 1）
- `maxLevel`：已解锁的最高关卡号（默认 1）
- `loadingProgress`：加载页进度百分比（默认 0）
- `loadedCount`：加载的图片资源计数（默认 0）
- `soundOn`：音效开关状态（默认 true）
- `vibrateOn`：震动开关状态（默认 true）
- `gameTime`：游戏计时器秒数（默认 0）
- `hintCount`：提示道具剩余次数（默认 3）
- `originalCount`：原图道具剩余次数（默认 3）
- `freezeCount`：冻结道具剩余次数（默认 3）

### 本地存储同步
- 变量变更时同步绑定本地存储
- 页面加载时从本地存储读取
- 确保重启小程序数据不丢失
