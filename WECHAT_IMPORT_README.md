# 微信开发者工具导入说明

## 压缩包信息

- **文件名**: puzzle-game-wechat-minimal.tar.gz
- **大小**: 2.1 MB
- **文件数量**: 63 个文件
- **包含内容**: 完整的源代码，可直接导入微信开发者工具

## 导入步骤

### 1. 解压压缩包

```bash
# Windows 使用 7-Zip 或 WinRAR 解压
# macOS/Linux 使用终端
tar xzvf puzzle-game-wechat-minimal.tar.gz
```

### 2. 导入微信开发者工具

1. 打开微信开发者工具
2. 点击「项目」→「导入项目」
3. 选择解压后的 `weapp-export` 文件夹
4. 填写 AppID（如果没有，选择测试号）
5. 点击「导入」

### 3. 安装依赖

在微信开发者工具的终端中运行：

```bash
npm install
# 或
pnpm install
```

### 4. 编译运行

1. 点击「工具」→「构建 npm」
2. 等待编译完成
3. 在模拟器中预览效果

## 项目结构

```
weapp-export/
├── src/                    # 源代码目录
│   ├── pages/             # 页面文件
│   │   ├── index/         # 首页
│   │   ├── loading/       # 加载页
│   │   ├── game/          # 游戏页
│   │   ├── level-select/  # 难度选择页
│   │   └── rank/          # 排行榜页
│   ├── components/        # 组件
│   ├── stores/            # 状态管理
│   ├── styles/            # 样式文件
│   └── app.ts             # 应用入口
├── config/                # 配置文件
├── types/                 # 类型定义
├── assets/                # 静态资源
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript 配置
└── project.config.json    # 项目配置
```

## 技术栈

- **框架**: Taro 4.x
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **UI 组件**: 自定义组件

## 注意事项

1. **云开发配置**: 如需使用云开发功能，请参考 `CLOUDBASE_MIGRATION.md` 配置
2. **AppID**: 发布前需要替换为真实的微信小程序 AppID
3. **图片资源**: 项目使用网络图片，确保设备有网络连接

## 验证结果

- ✅ ESLint 检查通过
- ✅ TypeScript 类型检查通过
- ✅ 构建成功
- ✅ 代码精简优化完成

## 配色方案

采用孔雀蓝（#0D7E9E）+ 浅驼色（#D7B9A1）的撞色搭配：

- 主色调：孔雀蓝 #0D7E9E
- 辅助色：深孔雀蓝 #0A5F77、亮孔雀蓝 #1496B8
- 暖色调：浅驼色 #D7B9A1
- 背景色：暖色 #F5EDE6、冷色 #E8F4F7

## 联系方式

如有问题，请参考项目内的 `IMPORT_GUIDE.md` 和 `WECHAT_RELEASE_GUIDE.md` 文档。
