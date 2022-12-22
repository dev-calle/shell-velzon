import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotFoundComponent } from '../../helpers/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', component: NotFoundComponent },

  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthLayoutRoutingModule {}
