import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NotFoundPageComponent } from '../../pages/not-found-page/not-found-page.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: '/user',
    component: UserComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'role',
    component: RoleComponent
  },
  {
    path: 'profile',
    component: ProfilePageComponent
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurityChildRoutingModule {}
