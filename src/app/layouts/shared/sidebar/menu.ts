import { MenuItem } from '../../../interfaces/sidebar.interfaces';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Timesheet',
    icon: 'ri-calendar-todo-fill',
    link: '/segurity/timesheet'
  },
  {
    id: 2,
    label: 'Consultas',
    icon: 'ri-bar-chart-fill',
    subItems: [
      {
        id: 3,
        label: 'Reporte General',
        link: '/segurity/general-report'
      }
    ]
  },
  {
    id: 4,
    label: 'Administración',
    icon: 'ri-settings-3-fill',
    subItems: [      
      {
        id: 5,
        label: 'Proyectos',
        link: '/segurity/project'
      },
      {
        id: 6,
        label: 'Actividades',
        link: '/segurity/activity'
      },           
      {
        id: 7,
        label: 'Usuarios',
        link: '/segurity/user'
      },
      {
        id: 8,
        label: 'Roles',
        link: '/segurity/role'
      }
    ]
  }
];
