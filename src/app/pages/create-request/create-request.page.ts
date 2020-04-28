import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.page.html',
  styleUrls: ['./create-request.page.scss'],
})
export class CreateRequestPage implements OnInit {
  requestForm: FormGroup;
  selected = ['', ''];
  showDaysHours: boolean;
  segmentSelected: any;

  constructor(private pickerCtrl: PickerController) {
    this.requestForm = new FormGroup({
      requestMessage: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.showDaysHours = false;
    this.segmentSelected = 'Medicine';
  }

  segmentChanged(e) {
    this.segmentSelected = e.detail.value;
  }

  async showPicker() {
    this.showDaysHours = true;
    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
        },
      ],
      columns: [
        {
          name: 'day',
          options: [
            { text: 'Today', value: 'Today' },
            { text: 'Tomorrow', value: 'Tomorrow' },
            { text: 'In 2 days', value: 'In 2 days' },
            { text: 'In 3 days', value: 'In 3 days' },
            { text: 'In 4 days', value: 'In 4 days' },
            { text: 'In 5 days', value: 'In 5 days' },
            { text: 'In 6 days', value: 'In 6 days' },
            { text: 'In 7 days', value: 'In 7 days' },
            { text: 'In 8 days', value: 'In 8 days' },
            { text: 'In 9 days', value: 'In 9 days' },
            { text: 'In 10 days', value: 'In 10 days' },
          ],
        },
        {
          name: 'hour',
          options: [
            { text: '1 hour', value: '1 hour' },
            { text: '2 hours', value: '2 hours' },
            { text: '3 hours', value: '3 hours' },
            { text: '4 hours', value: '4 hours' },
            { text: '5 hours', value: '5 hours' },
            { text: '6 hours', value: '6 hours' },
            { text: '7 hours', value: '7 hours' },
            { text: '8 hours', value: '8 hours' },
            { text: '9 hours', value: '9 hours' },
            { text: '10 hours', value: '10 hours' },
            { text: '11 hours', value: '11 hours' },
            { text: '12 hours', value: '12 hours' },
            { text: '13 hours', value: '13 hours' },
            { text: '14 hours', value: '14 hours' },
            { text: '15 hours', value: '15 hours' },
            { text: '16 hours', value: '16 hours' },
            { text: '17 hours', value: '17 hours' },
            { text: '18 hours', value: '18 hours' },
            { text: '19 hours', value: '19 hours' },
            { text: '20 hours', value: '20 hours' },
            { text: '21 hours', value: '21 hours' },
            { text: '22 hours', value: '22 hours' },
            { text: '23 hours', value: '23 hours' },
          ],
        },
      ],
    };
    const picker = await this.pickerCtrl.create(opts);
    picker.columns[0].selectedIndex = 2;
    picker.columns[1].selectedIndex = 2;
    picker.present();
    picker.onDidDismiss().then(async ({ data, role }) => {
      if (role === 'cancel') {
        this.showDaysHours = false;
      } else {
        const day = await picker.getColumn('day');
        const hour = await picker.getColumn('hour');
        this.selected = [
          day.options[day.selectedIndex].text,
          hour.options[hour.selectedIndex].text,
        ];
      }
    });
  }

  submitRequest() {
    // TODO
    console.log(this.requestForm);
    console.log(this.selected);
    console.log(this.segmentSelected);
  }
}
