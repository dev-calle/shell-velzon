import { Menu } from "./menu.interface"

export interface IMenuRes {
    apiEstado: string
    apiMensaje: string
    data: Menu[]
    total: number
}