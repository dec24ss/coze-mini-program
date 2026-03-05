# 🧩 拼图小游戏 - 云开发部署指南

## 📦 版本信息
- **版本**: v1.0.0
- **构建日期": $(date +%Y-%m-%d)
- **云开发环境**: cloudbase-8g1wqiy0823dea4a

---

## 🚀 快速开始（推荐）

### 方式一：使用一键部署脚本（最简单）

#### Mac/Linux 用户：
```bash
cd release-package
chmod +x deploy.sh
./deploy.sh
```

#### Windows 用户：
```cmd
cd release-package
deploy.bat
```

脚本会自动完成：
1. ✅ 启用云开发开关
2. ✅ 安装依赖
3. ✅ 构建项目
4. ✅ 整理文件

---

## 📋 手动部署步骤

如果一键脚本无法运行，请按照以下步骤手动部署：

### 步骤 1: 启用云开发开关

**文件**: `src/cloudbase/index.ts`

找到第 4 行：
```typescript
export const USE_CLOUDBASE = false  // ⚠️ 部署前请改为 true
```

修改为：
```typescript
export const USE_CLOUDBASE = true
```

### 步骤 2: 安装依赖

```bash
pnpm install
```

如果未安装 pnpm：
```bash
npm install -g pnpm
```

### 步骤 3: 构建项目

```bash
pnpm build:weapp
```

### 步骤 4: 导入微信开发者工具

1. 打开 **微信开发者工具**
2. 点击 **"导入项目"**
3. 选择 `release-package` 目录
4. 填写你的小程序 **AppID**（在 `project.config.json` 中修改）
5. 点击 **"确定"**

### 步骤 5: 配置云开发

#### 5.1 开通云开发
1. 在开发者工具中点击 **"云开发"** 按钮
2. 点击 **"开通"**
3. 选择 **"免费版"** 或 **"按量付费"**
4. 记录 **环境 ID**（如：`cloudbase-xxx`）

#### 5.2 更新环境 ID
编辑 `src/cloudbase/index.ts`：
```typescript
const CLOUDBASE_ENV = '你的环境ID'
```

#### 5.3 部署云函数
1. 在开发者工具中展开 `cloudfunctions` 文件夹
2. 右键点击 `users` → **"创建并部署：云端安装依赖"**
3. 右键点击 `rank` → **"创建并部署：云端安装依赖"**
4. 右键点击 `updateUser` → **"创建并部署：云端安装依赖"**

等待部署完成（每个云函数约 1-2 分钟）

#### 5.4 创建数据库
1. 点击 **"云开发"** → **"数据库"**
2. 点击 **"添加集合"**
3. 创建以下集合：
   - `users` - 存储用户信息
   - `rankings` - 存储排行榜数据

4. 设置权限：
   - 选择 `users` 集合 → **"权限设置"**
   - 选择 **"所有用户可读，仅创建者可读写"**
   - 对 `rankings` 集合做同样设置

### 步骤 6: 重新构建并上传

修改配置后，需要重新构建：
```bash
pnpm build:weapp
```

然后在开发者工具中：
1. 点击 **"上传"**
2. 填写版本号：`1.0.0`
3. 填写项目备注：拼图小游戏初版
4. 点击 **"上传"**

### 步骤 7: 提交审核

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入 **"版本管理"**
3. 在 **"开发版本"** 中找到刚上传的版本
4. 点击 **"提交审核"**
5. 填写审核信息：
   - 功能页面：pages/index/index
   - 功能描述：拼图小游戏，支持关卡解锁和排行榜
6. 点击 **"提交"**

---

## ⚠️ 常见问题

### 1. 构建时出现 BigInt 错误

**错误信息**：
```
Big integer literals are not available in the configured target environment ("es2015")
```

**原因**：云开发 SDK 使用了 BigInt，但小程序默认构建目标 es2015 不支持

**解决**：
- 部署前务必将 `USE_CLOUDBASE` 设为 `true`
- 如果仍报错，请确保已执行 `pnpm install` 安装云开发 SDK

### 2. 排行榜不显示数据

**检查清单**：
- [ ] 云开发环境已开通
- [ ] 3 个云函数已部署成功
- [ ] 数据库集合已创建
- [ ] 云开发环境 ID 配置正确
- [ ] `USE_CLOUDBASE` 设为 `true`

### 3. 头像上传失败

**解决**：
1. 进入云开发控制台 → 存储
2. 点击 **"开通"
3. 设置存储权限为 **"所有用户可读，仅创建者可写"**

### 4. 真机调试时云开发失效

**解决**：
1. 确保手机已登录微信
2. 点击开发者工具中的 **"真机调试"** → **"扫码真机调试"**
3. 使用最新版微信扫码

---

## 📁 文件结构说明

```
release-package/
├── dist/                       # 小程序构建输出（已构建）
│   ├── app.js                 # 小程序入口
│   ├── app.json               # 小程序配置
│   ├── pages/                 # 页面文件
│   │   ├── index/            # 首页
│   │   ├── game/             # 游戏页面
│   │   ├── level-select/     # 关卡选择
│   │   ├── rank/             # 排行榜
│   │   └── loading/          # 加载页
│   └── ...
├── cloudfunctions/            # 云函数（需部署）
│   ├── users/                # 用户管理
│   ├── rank/                 # 排行榜查询
│   └── updateUser/           # 更新用户信息
├── project.config.json        # 项目配置
├── package.json              # 依赖配置
├── deploy.sh                 # Mac/Linux 部署脚本
├── deploy.bat                # Windows 部署脚本
└── README.md                 # 本文件
```

---

## 🔧 配置说明

### 云开发开关
**文件**: `src/cloudbase/index.ts`
```typescript
// 第 4 行：控制是否使用云开发
export const USE_CLOUDBASE = true

// 第 2 行：云开发环境 ID
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'
```

### 小程序配置
**文件**: `project.config.json`
```json
{
  "appid": "你的小程序AppID",
  "cloudfunctionRoot": "./cloudfunctions/"
}
```

---

## ✅ 部署检查清单

部署前请务必检查：

- [ ] 已修改 `project.config.json` 中的 `appid`
- [ ] 已修改 `src/cloudbase/index.ts` 中的 `CLOUDBASE_ENV`
- [ ] 已将 `USE_CLOUDBASE` 设为 `true`
- [ ] 已运行 `pnpm build:weapp` 构建成功
- [ ] 已开通云开发环境
- [ ] 已部署 3 个云函数
- [ ] 已创建 2 个数据库集合
- [ ] 已设置数据库权限
- [ ] 已开通云存储
- [ ] 已测试排行榜功能正常

---

## 📞 技术支持

如遇到问题，请检查：
1. 微信开发者工具是否为最新版本
2. 云开发控制台是否有错误日志
3. 云函数部署状态是否为 "部署成功"
4. 数据库集合权限是否正确设置

---

## 📝 版本历史

### v1.0.0 (2025-03)
- ✅ 拼图游戏核心功能
- ✅ 无限关卡系统
- ✅ 排行榜功能
- ✅ 微信登录
- ✅ 云开发集成
- ✅ 蓝白色系动画

---

**祝您部署顺利！** 🎉
