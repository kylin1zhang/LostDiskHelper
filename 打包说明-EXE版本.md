# USB回家助手 - EXE 版本打包说明

## 🎉 打包完成

您的应用已成功打包成独立的 Windows exe 文件，**无需在目标电脑上安装 Node.js**！

## 📦 便携版位置

```
F:\zzf cursor project\LostDiskHelper\USB回家助手-便携版
```

## 📂 文件结构

```
USB回家助手-便携版/
├── USB回家助手.exe     # 主程序（约 50MB，包含 Node.js 运行时）
├── dist/               # 网页资源文件
│   ├── assets/
│   │   └── index-BRDyCCET.js
│   └── index.html
└── 使用说明.txt        # 用户使用指南
```

## 🚀 使用方法

### 步骤 1：复制到U盘
将整个 `USB回家助手-便携版` 文件夹复制到U盘

### 步骤 2：在任何 Windows 电脑上运行
1. 双击 `USB回家助手.exe`
2. 会弹出一个命令行窗口（请勿关闭）
3. 浏览器会自动打开应用界面
4. 开始使用！

### 步骤 3：停止程序
关闭命令行窗口即可

## ⚙️ 系统要求

- ✅ Windows 7 或更高版本
- ✅ **无需安装 Node.js**（已内置在 exe 中）
- ✅ 无需管理员权限
- ✅ 端口 3000 未被占用

## ⚠️ 重要提示

1. **必须保持文件结构**：`USB回家助手.exe` 和 `dist` 文件夹必须在同一目录下
2. **不要删除 dist 文件夹**：这是应用的网页资源文件
3. **命令行窗口不要关闭**：关闭窗口会停止服务器

## 🔄 如何重新打包

如果修改了源代码，需要重新打包：

```bash
npm run package
```

这个命令会自动完成：
1. 构建前端（`npm run build`）
2. 使用 pkg 打包成 exe
3. 创建便携版文件夹
4. 复制所有必需文件
5. 生成使用说明

## 🛠️ 技术细节

### 使用的工具
- **pkg**: 将 Node.js 应用打包成独立的可执行文件
- **Vite**: 构建前端资源
- **Node.js 18**: 内置在 exe 中的运行时

### 打包配置
- 目标平台: `node18-win-x64`
- 输出文件: `USB回家助手.exe`
- 包含资源: `dist` 文件夹（需手动放在 exe 旁边）

### 为什么 dist 需要单独存放？
pkg 打包时，静态资源文件（HTML、JS、CSS）如果内嵌到 exe 中会导致：
1. exe 文件过大
2. 资源访问性能下降
3. 更新困难

因此采用 exe + dist 文件夹的方式，既保证了便携性，又保持了灵活性。

## ❓ 常见问题

### Q: Windows Defender 提示风险？
**A**: 这是正常的。新生成的 exe 文件会被误报。解决方法：
- 点击"详细信息" → "仍要运行"
- 或者将文件添加到 Windows Defender 排除列表

### Q: 双击 exe 显示 "ENOENT" 错误？
**A**: 这表示找不到 dist 文件夹。请确保：
- `USB回家助手.exe` 和 `dist` 文件夹在同一目录
- dist 文件夹完整，包含 assets 和 index.html

### Q: 提示端口 3000 被占用？
**A**: 
- 关闭其他占用 3000 端口的程序
- 或重启电脑后重试

### Q: exe 文件太大？
**A**: exe 文件约 50MB 是正常的，因为内置了完整的 Node.js 运行时。这是为了在目标电脑上无需安装 Node.js。

### Q: 可以改端口吗？
**A**: 可以，但需要修改 `server.js` 中的 `PORT` 常量，然后重新打包。

### Q: 支持 Linux/Mac 吗？
**A**: 当前打包为 Windows 版本。如需其他平台：
```bash
# Linux
pkg server.js --targets node18-linux-x64 --output USB回家助手-linux

# macOS
pkg server.js --targets node18-macos-x64 --output USB回家助手-mac
```

## 📊 文件大小

- **exe 文件**: ~50MB（包含 Node.js 运行时）
- **dist 文件夹**: ~430KB
- **总大小**: ~50.5MB

## 🎯 使用场景

✅ 适合的场景：
- 复制到U盘随身携带
- 在不同的 Windows 电脑上使用
- 分享给不懂技术的用户
- 无法安装软件的受限环境（学校、公司等）

❌ 不适合的场景：
- 需要后台运行的服务器
- 需要开机自启动
- 需要系统托盘图标

## 🔐 安全说明

1. **exe 文件是什么？**
   - 包含 Node.js 运行时和您的 server.js 代码
   - 启动本地 HTTP 服务器（仅监听 localhost）
   - 不会联网（除非使用 Gemini API 功能）

2. **数据存储在哪里？**
   - Gemini API Key 存储在浏览器的 localStorage
   - 不会发送到任何服务器（除了 Google Gemini）

3. **防火墙提示？**
   - 首次运行可能提示防火墙
   - 选择"专用网络"即可
   - 服务器只监听本地，不接受外部连接

## 📝 更新日志

### v1.0.0 (2025-12-06)
- ✅ 首次发布 exe 版本
- ✅ 内置 Node.js 18 运行时
- ✅ 支持 Windows 7+
- ✅ 自动打包脚本
- ✅ 完整的使用文档

## 🙏 致谢

- [pkg](https://github.com/vercel/pkg) - Node.js 打包工具
- [Vite](https://vitejs.dev/) - 前端构建工具
- [Node.js](https://nodejs.org/) - JavaScript 运行时

---

**打包日期**: 2025-12-06  
**版本**: 1.0.0  
**目标平台**: Windows x64

