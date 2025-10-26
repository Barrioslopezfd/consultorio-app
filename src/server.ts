import http, { ServerResponse } from 'node:http';
import fs from 'node:fs';
import { obtenerCajeros, crearCajero, obtenerSiguienteId } from './services/CajeroService.js';

const PORT = 8000
const HOST = "0.0.0.0"

const HTML = "html"
const CSS = "css"
const JS = "js"
const JPG = "jpg"
const JPEG = "jpeg"
const PNG = "png"
const ICO = "ico"
const CSV = "csv"
const SUPPORTED_FILE_TYPES = [
	HTML,
	CSS,
	JS,
	JPG,
	JPEG,
	PNG,
	ICO,
	CSV
]

const MIMETYPE: { [key: string]: string } = {
	"html": "text/html; charset=utf-8",
	"css": "text/css; charset=utf-8",
	"js": "application/javascript; charset=utf-8",
	"jpg": "image/jpeg",
	"jpeg": "image/jpeg",
	"png": "image/png",
	"csv": "text/csv"
	// ".json": "application/json; charset=utf-8",
};

const ROUTES = [
	"home",
	"admin",
	"cashier",
	"display"
];

const ASSETS = [
	"assets/img/users",
	"assets/img/cajeros",
	"assets/img/visualizacion"
]


const server = http.createServer((req: http.IncomingMessage, res: ServerResponse) => {
	const urlBody = req.url?.split("?")[0]
	const URL = urlBody == "/" ? "/home" : urlBody
	console.log(`req.url -> ${URL}`)

	// rutas API
    if (URL?.startsWith('/api/')) {
        if (req.method === 'GET' && URL === '/api/cajeros') {
            const cajeros = obtenerCajeros();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cajeros));
            return;
        }

        if (req.method === 'POST' && URL === '/api/cajeros') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { nombre } = JSON.parse(body);
                    const nuevoId = obtenerSiguienteId();
                    crearCajero(nombre, nuevoId);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, id: nuevoId }));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error al crear cajero' }));
                }
            });
            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API route not found' }));
        return;
    }
	// -----

	if (URL == undefined) {
		console.log("Dentro de URL == undenfined con: " + URL)
		res.writeHead(400);
		res.end('URL is undefined');
		return;
	}
	const fileType: string | Error = getFileType(URL)
	if (fileType instanceof Error) {
		console.log(fileType.message)
		res.writeHead(404);
		res.end('Page does not exist');
		return;
	}
	const fileName = getFileName(URL)

	if (!ROUTES.includes(fileName) && !ASSETS.includes(fileName)) {
		console.log("Dentro de !ROUTES.includes(URL) con: " + URL + " y filename: " + fileName)
		res.writeHead(404);
		res.end('Page Not Found');
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
			console.log(err)
			res.writeHead(404);
			res.end('Page Not Found');
			return;
		}
	}
});

server.listen({
	host: HOST,
	port: PORT
}, () => {
	console.log(`Listening on http://${HOST}:${PORT}`);
});

function getFileName(url: string): string {
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
	if (SUPPORTED_FILE_TYPES.includes(extension)) {
		return extension
	}
	return new Error("FileType not supported")
}

function getContentType(fileType: string): string {
	return MIMETYPE[fileType]
}

function getPath(fileName: string, fileType: string): string {
	const dirName = fileName
	if (fileType == HTML || fileType == CSS || fileType == JS) {
		return fs.realpathSync(`${process.cwd()}/dst/pages/${dirName}/${fileName}.${fileType}`)
	}
	console.log("getPath returns: " + `${process.cwd()}/${fileName}.${fileType}`)
	return fs.realpathSync(`${process.cwd()}/${fileName}.${fileType}`)
}
