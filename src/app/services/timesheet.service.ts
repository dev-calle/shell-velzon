import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITimeSheetRes } from '../interfaces/timesheets.interface';
import { IItemTimesheetRes } from '../interfaces/item-timesheet.interface';
import { IEventTimesheetRes } from '../interfaces/event-timesheet.interface';

const { timesheet_server: URI } = environment;

@Injectable({
    providedIn: 'root'
})
export class TimesheetService {

    constructor(private _http: HttpClient) { }

    getTimesheets(limit: string, page: string, filter: string, order: string) {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('filter', filter);
        params = params.set('order', order);
        return this._http.get<ITimeSheetRes>(`${URI}/timesheet`, { params });
    }

    addTimesheet(body: any) {
        return this._http.post<any>(`${URI}/timesheet`, body);
    }

    getTimesheet(id: string) {
        return this._http.get<IItemTimesheetRes>(`${URI}/timesheet/${id}`);
    }

    editTimesheet(id: string, body: any) {
        return this._http.patch<any>(`${URI}/timesheet/${id}`, body);
    }

    deleteTimesheet(id: string) {
        return this._http.delete<any>(`${URI}/timesheet/${id}`);
    }

    getEvents(page: string = '1', dateStart: string, dateEnd: string, cliente: string = '', projecto: string = '', actividad: string = '') {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('dateStart', dateStart);
        params = params.set('dateEnd', dateEnd);
        params = params.set('cliente', cliente);
        params = params.set('projecto', projecto);
        params = params.set('actividad', actividad);
        return this._http.get<IEventTimesheetRes>(`${URI}/timesheet`, { params });
    }

    getReport(limit: string, page: string, dateStart: string, dateEnd: string, cliente: string = '', proyecto: string = '', actividad: string = '', users: string = '') {
        let params = new HttpParams();
        params = params.set('limit', limit);
        params = params.set('page', page);
        params = params.set('dateStart', dateStart);
        params = params.set('dateEnd', dateEnd);
        params = params.set('cliente', cliente);
        params = params.set('proyecto', proyecto);
        params = params.set('actividad', actividad);
        params = params.set('users', users);
        return this._http.get<IEventTimesheetRes>(`${URI}/timesheet/report/users`, { params });
    }

    getReportExcel(dateStart: string, dateEnd: string, cliente: string = '', proyecto: string = '', actividad: string = '', users: string = '') {
        let params = new HttpParams();
        params = params.set('dateStart', dateStart);
        params = params.set('dateEnd', dateEnd);
        params = params.set('cliente', cliente);
        params = params.set('proyecto', proyecto);
        params = params.set('actividad', actividad);
        params = params.set('users', users);

        return this._http
            .get(`${URI}/timesheet/report/excel`, { responseType: 'blob', observe: 'response', params })
            .toPromise()
            .then((response) => {
                const filename = `Reporte_Timesheet_${dateStart}_${dateEnd}.xlsx`;
                const blob = response?.body;
                return { filename, blob };
            });
    }
}
