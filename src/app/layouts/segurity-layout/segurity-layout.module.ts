import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedLayoutModule } from '../shared/shared-layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { SegurityLayoutComponent } from './segurity-layout.component';
import { SegurityLayoutRoutingModule } from './segurity-layout.routing.module';

@NgModule({
  declarations: [
    SegurityLayoutComponent,
  ],
  imports: [
    CommonModule,
    SharedLayoutModule,
    ReactiveFormsModule,
    TranslateModule,
    SegurityLayoutRoutingModule
  ],
})
export class SegurityLayoutModule { }
