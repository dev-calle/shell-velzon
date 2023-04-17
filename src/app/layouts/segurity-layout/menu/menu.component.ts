import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { MenuService } from 'src/app/services/menu.service';
import { Menu } from 'src/app/interfaces/menu.interface';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  menus$?: Subscription;
  menus: Menu[] = [];

 
  formAddMenu!: FormGroup;
  addMenu$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdMenu = '';
  option = OPTION.ADD;

  columns: ColumnOrder[] = [
    { name: 'codigo', text: 'Código', active: false, order: true },
    { name: 'nombre', text: 'Nombre', active: false, order: true },
    { name: 'url', text: 'Url', active: false, order: true },
    { name: 'estado', text: 'Estado', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _menuService: MenuService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddMenu();
    this.onSearchFilter();
    this.onListMenus();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddMenu.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddMenu() {
    this.formAddMenu = this._fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      order: [null, [Validators.required]],
      type: [null, [Validators.required]],
      platform: [null, [Validators.required]],
      module: [null, [Validators.required]],
      url: [null, [Validators.required]]
    })
  }

  onListMenus() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listMenus(limit, page, '', this.getColumNameActive());
  }

  listMenus(limit: string, page: string, filter: string, order: string) {
    this.menus$ = this._menuService.getMenus(limit, page, filter, order).subscribe(resp => {
      this.menus = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListMenus();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listMenus('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListMenus();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddMenu.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitMenu() {
    if (!this.formAddMenu.valid) {
      this.formAddMenu.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._menuService.addMenu(this.buildformAddMenu()) :
      this._menuService.editMenu(this.currentIdMenu, this.buildformAddMenu());
    this.addMenu$ = service$.subscribe(() => {
      this.formAddMenu.reset();
      this.onListMenus();
      this.modalRef.close();
      this.currentIdMenu = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddMenu() {
    return {
      codigo: this.fModal['code'].value,
      nombre: this.fModal['name'].value,
      orden: this.fModal['order'].value,
      tipo: this.fModal['type'].value,
      plataforma: this.fModal['platform'].value,
      modulo: this.fModal['module'].value,
      url: this.fModal['url'].value
    }
  }

  onAddMenu(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditMenu(id: string = '', content: TemplateRef<any>) {
    this._menuService.getMenu(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdMenu = id;
      this.loadDataMenuForm(resp.data);
      this.open(content);
    })
  }

  loadDataMenuForm(menu: Menu) {
    this.fModal['code'].setValue(menu.codigo);
    this.fModal['name'].setValue(menu.nombre);
    this.fModal['order'].setValue(menu.orden);
    this.fModal['type'].setValue(menu.tipo);
    this.fModal['platform'].setValue(menu.plataforma);
    this.fModal['module'].setValue(menu.modulo);
    this.fModal['url'].setValue(menu.url);
  }

  onDeleteMenu(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar menú ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteMenu(id);
      }
    })
  }

  deleteMenu(id: string) {
    return this._menuService.deleteMenu(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El rol ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListMenus();
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
    this.listMenus(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.menus$?.unsubscribe();
    this.addMenu$?.unsubscribe();
  }

}
