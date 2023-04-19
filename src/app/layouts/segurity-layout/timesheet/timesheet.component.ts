import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { Timesheet } from 'src/app/interfaces/timesheets.interface';
import { formatDate } from "@angular/common";
import { ProjectService } from 'src/app/services/project.service';
import { ActivityService } from 'src/app/services/activity.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  timesheets$?: Subscription;
  timesheets: Timesheet[] = [];

 
  formAddMenu!: FormGroup;
  addMenu$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdMenu = '';
  option = OPTION.ADD;

  projects = [];
  activities = [];
  users = [];

  columns: ColumnOrder[] = [
    { name: 'codigo', text: 'Código', active: false, order: true },
    { name: 'fecha', text: 'Fecha', active: false, order: true },
    { name: 'hora', text: 'Hora', active: false, order: true },
    { name: 'observacion', text: 'Observación', active: false, order: true },
    { name: 'estado', text: 'Estado', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _timesheetService: TimesheetService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService,
    private _projectService: ProjectService,
    private _activityService: ActivityService,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddTimesheet();
    this.onSearchFilter();
    this.onListtimesheets();
    this.loadDataSelects();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddMenu.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddTimesheet() {
    this.formAddMenu = this._fb.group({
      code: [null, []],
      date: [null, [Validators.required]],
      hour: [null, [Validators.required]],
      hours: [null, [Validators.required]],
      observation: [null, []],
      project: [null, [Validators.required]],
      activity: [null, [Validators.required]],
      user: [null, [Validators.required]]
    })
  }

  onListtimesheets() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listtimesheets(limit, page, '', this.getColumNameActive());
  }

  listtimesheets(limit: string, page: string, filter: string, order: string) {
    this.timesheets$ = this._timesheetService.getTimesheets(limit, page, filter, order).subscribe(resp => {
      this.timesheets = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListtimesheets();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listtimesheets('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListtimesheets();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddMenu.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitTimesheet() {
    if (!this.formAddMenu.valid) {
      this.formAddMenu.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._timesheetService.addTimesheet(this.buildformAddMenu()) :
      this._timesheetService.editTimesheet(this.currentIdMenu, this.buildformAddMenu());
    this.addMenu$ = service$.subscribe(() => {
      this.formAddMenu.reset();
      this.onListtimesheets();
      this.modalRef.close();
      this.currentIdMenu = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddMenu() {
    return {
      fecha: this.fModal['date'].value,
      hora: this.fModal['hours'].value,
      observacion: this.fModal['observation'].value,
      projecto: this.fModal['project'].value,
      actividad: this.fModal['activity'].value,
      usuario: this.fModal['user'].value
    }
  }

  onAddTimesheet(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditMenu(id: string = '', content: TemplateRef<any>) {
    this._timesheetService.getTimesheet(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdMenu = id;
      this.loadDataTimesheetForm(resp.data);
      this.open(content);
    })
  }

  loadDataTimesheetForm(timesheet: Timesheet) {
    const date = formatDate(timesheet.fecha, 'yyyy-MM-dd', 'en-US');
    const hour = formatDate(timesheet.fecha, 'HH:mm', 'en-US');
    this.fModal['code'].setValue(timesheet.codigo);
    this.fModal['date'].setValue(date);
    this.fModal['hour'].setValue(hour);
    this.fModal['hours'].setValue(timesheet.hora);
    this.fModal['observation'].setValue(timesheet.observacion);
    this.fModal['project'].setValue(timesheet.projecto.idproyecto);
    this.fModal['activity'].setValue(timesheet.actividad.idactividad);
    this.fModal['user'].setValue(timesheet.usuario.idusuario);
  }

  onDeleteTimesheet(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar timesheet ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteTimesheet(id);
      }
    })
  }

  deleteTimesheet(id: string) {
    return this._timesheetService.deleteTimesheet(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El timesheet ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListtimesheets();
    })
  }

  onOrderColumn(column: ColumnOrder) {
    if(!column.order) return;
    if(this.columns.some(col => col.active && col.name === column.name)) {
      column.active = false;
    } else {
      this.removeColumnsOrder();
      column.active = true;
    } 
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listtimesheets(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  loadDataSelects() {
    const params = { limit: '100', page: '1', filter: '', order: '' };
    const projects$ = this._projectService.getProjects(params.limit, params.page, params.filter, params.order);
    const activities$ = this._activityService.getActivities(params.limit, params.page, params.filter, params.order);
    const users$ = this._userService.getUsers(params.limit, params.page, params.filter, params.order);
    forkJoin([ projects$, activities$, users$]).subscribe(resp => {
      this.projects = resp[0].data.map(r => { return { id: r.idproyecto, name: r.nombre } }) as [];
      this.activities = resp[1].data.map(r => { return { id: r.idactividad, name: r.nombre } }) as [];
      this.users = resp[2].data.map(r => { return { id: r.idusuario, name: r.nombre } }) as [];
    });
  }

  ngOnDestroy(): void {
    this.timesheets$?.unsubscribe();
    this.addMenu$?.unsubscribe();
  }

}
