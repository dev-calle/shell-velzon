import { Role } from "./role.interface"

export interface IRoleRes {
  apiEstado: string
  apiMensaje: string
  data: Role[]
  total: number
}
