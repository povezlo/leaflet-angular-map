import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {GetApiService} from './get-api.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    HttpClientModule
  ],
  providers: [GetApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
