import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbRegisterComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { AuthService } from '../../servicios/auth.service';
import {ReactiveFormsModule} from '@angular/forms';
import {FormControl} from '@angular/forms';

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
    ReactiveFormsModule
  ]
})
export class NgxRegistroComponent extends NbRegisterComponent {

  private authService = inject(AuthService);

  nombreCompleto = new FormControl('');

  enviar(){
    this.authService.login({
      "username":"maestradaz3@gmail.com",
      "password":"123456789"
  }).subscribe(
    resultado => {
      console.log(resultado)
    }
  )
  }



}