import { Component} from '@angular/core';
import {  ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ModalMapComponent } from '../modal-map/modal-map.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isMovingRute:boolean = false;
  public ubicacionesArray:any[] = [];
  public rutaForm:FormGroup = this.fb.group({
    IdUsuario:[''],
    Nombre: ['',Validators.required],
    Descripcion:['',Validators.required],
  });
  constructor(
    public platform: Platform,
    private modalCtrl: ModalController,
    public fb:FormBuilder
  ) {}
  ngOnInit(){  }

  public handleReorder(ev: CustomEvent<ItemReorderEventDetail>):void {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    this.ubicacionesArray = this.array_move(this.ubicacionesArray,ev.detail.from,ev.detail.to);
    this.ubicacionesArray = this.ubicacionesArray.map((item:any,index:number) => {
      item.Orden = index+1
      return item;
    });
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
  public agregarRuta():void{
    const Ubicaciones = {
      Ubicaciones:this.ubicacionesArray
    };
    const ruta = {
      ...this.rutaForm.value,...Ubicaciones
    };
    console.log(ruta);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalMapComponent,
      componentProps: { 
        lastItem: this.ubicacionesArray.length + 1,
      },
      id:'modalMaps',
      
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
       this.ubicacionesArray.push(data);
    }
  }

  public movingRutes(value:boolean):void{
    this.isMovingRute = value;
  }

  public array_move(arr:any, old_index:number, new_index:number):any {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};



}