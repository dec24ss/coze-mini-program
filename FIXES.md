# 问题修复日志

## 云开发相关问题

### 1. 云开发初始化错误 `webapi_getwxaasyncsecinfo:fail`

**问题描述**
在微信开发者工具中预览时，出现以下错误：
```
webapi_getwxaasyncsecinfo:fail
```

**原因分析**
- 使用测试号（touristappid）进行预览
- 测试号不支持云开发功能
- 即使云开发功能已被禁用，微信开发者工具仍然会尝试进行安全检查

**解决方案**
1. **忽略此错误**（推荐）
   - 云开发功能已被禁用（USE_CLOUDBASE=false）
   - 游戏会使用本地存储模拟云开发功能
   - 不影响游戏的基本玩法

2. **使用预览版导出脚本**
   ```bash
   node export-for-preview.js
   pnpm build:weapp
   ```

3. **使用正式 AppID**
   - 修改 project.config.json 中的 appid
   - 将 USE_CLOUDBASE 设置为 true
   - 配置云开发环境

**相关文件**
- `src/cloudbase/index.ts`
- `src/pages/loading/index.tsx`
- `project.config.json`

**修复日期**
2025-01-13

---

### 2. 云开发 SDK BigInt 兼容性问题

**问题描述**
在构建时出现以下错误：
```
SyntaxError: Unexpected token '1n'
```

**原因分析**
- 云开发 SDK 使用了 BigInt 语法（如 `1n`）
- 小程序构建目标（es2015）不支持 BigInt
- 在导入云开发 SDK 时就会触发构建错误

**解决方案**
1. 在 `src/cloudbase/index.ts` 中添加 `USE_CLOUDBASE` 开关
2. 使用动态导入（`await import('@cloudbase/js-sdk')`）
3. 在 Coze 环境中禁用云开发（USE_CLOUDBASE=false）
4. 在本地部署时启用云开发（USE_CLOUDBASE=true）

**相关文件**
- `src/cloudbase/index.ts`

**修复日期**
2025-01-13

---

## 游戏相关问题

### 3. 首页白屏问题

**问题描述**
点击"开始游戏"后，游戏页面显示空白，图片没有加载。

**原因分析**
- `getCurrentLevel()` 方法返回的是用户完成的最高关卡
- 而不是当前应该从哪一关开始
- 没有正确传递关卡参数到游戏页面

**解决方案**
1. 修改 `getCurrentLevel()` 方法，从本地存储读取上次保存的关卡进度
2. 在首页的 `startGameWithPreload()` 中调用 `getCurrentLevel()`
3. 将关卡参数正确传递给游戏页面
4. 在跳转前检查图片预加载状态

**相关文件**
- `src/pages/index/index.tsx`
- `src/stores/userStore-cloudbase.ts`

**修复日期**
2025-01-13

---

### 4. 图片随机选择问题

**问题描述**
每次进入同一关，显示的图片都不一样。

**原因分析**
- 原先使用 `Math.random()` 随机选择图片
- 没有保证同一关卡使用同一张图片

**解决方案**
1. 使用 `(level * 17) % imageList.length` 计算随机索引
2. 确保每次进入同一关都是同一张图
3. 不同关卡图片不同

**相关文件**
- `src/pages/game/index.tsx`

**修复日期**
2025-01-13

---

## 用户系统相关问题

### 5. 微信登录后头像显示问题

**问题描述**
微信登录后显示"灰色头像和微信用户"，无法获取真实头像和昵称。

**原因分析**
- 微信小程序已废弃 `Taro.getUserProfile()` API
- 无法直接获取用户的头像和昵称

**解决方案**
1. 移除 `Taro.getUserProfile()` 调用
2. 使用用户信息设置弹窗
3. 让用户手动选择头像和输入昵称
4. 头像选择后上传到对象存储

**相关文件**
- `src/components/user-profile-modal/index.tsx`
- `src/stores/userStore-cloudbase.ts`

**修复日期**
2025-01-13

---

### 6. 用户信息更新问题

**问题描述**
设置头像和昵称后，再次设置时无法更新。

**原因分析**
- `getOrCreateUser` 方法不会更新已有用户的头像和昵称

**解决方案**
1. 修改 `getOrCreateUser` 方法
2. 检查是否需要更新头像和昵称
3. 如果传入新值则自动更新数据库

**相关文件**
- `src/stores/userStore-cloudbase.ts`

**修复日期**
2025-01-13

---

## 排行榜相关问题

### 7. 排行榜无法刷新问题

**问题描述**
排行榜页面显示的数据不是最新的。

**原因分析**
- 使用了本地缓存
- 没有提供刷新机制

**解决方案**
1. 每次进入排行榜页面强制刷新（forceRefresh: true）
2. 添加刷新按钮，用户可以手动刷新
3. 保留5分钟缓存机制作为降级方案

**相关文件**
- `src/pages/rank/index.tsx`
- `src/stores/userStore-cloudbase.ts`

**修复日期**
2025-01-13

---

### 8. 排行榜头像显示问题

**问题描述**
排行榜看不到其他真实用户的头像。

**原因分析**
- 头像URL为本地路径（wxfile://）时无法显示

**解决方案**
1. 头像URL为本地路径时显示默认头像
2. 有效网络头像正常显示
3. 优化头像 URL 验证逻辑

**相关文件**
- `src/pages/rank/index.tsx`

**修复日期**
2025-01-13

---

## 性能优化相关问题

### 9. 图片加载性能问题

**问题描述**
进入游戏时，图片加载较慢。

**原因分析**
- 没有预加载图片
- 图片从网络实时加载

**解决方案**
1. 在加载页面使用 `Taro.getImageInfo` 预缓存图片
2. 在 DOM 中渲染隐藏的 `<Image>` 组件
3. 确保进入关卡时图片立即可用

**相关文件**
- `src/pages/loading/index.tsx`
- `src/stores/gameStore.ts`

**修复日期**
2025-01-13

---

### 10. 代码重复问题

**问题描述**
多个地方存在重复的逻辑代码。

**原因分析**
- 没有提取公共逻辑
- 复制粘贴导致重复

**解决方案**
1. 提取 `playVibration()` 公共方法
2. 提取 `showLoginPrompt()` 公共方法
3. 移除未使用的导入和变量
4. 简化条件判断

**相关文件**
- `src/pages/index/index.tsx`
- `src/pages/rank/index.tsx`
- `src/pages/game/index.tsx`

**修复日期**
2025-01-13

---

## 其他问题

### 11. upload 云函数文件夹为空

**问题描述**
upload 云函数文件夹为空，导致压缩包不完整。

**解决方案**
1. 创建 `cloudfunctions/upload/package.json`
2. 创建 `cloudfunctions/upload/index.js`
3. 实现文件上传云函数

**相关文件**
- `cloudfunctions/upload/package.json`
- `cloudfunctions/upload/index.js`

**修复日期**
2025-01-13

---

## 修复总结

### 云开发相关问题（3个）
1. 云开发初始化错误
2. 云开发 SDK BigInt 兼容性问题
3. upload 云函数文件夹为空

### 游戏相关问题（2个）
1. 首页白屏问题
2. 图片随机选择问题

### 用户系统相关问题（2个）
1. 微信登录后头像显示问题
2. 用户信息更新问题

### 排行榜相关问题（2个）
1. 排行榜无法刷新问题
2. 排行榜头像显示问题

### 性能优化相关问题（2个）
1. 图片加载性能问题
2. 代码重复问题

---

## 修复原则

### 优先级
- P0：阻塞性问题（影响核心功能）
- P1：重要问题（影响用户体验）
- P2：优化问题（提升性能或代码质量）

### 修复流程
1. 问题发现（用户反馈或测试发现）
2. 问题定位（分析日志和代码）
3. 解决方案（设计并实现修复）
4. 测试验证（确保修复有效）
5. 文档更新（记录修复详情）

---

## 已知问题

### 待修复
- 无

### 待优化
- 无

---

## 联系方式

如发现新问题，请通过以下方式反馈：
- GitHub Issues
- 微信小程序评论区
