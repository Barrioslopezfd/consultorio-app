export interface IPaciente {
  id: number;
  nombre: string;
  numeroAfiliado: string;
  activo: boolean;
}

export class Paciente implements IPaciente {
  id: number;
  nombre: string;
  numeroAfiliado: string;
  activo: boolean;

  constructor(nombre: string, numeroAfiliado: string, id: number) {
    this.id = id;
    this.nombre = nombre;
    this.numeroAfiliado = numeroAfiliado;
    this.activo = true;
  }

  cambiarEstado(): void {
    this.activo = !this.activo;
  }
}
