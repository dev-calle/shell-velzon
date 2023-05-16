import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IProjectRes } from "../interfaces/projects.interface";
import { environment } from "src/environments/environment";
import { IItemProjectRes } from "../interfaces/item-project.interface";

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    
    constructor(private _http: HttpClient) { }

    getProjects(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<IProjectRes>(`${URI}/project`, { params });
    }

    addProject(body: any) {
        return this._http.post<any>(`${URI}/project`, body);
    }

    getProject(id: string) {
        return this._http.get<IItemProjectRes>(`${URI}/project/${id}`);
    }

    editProject(id: string, body: any) {
        return this._http.patch<any>(`${URI}/project/${id}`, body);
    }

    deleteProject(id: string) {
        return this._http.delete<any>(`${URI}/project/${id}`);
    }

    getStates() {
        return [
            { id: 1, name: 'En Proceso' },
            { id: 2, name: 'Stand By' },
            { id: 3, name: 'Terminado' }
        ]
    }

    getByClient(cliente: string) {
        let params = new HttpParams();
        params = params.set('cliente', cliente);
        return this._http.get<IProjectRes>(`${URI}/project/client/list/`, { params });
    }
}