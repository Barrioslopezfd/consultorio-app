import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface IResp {
	filePath: string,
	contentType: string,
}

http.createServer((req, res) => {
	const resp = getPath(req.url);
	const filePath: string = resp.filePath;
	const contentType: string = resp.contentType;

	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end('Pagina no encontrada');
			return;
		}

		res.writeHead(200, { 'Content-Type': contentType });
		res.end(data);
	});
}).listen({
	host: '0.0.0.0',
	port: 8000
});

function getPath(url: string | undefined): IResp {

	const HTML: string = 'text/html';
	const JS: string = 'text/javascript';
	const CSS: string = 'text/css';

	let resp: IResp = {
		filePath: '',
		contentType: HTML,
	};

	if (url == undefined) {
		return resp
	}

	const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/pages')
	const __dist = path.join(path.dirname(fileURLToPath(import.meta.url)), url)
	switch (url) {
		case '/':
		case '/home':
			resp.filePath = path.join(__dirname, 'home/home.html')
			break
		case '/user':
			resp.filePath = path.join(__dirname, 'user/user.html')
			break
		default:
			resp.filePath = __dist
	}

	const usplit = url.split('.')
	switch (usplit[usplit.length - 1]) {
		case 'js':
			resp.contentType = JS;
			break;
		case 'css':
			resp.contentType = CSS;
			break;
	}

	return resp

}
