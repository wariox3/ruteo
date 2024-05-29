import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
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
      }
    ],
  },
  {
    title: 'Utilidad',
    icon: 'pantone-outline',
    children: [
      {
        icon: 'file-add-outline',
        title: 'Importar guias',
        link: '',
      }
    ],
  }
];
