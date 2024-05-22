import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { obtenerContenedorSeleccion } from "../../../redux/selectos/contenedor.selectors";

@Component({
  selector: "ngx-one-column-layout",
  styleUrls: ["./one-column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar
        *ngIf="menuVisible$ | async"
        class="menu-sidebar"
        tag="menu-sidebar"
        responsive
      >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  menuVisible$ = this.store.select(obtenerContenedorSeleccion);

  constructor(private store: Store) {}
}
