import { ChangeDetectorRef, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

export class General {

  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected changeDetectorRef = inject(ChangeDetectorRef);

  constructor() { }

}
