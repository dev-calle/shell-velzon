import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SegurityLayoutComponent } from './segurity-layout.component';
import { TokenGuard } from 'src/app/guards/token.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';



const routes: Routes = [
  {
    path: '',
    component: SegurityLayoutComponent,
    canActivate: [TokenGuard, AuthGuard],
    loadChildren: () => import('./segurity-layout.routes.module').then( (m) => m.SegurityChildRoutingModule )
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegurityLayoutRoutingModule {}
