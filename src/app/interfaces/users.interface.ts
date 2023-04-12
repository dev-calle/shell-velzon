import { Role } from "./role.interface"

export interface IUserRes {
  apiEstado: string
  apiMensaje: string
  data: User[]
  total: number
}

export interface User {
  idusuario: string
  codigo: string
  contenido: string
  idestado: number
  nombre: string
  apellido: string
  estado: string
  roles?: Role[]
}
