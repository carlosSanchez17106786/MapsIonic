import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ModalMapComponent } from '../modal-map/modal-map.component';
import { ModalEditRecordatorioComponent } from '../modal-edit-recordatorio/modal-edit-recordatorio.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,ModalMapComponent,ModalEditRecordatorioComponent],
  providers:[NativeGeocoder,Geolocation]
})
export class HomePageModule {}
