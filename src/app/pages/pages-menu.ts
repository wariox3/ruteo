import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Inicio',
    icon: 'home-outline',
    link: 'dashboard',
  },
  {
    icon: 'activity-outline',
    title: 'Rutear',
    link: 'visita/utilidad/rutear',
  },
  {
    icon: 'car-outline',
    title: 'Tráfico',
    link: 'trafico',
  },
  {
    title: 'Movimiento',
    icon: 'book-outline',
    children: [
      {
        icon: 'file-text-outline',
        title: 'Visita',
        link: 'visita/movimiento/lista',
      },
      {
        icon: 'file-text-outline',
        title: 'Despacho',
        link: 'despacho/movimiento/lista',
      },

    ],
  },
  {
    title: 'Administración',
    icon: 'edit-2-outline',
    children: [
      {
        icon: 'car-outline',
        title: 'Vehículos',
        link: 'administracion/vehiculo',
      },
      {
        icon: 'people-outline',
        title: 'Contactos',
        link: 'administracion/contacto',
      },
      {
        icon: 'pin-outline',
        title: 'Franja',
        link: 'administracion/franja',
      }
    ],
  },
  {
    title: 'Utilidad',
    icon: 'pantone-outline',
    children: [
      {
        icon: 'file-add-outline',
        title: 'Importar visitas',
        link: 'visita/utilidad/importar',
      }
    ],
  }
];
