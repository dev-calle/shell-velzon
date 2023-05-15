import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NotFoundPageComponent } from '../../pages/not-found-page/not-found-page.component';
import { MenuComponent } from './menu/menu.component';
import { ActivityComponent } from './activity/activity.component';
import { ProjectComponent } from './project/project.component';
import { StateCatalogComponent } from './state-catalog/state-catalog.component';
import { NomenclatureComponent } from './nomenclature/nomenclature.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent
  },
  {
    path: 'consultas',
    children: [
      {
        path: 'reporte-general',
        component: ReportComponent
      }
    ]
  },
  {
    path: 'administracion',
    children: [
      {
        path: 'proyectos',
        component: ProjectComponent
      },
      {
        path: 'actividades',
        component: ActivityComponent
      },
      {
        path: 'usuarios',
        component: UserComponent
      },
      {
        path: 'roles',
        component: RoleComponent
      }
    ]
  },
  /*
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
    path: 'activity',
    component: ActivityComponent
  },
  {
    path: 'timesheet',
    component: CalendarComponent
  },
  {
    path: 'state-catalog',
    component: StateCatalogComponent
  },
  {
    path: 'nomenclature',
    component: NomenclatureComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurityChildRoutingModule {}
