import { Nomenclature } from "./nomenclature.interface"

export interface INomenclatureRes {
    apiEstado: string
    apiMensaje: string
    data: Nomenclature[]
    total: number
}