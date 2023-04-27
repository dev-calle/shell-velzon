import { EventInput } from '@fullcalendar/angular';

let eventGuid = 0;
export function createEventId() {
    return String(eventGuid++);
}

const category = [
    {
        name: '--Select--',
        value: '',
        option: "selected"
    },
    {
        name: 'Danger',
        value: 'bg-soft-danger',
        option: ""
    },
    {
        name: 'Success',
        value: 'bg-soft-success',
        option: ""
    },
    {
        name: 'Primary',
        value: 'bg-soft-primary',
        option: ""
    },
    {
        name: 'Info',
        value: 'bg-soft-info',
        option: ""
    },
    {
        name: 'Dark',
        value: 'bg-soft-dark',
        option: ""
    },
    {
        name: 'Warning',
        value: 'bg-soft-warning',
        option: ""
    }
];
var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();
const calendarEvents: EventInput[] = [];

export { category, calendarEvents };
