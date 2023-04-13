import { Menu } from "./menu.interface";

export interface Role {
    idrol: string
    codigo: string
    nombre: string
    fechacreacion: string
    estado: number,
    menus?: Menu[];
}