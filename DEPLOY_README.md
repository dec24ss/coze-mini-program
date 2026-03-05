# 拼图小游戏 - 云开发部署说明

## 📦 版本信息
- **版本号**: 1.0.0
- **构建时间": $(date)
- **云开发环境**: cloudbase-8g1wqiy0823dea4a

## 🚀 快速部署步骤

### 步骤 1: 下载并解压
将本压缩包解压到本地目录

### 步骤 2: 启用云开发 (关键步骤)
**⚠️ 必须执行，否则排行榜功能无法使用**

编辑文件 `src/cloudbase/index.ts`，将:
```typescript
export const USE_CLOUDBASE = false  // ⚠️ 部署前请改为 true
```

修改为:
```typescript
export const USE_CLOUDBASE = true
```

### 步骤 3: 安装依赖
```bash
pnpm install
```

### 步骤 4: 构建项目
```bash
pnpm build:weapp
```

### 步骤 5: 导入微信开发者工具
1. 打开微信开发者工具
2. 选择 "导入项目"
3. 选择解压后的项目目录
4. 填写你的小程序 AppID
5. 点击 "确定"

### 步骤 6: 初始化云开发
1. 在开发者工具中点击 "云开发" 按钮
2. 创建云开发环境（如果还没有）
3. 记录环境 ID（如 `cloudbase-8g1wqiy0823dea4a`）
4. 更新 `src/cloudbase/index.ts` 中的 `CLOUDBASE_ENV` 为你自己的环境 ID

### 步骤 7: 部署云函数
1. 在开发者工具中右键点击 `cloudfunctions/users` 文件夹
2. 选择 "创建并部署：云端安装依赖"
3. 对 `cloudfunctions/rank` 和 `cloudfunctions/updateUser` 重复上述操作

### 步骤 8: 创建数据库集合
在云开发控制台的数据库中创建以下集合:
- `users` - 存储用户信息
- `rankings` - 存储排行榜数据

### 步骤 9: 上传代码
1. 在开发者工具中点击 "上传"
2. 填写版本号（如 1.0.0）
3. 填写项目备注
4. 点击 "上传"

### 步骤 10: 提交审核
1. 登录微信公众平台
2. 进入 "版本管理"
3. 找到刚上传的开发版本
4. 点击 "提交审核"

## 📁 目录结构

```
├── cloudfunctions/          # 云函数目录
│   ├── rank/               # 排行榜云函数
│   ├── updateUser/         # 更新用户信息云函数
│   └── users/              # 用户管理云函数
├── dist/                   # 构建输出目录
├── src/                    # 源代码目录
│   ├── cloudbase/          # 云开发配置
│   ├── pages/              # 页面代码
│   ├── stores/             # 状态管理
│   └── ...
├── project.config.json     # 项目配置文件
└── README.md              # 本文件
```

## ⚙️ 关键配置说明

### 云开发开关
文件: `src/cloudbase/index.ts`
```typescript
// 云开发环境 ID
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'

// 云开发开关 - 必须设为 true 才能使用排行榜
export const USE_CLOUDBASE = true
```

### 小程序配置
文件: `project.config.json`
```json
{
  "appid": "你的小程序AppID",
  "cloudfunctionRoot": "./cloudfunctions/"
}
```

## 🔧 常见问题

### 1. 构建时出现 BigInt 错误
**问题**: 云开发 SDK 使用 BigInt，但小程序 es2015 不支持

**解决**: 
- 在 Coze 环境中构建时使用 `USE_CLOUDBASE = false`
- 下载到本地后改为 `USE_CLOUDBASE = true` 再构建

### 2. 排行榜不显示数据
**问题**: 云函数未部署或数据库未初始化

**解决**:
1. 确保云函数已部署
2. 确保数据库集合已创建
3. 检查云开发环境 ID 是否正确

### 3. 头像上传失败
**问题**: 云开发存储未启用或权限配置错误

**解决**:
1. 在云开发控制台开启存储功能
2. 检查存储权限设置

## 📝 版本更新记录

### v1.0.0 (2025-01)
- ✅ 基础拼图游戏功能
- ✅ 关卡解锁系统（无限关卡）
- ✅ 排行榜功能
- ✅ 微信登录集成
- ✅ 音效和震动反馈
- ✅ 蓝白色系动画效果

## 📞 技术支持

如有问题，请检查:
1. 微信开发者工具是否为最新版本
2. 云开发环境是否正常
3. 云函数是否已成功部署
4. 数据库集合是否已创建

## 🎯 审核注意事项

提交审核前请确保:
- [ ] 所有功能已测试通过
- [ ] 云开发环境已配置
- [ ] 云函数已部署
- [ ] 隐私政策已配置（如需要收集用户信息）
- [ ] 小程序内容符合微信审核规范
