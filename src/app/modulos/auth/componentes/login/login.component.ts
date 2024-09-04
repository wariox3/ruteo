import { RespuestaLogin } from "@/interfaces/auth/auth.interface";
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
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
} from "@nebular/theme";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { usuarioIniciar } from "../../../../redux/actions/usuario.actions";
import { AuthService } from "../../servicios/auth.service";
import { TokenService } from "../../servicios/token.service";

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
    NbFormFieldModule,
    NbIconModule,
  ],
})
export class NgxLoginComponent extends NbLoginComponent {
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private store = inject(Store);

  public isLoading: boolean = false;
  public mostrarClave: boolean = false;
  public tipoClaveInput: "text" | "password" = "password";

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

  toggleMostrarClave() {
    this.tipoClaveInput =
      this.tipoClaveInput === "password" ? "text" : "password";
  }

  enviar() {
    if (this.formulario.invalid) {
      return;
    }
    this.isLoading = true; // Mostrar loading
    this.authService
      .login(this.formulario.value)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((resultado: RespuestaLogin) => {
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
      });
  }
}
