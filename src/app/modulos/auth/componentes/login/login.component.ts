import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbLoginComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
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
export class NgxLoginComponent extends NbLoginComponent implements OnInit {

  private authService = inject(TokenService);

  ngOnInit(): void {
    let calcularTiempo = new Date(
      new Date().getTime() + 3 * 60 * 60 * 1000
    );
    this.authService.guardar('elToken', calcularTiempo)
  }

}