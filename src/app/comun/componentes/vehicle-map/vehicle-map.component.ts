import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

declare const H: any;

@Component({
  selector: 'app-vehicle-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleMapComponent implements OnInit { 

  private platform: any;
  private map: any;
  private ui: any;
  address: string = '';
  suggestions: any[] = [];
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
    this.platform = new H.service.Platform({
      'apikey': 'drHZ5_qZgCOmDxje-eml8a_XR1JkYL7uVk0aTSVbM94'
    });

    // Configurar debounce con manejo de errores
    this.searchSubject.pipe(
      debounceTime(300),  // Espera 300ms después de la última entrada
      switchMap(searchText => this.performSearch(searchText).pipe(
        catchError(err => {
          console.error('Error occurred during search:', err);
          // Devuelve un array vacío si ocurre un error
          return of({ items: [] });
        })
      ))
    ).subscribe((data: any) => {
      this.suggestions = data.items;
    });
  }

  ngOnInit(): void {
    const defaultLayers = this.platform.createDefaultLayers();
    
    // Coordenadas centrales de Medellín, Colombia
    const medellinCenter = { lat: 6.2442, lng: -75.5812 };
    
    this.map = new H.Map(
      document.getElementById('map'),
      defaultLayers.vector.normal.map,
      {
        zoom: 12, // Nivel de zoom alto para Medellín
        center: medellinCenter
      }
    );

    const mapEvents = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // Restricción del área del mapa a Colombia
    const boundingBox = new H.geo.Rect(12.0, -79.0, -4.0, -66.0); // Ajusta según los límites de Colombia

    this.map.addEventListener('mapviewchangeend', () => {
      const center = this.map.getCenter();
      if (!boundingBox.containsPoint(center)) {
        // Si el centro está fuera de los límites, vuelve al centro válido más cercano
        const clampedCenter = boundingBox.getNearestPoint(center);
        this.map.setCenter(clampedCenter);
      }
    });
  }

  performSearch(searchText: string) {
    const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=6.2442,-75.5812&q=${searchText}&apikey=drHZ5_qZgCOmDxje-eml8a_XR1JkYL7uVk0aTSVbM94`;
    return this.http.get(url);
  }

  searchAddress(): void {
    if (this.address.length > 0) {
      this.searchSubject.next(this.address);
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: any): void {
    this.address = suggestion.address.label;
    this.suggestions = [];

    const location = {
      lat: suggestion.position.lat,
      lng: suggestion.position.lng
    };

    this.map.setCenter(location);
    this.map.setZoom(14);

    const marker = new H.map.Marker(location);
    this.map.addObject(marker);
  }

}
