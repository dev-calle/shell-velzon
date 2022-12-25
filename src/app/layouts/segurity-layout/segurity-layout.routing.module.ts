import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { NotFoundPageComponent } from '../../pages/not-found-page/not-found-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SegurityLayoutComponent } from './segurity-layout.component';



const routes: Routes = [
  {
    path: 'segurity',
    component: SegurityLayoutComponent,
    loadChildren: () => import('./segurity-layout.routes.module').then( (m) => m.SegurityChildRoutingModule )
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurityLayoutRoutingModule {}
