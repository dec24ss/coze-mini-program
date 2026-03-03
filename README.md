# 拼图小游戏 - 扣子编程 + 腾讯云开发版本

一个基于 Taro + React + TypeScript 开发的拼图小游戏，在扣子编程环境中开发，使用腾讯云开发（云函数 + 云数据库 + 云存储）实现后端功能。

---

## 🎯 部署方式

**扣子编程**（开发环境）：
- 代码编辑和管理
- 项目编译和构建

**腾讯云开发**（后端服务）：
- 云函数（业务逻辑）
- 云数据库（数据存储）
- 云存储（文件存储）

**微信小程序**（运行环境）：
- 用户交互界面

---

## 🚀 快速开始（15 分钟）

- **跨端支持**：同时支持微信小程序和 H5
- **云开发集成**：使用腾讯云开发（云函数 + 云数据库 + 云存储）
- **排行榜功能**：实时查看玩家排名
- **积分系统**：完成游戏获得积分，积分可兑换道具
- **关卡系统**：多个难度关卡，循序渐进
- **用户系统**：支持用户登录、头像上传、昵称设置

---

## 🚀 技术栈

### 前端

- **框架**：Taro 4.1.9
- **语言**：TypeScript 5.4.5
- **UI 库**：React 18.0.0
- **样式**：TailwindCSS 4.1.18 + weapp-tailwindcss 4.9.2
- **状态管理**：Zustand 5.0.9
- **图标库**：lucide-react-taro 1.2.0
- **构建工具**：Vite 4.2.0

### 后端

- **云服务**：腾讯云开发
- **云函数**：Node.js 16.13
- **云数据库**：NoSQL 文档数据库
- **云存储**：对象存储服务

---

## 📦 项目结构

```
├── cloudfunctions/          # 云函数目录
│   ├── login/               # 登录云函数
│   ├── updateUserInfo/      # 更新用户信息
│   ├── updateHighestLevel/  # 更新最高关卡
│   ├── getRankList/         # 获取排行榜
│   ├── addPoints/           # 添加积分
│   └── consumePoints/       # 消耗积分
├── config/                  # Taro 构建配置
├── src/                     # 前端源码
│   ├── pages/               # 页面组件
│   │   ├── index/           # 首页
│   │   ├── game/            # 游戏页
│   │   ├── level-select/    # 关卡选择
│   │   └── leaderboard/     # 排行榜
│   ├── components/          # 公共组件
│   │   └── user-profile-modal/  # 用户信息弹窗
│   ├── stores/              # 状态管理
│   │   ├── userStore.ts     # 用户状态
│   │   └── gameStore.ts     # 游戏状态
│   ├── config/              # 配置文件
│   │   └── api.ts           # API 配置
│   ├── utils/               # 工具函数
│   │   ├── h5-styles.ts     # H5 样式工具
│   │   └── wx-debug.ts      # 微信调试工具
│   ├── app.ts               # 应用入口
│   ├── app.config.ts        # 应用配置
│   └── app.css              # 全局样式
├── dist/                    # 编译输出（小程序）
├── dist-web/                # 编译输出（H5）
├── project.config.json      # 微信小程序配置
├── cloudbaserc.json         # 腾讯云开发配置
└── package.json             # 项目依赖
```

---

## 🎯 功能模块

### 1. 用户系统

- 用户登录（微信授权）
- 用户信息管理（昵称、头像）
- 用户数据持久化（云数据库）

### 2. 游戏系统

- 关卡选择（简单、普通、困难）
- 拼图游戏核心逻辑
- 移动动画效果
- 完成检测

### 3. 排行榜系统

- 实时排行榜
- 按最高关卡和积分排序
- 排名展示

### 4. 积分系统

- 完成关卡获得积分
- 积分兑换道具
- 积分记录

---

### 快速开始（扣子编程 + 腾讯云）

在扣子编程终端中执行：

```bash
# 1. 安装依赖
pnpm install

# 2. 编译小程序
pnpm build:weapp

# 3. 下载 dist 和 cloudfunctions 目录到本地

# 4. 用微信开发者工具打开项目

# 5. 配置腾讯云开发并上传云函数
```

详见：`COZE_QUICK_START.md`（15 分钟快速部署）

### 标准部署（本地开发）

### 环境要求

- Node.js >= 18
- pnpm >= 9.0.0
- 微信开发者工具（小程序开发）

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/dec24ss/coze-mini-program.git

# 进入项目目录
cd coze-mini-program

# 安装依赖
pnpm install
```

### 开发模式

```bash
# 启动 H5 开发模式
pnpm dev:web

# 启动小程序开发模式
pnpm dev:weapp
```

### 编译构建

```bash
# 编译小程序
pnpm build:weapp

# 编译 H5
pnpm build:web

# 编译所有
pnpm build
```

---

### 云函数（腾讯云开发）

| 云函数 | 说明 | 参数 | 返回 |
|--------|------|------|------|
| `login` | 用户登录 | `openid`, `nickname`, `avatar_url` | 用户信息 |
| `updateUserInfo` | 更新用户信息 | `openid`, `nickname`, `avatar_url` | 更新结果 |
| `updateHighestLevel` | 更新最高关卡 | `openid`, `level` | 更新结果 |
| `getRankList` | 获取排行榜 | `limit` | 排行榜列表 |
| `addPoints` | 添加积分 | `openid`, `points` | 积分变更 |
| `consumePoints` | 消耗积分 | `openid`, `points` | 积分变更 |

### 数据库（腾讯云开发）

**集合名称**：`users`

**字段结构**：

```json
{
  "_id": "自动生成",
  "openid": "用户唯一标识",
  "nickname": "用户昵称",
  "avatar_url": "头像 URL",
  "highest_level": 0,
  "points": 0,
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

### 存储（腾讯云开发）

**目录名称**：`avatars`

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| `COZE_QUICK_START.md` | 扣子编程快速部署指南（推荐，15 分钟） |
| `COZE_CLOUD_DEPLOYMENT.md` | 扣子编程详细部署指南 |
| `COZE_DEPLOYMENT_SUMMARY.md` | 扣子编程部署总结 |
| `PROJECT_EXPORT_GUIDE.md` | 项目导出和部署指南 |
| `PROJECT_CHECKLIST.md` | 项目检查清单 |
| `README.md` | 项目说明文档 |

---

## 🔄 日常开发流程（扣子编程）

1. 在扣子编程中修改 `src/` 目录下的代码
2. 重新编译：`pnpm build:weapp`
3. 下载 `dist` 目录到本地
4. 刷新微信开发者工具
5. 测试功能

---

## 📱 微信小程序部署（腾讯云开发）

### 环境 ID

**环境 ID**：`cloudbase-8g1wqiy0823dea4a`

### 云函数

| 云函数 | 说明 | 参数 |
|--------|------|------|
| `login` | 用户登录 | `openid`, `nickname`, `avatar_url` |
| `updateUserInfo` | 更新用户信息 | `openid`, `nickname`, `avatar_url` |
| `updateHighestLevel` | 更新最高关卡 | `openid`, `level` |
| `getRankList` | 获取排行榜 | `limit` |
| `addPoints` | 添加积分 | `openid`, `points` |
| `consumePoints` | 消耗积分 | `openid`, `points` |

### 数据库

**集合名称**：`users`

**字段结构**：

```json
{
  "_id": "自动生成",
  "openid": "用户唯一标识",
  "nickname": "用户昵称",
  "avatar_url": "头像 URL",
  "highest_level": 0,
  "points": 0,
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

### 存储

**目录名称**：`avatars`

---

## 📱 微信小程序部署

### 1. 编译小程序

```bash
pnpm build:weapp
```

### 2. 用微信开发者工具打开

1. 打开微信开发者工具
2. 导入项目
3. 选择项目根目录（`coze-mini-program`）
4. 填写 AppID
5. 点击导入

### 3. 关联云开发环境

1. 点击顶部菜单 "云开发"
2. 点击 "开通"
3. 选择环境：`cloudbase-8g1wqiy0823dea4a`
4. 点击 "确定"

### 4. 上传云函数

在微信开发者工具中：

1. 右键 `cloudfunctions` 目录
2. 选择 "新建 Node.js 云函数"
3. 输入云函数名称
4. 复制对应的云函数代码
5. 保存文件
6. 右键云函数文件夹
7. 选择 "上传并部署：云端安装依赖"

### 5. 创建数据库和存储

在腾讯云控制台中：

1. 创建数据库集合 `users`，权限：所有用户可读写
2. 创建存储目录 `avatars`

### 6. 测试功能

在微信开发者工具控制台测试：

```javascript
// 测试登录
wx.cloud.callFunction({
  name: 'login',
  data: {
    openid: 'test_001',
    nickname: '测试用户',
    avatar_url: ''
  }
}).then(res => {
  console.log('✅ 登录成功:', res.result)
})

// 测试排行榜
wx.cloud.callFunction({
  name: 'getRankList',
  data: { limit: 10 }
}).then(res => {
  console.log('✅ 排行榜数据:', res.result)
})
```

---

## 📚 详细文档

| 文档 | 说明 |
|------|------|
| `PROJECT_EXPORT_GUIDE.md` | 项目导出和部署指南 |
| `PROJECT_CHECKLIST.md` | 项目检查清单 |
| `CLOUD_SETUP_GUIDE.md` | 云开发配置详细步骤 |
| `QUICK_START.md` | 快速部署指南 |
| `TENCENT_CLOUD_DEPLOYMENT.md` | 腾讯云官方文档风格 |

---

## 🔧 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码检查
- 遵循 React Hooks 规范
- 使用 TailwindCSS 进行样式开发

### 命名规范

- 文件名：kebab-case（如 `user-profile.tsx`）
- 组件名：PascalCase（如 `UserProfile`）
- 变量/函数：camelCase（如 `getUserInfo`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）

### 提交规范

```bash
feat: 新功能
fix: 修复 bug
style: 样式调整
docs: 文档更新
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

---

## 🆘 常见问题

### 问题 1：编译失败

**解决方案**：
```bash
# 清理缓存
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install

# 重新编译
pnpm build:weapp
```

### 问题 2：云函数调用失败

**解决方案**：
1. 检查云开发环境是否已关联
2. 检查云函数是否已上传
3. 检查环境 ID 是否正确

### 问题 3：数据库操作失败

**解决方案**：
1. 检查数据库集合是否已创建
2. 检查权限是否设置为"所有用户可读写"
3. 查看云函数日志

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📮 联系方式

- 项目地址：https://github.com/dec24ss/coze-mini-program
- 问题反馈：提交 Issue

---

**祝你游戏愉快！** 🎮✨
