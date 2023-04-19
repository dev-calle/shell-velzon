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
        return this._http.get<IProjectRes>(`${URI}/Project`, { params });
    }

    addProject(body: any) {
        return this._http.post<any>(`${URI}/Project`, body);
    }

    getProject(id: string) {
        return this._http.get<IItemProjectRes>(`${URI}/Project/${id}`);
    }

    editProject(id: string, body: any) {
        return this._http.patch<any>(`${URI}/Project/${id}`, body);
    }

    deleteProject(id: string) {
        return this._http.delete<any>(`${URI}/Project/${id}`);
    }
}