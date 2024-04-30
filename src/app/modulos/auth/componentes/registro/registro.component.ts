import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbRegisterComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'ngx-register',
  templateUrl: './registro.component.html',
  standalone : true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
  ]
})
export class NgxRegistroComponent extends NbRegisterComponent {

  private authService = inject(AuthService);

  enviar(){
    this.authService.registro({
      "email":"maestradaz3@gmail.com",
      "password":"123456789",
      "celular":"3205015059"
  }).subscribe(
    resultado => {
      console.log(resultado)
    }
  )
  }

}