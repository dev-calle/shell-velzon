import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces/project.interface';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  projects$?: Subscription;
  projects: Project[] = [];

  formAddProject!: FormGroup;
  addProject$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdProject = '';
  option = OPTION.ADD;

  columns: ColumnOrder[] = [
    { name: 'codigo', text: 'Código', active: false, order: true },
    { name: 'nombre', text: 'Nombre', active: false, order: true },
    { name: 'estado', text: 'Estado', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _projectService: ProjectService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddProject();
    this.onSearchFilter();
    this.onListprojects();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddProject.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddProject() {
    this.formAddProject = this._fb.group({
      code: [null, []],
      name: [null, [Validators.required]]
    })
  }

  onListprojects() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listprojects(limit, page, '', this.getColumNameActive());
  }

  listprojects(limit: string, page: string, filter: string, order: string) {
    this.projects$ = this._projectService.getProjects(limit, page, filter, order).subscribe(resp => {
      this.projects = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListprojects();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listprojects('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListprojects();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddProject.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitProject() {
    if (!this.formAddProject.valid) {
      this.formAddProject.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._projectService.addProject(this.buildformAddProject()) :
      this._projectService.editProject(this.currentIdProject, this.buildformAddProject());
    this.addProject$ = service$.subscribe(() => {
      this.formAddProject.reset();
      this.onListprojects();
      this.modalRef.close();
      this.currentIdProject = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddProject() {
    return {
      nombre: this.fModal['name'].value
    }
  }

  onAddProject(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditProject(id: string = '', content: TemplateRef<any>) {
    this._projectService.getProject(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdProject = id;
      this.loadDataProjectForm(resp.data);
      this.open(content);
    })
  }

  loadDataProjectForm(project: Project) {
    this.fModal['code'].setValue(project.codigo);
    this.fModal['name'].setValue(project.nombre);
  }

  onDeleteProject(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar proyecto ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteProject(id);
      }
    })
  }

  deleteProject(id: string) {
    return this._projectService.deleteProject(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El proyecto ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListprojects();
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
    this.listprojects(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.projects$?.unsubscribe();
    this.addProject$?.unsubscribe();
  }

}
