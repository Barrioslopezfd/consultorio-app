import { ICajero } from '../../models/Cajero.js';

const cajerosList = document.getElementById('cajeros-list') as HTMLUListElement
const btnCrearCajero = document.getElementById('btn-crear-cajero') as HTMLButtonElement | null;
const modal = document.getElementById('modal-crear-cajero') as HTMLDivElement | null;
const inputNombre = document.getElementById('input-nombre-cajero') as HTMLInputElement | null;
const btnConfirmar = document.getElementById('btn-confirmar-crear') as HTMLButtonElement | null;
const btnCancelar = document.getElementById('btn-cancelar-crear') as HTMLButtonElement | null;

async function obtenerCajeros(): Promise<ICajero[]> {
    try {
        const response = await fetch('/api/cajeros');
        if (!response.ok) throw new Error('Error al obtener cajeros');
        return await response.json();
    } catch (err) {
        console.error('Error:', err);
        return [];
    }
}

async function crearCajeroAPI(nombre: string): Promise<boolean> {
    try {
        const response = await fetch('/api/cajeros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        return response.ok;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
}

async function renderCajeros() {
    const cajeros = await obtenerCajeros();
    cajerosList.innerHTML = '';
    if (cajeros.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay cajeros disponibles';
        cajerosList.appendChild(li);
        return;
    }
    cajeros.forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.nombre} - ID: ${c.id} ${c.activo ? '(activo)' : '(inactivo)'}`;
        cajerosList.appendChild(li);
    });
}

function abrirModal() {
    if (modal && inputNombre) {
        modal.style.display = 'flex';
        inputNombre.value = '';
        inputNombre.focus();
    }
}

function cerrarModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}

async function handleCrearCajero() {
    if (!inputNombre) return;
    
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        alert('Por favor ingresa un nombre para el cajero');
        return;
    }
    
    const success = await crearCajeroAPI(nombre);
    if (success) {
        cerrarModal();
        await renderCajeros();
    } else {
        alert('Error al crear el cajero');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCajeros();
    
    btnCrearCajero?.addEventListener('click', abrirModal);
    btnCancelar?.addEventListener('click', cerrarModal);
    btnConfirmar?.addEventListener('click', handleCrearCajero);
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    inputNombre?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleCrearCajero();
        }
    });
});