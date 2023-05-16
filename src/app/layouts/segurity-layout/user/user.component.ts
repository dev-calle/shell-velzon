import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { User } from 'src/app/interfaces/users.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { nonEmptyArrayValidator } from 'src/app/utils';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { ColumnOrder } from 'src/app/interfaces/column-order.interface';
import { RoleService } from 'src/app/services/role.service';
import { PWD_PATTERN } from 'src/app/constants/pwd-pattern.constant';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  users$?: Subscription;
  roles$?: Subscription;
  users: User[] = [];

  roles = [];
  formAddUser!: FormGroup;
  addUser$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdUser = '';
  option = OPTION.ADD;

  columns: ColumnOrder[] = [
    { name: 'codigo', text: 'Código', active: false, order: true },
    { name: 'nombre', text: 'Nombre', active: false, order: true },
    { name: 'apellido', text: 'Apellido', active: false, order: true },
    { name: 'contenido', text: 'Correo', active: false, order: true },
    { name: 'estado', text: 'Estado', active: false, order: true },
    { name: 'editar', text: 'Editar', active: false, order: false },
    { name: 'eliminar', text: 'Eliminar', active: false, order: false }
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService,
    private _roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createFormAddUser();
    this.onSearchFilter();
    this.onListUsers();
    this.listRoles();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddUser.controls; }

  get titleModal() {
    return this.option === OPTION.ADD ? 'Agregar Usuario': 'Editar Usuario';
  }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createFormAddUser() {
    this.formAddUser = this._fb.group({
      code: [null, []],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      content: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(PWD_PATTERN)]],
      roles: [[], [Validators.required, nonEmptyArrayValidator]]
    })
  }

  onListUsers() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.listUsers(limit, page, '', this.getColumNameActive());
  }

  listUsers(limit: string, page: string, filter: string, order: string) {
    this.users$ = this._userService.getUsers(limit, page, filter, order).subscribe(resp => {
      this.users = resp.data;
      this.total = resp.total;
    }); 
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.removeColumnsOrder();
          this.search(value);
        } else {
          this.onListUsers();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.listUsers('', '', value, '');
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListUsers();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddUser.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitUser() {
    if (!this.formAddUser.valid) {
      this.formAddUser.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._userService.addUser(this.buildFormAddUser()) :
      this._userService.editUser(this.currentIdUser, this.buildFormAddUser());
    this.addUser$ = service$.subscribe(() => {
      this.formAddUser.reset();
      this.onListUsers();
      this.modalRef.close();
      this.currentIdUser = '';
      this.option = OPTION.ADD;
    })
  }

  buildFormAddUser() {
    return {
      nombre: this.fModal['name'].value,
      apellido: this.fModal['lastname'].value,
      contenido: this.fModal['content'].value,
      contrasenia: this.fModal['password'].value,
      roles: this.fModal['roles'].value
    }
  }

  onAddUser(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.fModal['password'].setValidators([Validators.required, Validators.pattern(PWD_PATTERN)]);
    this.fModal['password'].updateValueAndValidity();
    this.open(content);
  }

  onEditUser(id: string, content: TemplateRef<any>) {
    this._userService.getUser(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.fModal['password'].setValidators(null);
      this.fModal['password'].updateValueAndValidity();
      this.currentIdUser = id;
      this.loadDataUserForm(resp.data);
      this.open(content);
    })
  }

  loadDataUserForm(user: User) {
    this.fModal['code'].setValue(user.codigo);
    this.fModal['name'].setValue(user.nombre);
    this.fModal['lastname'].setValue(user.apellido);
    this.fModal['content'].setValue(user.contenido);
    const roles = user.roles?.map(r => r.idrol);
    this.fModal['roles'].setValue(roles);
  }

  onDeleteUser(id: string, name: string, lastname: string) {
    this._alertService.show({
      title: `¿Eliminar a ${name} ${lastname}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteUser(id);
      }
    })
  }

  deleteUser(id: string) {
    return this._userService.deleteUser(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El usuario ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListUsers();
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
    this.listUsers(limit, page, '', this.getColumNameActive());
  }

  removeColumnsOrder() {
    this.columns.forEach(column => column.active = false);
  }  

  getColumNameActive() {
    return this.columns.find(column => column.active && column.order)?.name ?? '';
  }

  listRoles() {
    this.roles$ = this._roleService.getRoles('100', '1', '', '').subscribe(resp => {
      this.roles = resp.data.map(r => { return { id: r.idrol, name: r.nombre } }) as [];
    });
  }

  ngOnDestroy(): void {
    this.users$?.unsubscribe();
    this.addUser$?.unsubscribe();
    this.roles$?.unsubscribe();
  }
}
