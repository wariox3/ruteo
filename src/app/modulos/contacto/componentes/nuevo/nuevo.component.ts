import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { NbCardModule } from "@nebular/theme";
import { FormularioComponent } from "../formulario/formulario.component";
import { General } from "../../../../comun/clases/general";
import { ContactoService } from "../../servicios/contacto.service";

@Component({
  selector: "app-nuevo",
  standalone: true,
  imports: [CommonModule, NbCardModule, FormularioComponent],
  templateUrl: "./nuevo.component.html",
  styleUrls: ["./nuevo.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoComponent extends General implements OnInit {
  private contactoService = inject(ContactoService);

  ngOnInit() {}

  enviarFormulario(formulario: any) {
    this.contactoService.guardarContacto(formulario).subscribe((respuesta) => {
      this.alerta.mensajaExitoso('Se ha creado el contacto exitosamente.', 'Guardado con éxito.')
      // this.router.navigate(['/contacto/detalle']);
    });
  }
}
