export interface IEventTimesheetRes {
    apiEstado: string
    apiMensaje: string
    data: EventTimesheet[]
    total: number
}

export interface EventTimesheet {
    idtimesheet: string
    codigo: string
    fecha: string
    hora: number
    observacion: string
    idestado: number
    idproyecto: string
    proyecto: string
    idactividad: string
    actividad: string
    usuario: string
    estado: string
    idcliente: string
    cliente: string
}