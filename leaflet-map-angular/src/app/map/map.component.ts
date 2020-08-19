import {Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
import {GetApiService} from '../get-api.service';
import 'leaflet.markercluster';

// FIXED BUG. Configure Leaflet to use the correct URLs as customer marker images
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const center = [28.644800, 77.216721];
const zoom = 5;
// DEFINE AND SET ICON DEFAULT
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // ARRAY OF WHICH CONSISTS OF OBJECTS WITH A LIST OF CITIES
  areaCities = [];
  markers = [];
  // DEFINE MAP
  map: Leaflet.Map;
  // ARRAY WITH REMOVED MARKERS AND SELECTED ELEMENTS
  removedMarkers: [] = [];
  selectedElements: any[] = [];

  constructor(private apiService: GetApiService) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.map = Leaflet.map('map').setView(center, zoom).fitWorld();
    // HERE WE SPECIFY 16 AS THE MAXIMUM ZOOM WHEN SETTING THE MAP VIEW AUTOMATICALLY
    this.map.locate({setView: true, maxZoom: 16});
    // SET LAYER
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);
    // ADD A MARKER IN THE DETECTED LOCATION, SHOWING ACCURACY IN A POPUP
    Marker.prototype.options.icon = iconDefault;
    this.map.on('locationFound', this.onLocationFound);
    // GET API CITY OF UKRAINE
    this.apiService.getArea().subscribe(res => {
      this.areaCities.push(...res[0].regions);
    });
  }

  // SET MARKER
  // tslint:disable-next-line:typedef
  setMarker(e) {
    this.removeMarkers(e);
    //  SET MARKER
    this.areaCities.forEach(region => {
        if (e.target.innerHTML.includes(region.name)) {
          if (e.target.id.toUpperCase() !== region.name.toUpperCase()) {
            region.cities.forEach(city => {
              this.markers.push(Leaflet.marker([city.lat, city.lng], {id: region.name.toUpperCase()})
                .addTo(this.map)
                .bindPopup(city.name)
                .openPopup());
            });
            e.target.id = region.name.toUpperCase();
          } else {
            e.target.id = '';
          }
        }
      });
  }
  // GET CITY
  // tslint:disable-next-line:typedef
  getCity(e, areaCities) {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
      this.map.removeControl(marker);
    });
    areaCities.forEach(city => {
      if (city.name.toUpperCase() === e.target.textContent.toUpperCase()) {
        const marker = Leaflet.marker([city.lat, city.lng], {
          id: city.name.toUpperCase(),
          active: true,
          riseOnHover: true,
          draggable: true
        }).addTo(this.map);
        marker.bindPopup(city.name)
          // ADD EVENT LISTENER ON MARKER
          .on('click', () => {
            this.map.removeLayer(marker);
            this.map.removeControl(marker);
            // @ts-ignore
            this.removedMarkers.push(marker.options.id);
            // ADD A CLASS .SELECTED TO THE ELEMENTS WE HAVE SELECTED
            e.target.classList.toggle('selected');
          })
          .openPopup();
        this.markers.push(marker);
      }
    });
    // ADD TO ELEMENTS WE HAVE SELECTED
    this.selectedElements.push(e.target);
  }
  // REMOVE MARKERS OFF MAP
  // tslint:disable-next-line:typedef
  removeMarkers(e) {
    this.markers.forEach((marker) => {
      if (marker.options.id.toUpperCase() === e.target.innerText.toUpperCase()) {
        this.map.removeLayer(marker); // remove
        this.map.removeControl(marker); // remove
      }
    });
  }
  // SHOWING ACCURACY IN A POPUP
  // tslint:disable-next-line:typedef
  onLocationFound(e) {
    const radius = e.accuracy;
    Leaflet.marker(e.latlng).addTo(this.map)
      .bindPopup('Вы находитесь в пределах ' + radius + ' метров от этой точки').openPopup();
    Leaflet.circle(e.latlng, radius).addTo(this.map);
  }
   // ACCORDION
  // tslint:disable-next-line:typedef
  accordion(e: Event) {
    const event = (e.target as HTMLInputElement);
    if (event.className === 'accordion') {
      const panel = event.nextElementSibling;
      panel.classList.toggle('panel');
      e.stopPropagation();
    } else {
      return event.parentElement.classList.toggle('active');
    }
  }
   // REMOVE MARKER OFF RIGHT BLOCK
  // tslint:disable-next-line:typedef
  removeMarkerRightBlock(id: any) {
    this.markers.forEach(marker => {
      if (marker.options.id.toUpperCase() === id) {
        marker.options.active = false;
      }
    });
    this.selectedElements.forEach(selected => {
      if (selected.innerHTML.toUpperCase() === id) {
        selected.classList.remove('selected');
      }

        // .classList.remove('selected')

    });
    // @ts-ignore
    this.removedMarkers = this.removedMarkers.filter(marker => marker !== id);
  }

}
