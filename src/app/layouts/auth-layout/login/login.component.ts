import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { APP_NAME } from 'src/app/constants/app.constants';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/redux/interfaces/auth.interface';
import { loginSuccess } from 'src/app/redux/actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  title = APP_NAME;


  loginForm!: FormGroup;
  submitted = false;
  fieldTextType = false;

  login$?: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<AuthState>
   ) {

    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false, []]
    });

   }

  ngOnInit(): void {
    this.loadDataRemember();
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if(!this.loginForm.valid) return;
    this.submitted = false;
    this.login$ = this._authService.login(this.buildLoginForm()).subscribe(resp => {
      const { token, data: user } = resp;
      const rememberMe = this.f['rememberMe'].value;
      this._authService.setToken(token);
      this._authService.setUserData(user);
      this._authService.setRememberMe(rememberMe);
      this._store.dispatch(loginSuccess({ token, user }));
      this._router.navigate(['/']);
    });
  }

  buildLoginForm() {
    return {
      username: this.f['email'].value,
      password: this.f['password'].value
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  loadDataRemember() {
    const email = this._authService.getUserData()?.contenido;
    const rememberMe = this._authService.getRememberMe();
    this.f['email'].setValue(email);
    this.f['rememberMe'].setValue(rememberMe);
  }

  ngOnDestroy(): void {
    this.login$?.unsubscribe();
  }
}
