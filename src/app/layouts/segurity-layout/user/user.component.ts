import { Component, OnDestroy, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { User } from 'src/app/interfaces/users.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') myModal!: ElementRef;

  formSearch!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  total = 0;
  users$?: Subscription;
  users: User[] = [];

  roles = [
    { id: '9ce25d5c-3a17-4443-b7f9-1540231b4ece', name: 'Integration' }
  ];
  selectedValues: string[] = [];
  formAddUser!: FormGroup;

  private searchSubject = new Subject<string>();

  constructor(
    private _userService: UserService, 
    private _fb: FormBuilder,
    public _modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.createForm();
    this.createFormAddUser();
    this.onSearchFilter();
    this.onListUsers();
  }

  get f() { return this.formSearch.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
    })
  }

  createFormAddUser() {
    this.formAddUser = this._fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      content: [null, []],
      roles: [[], []]
    })
  }

  onListUsers() {
    const limit = this.itemsPerPage.toString();
    const page = this.currentPage.toString();
    this.users$ = this._userService.getUsers(limit, page, '').subscribe(resp => {
      this.users = resp.data;
      this.total = resp.total;
    });
  }

  onSearchFilter() {
    this.searchSubject.pipe(debounceTime(1000))
      .subscribe((value) => {
        if (value && value.length > 0) {
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
    this.users$ = this._userService.getUsers('', '', value).subscribe(resp => {
      this.users = resp.data;
      this.total = resp.total;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.itemsPerPage);
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.onListUsers();
  }

  open(content: TemplateRef<any>) {
    this._modalService.open(content);
  }

  ngOnDestroy(): void {
    this.users$?.unsubscribe();
  }
}
