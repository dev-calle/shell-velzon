import { Activity } from "./activity.interface"

export interface IActivityRes {
  apiEstado: string
  apiMensaje: string
  data: Activity[]
  total: number
}
