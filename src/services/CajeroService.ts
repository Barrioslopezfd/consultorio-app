import fs from 'node:fs';
import path from 'node:path';
import { ICajero, Cajero } from '../models/Cajero.js';

const CAJEROS_FILE = path.resolve(process.cwd(), 'db/cajeros/cajeros.json');

export function obtenerCajeros(): ICajero[] {
	try {
		const data = fs.readFileSync(CAJEROS_FILE, 'utf-8');
		const cajeros = JSON.parse(data) as ICajero[];
		return cajeros;
	} catch (err) {
		console.error('Error leyendo cajeros.json:', err);
		return [];
	}
}

export function obtenerSiguienteId(): number {
	const cajeros = obtenerCajeros();
	if (cajeros.length === 0) {
		return 1;
	}
	const maxId = Math.max(...cajeros.map(c => c.id));
	return maxId + 1;
}

export function crearCajero(nombre: string, id: number): void {
	const cajeros = obtenerCajeros();
	const nuevoCajero = new Cajero(nombre, id);
	cajeros.push(nuevoCajero);
	
	try {
		fs.writeFileSync(CAJEROS_FILE, JSON.stringify(cajeros, null, 2), 'utf-8');
		console.log('Cajero creado exitosamente:', nuevoCajero);
	} catch (err) {
		console.error('Error guardando cajero:', err);
		throw err;
	}
}
