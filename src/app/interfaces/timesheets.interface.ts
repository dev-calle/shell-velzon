export interface ITimeSheetRes {
    apiEstado: string
    apiMensaje: string
    data: Timesheet[]
    total: number
}

export interface Timesheet {
    idtimesheet: string
    codigo: string
    fecha: string
    hora: number
    observacion: string
    usuario: Usuario
    projecto: Projecto
    actividad: Actividad
    estado: string
    idestado: number
}

export interface Usuario {
    idusuario: string
    codigo: string
    contenido: string
    usuariohash?: Usuariohash
}

export interface Usuariohash {
    idUsuariohash: string
    hash: string
    salt: string
    fechacreacion: string
    usuariocreacion: string
    fechaedicion: any
    usuarioedicion: any
    eliminado: boolean
}

export interface Projecto {
    idproyecto: string
    codigo: string
    nombre: string
}

export interface Actividad {
    idactividad: string
    codigo: string
    nombre: string
}
