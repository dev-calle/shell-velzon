import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { NotFoundComponent } from '../../helpers/not-found/not-found.component';
import { ProfileComponent } from '../../helpers/profile/profile.component';

const routes: Routes = [
  { path: '', component: UserComponent },
  { path: 'user', component: UserComponent },
  { path: 'role', component: RoleComponent },
  {
    path: 'profile',
    pathMatch: 'full',
    component: ProfileComponent
  },
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
export class SegurityLayoutRoutingModule {}
