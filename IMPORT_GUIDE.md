# 拼图小游戏 - 微信开发者工具导入指南

## 📦 已生成文件

### 压缩包信息
- **文件名**：puzzle-game-dist.tar.gz
- **大小**：83 KB
- **位置**：`/workspace/projects/puzzle-game-dist.tar.gz`
- **完整路径**：`/workspace/projects/puzzle-game-dist.tar.gz`

## 📁 文件清单

压缩包包含以下完整的小程序文件：

### 核心文件
```
dist/
├── app.js                    # 小程序入口
├── app.json                  # 小程序配置
├── app.wxss                  # 全局样式
├── app-origin.wxss           # 原始样式
├── base.wxml                 # 基础模板
├── project.config.json       # 项目配置
├── taro.js                   # Taro 框架
├── babelHelpers.js           # 辅助函数
├── vendors.js                # 第三方库
├── utils.wxs                 # 工具函数
└── pages/                    # 页面目录
```

### 页面文件
```
pages/
├── loading/                  # 加载页
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── index/                    # 首页
│   ├── index.js
│   index.json
│   index.wxml
│   └── index.wxss
└── game/                     # 游戏页
    ├── index.js
    ├── index.json
    index.wxml
    └── index.wxss
```

## 🔧 导入步骤

### 方法 1：使用 WinSCP 下载（推荐）

1. **下载 WinSCP**
   - 访问：https://winscp.net/
   - 下载并安装

2. **连接服务器**
   - 打开 WinSCP
   - 输入服务器信息（从管理员获取）：
     - 协议：SFTP
     - 主机名：服务器 IP 地址
     - 端口：22（或管理员提供的端口）
     - 用户名：你的用户名
     - 密码：你的密码
   - 点击"登录"

3. **下载压缩包**
   - 右侧导航到：`/workspace/projects/`
   - 找到 `puzzle-game-dist.tar.gz`
   - 右键 → "下载"
   - 选择保存位置：`D:\puzzle-game\`

4. **解压文件**
   - 在本地打开文件夹 `D:\puzzle-game\`
   - 右键 `puzzle-game-dist.tar.gz` → "解压到当前文件夹"
   - 解压后得到 `dist` 文件夹

5. **导入微信开发者工具**
   - 打开微信开发者工具
   - 点击"+"导入项目
   - **项目目录**：`D:\puzzle-game\dist`
   - **AppID**：选择"测试号"（推荐）或输入正式 AppID
   - **项目名称**：拼图小游戏
   - 点击"导入"

### 方法 2：使用 FileZilla 下载

1. **下载 FileZilla**：https://filezilla-project.org/
2. **连接服务器**（使用服务器信息）
3. **下载文件**：
   - 下载 `/workspace/projects/puzzle-game-dist.tar.gz`
   - 保存到 `D:\puzzle-game\`
4. **解压并导入**（同上）

### 方法 3：使用 scp 命令（如果你有 SSH 访问权限）

在本地 Windows 的 PowerShell 或 CMD 中执行：

```bash
scp username@server-ip:/workspace/projects/puzzle-game-dist.tar.gz D:\puzzle-game\
```

然后在本地解压并导入。

## 🎯 导入后配置

### 1. 本地设置（可选）

导入后，点击右上角 **"详情"**，配置：
- **本地设置**：勾选"不校验合法域名"（开发调试用）
- **调试基础库**：选择 2.0+ 版本

### 2. 测试功能

导入后可以测试：
- ✅ 首页加载动画
- ✅ 开始游戏功能
- ✅ 拼图拖拽交换
- ✅ 计时器
- ✅ 提示功能
- ✅ 查看原图
- ✅ 过关检测

## 📱 预览和调试

### 预览
1. 点击工具栏的"预览"按钮
2. 生成二维码
3. 用微信扫码在手机上体验

### 调试
- 使用模拟器查看效果
- 查看控制台日志
- 使用调试工具检查 DOM 和网络请求

## 🔍 验证完整性

解压后，确保以下文件存在：

```
dist/
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── taro.js
└── pages/
    ├── loading/
    ├── index/
    └── game/
```

## ⚠️ 注意事项

1. **不要**选择项目根目录，必须选择 `dist` 目录
2. 如果使用测试号，大部分功能都可以正常使用
3. 如果需要发布，需要绑定正式 AppID
4. 每次修改代码后，需要重新编译：
   ```bash
   pnpm build:weapp
   ```
   然后在微信开发者工具中点击"编译"按钮刷新

## 💡 常见问题

### Q: 导入后显示空白？
A: 检查是否选择了 `dist` 目录，而不是项目根目录。

### Q: 某些功能不工作？
A: 确保选择了正确的 AppID，或在本地设置中勾选"不校验合法域名"。

### Q: 如何更新代码？
A: 重新编译后，在微信开发者工具中点击"编译"按钮即可。

### Q: 支付功能不可用？
A: 测试号不支持支付功能，需要使用正式 AppID。

## 📞 技术支持

如遇到问题，请检查：
1. 文件是否完整下载
2. 是否正确解压
3. 是否选择了正确的导入目录
4. AppID 是否正确

---

**版本信息**
- 生成时间：2025-02-22
- Taro 版本：4.1.9
- React 版本：18
- 编译目标：微信小程序
