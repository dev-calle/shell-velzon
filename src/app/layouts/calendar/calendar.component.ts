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

    // Validation
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      location: ['', [Validators.required]],
      desription: ['', [Validators.required]],
      date: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });

    this._fetchData();
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
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
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
    eventsSet: this.handleEvents.bind(this)
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

    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory: clickInfo.event.classNames[0],
      editlocation: clickInfo.event.extendedProps['location'],
      editDescription: clickInfo.event.extendedProps['desription'],
      editDate: clickInfo.event.start,
      editStart: clickInfo.event.start,
      editEnd: clickInfo.event.end
    });
    this.modalService.open(this.editmodalShow, { centered: true });
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
      location: '',
      desription: '',
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
      const className = this.formData.get('category')!.value;
      const title = this.formData.get('title')!.value;
      const location = this.formData.get('location')!.value;
      const desription = this.formData.get('desription')!.value
      const date = this.formData.get('date')!.value
      const starttime = this.formData.get('start')!.value;
      const endtime = this.formData.get('end')!.value;
      const yy = new Date(date).getFullYear();
      const mm = new Date(date).getMonth() + 1;
      const dd = new Date(date).getDate();

      const start = new Date(mm + '-' + dd + '-' + yy);
      start.setHours((starttime.split(' ')[0]).split(':')[0]);
      start.setMinutes((starttime.split(' ')[0]).split(':')[1]);

      const end = new Date(mm + '-' + dd + '-' + yy);
      end.setHours((endtime.split(' ')[0]).split(':')[0]);
      end.setMinutes((endtime.split(' ')[0]).split(':')[1]);
      const calendarApi = this.newEventDate.view.calendar;

      calendarApi.addEvent({
        id: createEventId(),
        title,
        date,
        start,
        end,
        location,
        desription,
        className: className + ' ' + 'text-white'
      });
      this.position();
      this.formData = this.formBuilder.group({
        title: '',
        category: '',
        location: '',
        desription: '',
        date: '',
        start: '',
        end: ''
      });
      this.modalService.dismissAll();
    } else {
    }
    this.submitted = true;
  }

  /**
   * save edit event data
   */
  editEventSave() {

    const editTitle = this.formEditData.get('editTitle')!.value;
    const editCategory = this.formEditData.get('editCategory')!.value;

    const editId = this.calendarEvents.findIndex(
      (x) => x.id + '' === this.editEvent.id + ''
    );

    this.editEvent.setProp('title', editTitle);
    this.editEvent.setProp('classNames', editCategory);

    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id: this.editEvent.id,
      classNames: editCategory,
    };
    this.Editposition();
    this.formEditData = this.formBuilder.group({
      editTitle: '',
      editCategory: '',
    });
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
