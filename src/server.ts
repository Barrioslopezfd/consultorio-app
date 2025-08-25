import http, { ServerResponse } from 'node:http';
import fs from 'node:fs';

const HTML = "html"
const SCSS = "scss"
const JS = "js"

const MIME: { [key: string]: string } = {
	"html": "text/html; charset=utf-8",
	"scss": "text/css; charset=utf-8",
	"js": "application/javascript; charset=utf-8",
	// ".json": "application/json; charset=utf-8",
};

const ROUTES = [
	"home",
	"admin",
	"cashier",
	"display"
];

// interface IResp {
// 	ContentType: string,
// 	FileType: string,
// 	FileName: string,
// }

const server = http.createServer((req: http.IncomingMessage, res: ServerResponse) => {
	const urlBody = req.url?.split("?")[0]
	const URL = urlBody == "/" ? "/home" : urlBody
	console.log(`req.url -> ${URL}`)

	if (URL == undefined) {
		res.writeHead(400);
		res.end('URL is undefined');
		return;
	}
	const fileName = getFileName(URL)
	console.log("Luego de URL == undenfined con: " + URL)
	if (!ROUTES.includes(fileName)) {
		res.writeHead(404);
		res.end('Page Not Found');
		return;
	}
	console.log("Luego de !ROUTES.includes(URL) con: " + URL)

	const fileType: string | Error = getFileType(URL)
	if (fileType instanceof Error) {
		res.writeHead(404);
		res.end('Page does not exist');
		return;
	}
	const contentType = getContentType(fileType)
	const filePath = getPath(fileName, fileType)
	try {
		const data = fs.readFileSync(filePath)
		res.writeHead(200, { 'Content-Type': contentType });
		res.end(data);
	} catch (err) {
		if (err) {
			res.writeHead(404);
			res.end('Page Not Found');
			return;
		}
	}
});

server.listen({
	host: '0.0.0.0',
	port: 8000
});

function getFileName(url: string): string {
	console.log(`@@@@@@ ${url.slice(1).split('.')[0]}`)
	if (!url.includes(".")) {
		return url.slice(1)
	}
	return url.slice(1).split('.')[0]
}

function getFileType(url: string): string | Error {
	if (!url.includes('.')) {
		return HTML
	}
	const extension = url.split('.')[1]
	console.log("WWWWWWWW" + " " + extension)

	switch (extension) {
		case HTML:
			return HTML
		case JS:
			return JS
		case SCSS:
			return SCSS
		default:
			return new Error("FileType not supported")
	}
}

function getContentType(fileType: string): string {
	return MIME[fileType]
}

function getPath(fileName: string, fileType: string): string {
	const dirName = fileName
	console.log(`TODAAAAA >>>>> ${fileName} --- ${fileType}`)
	return fs.realpathSync(`${process.cwd()}/dst/pages/${dirName}/${fileName}.${fileType}`)
}
