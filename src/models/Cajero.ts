
export interface ICajero {
  id: number;
  nombre: string;
  activo: boolean;
}

export class Cajero implements ICajero {
  id: number;
  nombre: string;
  activo: boolean;

  constructor(nombre: string, id: number) {
    this.id = id;
    this.nombre = nombre;
    this.activo = true;
  }

  cambiarEstado(): void {
    this.activo = !this.activo;
  }
}
