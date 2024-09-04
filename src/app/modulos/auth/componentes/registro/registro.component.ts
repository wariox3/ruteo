import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NbRegisterComponent } from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule
} from "@nebular/theme";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlertaService } from "../../../../comun/servicios/alerta.service";
import { AuthService } from "../../servicios/auth.service";
import { RespuestaRegistro } from "@/interfaces/auth/auth.interface";

type TipoClaveInput = "text" | "password";
type TipoInput = "clave" | "confimarClave";

@Component({
  selector: "ngx-register",
  templateUrl: "./registro.component.html",
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
export class NgxRegistroComponent extends NbRegisterComponent {
  private authService = inject(AuthService);
  private alerta = inject(AlertaService);
  public tipoClaveInput: TipoClaveInput = "password";
  public tipoConfirmarClaveInput: TipoClaveInput = "password";
  registrando: boolean = false;

  validarContrasena(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const clave = control.root.get("password")?.value;
      const confirmarClave = control.value;

      return clave === confirmarClave ? null : { clavesDiferentes: true };
    };
  }

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
    confirmarContrasena: new FormControl("", [
      Validators.required,
      this.validarContrasena(),
    ]),
    terminoCondicion: new FormControl(
      "",
      Validators.compose([Validators.requiredTrue])
    ),
  });

  toggleMostrarClave(tipo: TipoInput) {
    switch (tipo) {
      case "clave":
        this.tipoClaveInput =
          this.tipoClaveInput === "password" ? "text" : "password";
        break;
      case "confimarClave":
        this.tipoConfirmarClaveInput =
          this.tipoConfirmarClaveInput === "password" ? "text" : "password";
    }
  }

  enviar() {
    this.registrando = true;
    this.authService
      .registro(this.formulario.value)
      .pipe(
        catchError(() => {
          this.registrando = false;
          return of(null);
        })
      )
      .subscribe((resultado: RespuestaRegistro) => {
        if (resultado.usuario.id) {
          this.alerta.mensajaExitoso(
            "Se ha creado el usuario exitosamente.",
            "Guardado con éxito."
          );
          this.router.navigate(["auth/login"]);
        }
      });
  }
}
