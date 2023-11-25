import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-edit-recordatorio',
  templateUrl: './modal-edit-recordatorio.component.html',
  styleUrls: ['./modal-edit-recordatorio.component.scss'],
})
export class ModalEditRecordatorioComponent  implements OnInit {
  public lastId!:number;
  public recordatorioForm:FormGroup = this.fb.group({
    Id:[''],
    Titulo: ['',Validators.required],
    Contenido:['',Validators.required]
  });
  constructor(private modalCtrl: ModalController,public fb:FormBuilder) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel','modalEditRecordatorio');
  }

  confirm() {
    this.recordatorioForm.controls['Id'].setValue(this.lastId);
    return this.modalCtrl.dismiss(this.recordatorioForm.value, 'confirm','modalEditRecordatorio');
  }

  ngOnInit() {
    // console.log(this.lastId);
  }

}
