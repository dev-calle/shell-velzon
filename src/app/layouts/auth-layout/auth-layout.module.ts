import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutingModule } from './auth-layout.routing.module';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthLayoutRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthLayoutModule { }
