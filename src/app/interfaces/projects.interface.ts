import { Project } from "./project.interface"

export interface IProjectRes {
  apiEstado: string
  apiMensaje: string
  data: Project[]
  total: number
}