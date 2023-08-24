import { Injectable } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the InputDialogServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InputDialogServiceProvider {

  constructor(public dataService: DataServiceProvider, public alertCtrl: AlertController,) {
    console.log('Hello InputDialogServiceProvider Provider');
  }

  showPrompt(item?, index?) {
    const prompt = this.alertCtrl.create({
      title: item ? 'Edit Contact' : 'Add Contact',
      message: item ? "Edit Contact..." : 'New Contact...',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value: item ? item.name : null
        },
        {
          name: 'quantity',
          placeholder: 'Quantity',
          value: item ? item.quantity : null
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (index !== undefined) {
              item.name = data.name;
              item.quantity = data.quantity;
              this.dataService.editItem(item, index);
            } else {
              this.dataService.addItem(data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

}
