import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

// Calendar option
import { CalendarOptions, EventClickArg, EventApi, DatesSetArg } from '@fullcalendar/angular';
// BootStrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
// Sweet Alert
import Swal from 'sweetalert2';

import { calendarEvents, createEventId } from './data';
import { DatePipe } from '@angular/common';

import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import { ProjectService } from 'src/app/services/project.service';
import { ActivityService } from 'src/app/services/activity.service';
import { forkJoin, map } from 'rxjs';
import { formattedFirstDayOfMonth, formattedLastDayOfMonth, nonEmptyArrayValidator } from 'src/app/utils';
import { TimesheetService } from 'src/app/services/timesheet.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

/**
 * Calendar Component
 */
export class CalendarComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // calendar
  calendarEvents!: any[];
  currentIdEvents: string[] = [];
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  submitted = false;

  // Calendar click Event
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;

  projects = [];
  activities = [];
  formSearch!: UntypedFormGroup;

  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe, private _projectService: ProjectService,
    private _activityService: ActivityService, private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }
    ];

    this.createFormSearch();
    this.createForm();

    this.loadDataSelects();
  }

  createFormSearch() {
    this.formSearch = this.formBuilder.group({
      project: [[], [Validators.required, nonEmptyArrayValidator]],
      activity: [[], [Validators.required, nonEmptyArrayValidator]]
    })
  }

  onSearch() {
    if (this.formSearch.invalid) {
      this.formSearch.markAllAsTouched();
      return;
    }
    console.log(this.formSearch.value);
  }

  createForm() {
    // Validation
    this.formData = this.formBuilder.group({
      date: [{ value: null, disabled: true }, Validators.required],
      project: [null, [Validators.required]],
      activity: [null, [Validators.required]],
      hour: [1, [Validators.required, Validators.min(1)]],
      observation: ['', []],
    });
  }

  /**
   * Fetches the data
   */
  private _fetchData(event: DatesSetArg) {
    const { startStr, endStr } = event;
    this.timesheetService.getEvents('1', startStr.slice(0,10), endStr.slice(0,10))
      .pipe(
        map(resp => resp.data.filter(event => !this.currentIdEvents.includes(event.idtimesheet)))
      )
      .subscribe(resp => {
        this.calendarEvents = resp.map(ts => {
          return {
            id: ts.idtimesheet,
            title: `[${ts.proyecto}] ${ts.actividad}`,
            start: ts.fecha.slice(0, 10),
            end: ts.fecha.slice(0, 10),
            project: ts.idproyecto,
            activity: ts.idactividad,
            hour: ts.hora,
            observation: ts.observacion
          }
        });
        this.calendarOptions.events = this.calendarEvents;
      })
  }

  /***
  * Calender Set
  */
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'dayGridMonth,listWeek',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: "dayGridMonth",
    themeSystem: "bootstrap",
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: "es",
    locales: [esLocale],
    plugins: [listPlugin],
    datesSet: this._fetchData.bind(this),
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5], // lunes a viernes
      startTime: '09:00', // hora de inicio de trabajo
      endTime: '18:00', // hora de finalización de trabajo
    }
  };
  currentEvents: EventApi[] = [];

  /**
   * Event add modal
   */
  openModal(event?: any) {
    console.log(event)
    this.createForm();
    const { date } = event;
    this.newEventDate = event,
      this.form['date'].setValue(date);
    this.modalService.open(this.modalShow, { centered: true });
  }

  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;
    this.createFormEdit();
    this.modalService.open(this.editmodalShow, { centered: true });
  }

  createFormEdit() {
    this.formEditData = this.formBuilder.group({
      editDate: [{ value: this.editEvent.start, disabled: true }],
      editProject: [ this.editEvent.extendedProps['project'], [Validators.required]],
      editActivity: [ this.editEvent.extendedProps['activity'], [Validators.required]],
      editHour: [ this.editEvent.extendedProps['hour'], [Validators.required, Validators.min(1)]],
      editObservation: this.editEvent.extendedProps['observation'],
    });
  }

  /**
   * Events bind in calander
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      category: '',
      hour: '',
      observation: '',
      date: '',
      start: '',
      end: ''
    });
    this.modalService.dismissAll();
  }

  /***
   * Model Position Set
   */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'El registro ha sido guardado',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /***
   * Model Edit Position Set
   */
  Editposition() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'El registro ha sido actualizado',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Event Data Get
   */
  get form() {
    return this.formData.controls;
  }

  /**
   * Save the event
   */
  saveEvent() {
    if (this.formData.valid) {
      const date = this.formData.get('date')!.value;
      const project = this.formData.get('project')!.value;
      const activity = this.formData.get('activity')!.value;
      const hour = this.formData.get('hour')!.value;
      const observation = this.formData.get('observation')!.value;
      const body = {
        fecha: date.toISOString().slice(0, 10),
        hora: hour,
        observacion: observation,
        projecto: project,
        actividad: activity
      }
      this.timesheetService.addTimesheet(body).subscribe((resp) => {
        const calendarApi = this.newEventDate.view.calendar;
        const event = {
          id: resp.data.idtimesheet,
          title: `[${this.loadDescriptionCombox(this.projects, project)}] ${this.loadDescriptionCombox(this.activities, activity)}`,
          start: date,
          end: date,
          project,
          activity,
          hour,
          observation,
        };
        calendarApi.addEvent(event);
        this.currentIdEvents.push(event.id);
        this.position();
        this.createForm();
        this.modalService.dismissAll();
        this.submitted = false;
      });
    } else {
      this.submitted = true;
    }
  }

  /**
   * save edit event data
   */
  editEventSave() {
    if (!this.formEditData.valid) {
      this.formEditData.markAllAsTouched();
      return;
    }

    const editDate = this.formEditData.get('editDate')!.value
    const editProject = this.formEditData.get('editProject')!.value;
    const editActivity = this.formEditData.get('editActivity')!.value;
    const editHour = this.formEditData.get('editHour')!.value;
    const editObservation = this.formEditData.get('editObservation')!.value;

    const body = {
      fecha: editDate.toISOString().slice(0, 10),
      hora: editHour,
      observacion: editObservation,
      projecto: editProject,
      actividad: editActivity,
    }

    this.timesheetService.editTimesheet(this.editEvent.id, body).subscribe(() => {
      const title = `[${this.loadDescriptionCombox(this.projects, editProject)}] ${this.loadDescriptionCombox(this.activities, editActivity)}`;
      this.editEvent.setProp('title', title);
      this.editEvent.setExtendedProp('project', editProject);
      this.editEvent.setExtendedProp('activity', editActivity);
      this.editEvent.setExtendedProp('hour', editHour);
      this.editEvent.setExtendedProp('observation', editObservation);
  
      const editId = this.calendarEvents.findIndex(
        (x) => x.id + '' === this.editEvent.id + ''
      );
      const editEvent = {
        ...this.editEvent,
        id: this.editEvent.id,
        title: title,
        start: editDate,
        end: editDate,
        project: editProject,
        activity: editActivity,
        hour: editHour,
        observation: editObservation,
      };
      this.calendarEvents[editId] = editEvent;
      this.Editposition();
      this.createFormEdit();
      this.modalService.dismissAll();
    });    
  }

  /**
   * Delete-confirm
   */
  confirm() {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminarlo!',
    }).then((result) => {
      if (result.value) {
        this.timesheetService.deleteTimesheet(this.editEvent.id).subscribe(() => {
          this.deleteEventData();
          Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
        })
      }
    });
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.dismissAll();
  }

  loadDataSelects() {
    const params = { limit: '100', page: '1', filter: '', order: '' };
    const projects$ = this._projectService.getProjects(params.limit, params.page, params.filter, params.order);
    const activities$ = this._activityService.getActivities(params.limit, params.page, params.filter, params.order);
    forkJoin([projects$, activities$]).subscribe(resp => {
      this.projects = resp[0].data.map(r => { return { id: r.idproyecto, name: r.nombre } }) as [];
      this.activities = resp[1].data.map(r => { return { id: r.idactividad, name: r.nombre } }) as [];
    });
  }

  loadDescriptionCombox(list: any[], id: string): string {
    return list.find((i: any) => i.id === id).name ?? '';
  }
}
