import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { EventTimesheet } from 'src/app/interfaces/event-timesheet.interface';
import { ActivityService } from 'src/app/services/activity.service';
import { ProjectService } from 'src/app/services/project.service';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { UserService } from 'src/app/services/user.service';
import { firstDayOfMonth, lastDayOfMonth } from 'src/app/utils';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  projects = [];
  activities = [];
  users = [];
  formSearch!: UntypedFormGroup;

  columns: ColumnOrder[] = [
    { name: 'fecha', text: 'Fecha', active: false, order: false },
    { name: 'proyecto', text: 'Proyecto', active: false, order: false },
    { name: 'actividad', text: 'Actividad', active: false, order: false },
    { name: 'usuario', text: 'Usuario', active: false, order: false },
    { name: 'horas', text: 'Horas', active: false, order: false },
    { name: 'observacion', text: 'Observación', active: false, order: false }
  ];

  currentPage = 1;
  itemsPerPage = 5;
  total = 0;

  eventsTimesheet: EventTimesheet[] = [];

  constructor(private formBuilder: FormBuilder, private _projectService: ProjectService, 
    private _activityService: ActivityService , private _userService: UserService,
    private _timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.createFormSearch();
    this.loadDataSelects();
    this.onSearch();
  }

  createFormSearch() {
    this.formSearch = this.formBuilder.group({
      dateStart: [firstDayOfMonth(), [Validators.required]],
      dateEnd: [lastDayOfMonth(), [Validators.required]],
      project: [null, []],
      activity: [null, []],
      users: [null, []]
    })
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onSearch();
  }

  onSearch() {
    if(!this.formSearch.valid) {
      this.formSearch.markAllAsTouched();
      return;
    }

    const dateStart = this.formSearch.get('dateStart')?.value;
    const dateEnd = this.formSearch.get('dateEnd')?.value;
    const project = this.formSearch.get('project')?.value as string[];
    const activity = this.formSearch.get('activity')?.value as string[];
    const users = this.formSearch.get('users')?.value as string[];
    
    this._timesheetService.getReport(this.itemsPerPage.toString(), this.currentPage.toString(), 
      dateStart.toISOString().slice(0, 10), dateEnd.toISOString().slice(0, 10), project?.join(','), 
      activity?.join(','), users?.join(',')).subscribe(resp => {
      this.eventsTimesheet = resp.data;
      this.total = resp.total;
    })
  }

  loadDataSelects() {
    const params = { limit: '100', page: '1', filter: '', order: '' };
    const projects$ = this._projectService.getProjects(params.limit, params.page, params.filter, params.order);
    const activities$ = this._activityService.getActivities(params.limit, params.page, params.filter, params.order);
    const users$ = this._userService.getUsers(params.limit, params.page, params.filter, params.order);
    forkJoin([projects$, activities$, users$]).subscribe(resp => {
      this.projects = resp[0].data.map(r => { return { id: r.idproyecto, name: r.nombre } }) as [];
      this.activities = resp[1].data.map(r => { return { id: r.idactividad, name: r.nombre } }) as [];
      this.users = resp[2].data.map(r => { return { id: r.idusuario, name: r.nombre } }) as [];
    });
  }

  async download(): Promise<void> {
    const url = 'URL_DEL_SERVIDOR'; // Reemplaza con la URL de tu servidor

    const dateStart = this.formSearch.get('dateStart')?.value;
    const dateEnd = this.formSearch.get('dateEnd')?.value;
    const project = this.formSearch.get('project')?.value as string[];
    const activity = this.formSearch.get('activity')?.value as string[];
    const users = this.formSearch.get('users')?.value as string[];

    const { filename, blob } = await this._timesheetService.getReportExcel(dateStart.toISOString().slice(0, 10), 
    dateEnd.toISOString().slice(0, 10), project?.join(','), activity?.join(','), users?.join(','));

    if (!blob) {
      console.error('El Blob es nulo o indefinido.');
      return;
    }

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // Simular un clic en el enlace
    link.click();

    // Liberar el objeto URL creado para el enlace
    window.URL.revokeObjectURL(link.href);
  }
}
