import http, { ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const

const FILETYPES = [
	"js",
	"html",
	"css"
];
const ROUTES = [
	"/",
	"/admin",
	"/cashier",
	"/display"
];

interface IResp {
	filePath: string,
	contentType: string,
}

http.createServer((req: http.IncomingMessage, res: ServerResponse) => {
	const URL = req.url?.split("?")[0]
	console.log(`req.url -> ${URL}`)

	if (URL == undefined) {
		res.writeHead(400);
		res.end('Bad Request');
		return;
	}
	if (!ROUTES.includes(URL)) {
		res.writeHead(404);
		res.end('Page Not Found');
		return;
	}

	const resp = getPath(URL);
	const filePath: string = resp.filePath;
	const contentType: string = resp.contentType;

	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end('Page Not Found');
			return;
		}

		res.writeHead(200, { 'Content-Type': contentType });
		res.end(data);
	});
}).listen({
	host: '0.0.0.0',
	port: 8000
});

function getFileName(url: string): string {
}

function getPath(url: string): IResp {

	const HTML: string = 'text/html';
	const JS: string = 'text/javascript';
	const CSS: string = 'text/css';

	let resp: IResp = {
		filePath: 'NotFound',
		contentType: HTML,
	};

	if (url == undefined) {
		return resp
	}

	const PAGESDIR = path.resolve(process.cwd(), 'dst/pages')
	console.log(`PAGESDIR: ${PAGESDIR}`)
	const __dist = path.join(path.dirname(fileURLToPath(import.meta.url)), url)
	console.log(`__dist: ${__dist}`)
	// console.log(`URL: ${url}`)
	console.log(`fielURLToPath: ${fileURLToPath(import.meta.url)}`)
	switch (url) {
		case '/':
			resp.filePath = path.join(PAGESDIR, 'home/home.html')
			break
		case '/admin':
			resp.filePath = path.join(PAGESDIR, 'admin/admin.html')
			break
		case '/cashier':
			resp.filePath = path.join(PAGESDIR, 'cashier/cashier.html')
			break
		case '/display':
			resp.filePath = path.join(PAGESDIR, 'display/display.html')
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
