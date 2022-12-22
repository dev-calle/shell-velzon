import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SegurityLayoutComponent } from './layouts/segurity-layout/segurity-layout.component';
import { NotFoundComponent } from './helpers/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: SegurityLayoutComponent,
    loadChildren: () => import('./layouts/segurity-layout/segurity-layout.module').then( m => m.SegurityLayoutModule )
  },
  {
    path: 'segurity',
    // pathMatch: 'full',
    component: SegurityLayoutComponent,
    loadChildren: () => import('./layouts/segurity-layout/segurity-layout.module').then( m => m.SegurityLayoutModule )
  },
  {
    path: 'auth',
    // pathMatch: 'full',
    component: AuthLayoutComponent,
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
  },
  { path: '**', component: NotFoundComponent },

  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
