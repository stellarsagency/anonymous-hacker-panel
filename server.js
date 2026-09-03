const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = 'D:\\anonymous hacker';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    let filePath = path.join(dir, url === '/' ? 'index.html' : url);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
        res.end(data);
    });
}).listen(9090, () => console.log('Anonymous Hacker running on http://localhost:9090'));