import { MenuItem } from '../../../interfaces/sidebar.interfaces';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Timesheet',
    icon: 'ri-calendar-todo-fill',
    link: '/'
  },
  {
    id: 2,
    label: 'Consultas',
    icon: 'ri-bar-chart-fill',
    subItems: [
      {
        id: 3,
        label: 'Reporte General',
        link: '/consultas/reporte-general'
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
        link: '/administracion/proyectos'
      },
      {
        id: 6,
        label: 'Actividades',
        link: '/administracion/actividades'
      },           
      {
        id: 7,
        label: 'Usuarios',
        link: '/administracion/usuarios'
      },
      {
        id: 8,
        label: 'Roles',
        link: '/administracion/roles'
      }
    ]
  }
];
