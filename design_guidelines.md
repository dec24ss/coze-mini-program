# 拼图小游戏设计指南

## 1. 品牌定位

**应用定位**：一款休闲益智拼图小游戏，通过自由拖拽碎片完成图片拼合

**设计风格**：清新、简洁、有趣，强调游戏的可玩性和视觉愉悦感

**目标用户**：大众休闲玩家，追求轻松有趣的游戏体验

## 2. 配色方案

### 主色调
- **主色（游戏主题色）**：清新的天空蓝 `#3B82F6` → Tailwind: `bg-blue-500`、`text-blue-500`
  - 意象来源：晴朗的天空，代表轻松愉悦
- **辅色（功能按钮）**：活泼的橙色 `#F97316` → Tailwind: `bg-orange-500`、`text-orange-500`
  - 意象来源：温暖的阳光，代表活力和行动

### 中性色
- **背景色**：渐变背景 `from-blue-50 to-purple-50`
- **卡片背景**：纯白 `#FFFFFF` → Tailwind: `bg-white`
- **文字主色**：深灰 `#1F2937` → Tailwind: `text-gray-800`
- **文字辅色**：中灰 `#6B7280` → Tailwind: `text-gray-500`

### 语义色
- **成功色**：绿色 `#10B981` → Tailwind: `bg-green-500`、`text-green-500`
- **提示色**：黄色 `#F59E0B` → Tailwind: `bg-yellow-500`、`text-yellow-500`
- **错误色**：红色 `#EF4444` → Tailwind: `bg-red-500`、`text-red-500`

## 3. 字体规范

- **标题字体**：`text-2xl font-bold` → 大标题
- **副标题字体**：`text-lg font-semibold` → 次级标题
- **正文字体**：`text-base` → 正文内容
- **辅助文字**：`text-sm` → 说明文字
- **特殊强调**：`text-xl font-bold` → 重要信息（关卡、用时）

## 4. 间距系统

- **页面边距**：`p-4`（16px）
- **卡片内边距**：`p-6`（24px）
- **组件间距**：`gap-4`（16px）
- **小间距**：`gap-2`（8px）
- **中间距**：`gap-6`（24px）

## 5. 组件规范

### 按钮样式

**主按钮（开始游戏、下一关）**
```tsx
<Button className="w-full bg-blue-500 text-white rounded-full py-4 text-lg font-semibold shadow-lg shadow-blue-500/30">
  开始游戏
</Button>
```

**次按钮（返回首页）**
```tsx
<Button className="w-full bg-gray-100 text-gray-700 rounded-full py-4 text-lg font-semibold">
  返回首页
</Button>
```

**功能按钮（提示、查看原图、重置）**
```tsx
<Button className="flex-1 bg-orange-500 text-white rounded-xl py-3 text-base font-medium">
  提示
</Button>
```

### 卡片样式

```tsx
<View className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50">
  {/* 卡片内容 */}
</View>
```

### 输入框样式（跨端兼容）

```tsx
<View className="bg-gray-50 rounded-xl px-4 py-3">
  <Input
    className="w-full bg-transparent text-base"
    placeholder="请输入"
  />
</View>
```

### 列表项样式

```tsx
<View className="flex items-center justify-between p-4 bg-white rounded-xl mb-3">
  <Text className="block text-base font-medium">内容</Text>
  <Text className="block text-sm text-gray-500">辅助信息</Text>
</View>
```

### 进度条样式

```tsx
<Progress
  className="w-full"
  percent={50}
  strokeWidth={8}
  activeColor="#3B82F6"
  backgroundColor="#E5E7EB"
  active
  showInfo={false}
/>
```

## 6. 导航结构

### TabBar 配置
本项目不使用 TabBar，采用单页面导航模式。

### 页面路由
1. **加载页面**：`pages/loading/index` → 首次进入显示
2. **首页**：`pages/index/index` → 游戏入口
3. **游戏页面**：`pages/game/index` → 拼图主界面
4. **过关页面**：`pages/victory/index` → 通关弹窗（可内嵌在游戏页面）

### 页面跳转规范
- 首页 → 游戏页面：`Taro.navigateTo({ url: '/pages/game/index' })`
- 游戏页面 → 首页：`Taro.redirectTo({ url: '/pages/index/index' })`
- 关卡内切换：使用状态管理，无需跳转

## 7. 拼图区域规范

### 拼图容器
```tsx
<View className="w-full aspect-square bg-white rounded-2xl shadow-lg overflow-hidden relative">
  {/* 拼图碎片 */}
</View>
```

### 拼图碎片
- **尺寸**：根据关卡动态计算（8×8 / 10×10 / 12×12）
- **边框**：白色边框 `border-2 border-white` 用于区分碎片
- **阴影**：`shadow-md` 增加立体感
- **吸附效果**：动画过渡 `transition-all duration-200`

### 拖拽状态
- **正常状态**：`opacity-100`
- **拖拽中**：`opacity-80 scale-105`
- **吸附成功**：`opacity-100 scale-100`

## 8. 小程序约束

### 包体积限制
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

## 9. 空状态与加载态

### 加载态
```tsx
<View className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
  <Text className="block text-2xl font-bold text-blue-500 mb-8">拼图游戏</Text>
  <Progress percent={80} strokeWidth={8} activeColor="#3B82F6" active />
  <Text className="block text-sm text-gray-500 mt-4">加载中...</Text>
</View>
```

### 空状态
```tsx
<View className="flex flex-col items-center justify-center py-12">
  <Text className="block text-gray-400 text-base">暂无内容</Text>
</View>
```

## 10. 跨端兼容性

### H5/小程序兼容
- Text 组件添加 `block` 类：`<Text className="block">`
- Input 组件使用 View 包裹：`<View className="bg-gray-50"><Input /></View>`
- 平台检测：`const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP`

### Canvas 兼容
- 使用 Taro Canvas API
- 图片绘制使用 `createImage()` 加载
- 碎片切割使用 `ctx.drawImage()`

### 触摸事件兼容
- 小程序：`onTouchStart`、`onTouchMove`、`onTouchEnd`
- H5：自动转换为对应的事件
- 使用 `transform` 实现平滑拖拽
