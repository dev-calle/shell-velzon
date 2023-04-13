import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { nonEmptyArrayValidator } from 'src/app/utils';
import { OPTION } from 'src/app/constants/option.constants';
import { AlertService } from 'src/app/services/alert.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/interfaces/role.interface';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  roles$?: Subscription;
  roles: Role[] = [];

  menus = [
    { id: '3e4196db-0863-4c78-b3fb-bab480ded1de', name: 'Factors' }
  ];
  formAddRole!: FormGroup;
  addRole$?: Subscription;
  modalRef!: NgbModalRef;

  currentIdRole = '';
  option = OPTION.ADD;

  private searchSubject = new Subject<string>();

  constructor(
    private _roleService: RoleService,
    private _fb: FormBuilder,
    public _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createformAddRole();
    this.onSearchFilter();
    this.onListroles();
  }

  get f() { return this.formSearch.controls; }

  get fModal() { return this.formAddRole.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createformAddRole() {
    this.formAddRole = this._fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      menus: [[], [Validators.required, nonEmptyArrayValidator]]
    })
  }

  onListroles() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.roles$ = this._roleService.getRoles(limit, page, '').subscribe(resp => {
      this.roles = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
          this.search(value);
        } else {
          this.onListroles();
        }
      });

    this.f['filter'].valueChanges.subscribe(() => {
      this.searchSubject.next(this.f['filter'].value);
    });
  }

  search(value: string) {
    this.roles$ = this._roleService.getRoles('', '', value).subscribe(resp => {
      this.roles = resp.data;
      this.total = resp.total;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListroles();
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this._modalService.open(content);
    this.modalRef.closed.subscribe(() => {
      this.formAddRole.reset();
      this.option = OPTION.ADD;
    });
  }

  onSubmitRole() {
    if (!this.formAddRole.valid) {
      this.formAddRole.markAllAsTouched();
      return;
    }
    const service$ = this.option === OPTION.ADD ?
      this._roleService.addRole(this.buildformAddRole()) :
      this._roleService.editRole(this.currentIdRole, this.buildformAddRole());
    this.addRole$ = service$.subscribe(() => {
      this.formAddRole.reset();
      this.onListroles();
      this.modalRef.close();
      this.currentIdRole = '';
      this.option = OPTION.ADD;
    })
  }

  buildformAddRole() {
    return {
      codigo: this.fModal['code'].value,
      nombre: this.fModal['name'].value,
      menus: this.fModal['menus'].value
    }
  }

  onAddRole(content: TemplateRef<any>) {
    this.option = OPTION.ADD;
    this.open(content);
  }

  onEditRole(id: string = '', content: TemplateRef<any>) {
    this._roleService.getRole(id).subscribe(resp => {
      this.option = OPTION.EDIT;
      this.currentIdRole = id;
      this.loadDataRoleForm(resp.data);
      this.open(content);
    })
  }

  loadDataRoleForm(role: Role) {
    this.fModal['code'].setValue(role.codigo);
    this.fModal['name'].setValue(role.nombre);
    const roles = role.menus?.map(r => r.idmenu);
    this.fModal['menus'].setValue(roles);
  }

  onDeleteRole(id: string = '', name: string) {
    this._alertService.show({
      title: `¿Eliminar rol ${name}?`,
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteRole(id);
      }
    })
  }

  deleteRole(id: string) {
    return this._roleService.deleteRole(id).subscribe(() => {
      this._alertService.show({ 
        title: 'Eliminado', 
        text: 'El rol ha sido eliminado', 
        icon: 'success', 
        confirmButtonText: 'Aceptar' 
      });
      this.onListroles();
    })
  }

  ngOnDestroy(): void {
    this.roles$?.unsubscribe();
    this.addRole$?.unsubscribe();
  }

}
