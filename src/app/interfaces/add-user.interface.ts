export interface IAddUserRes {
    apiEstado: string
    apiMensaje: string
    data: Data
}

export interface Data {
    codigo: string
    nombre: string
    apellido: string
    contenido: string
    roles: string[]
    idusuario: string
    idestado: number
    estado: string
}
