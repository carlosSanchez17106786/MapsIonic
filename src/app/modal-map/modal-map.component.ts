import { Component, OnInit } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalEditRecordatorioComponent } from '../modal-edit-recordatorio/modal-edit-recordatorio.component';

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss'],
})
export class ModalMapComponent  implements OnInit {
  public lastItem: number = 0;
  public recordatorios:any[] = [];
  public name: string;
  public latitude: any = 0; //latitude
  public longitude: any = 0; //longitude
  public address: string;
  public nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
  };
  private map!:any;
  private markPoint!:any;
  private acutalPosition!:any;  
  public fullAdress:string = '';
  public pointForm:FormGroup = this.fb.group({
    Nombre: ['',Validators.required],
    Calle:[''],
    NumExt:[''],
    NumInt:[''],
    Mz:[''],
    Delegacion:[''],
    Estado:[''],
    Colonia:[''],
    Longitud:[''],
    Latitud:[''],
    Orden:[''],
    FullAdress:['',Validators.required]
  });
  constructor(
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public fb:FormBuilder
    ) {}

  ngOnInit() {
    this.pointForm.controls['Orden'].setValue(this.lastItem);
  }
  ionViewDidEnter():any{
    this.addMap();
   }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel','modalMaps');
  }

  confirm() {
    this.pointForm.value;
    const Recordatorios = {
      Recordatorios: this.recordatorios
    };
    const data = {...this.pointForm.value, ...Recordatorios};
    return this.modalCtrl.dismiss(data, 'confirm','modalMaps');
  }

  
  //abrirmos el modal para crear recordatorios
  public async openAgregarRecordatorio(){
    const modal = await this.modalCtrl.create({
      component: ModalEditRecordatorioComponent,
      componentProps: { 
        lastId: this.recordatorios.length + 1,
      },
      id:'modalEditRecordatorio',

    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.recordatorios.push(data);
    }
  }
  
  //borramos el recordatorio de la lista
  public deleteRecordatorio(recordatorio:any):void{
     this.recordatorios = this.recordatorios.filter((reco:any) => reco != recordatorio);
  }

  //agregamos el mapa 
  public addMap():void{
    this.map = L.map('mapId').setView([19.38784467889534, -99.13545912664559],12);
    this.map.doubleClickZoom.disable(); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:
       '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    const iconMarket = L.icon({
      iconUrl: 'assets/icon/location.png',  
      iconSize:     [38, 50],
      shadowSize:   [18, 50],
      iconAnchor:   [19, 55],
      shadowAnchor: [5, 60],
      popupAnchor:  [0, -50]

  });
     const popUp = `<p>Ubicación</p>`;
     this.markPoint = L.marker([19.38784467889534, -99.13545912664559]);
    this.markPoint.bindPopup(popUp);
    this.markPoint.setIcon(iconMarket);

    this.map.addLayer(this.markPoint);

    this.map.on('dblclick',(event:any)=>{
      if(this.markPoint !== null){
        this.map.removeLayer(this.markPoint);
      }
      this.markPoint = L.marker([event.latlng.lat , event.latlng.lng],{icon:iconMarket}).bindPopup(popUp).addTo(this.map);
      this.getAddress(event.latlng.lat , event.latlng.lng);
    });
  }

  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp:any) => {
      const myUbicationIcon = L.icon({
        iconUrl: 'assets/icon/myLocation.png',  
        iconSize:     [38, 50],
        // shadowSize:   [18, 50],
        iconAnchor:   [19, 55],
        shadowAnchor: [5, 60],
        popupAnchor:  [0, -50]
  
    });
    const popUpMyLocation = `<p>Tú estás aquí</p>`;

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      if(this.acutalPosition!== null && this.acutalPosition!== undefined){
        this.map.removeLayer(this.acutalPosition);
      }
      this.acutalPosition = L.marker([this.latitude , this.longitude],{icon:myUbicationIcon}).bindPopup(popUpMyLocation).addTo(this.map);
     
    
     }).catch((error:any) => {
       console.log('Error getting location', error);
     });
  }

  public setAdressToFrom(response:any):void {
    const {
      thoroughfare,//calle o avenida
      subThoroughfare,//mz y lote o numero ext
      subLocality,//colonia
      locality, //localidad
      latitude,//lonfitud
      longitude,//latitud,
      addressLines, //dirección completa
      administrativeArea //estado
    } = response;
    this.pointForm.controls['Calle'].setValue(thoroughfare);
    this.pointForm.controls['Colonia'].setValue(subLocality);
    this.pointForm.controls['Longitud'].setValue(longitude);
    this.pointForm.controls['Latitud'].setValue(latitude);
    this.pointForm.controls['Estado'].setValue(administrativeArea);
    this.pointForm.controls['NumExt'].setValue(subThoroughfare);
    this.pointForm.controls['FullAdress'].setValue(addressLines);

  }

  public getAddress(lat: any, long: any):void {
    // if (this.platform.is('cordova')) {
      this.nativeGeocoder
      .reverseGeocode(lat, long, this.nativeGeocoderOptions)
      .then((res: NativeGeocoderResult[]) => {
        this.address = this.generateAddress(res[0]);
        this.setAdressToFrom(res[0]);
      })
      .catch((error: any) => {
        console.log(error);
        alert('Error getting location' + JSON.stringify(error));
        
      });
    // }else{

    // }

  }
    // address
    generateAddress(addressObj:any) {
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if (obj[val].length)
          address += obj[val] + ', ';
      }
      return address.slice(0, -2);
    }

    
  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<string>>;
  //   if (ev.detail.role === 'confirm') {
  //     this.message = `Hello, ${ev.detail.data}!`;
  //   }
  // }
}
