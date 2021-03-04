import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { Subscription } from 'rxjs';

import {
  defaultPrimaryColor,
  defaultSecondaryColor,
  defaultUserType,
} from 'src/app/constants/core-api';
import { HelpRequest, UserType } from 'src/app/models/core-api';
import {
  UserThemeColorPrimary,
  UserThemeColorSecondary,
} from 'src/app/models/ui';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CoreAPIService } from 'src/app/shared/services/core-api/core-api.service';
import { MiscService } from 'src/app/shared/services/misc/misc.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.page.html',
  styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit {
  loadingData: HTMLIonLoadingElement;
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;
  userThemeColorSecondary: UserThemeColorSecondary;
  isLoggedIn: boolean;
  showDaysHours: boolean;
  requestData: HelpRequest;
  requestId: number;
  deadline: { days: string; hours: string };
  constructor(
    private router: Router,
    private authService: AuthService,
    private pickerCtrl: PickerController,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.requestData = navigation.extras.state as HelpRequest;
    this.requestId = navigation.extras.state.id;

    this.isLoggedIn = false;
    this.userType = defaultUserType;
    this.userThemeColorPrimary = defaultPrimaryColor;
    this.userThemeColorSecondary = defaultSecondaryColor;

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
        this.userThemeColorPrimary =
          this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
        this.userThemeColorSecondary =
          this.userType === 'AF' ? 'secondaryAF' : 'secondaryHL';
      } else {
        this.isLoggedIn = false;
        this.userType = defaultUserType;
        this.userThemeColorPrimary = defaultPrimaryColor;
        this.userThemeColorSecondary = defaultSecondaryColor;
      }
    });
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
            { text: 'Today', value: '0' },
            { text: 'Tomorrow', value: '1' },
            { text: 'In 2 days', value: '2' },
            { text: 'In 3 days', value: '3' },
            { text: 'In 4 days', value: '4' },
            { text: 'In 5 days', value: '5' },
            { text: 'In 6 days', value: '6' },
            { text: 'In 7 days', value: '7' },
            { text: 'In 8 days', value: '8' },
            { text: 'In 9 days', value: '9' },
            { text: 'In 10 days', value: '10' },
          ],
        },
        {
          name: 'hour',
          options: [
            { text: '1 hour', value: '1' },
            { text: '2 hours', value: '2' },
            { text: '3 hours', value: '3' },
            { text: '4 hours', value: '4' },
            { text: '5 hours', value: '5' },
            { text: '6 hours', value: '6' },
            { text: '7 hours', value: '7' },
            { text: '8 hours', value: '8' },
            { text: '9 hours', value: '9' },
            { text: '10 hours', value: '10' },
            { text: '11 hours', value: '11' },
            { text: '12 hours', value: '12' },
            { text: '13 hours', value: '13' },
            { text: '14 hours', value: '14' },
            { text: '15 hours', value: '15' },
            { text: '16 hours', value: '16' },
            { text: '17 hours', value: '17' },
            { text: '18 hours', value: '18' },
            { text: '19 hours', value: '19' },
            { text: '20 hours', value: '20' },
            { text: '21 hours', value: '21' },
            { text: '22 hours', value: '22' },
            { text: '23 hours', value: '23' },
          ],
        },
      ],
    };
    const picker = await this.pickerCtrl.create(opts);

    let defaultDay = 2,
      defaultHour = 2;
    if (this.deadline) {
      defaultDay = parseInt(this.deadline.days, 10);
      defaultHour = parseInt(this.deadline.hours, 10);
    }
    picker.columns[0].selectedIndex = defaultDay;
    picker.columns[1].selectedIndex = defaultHour;

    picker.present();
    picker.onDidDismiss().then(async ({ data, role }) => {
      if (role === 'cancel') {
        this.showDaysHours = false;
      } else {
        const day = await picker.getColumn('day');
        const hour = await picker.getColumn('hour');
        this.deadline = {
          days: day.options[day.selectedIndex].value,
          hours: hour.options[hour.selectedIndex].value,
        };
        this.requestData.deadline = this.calculateDeadline(
          this.deadline.days,
          this.deadline.hours
        );
      }
    });
  }

  calculateDeadline(days, hours): string {
    const currentTime: Date = new Date();
    currentTime.setUTCDate(currentTime.getUTCDate() + parseInt(days, 10));
    currentTime.setUTCHours(currentTime.getUTCHours() + parseInt(hours, 10));
    return currentTime.toISOString();
  }

  async displayFinishModal() {
    const modalController = await this.modalController.create({
      component: ConfirmModalComponent,
      id: 'confirm-modal',
      componentProps: {
        question: 'Are you sure you want to save the changes?',
        buttonLabel: 'finish',
        confirmLabel: 'Yes',
        denyLabel: 'No, discard changes',
      },
    });

    await modalController.present();
    return await modalController.onDidDismiss().then((dismissedModal: any) => {
      console.log('dismissedModal', dismissedModal);
      if (
        dismissedModal.role === 'finish' &&
        dismissedModal.data.agreement === 'confirm'
      ) {
        this.updateRequest();
      }
    });
  }

  updateRequest() {
    console.log('calling updateRequest');

    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Updating request`,
      })
      .then((onLoadSuccess) => {
        this.loadingData = onLoadSuccess;
        this.loadingData.present();
        this.coreAPIService
          .updateRequest(this.requestData.id, this.requestData)
          .then((result: any) => {
            if (this.loadingData !== undefined) {
              this.loadingData.dismiss().then(() => {
                this.loadingData = undefined;
              });
            }
            this.miscService.presentAlert({
              header: 'Success!!!',
              subHeader: 'Request updated.',
              buttons: [
                {
                  text: 'Ok',
                  cssClass: 'secondary',
                  handler: () => {
                    this.router.navigate(['/my-requests'], {
                      replaceUrl: true,
                    });
                  },
                },
              ],
              message: `Request updated successfully. Click Ok to continue`,
            });
          })
          .catch((errorObj) => {
            this.loadingData.dismiss();
            const { error, status: statusCode } = errorObj;
            const errorMessages: string[] = [];
            for (const key in error) {
              if (error.hasOwnProperty(key) && typeof key !== 'function') {
                errorMessages.push(error[key][0]);
              }
            }
            // show the errors as alert
            this.handleErrors(errorMessages, statusCode);
          });
      });
  }

  handleErrors(errorMessages: string[], statusCode) {
    const errorString =
      statusCode === 500 ? 'Internal Server Error' : errorMessages.join('. ');

    console.log(errorString, statusCode);
    this.miscService.presentAlert({ message: errorString });
  }
}
