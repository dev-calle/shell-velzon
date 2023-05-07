export interface IMenuValidRes {
    apiEstado: string
    apiMensaje: string
    data: MenuValid
}

export interface MenuValid {
    roles: string[]
    menus: string[]
}