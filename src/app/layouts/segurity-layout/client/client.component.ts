import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/interfaces/client.interface';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  clients$?: Subscription;
  clients: Client[] = [];

  formAddClient!: FormGroup;
  addClient$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdClient = '';
  option = OPTION.ADD;

  columns: ColumnOrder[] = [
    { name: 'codigo', text: 'Código', active: false, order: true },
    { name: 'nombre', text: 'Nombre', active: false, order: true },
    { name: 'fechacreacion', text: 'Fecha creación', active: false, order: true },
    { name: 'estado', text: 'Estado', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _clientService: ClientService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddActivity();
    this.onSearchFilter();
    this.onListActivities();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddClient.controls; }

  get titleModal() {
    return this.option === OPTION.ADD ? 'Agregar Cliente': 'Editar Cliente';
  }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddActivity() {
    this.formAddClient = this._fb.group({
      code: [null, []],
      name: [null, [Validators.required]]
    })
  }

  onListActivities() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listActivities(limit, page, '', this.getColumNameActive());
  }

  listActivities(limit: string, page: string, filter: string, order: string) {
    this.clients$ = this._clientService.getClients(limit, page, filter, order).subscribe(resp => {
      this.clients = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListActivities();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listActivities('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListActivities();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddClient.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitClient() {
    if (!this.formAddClient.valid) {
      this.formAddClient.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._clientService.addClient(this.buildformAddActivity()) :
      this._clientService.editClient(this.currentIdClient, this.buildformAddActivity());
    this.addClient$ = service$.subscribe(() => {
      this.formAddClient.reset();
      this.onListActivities();
      this.modalRef.close();
      this.currentIdClient = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddActivity() {
    return {
      nombre: this.fModal['name'].value
    }
  }

  onAddActivity(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditActivity(id: string = '', content: TemplateRef<any>) {
    this._clientService.getClient(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdClient = id;
      this.loadDataActivityForm(resp.data);
      this.open(content);
    })
  }

  loadDataActivityForm(client: Client) {
    this.fModal['code'].setValue(client.codigo);
    this.fModal['name'].setValue(client.nombre);
  }

  onDeleteActivity(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar cliente ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteActivity(id);
      }
    })
  }

  deleteActivity(id: string) {
    return this._clientService.deleteClient(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El cliente ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListActivities();
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
    this.listActivities(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.clients$?.unsubscribe();
    this.addClient$?.unsubscribe();
  }
}
