import { Client } from "./client.interface"

export interface IClientRes {
  apiEstado: string
  apiMensaje: string
  data: Client[]
  total: number
}