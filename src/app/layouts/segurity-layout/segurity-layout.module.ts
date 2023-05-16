import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedLayoutModule } from '../shared/shared-layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { SegurityLayoutComponent } from './segurity-layout.component';
import { SegurityLayoutRoutingModule } from './segurity-layout.routing.module';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';

import { SwiperModule } from 'swiper/angular';
import { NgbNavModule, NgbDropdownModule, NgbAccordionModule, NgbTooltipModule, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfilePageComponent } from './profile-page/profile-page.component';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Load Icon
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { RouterModule } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MenuComponent } from './menu/menu.component';
import { ActivityComponent } from './activity/activity.component';
import { EstadoPipe } from 'src/app/pipes/estado.pipe';
import { ProjectComponent } from './project/project.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { StateCatalogComponent } from './state-catalog/state-catalog.component';
import { NomenclatureComponent } from './nomenclature/nomenclature.component';

import { FlatpickrModule } from 'angularx-flatpickr';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { DatePipe } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportComponent } from './report/report.component';
import { ClientComponent } from './client/client.component';
import { EstadoProjectPipe } from 'src/app/pipes/estado-project.pipe';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    SegurityLayoutComponent,
    UserComponent,
    RoleComponent,
    ProfilePageComponent,
    MenuComponent,
    ActivityComponent,
    ProjectComponent,
    TimesheetComponent,
    StateCatalogComponent,
    NomenclatureComponent,
    CalendarComponent,
    ReportComponent,
    ClientComponent,
    EstadoPipe,
    EstadoProjectPipe
  ],
  imports: [
    CommonModule,
    SharedLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    TranslateModule,
    SegurityLayoutRoutingModule,

    NgbNavModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbModalModule,
    FeatherModule.pick(allIcons),

    RouterModule,
    NgSelectModule,
    FullCalendarModule,
    FlatpickrModule.forRoot()
  ],
  providers: [LocalStorageService, DatePipe]
})
export class SegurityLayoutModule {

  constructor() {
    defineElement(lottie.loadAnimation);
  }


}
