const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

// 在 pkg 打包环境下，使用 process.cwd() 而不是 __dirname
// process.cwd() 返回 exe 文件所在目录，__dirname 在 pkg 中指向临时目录
const DIST_DIR = path.join(process.cwd(), 'dist');

// 启动时检查 dist 目录是否存在
if (!fs.existsSync(DIST_DIR)) {
  console.error('\n❌ 错误：找不到 dist 文件夹！\n');
  console.error('请确保以下文件结构：');
  console.error('  USB回家助手.exe');
  console.error('  dist/');
  console.error('    ├─ assets/');
  console.error('    └─ index.html');
  console.error('\n⚠️  dist 文件夹必须与 exe 文件在同一目录下！\n');
  console.error('当前查找路径:', DIST_DIR);
  console.error('当前工作目录:', process.cwd());
  console.error('\n按任意键退出...');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 1));
  return;
}

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，返回 index.html（支持SPA路由）
        fs.readFile(path.join(DIST_DIR, 'index.html'), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end('错误: ' + error.code);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('错误: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║          🎉 USB回家助手 启动成功！                     ║
║                                                        ║
║          服务器运行在: http://localhost:${PORT}         ║
║                                                        ║
║          浏览器将自动打开...                            ║
║                                                        ║
║          关闭此窗口即可停止服务器                       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);

  // 自动打开浏览器
  const url = `http://localhost:${PORT}`;
  const command = `start ${url}`;

  exec(command, (err) => {
    if (err) {
      console.log(`请手动在浏览器中打开: ${url}`);
    }
  });
});

// 错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n错误: 端口 ${PORT} 已被占用！`);
    console.error('请关闭其他占用该端口的程序，或联系技术支持。\n');
  } else {
    console.error('服务器错误:', err);
  }
  console.log('\n按任意键退出...');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
});

