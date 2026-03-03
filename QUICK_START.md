# 快速开始指南

本指南帮助你在 10 分钟内快速启动项目。

---

## 🎯 目标

- 克隆项目
- 安装依赖
- 编译小程序
- 用微信开发者工具打开
- 测试基本功能

---

## ⏱️ 预计时间

**总时间**：10 分钟

---

## 🚀 快速开始

### 步骤 1：克隆项目（2 分钟）

在 Windows CMD 或 PowerShell 中执行：

```bash
# 进入桌面
cd Desktop

# 克隆项目
git clone https://github.com/dec24ss/coze-mini-program.git

# 进入项目目录
cd coze-mini-program
```

---

### 步骤 2：安装依赖（3 分钟）

```bash
# 检查 pnpm 是否安装
pnpm --version

# 如果没有安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

**预期输出**：
```
Packages: +123
Progress: resolved 123, reused 0, downloaded 123, added 123
Done in 30s
```

---

### 步骤 3：编译小程序（2 分钟）

```bash
# 编译小程序
pnpm build:weapp
```

**预期输出**：
```
📦 Compiling...
✅ Compile success in 30s
📦 Output: dist/
```

**检查点**：
- 确认 `dist` 目录已生成
- 确认 `dist` 目录下有 `app.json` 文件

---

### 步骤 4：用微信开发者工具打开（1 分钟）

1. **打开微信开发者工具**
2. **点击导入项目**
3. **选择项目目录**
   - 路径：`Desktop\coze-mini-program`
4. **填写项目信息**
   - 项目名称：`拼图小游戏`
   - AppID：使用测试号（或你的小程序 AppID）
   - 开发模式：**小程序**
   - 后端服务：**不使用云服务**
5. **点击导入**

**预期结果**：
- 微信开发者工具成功加载项目
- 显示首页（欢迎界面）

---

### 步骤 5：测试基本功能（2 分钟）

#### 测试 1：查看页面

在微信开发者工具中：

1. 点击模拟器中的页面
2. 检查页面是否正常显示
3. 检查样式是否正常

**预期结果**：
- 页面正常显示
- 样式正确

#### 测试 2：检查控制台

在微信开发者工具中：

1. 点击 "调试器" 标签
2. 点击 "Console" 标签
3. 查看是否有错误信息

**预期结果**：
- 控制台没有错误信息
- 可能看到一些日志信息

#### 测试 3：查看项目结构

在微信开发者工具中：

1. 点击 "编辑器" 标签
2. 查看左侧文件树
3. 确认文件结构正确

**预期结果**：
- 显示 `dist/` 目录
- 显示 `cloudfunctions/` 目录
- 显示 `project.config.json` 文件

---

## ✅ 检查清单

完成以下检查项：

- [ ] 项目已克隆到本地
- [ ] 依赖已安装
- [ ] 小程序已编译（`dist` 目录存在）
- [ ] 微信开发者工具已打开项目
- [ ] 页面正常显示
- [ ] 控制台无错误信息
- [ ] 项目结构正确

---

## 🎉 恭喜！

你已经成功启动了项目！

**下一步**：

1. 配置云开发环境
2. 上传云函数
3. 创建数据库和存储
4. 测试完整功能

详见：`PROJECT_EXPORT_GUIDE.md`

---

## 🆘 常见问题

### 问题 1：安装依赖失败

**错误信息**：
```
Error: Cannot find module 'xxx'
```

**解决方案**：
```bash
# 清理缓存
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

---

### 问题 2：编译失败

**错误信息**：
```
Error: Compile failed
```

**解决方案**：
```bash
# 清理编译输出
rm -rf dist

# 重新编译
pnpm build:weapp
```

---

### 问题 3：微信开发者工具显示空白

**可能原因**：
- `dist` 目录未生成
- `project.config.json` 配置错误

**解决方案**：
1. 检查 `dist` 目录是否存在
2. 检查 `project.config.json` 中的 `miniprogramRoot` 是否为 `dist/`
3. 重新编译：`pnpm build:weapp`
4. 刷新微信开发者工具

---

### 问题 4：pnpm 未安装

**错误信息**：
```
Command 'pnpm' not found
```

**解决方案**：
```bash
# 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| `PROJECT_EXPORT_GUIDE.md` | 完整的项目导出和部署指南 |
| `PROJECT_CHECKLIST.md` | 项目检查清单 |
| `CLOUD_SETUP_GUIDE.md` | 云开发配置详细步骤 |
| `README.md` | 项目说明文档 |

---

**祝你开发顺利！** 🚀
