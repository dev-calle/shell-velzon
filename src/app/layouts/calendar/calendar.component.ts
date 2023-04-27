import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

// Calendar option
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/angular';
// BootStrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
// Sweet Alert
import Swal from 'sweetalert2';

import { category, calendarEvents, createEventId } from './data';
import { DatePipe } from '@angular/common';

import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';

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
  editEvent: any;
  formEditData!: UntypedFormGroup;
  newEventDate: any;
  category!: any[];
  submitted = false;

  // Calendar click Event
  formData!: UntypedFormGroup;
  @ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
  @ViewChild('modalShow') modalShow !: TemplateRef<any>;

  constructor(private modalService: NgbModal, private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Apps' },
      { label: 'Calendar', active: true }
    ];

    this.createForm();

    this._fetchData();
  }

  createForm() {
    // Validation
    this.formData = this.formBuilder.group({
      date: ['', Validators.required],
      project: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      hour: [1, [Validators.required, Validators.min(1)]],
      observation: ['', []],
    });
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    // Event category
    this.category = category;

    // Calender Event Data
    this.calendarEvents = calendarEvents;
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
    initialEvents: calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: "es",
    locales: [esLocale],
    plugins: [listPlugin]
  };
  currentEvents: EventApi[] = [];

  /**
   * Event add modal
   */
  openModal(event?: any) {
    this.newEventDate = event,
      this.formBuilder.group({
        editDate: this.newEventDate.date
      })
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
      editDate: this.editEvent.start,
      editProject: this.editEvent.extendedProps['project'],
      editActivity: this.editEvent.extendedProps['activity'],
      editHour: this.editEvent.extendedProps['hour'],
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
      title: 'Event has been saved',
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
      title: 'Event has been Updated',
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
      const date = this.formData.get('date')!.value
      const project = this.formData.get('project')!.value;
      const activity = this.formData.get('activity')!.value;
      const hour = this.formData.get('hour')!.value;
      const observation = this.formData.get('observation')!.value;

      const calendarApi = this.newEventDate.view.calendar;

      const event = {
        id: createEventId(),
        title: 'Project',
        start: date,
        end: date,    
        project,    
        activity,
        hour,
        observation,
        className: 'bg-soft-info' + ' ' + 'text-white'
      };
      calendarApi.addEvent(event);
      this.position();
      this.createForm();
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  /**
   * save edit event data
   */
  editEventSave() {

    const editDate = this.formEditData.get('editDate')!.value
    const editProject = this.formEditData.get('editProject')!.value;
    const editActivity = this.formEditData.get('editActivity')!.value;
    const editHour = this.formEditData.get('editHour')!.value;
    const editObservation = this.formEditData.get('editObservation')!.value;

    this.editEvent.setStart(editDate);
    this.editEvent.setEnd(editDate);
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
      title: 'Project',
      start: editDate,    
      project: editProject,    
      activity: editActivity,
      hour: editHour,
      observation: editObservation,
      className: 'bg-soft-info' + ' ' + 'text-white'
    };
    this.calendarEvents[editId] = editEvent;
    this.Editposition();
    this.createFormEdit();
    this.modalService.dismissAll();
  }

  /**
   * Delete-confirm
   */
  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.deleteEventData();
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
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


}
