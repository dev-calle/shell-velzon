import { StateCatalog } from "./state-catalog.interface"

export interface IStatesCatalogRes {
  apiEstado: string
  apiMensaje: string
  data: StateCatalog[]
  total: number
}
