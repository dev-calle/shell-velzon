export interface AuthState {
    token: string | null;
    user: User | null;
    roles: string[];
    menus: string[];
}

export interface User {
    idusuario: string;
    codigo: string;
    contenido: string;
    estado: number;
    nombre: string;
    apellido: string;
}
