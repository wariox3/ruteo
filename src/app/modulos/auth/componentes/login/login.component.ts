import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NbLoginComponent } from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from "@nebular/theme";
import { TokenService } from "../../servicios/token.service";
import { AuthService } from "../../servicios/auth.service";
import { Store } from "@ngrx/store";
import { usuarioIniciar } from "../../../../redux/actions/usuario.actions";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    ReactiveFormsModule,
  ],
})
export class NgxLoginComponent extends NbLoginComponent {
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private store = inject(Store);

  formulario = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ])
    ),
  });

  isLoading = false;

  enviar() {
    if (this.formulario.invalid) {
      return;
    }
    this.isLoading = true; // Mostrar loading
    this.authService.login(this.formulario.value).subscribe(
      (resultado: any) => {
        if (resultado.token) {
          let calcularTiempo = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          this.store.dispatch(
            usuarioIniciar({
              usuario: resultado.user,
            })
          );
          this.tokenService.guardar(resultado.token, calcularTiempo);
          this.router.navigate(["contenedor"]);
        }
      },
      (error) => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
