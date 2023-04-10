export interface ILoginRes {
    apiEstado: string
    apiMensaje: string
    data: Data
    token: string
  }
  
  export interface Data {
    idusuario: string
    codigo: string
    contenido: string
    estado: number
    nombre: string
    apellido: string
  }
  