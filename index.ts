import http from 'node:http';

http.createServer((_, res) => {
	res.writeHead(200);
	res.end('hello world\n');
}).listen({
	host: '0.0.0.0',
	port: 8000
});
