import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { NomenclatureService } from 'src/app/services/nomenclature.service';
import { Nomenclature } from 'src/app/interfaces/nomenclature.interface';

@Component({
  selector: 'app-nomenclature',
  templateUrl: './nomenclature.component.html',
  styleUrls: ['./nomenclature.component.scss']
})
export class NomenclatureComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  nomenclatures$?: Subscription;
  nomenclatures: Nomenclature[] = [];

 
  formAddNomenclature!: FormGroup;
  addNomenclature$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdNomenclature = '';
  option = OPTION.ADD;

  columns: ColumnOrder[] = [
    { name: 'abreviatura', text: 'Abreviatura', active: false, order: true },
    { name: 'entidad', text: 'Entidad', active: false, order: true },
    { name: 'contador', text: 'Contador', active: false, order: true },
    { name: 'longitud', text: 'Longitud', active: false, order: true },
    { name: 'estado', text: 'Estado', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _nomenclatureService: NomenclatureService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddNomenclature();
    this.onSearchFilter();
    this.onListNomenclatures();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddNomenclature.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddNomenclature() {
    this.formAddNomenclature = this._fb.group({
      abbreviation: [null, [Validators.required]],
      entity: [null, [Validators.required]],
      counter: [null, [Validators.required]],
      length: [null, [Validators.required]]
    })
  }

  onListNomenclatures() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listNomenclatures(limit, page, '', this.getColumNameActive());
  }

  listNomenclatures(limit: string, page: string, filter: string, order: string) {
    this.nomenclatures$ = this._nomenclatureService.getNomenclatures(limit, page, filter, order).subscribe(resp => {
      this.nomenclatures = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListNomenclatures();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listNomenclatures('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListNomenclatures();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddNomenclature.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitNomenclature() {
    if (!this.formAddNomenclature.valid) {
      this.formAddNomenclature.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._nomenclatureService.addNomenclature(this.buildformAddNomenclature()) :
      this._nomenclatureService.editNomenclature(this.currentIdNomenclature, this.buildformAddNomenclature());
    this.addNomenclature$ = service$.subscribe(() => {
      this.formAddNomenclature.reset();
      this.onListNomenclatures();
      this.modalRef.close();
      this.currentIdNomenclature = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddNomenclature() {
    return {
      abreviatura: this.fModal['abbreviation'].value,
      entidad: this.fModal['entity'].value,
      contador: this.fModal['counter'].value,
      longitud: this.fModal['length'].value
    }
  }

  onAddNomenclature(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditNomenclature(id: string = '', content: TemplateRef<any>) {
    this._nomenclatureService.getNomenclature(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdNomenclature = id;
      this.loadDataNomenclatureForm(resp.data);
      this.open(content);
    })
  }

  loadDataNomenclatureForm(nomenclature: Nomenclature) {
    this.fModal['abbreviation'].setValue(nomenclature.abreviatura);
    this.fModal['entity'].setValue(nomenclature.entidad);
    this.fModal['counter'].setValue(nomenclature.contador);
    this.fModal['length'].setValue(nomenclature.longitud);
  }

  onDeleteNomenclature(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar nomenclatura ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteNomenclature(id);
      }
    })
  }

  deleteNomenclature(id: string) {
    return this._nomenclatureService.deleteNomenclature(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'La nomenclatura ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListNomenclatures();
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
    this.listNomenclatures(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.nomenclatures$?.unsubscribe();
    this.addNomenclature$?.unsubscribe();
  }
}
