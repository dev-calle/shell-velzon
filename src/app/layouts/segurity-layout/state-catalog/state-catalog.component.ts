import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { StateCatalogService } from 'src/app/services/state-catalog.service';
import { StateCatalog } from 'src/app/interfaces/state-catalog.interface';

@Component({
  selector: 'app-state-catalog',
  templateUrl: './state-catalog.component.html',
  styleUrls: ['./state-catalog.component.scss']
})
export class StateCatalogComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  statesCatalog$?: Subscription;
  statesCatalog: StateCatalog[] = [];

  formAddStateCatalog!: FormGroup;
  addStateCatalog$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdStateCatalog = '';
  option = OPTION.ADD;

  columns: ColumnOrder[] = [
    { name: 'codigo', text: 'Código', active: false, order: true },
    { name: 'valor', text: 'Valor', active: false, order: true },
    { name: 'nombre', text: 'Nombre', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _stateCatalogService: StateCatalogService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddStateCatalog();
    this.onSearchFilter();
    this.onListStatesCatalog();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddStateCatalog.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddStateCatalog() {
    this.formAddStateCatalog = this._fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      value: [null, [Validators.required]]
    })
  }

  onListStatesCatalog() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listStatesCatalog(limit, page, '', this.getColumNameActive());
  }

  listStatesCatalog(limit: string, page: string, filter: string, order: string) {
    this.statesCatalog$ = this._stateCatalogService.getStatesCatalog(limit, page, filter, order).subscribe(resp => {
      this.statesCatalog = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListStatesCatalog();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listStatesCatalog('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListStatesCatalog();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddStateCatalog.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitStateCatalog() {
    if (!this.formAddStateCatalog.valid) {
      this.formAddStateCatalog.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._stateCatalogService.addStateCatalog(this.buildformAddStateCatalog()) :
      this._stateCatalogService.editStateCatalog(this.currentIdStateCatalog, this.buildformAddStateCatalog());
    this.addStateCatalog$ = service$.subscribe(() => {
      this.formAddStateCatalog.reset();
      this.onListStatesCatalog();
      this.modalRef.close();
      this.currentIdStateCatalog = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddStateCatalog() {
    return {
      codigo: this.fModal['code'].value,
      valor: this.fModal['value'].value,
      nombre: this.fModal['name'].value
    }
  }

  onAddStateCatalog(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditStateCatalog(id: string = '', content: TemplateRef<any>) {
    this._stateCatalogService.getStateCatalog(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdStateCatalog = id;
      this.loadDataStateCatalogForm(resp.data);
      this.open(content);
    })
  }

  loadDataStateCatalogForm(stateCatalog: StateCatalog) {
    this.fModal['code'].setValue(stateCatalog.codigo);
    this.fModal['name'].setValue(stateCatalog.nombre);
    this.fModal['value'].setValue(stateCatalog.valor);
  }

  onDeleteStateCatalog(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar estado ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteStateCatalog(id);
      }
    })
  }

  deleteStateCatalog(id: string) {
    return this._stateCatalogService.deleteStateCatalog(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El estado ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListStatesCatalog();
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
    this.listStatesCatalog(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.statesCatalog$?.unsubscribe();
    this.addStateCatalog$?.unsubscribe();
  }
}
