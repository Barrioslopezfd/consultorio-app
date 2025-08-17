import http from 'node:http';
import fs from 'node:fs';

http.createServer((_, res) => {
	res.writeHead(200);
	res.end(fs.readFileSync('index.html'));
}).listen({
	host: '0.0.0.0',
	port: 8000
});
