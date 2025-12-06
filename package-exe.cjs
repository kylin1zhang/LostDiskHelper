const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n开始打包 USB回家助手...\n');

// 1. 构建前端
console.log('步骤 1/4: 构建前端应用...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✓ 前端构建完成\n');
} catch (error) {
  console.error('✗ 前端构建失败');
  process.exit(1);
}

// 2. 打包成 exe
console.log('步骤 2/4: 打包成 exe 文件...');
try {
  execSync('pkg server.js --targets node18-win-x64 --output USB回家助手.exe', { stdio: 'inherit' });
  console.log('✓ exe 文件生成完成\n');
} catch (error) {
  console.error('✗ exe 打包失败');
  process.exit(1);
}

// 3. 创建便携版文件夹
console.log('步骤 3/4: 创建便携版文件夹...');
const portableDir = path.join(__dirname, 'USB回家助手-便携版');

// 如果文件夹已存在，先删除
if (fs.existsSync(portableDir)) {
  fs.rmSync(portableDir, { recursive: true, force: true });
}

// 创建新文件夹
fs.mkdirSync(portableDir);

// 复制 exe 文件
fs.copyFileSync(
  path.join(__dirname, 'USB回家助手.exe'),
  path.join(portableDir, 'USB回家助手.exe')
);
console.log('  ✓ USB回家助手.exe');

// 复制 dist 文件夹
copyFolder(path.join(__dirname, 'dist'), path.join(portableDir, 'dist'));
console.log('  ✓ dist/');

console.log('✓ 便携版文件夹创建完成\n');

// 创建快速启动脚本
console.log('步骤 3.5/4: 创建启动脚本...');
const startBat = `@echo off
chcp 65001 >nul
title USB回家助手

echo.
echo ═══════════════════════════════════════
echo     USB回家助手 - 正在启动...
echo ═══════════════════════════════════════
echo.
echo 💡 提示：不要关闭此窗口！
echo.

USB回家助手.exe

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ═══════════════════════════════════════
    echo     程序异常退出！
    echo ═══════════════════════════════════════
    echo.
    pause
)
`;

fs.writeFileSync(
  path.join(portableDir, '启动程序.bat'),
  startBat,
  'utf-8'
);
console.log('  ✓ 启动程序.bat');
console.log('✓ 启动脚本创建完成\n');

// 4. 创建使用说明
console.log('步骤 4/4: 创建使用说明...');

const readme = `═══════════════════════════════════════════════════════════
              USB回家助手 - 使用说明
═══════════════════════════════════════════════════════════

🎉 欢迎使用 USB回家助手便携版！

本版本已打包成独立的 exe 文件，无需安装 Node.js 即可运行。

═══════════════════════════════════════════════════════════
                    🚀 快速开始
═══════════════════════════════════════════════════════════

方法一（推荐）：
  1. 双击 "启动程序.bat"
  2. 等待浏览器自动打开
  3. 开始使用！

方法二：
  1. 双击 "USB回家助手.exe"
  2. 等待浏览器自动打开
  3. 开始使用！

⚠️ 重要：请勿删除或移动 dist 文件夹！

═══════════════════════════════════════════════════════════
                    📦 文件结构
═══════════════════════════════════════════════════════════

USB回家助手-便携版/
  ├─ USB回家助手.exe    # 主程序（包含 Node.js 运行时）
  ├─ 启动程序.bat       # 推荐使用的启动脚本
  ├─ dist/              # 网页资源文件
  └─ 使用说明.txt       # 本文件

⚠️ 重要：请勿删除或移动 dist 文件夹！

═══════════════════════════════════════════════════════════
                    ⚙️ 系统要求
═══════════════════════════════════════════════════════════

✓ Windows 7 或更高版本
✓ 无需安装 Node.js（已内置）
✓ 无需安装其他依赖
✓ 端口 3000 未被占用

═══════════════════════════════════════════════════════════
                    📝 首次使用
═══════════════════════════════════════════════════════════

1. 双击 exe 文件，会弹出一个命令行窗口
2. 命令行窗口显示启动成功信息
3. 浏览器会自动打开应用界面
4. 点击右上角"设置"按钮，输入 Gemini API Key
5. 开始使用所有功能

💡 提示：不要关闭命令行窗口，否则程序会停止运行

═══════════════════════════════════════════════════════════
                    ❓ 常见问题
═══════════════════════════════════════════════════════════

Q: 双击 exe 后显示错误？
A: 请确保 dist 文件夹与 exe 文件在同一目录下

Q: 提示端口被占用？
A: 关闭其他占用 3000 端口的程序，或重启电脑后重试

Q: 浏览器未自动打开？
A: 手动打开浏览器，访问：http://localhost:3000

Q: 如何停止程序？
A: 关闭命令行窗口即可

Q: 可以复制到U盘使用吗？
A: 可以！将整个文件夹复制到U盘，在任何 Windows 电脑上都能运行

Q: Windows Defender 提示风险？
A: 这是正常的。因为这是新生成的 exe 文件，点击"仍要运行"即可

═══════════════════════════════════════════════════════════
                    🔧 高级选项
═══════════════════════════════════════════════════════════

如需修改默认端口（3000）：
  目前需要重新编译源码

═══════════════════════════════════════════════════════════
                    📞 使用场景
═══════════════════════════════════════════════════════════

✓ 复制到U盘随身携带
✓ 在学校/公司电脑上使用（无需管理员权限）
✓ 分享给朋友（不需要他们安装开发环境）
✓ 快速部署到多台电脑

═══════════════════════════════════════════════════════════

版本: 1.0.0
打包日期: ${new Date().toLocaleString('zh-CN')}
文件大小: 约 50 MB（包含 Node.js 运行时）

═══════════════════════════════════════════════════════════
`;

fs.writeFileSync(
  path.join(portableDir, '使用说明.txt'),
  readme,
  'utf-8'
);
console.log('  ✓ 使用说明.txt');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║                                                        ║');
console.log('║          ✅ 打包完成！                                 ║');
console.log('║                                                        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('📁 便携版位置：');
console.log(`   ${portableDir}\n`);

console.log('📋 接下来的步骤：');
console.log('   1. 将 "USB回家助手-便携版" 文件夹复制到U盘');
console.log('   2. 在任何 Windows 电脑上双击 exe 文件即可使用');
console.log('   3. 无需安装 Node.js 或其他依赖\n');

// 辅助函数：递归复制文件夹
function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

