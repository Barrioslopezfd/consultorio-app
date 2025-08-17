import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
http.createServer((req, res) => {
    const url = req.url === '/' ? '/home.html' : req.url;
    let filePath;
    if (url.endsWith('.html')) {
        filePath = path.join(ROOT_DIR, url);
    }
    else {
        filePath = path.join(__dirname, url);
    }
    console.log('Buscando archivo:', filePath);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Pagina no encontrada');
            return;
        }
        let contentType = 'text/plain';
        if (filePath.endsWith('.html'))
            contentType = 'text/html';
        else if (filePath.endsWith('.js'))
            contentType = 'application/javascript';
        else if (filePath.endsWith('.css'))
            contentType = 'text/css';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}).listen({
    host: '0.0.0.0',
    port: 8000
});
