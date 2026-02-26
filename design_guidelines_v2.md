# 海海拼图大作战 - 全新设计指南

## 1. 品牌定位与风格意象

### 核心意象
**"星空木片拼图"** - 想象在深夜的露台上，柔和的月光洒在一张手工木质拼图上，拼图碎片散发出微微的星云光泽，每一次拼接都像是在组装星空的碎片。

### 气质关键词
- 温暖、治愈、精致、轻盈、梦幻
- 木质触感 + 星空色彩 + 柔和光影

### 视觉策略
- **摄影方向**：暖调、柔和、自然光、微距特写
- **图形语言**：有机曲线、柔和阴影、毛玻璃效果、微光边框

---

## 2. 配色方案

### 主色调（星空木色）
| 名称 | 颜色 | Tailwind | 意象来源 |
|------|------|----------|----------|
| 深邃夜空 | `#1a1b2f` | `bg-slate-900` | 深夜星空的底色 |
| 星云紫 | `#6d5acd` | `bg-violet-500` | 遥远星系的微光 |
| 琥珀木 | `#e8b86d` | `bg-amber-400` | 手工拼图的木质温暖 |
| 月光白 | `#f5f5f0` | `bg-stone-50` | 月光洒落的纯净 |
| 晨雾灰 | `#9ca3af` | `bg-gray-400` | 朦胧的边界感 |

### 辅助色
| 名称 | 颜色 | Tailwind | 用途 |
|------|------|----------|------|
| 胜利金 | `#fbbf24` | `bg-amber-400` | 胜利、成功状态 |
| 警示珊瑚 | `#f87171` | `bg-red-400` | 倒计时警告、失败 |
| 成功翠绿 | `#34d399` | `bg-emerald-400` | 正确提示 |
| 神秘靛蓝 | `#6366f1` | `bg-indigo-500` | 按钮hover、交互 |

### 渐变方案
```css
/* 主背景渐变 - 星空感 */
.gradient-main: linear-gradient(135deg, #1a1b2f 0%, #2d1b4e 50%, #1a1b2f 100%);

/* 按钮光泽 */
.gradient-button: linear-gradient(135deg, #e8b86d 0%, #f0d9a0 50%, #e8b86d 100%);

/* 胜利特效 */
.gradient-victory: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);

/* 卡片悬浮 */
.gradient-card: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
```

---

## 3. 字体与排版

### 字体选择
- **中文标题**：霞鹜文楷 (LXGW WenKai) - 温暖、有质感
- **英文/数字**：Outfit - 现代、清晰
- **系统回退**：PingFang SC, -apple-system

### 字体层级
| 层级 | 大小 | 字重 | 用途 |
|------|------|------|------|
| H1 大标题 | text-4xl (36px) | font-bold | 首页标题 |
| H2 章节标题 | text-2xl (24px) | font-semibold | 页面标题 |
| H3 卡片标题 | text-xl (20px) | font-semibold | 按钮文字、弹窗标题 |
| Body 正文 | text-base (16px) | font-normal | 描述文字 |
| Caption 辅助 | text-sm (14px) | font-normal | 提示、小字 |
| Number 数字 | text-3xl (30px) | font-bold | 倒计时、分数 |

---

## 4. 间距系统

### 页面间距
- 页面边距：`px-4` (16px) / `px-6` (24px)
- 安全区底部：`pb-20` (80px) 避开 TabBar
- 内容区最大宽度：`max-w-md` (448px)

### 组件间距
- 卡片内边距：`p-4` (16px)
- 按钮内边距：`px-6 py-3` (24px 12px)
- 列表项间距：`gap-3` (12px)
- 标题与内容：`mb-4` (16px)

### 拼图区域
- 棋盘内边距：`p-3` (12px)
- 拼图碎片间距：`gap-1` (4px)
- 边框圆角：`rounded-xl` (12px)

---

## 5. 组件规范

### 按钮
```tsx
// 主按钮 - 琥珀木光泽
<View className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400 shadow-lg shadow-amber-500/30">
  <Button className="relative z-10 px-8 py-4 text-slate-900 font-semibold text-lg">
    开始游戏
  </Button>
  {/* 光泽层 */}
  <View className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
</View>

// 次按钮 - 毛玻璃效果
<View className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
  <Button className="px-6 py-3 text-stone-50 font-medium">
    返回首页
  </Button>
</View>

// 功能按钮 - 圆形图标
<View className="w-12 h-12 rounded-full bg-violet-500/80 backdrop-blur shadow-lg shadow-violet-500/30 flex items-center justify-center">
  <Text className="text-white text-xl">💡</Text>
</View>
```

### 卡片
```tsx
// 毛玻璃卡片
<View className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
  {/* 顶部微光 */}
  <View className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  
  {/* 内容 */}
  <View className="p-5">
    <Text className="block text-stone-50 font-semibold text-lg">关卡 1</Text>
  </View>
</View>
```

### 拼图棋盘
```tsx
// 棋盘容器
<View className="relative rounded-2xl p-3 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur border border-white/10 shadow-2xl">
  {/* 内发光边框 */}
  <View className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
  
  {/* 拼图网格 */}
  <View className="relative grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
    {/* 拼图碎片 */}
  </View>
</View>
```

### 拼图碎片
```tsx
// 拼图碎片
<View className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105 active:scale-95">
  {/* 选中状态光晕 */}
  {isSelected && (
    <View className="absolute inset-0 rounded-lg ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 animate-pulse" />
  )}
  
  {/* 图片 */}
  <Image className="w-full h-full object-cover" src={piece.imageUrl} />
  
  {/* 悬浮阴影 */}
  <View className="absolute inset-0 shadow-inner" />
</View>
```

### 进度条
```tsx
// 星空进度条
<View className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
  {/* 背景星星 */}
  <View className="absolute inset-0 opacity-30">
    <Text className="text-xs">✨</Text>
  </View>
  
  {/* 进度填充 */}
  <View 
    className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 via-amber-400 to-violet-500 rounded-full transition-all duration-500"
    style={{ width: `${progress}%` }}
  >
    {/* 流光效果 */}
    <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
  </View>
</View>
```

---

## 6. 动画与动效

### 页面过渡
- 进入：淡入 + 上滑，`duration-500`，`ease-out`
- 离开：淡出 + 下滑，`duration-300`，`ease-in`

### 按钮交互
- Hover：缩放 `scale-105`，阴影增强
- Press：缩放 `scale-95`，背景变暗
- 过渡：`duration-200 ease-out`

### 拼图动画
- 拖拽跟随：`transition-none`（实时跟随手指）
- 交换动画：`spring` 弹性效果，`duration-300`
- 正确归位：缩放脉冲 + 发光，`duration-500`
- 胜利动画：碎片飞入 + 粒子爆发

### 倒计时动画
- 正常状态：数字缩放 `scale-100`
- 最后10秒：心跳脉冲 `animate-pulse`，颜色变红
- 最后3秒：抖动 `animate-bounce`，颜色闪烁

### 特效动画
- 星星闪烁：`animate-twinkle`，随机延迟
- 粒子爆炸：胜利时使用，`duration-1000`
- 光晕扩散：提示正确位置，`duration-800`

### 自定义动画定义
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(232, 184, 109, 0.3); }
  50% { box-shadow: 0 0 40px rgba(232, 184, 109, 0.6); }
}
```

---

## 7. 音效设计

### 背景音乐
- 类型：轻快的 Lo-fi / 治愈系钢琴曲
- 循环播放，可开关
- 音量：30%

### 操作音效
| 操作 | 音效描述 | 参考 |
|------|----------|------|
| 点击按钮 | 清脆的"叮"声，木质质感 | Pop sound |
| 拖拽碎片 | 轻微的摩擦声 | Paper slide |
| 碎片交换 | 木质碰撞的"咔哒"声 | Wood click |
| 正确归位 | 悦耳的和弦提示 | Success chime |
| 关卡完成 | 欢快的胜利旋律 | Victory fanfare |
| 倒计时警告 | 急促的心跳节奏 | Heartbeat |
| 游戏失败 | 低沉的提示音 | Soft failure |
| 使用道具 | 魔法光效音 | Magic spark |

---

## 8. 设计禁忌

❌ **不要使用**：
- 纯黑/纯白背景（使用深邃夜空 `#1a1b2f`）
- 直角/尖锐边角（使用 `rounded-2xl` 或更大）
- 纯扁平设计（添加微渐变、阴影、光泽）
- 生硬的过渡动画（使用 spring/bezier 缓动）
- 刺眼的对比色（使用柔和的相近色）
- 小字号密集排版（使用足够的间距和留白）
- 复杂的装饰性元素（保持简约精致）

✅ **必须做到**：
- 所有页面使用统一的深色星空背景
- 按钮添加光泽/阴影层次
- 交互元素有清晰的 hover/active 状态
- 动画过渡自然流畅
- 文字与背景对比度充足（WCAG 4.5:1）
- 拼图碎片有立体感（阴影+高光）
- 加载/过渡有视觉反馈

---

## 9. 页面结构规范

### 加载页
- 居中 Logo 动画
- 星空进度条
- 加载提示文字

### 首页
- 大标题 + 副标题
- 主按钮：开始游戏
- 次级按钮：选择关卡
- 背景：动态星空粒子

### 游戏页
- 顶部：关卡信息 + 倒计时
- 中部：拼图棋盘（居中）
- 底部：功能按钮（提示、原图、冻结）
- 背景：柔和渐变

### 关卡选择页
- 标题：选择关卡
- 网格：1-10 关卡片
- 底部：返回按钮

### 过关/失败弹窗
- 居中卡片
- 结果图标（✓/✗）
- 文字信息
- 操作按钮
- 粒子特效（过关时）
