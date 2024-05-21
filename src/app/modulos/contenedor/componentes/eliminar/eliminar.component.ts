import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NbButtonModule, NbInputModule } from "@nebular/theme";
import { ContenedorService } from "../../servicios/contenedor.service";

@Component({
  selector: "app-eliminar",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NbInputModule, NbButtonModule],
  templateUrl: "./eliminar.component.html",
  styleUrls: ["./eliminar.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EliminarComponent {
  private formBuilder = inject(FormBuilder);
  private contenedorService = inject(ContenedorService)

  formularioEliminar = new FormGroup({
    nombre: new FormControl("", Validators.compose([Validators.required])),
  });

  eliminar(){
  }
}
