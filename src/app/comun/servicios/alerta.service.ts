import { Injectable, inject } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private alert = inject(NbToastrService)

  mensajeError(text: string, title: string,) {
    this.alert.show(text, title,{
      status: 'danger',
      destroyByClick: true,
      duration: 5000,
      hasIcon: false,
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
      preventDuplicates: false,
    });
  }

  async mensajaExitoso(text: string, title: string,) {
    this.alert.show(text, title,{
      status: 'success',
      destroyByClick: true,
      duration: 5000,
      hasIcon: false,
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
      preventDuplicates: false,
    });
  }

}
