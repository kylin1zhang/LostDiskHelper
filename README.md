<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1BWKtdU-Yno1IybaWq8xeiW-a-9Fom8t2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 📦 打包成 EXE 文件（U盘便携版）

如果你想将应用打包成可以在U盘中一键使用的 exe 文件：

### 一键打包

```bash
npm run package
```

这个命令会自动完成：
1. ✅ 构建前端应用
2. ✅ 使用 pkg 打包成独立的 exe 文件
3. ✅ 创建便携版文件夹（包含 exe 和 dist）
4. ✅ 生成用户使用说明

### 打包完成后

打包成功后，会在项目根目录生成 `USB回家助手-便携版` 文件夹：

```
USB回家助手-便携版/
├── USB回家助手.exe     # 主程序（约 50MB，内置 Node.js）
├── dist/               # 网页资源
└── 使用说明.txt        # 用户指南
```

### 使用方法

1. 将 `USB回家助手-便携版` 文件夹复制到U盘
2. 在任何 Windows 电脑上双击 `USB回家助手.exe` 即可使用
3. **无需安装 Node.js 或其他依赖**

### 特性

- ✅ 真正的一键启动（双击即用）
- ✅ 无需安装 Node.js（已内置）
- ✅ 无需管理员权限
- ✅ 支持 Windows 7+
- ✅ 完全便携，可在U盘中运行

详细说明请查看 [打包说明-EXE版本.md](打包说明-EXE版本.md)
