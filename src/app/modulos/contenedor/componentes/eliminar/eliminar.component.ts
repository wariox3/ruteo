import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NbButtonModule, NbIconModule, NbInputModule } from "@nebular/theme";
import { ContenedorService } from "../../servicios/contenedor.service";
import { Contenedor } from "@/interfaces/contenedor/contenedor.interface";
import { General } from "@/comun/clases/general";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-eliminar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
  ],
  templateUrl: "./eliminar.component.html",
  styleUrls: ["./eliminar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EliminarComponent extends General {
  @Input() data: { contenedor: Contenedor };
  @Input() cerrarModal: any;
  @Output() emitirEliminarContenedor: EventEmitter<any> = new EventEmitter();
  @Output() emitirCerrarModal: EventEmitter<any> = new EventEmitter();
  @ViewChild("inputNombre", { read: ElementRef })
  inputNombre: ElementRef<HTMLInputElement>;
  private formBuilder = inject(FormBuilder);
  private contenedorService = inject(ContenedorService);

  formularioEliminar = new FormGroup({
    nombre: new FormControl("", Validators.compose([Validators.required])),
  });

  cerrar() {
    this.emitirCerrarModal.emit(true);
  }

  eliminarContenedor() {
    if (
      this.formularioEliminar.get("nombre")?.value.trim() ===
      this.data.contenedor.subdominio.trim()
    ) {
      const contenedorId = this.data.contenedor.id;
      this.contenedorService
        .eliminarContenedor(contenedorId)
        .pipe(
          catchError(() => {
            this.emitirEliminarContenedor.emit(true);
            return of(null);
          })
        )
        .subscribe((response) => {
          this.emitirEliminarContenedor.emit(true);
          this.alerta.mensajaExitoso(
            "Se eliminó correctamente el contenedor.",
            "Guardado con éxito."
          );
        });
    }
  }
}
