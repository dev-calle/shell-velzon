import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { User } from 'src/app/interfaces/users.interface';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  users: User[] = [];

  private searchSubject = new Subject<string>();

  constructor(private _userService: UserService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.onSearchFilter();
    this.onListUsers();
  }

  get f() { return this.formSearch.controls; }

  createForm() {
    this.formSearch = this._fb.group({
      filter: [null, []]
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
    this.searchSubject
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        if(value && value.length > 0) {
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

  ngOnDestroy(): void {
    this.users$?.unsubscribe();
  }
}
