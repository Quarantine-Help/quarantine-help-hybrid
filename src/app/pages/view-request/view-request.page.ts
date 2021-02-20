import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CallNumberService } from 'src/app/shared/services/call-number/call-number.service';
import { MiscService } from 'src/app/shared/services/misc/misc.service';
import { CoreAPIService } from 'src/app/shared/services/core-api/core-api.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { UserType } from 'src/app/models/core-api';
import {
  defaultUserType,
  defaultPrimaryColor,
  defaultSecondaryColor,
} from 'src/app/constants/core-api';
import {
  UserThemeColorPrimary,
  UserThemeColorSecondary,
} from 'src/app/models/ui';

import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit, OnDestroy {
  loadingData: HTMLIonLoadingElement;
  requestData: any;
  requestId: number;
  userType: UserType;
  authSubs: Subscription;
  userThemeColorPrimary: UserThemeColorPrimary;
  userThemeColorSecondary: UserThemeColorSecondary;
  isLoggedIn: boolean;
  constructor(
    private router: Router,
    private callNumberService: CallNumberService,
    private miscService: MiscService,
    private coreAPIService: CoreAPIService,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.requestData = navigation.extras.state;
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

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  callAssignee(phoneNo) {
    this.callNumberService
      .callNumber(phoneNo)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
  }

  async displayResolveModal() {
    const modalController = await this.modalController.create({
      component: ConfirmModalComponent,
      id: 'confirm-modal',
      componentProps: {
        question: 'Resolve request now?',
        buttonLabel: 'finish',
        confirmLabel: 'Yes, help has been delivered',
        denyLabel: 'No, not yet',
      },
    });

    await modalController.present();
    return await modalController.onDidDismiss().then((dismissedModal: any) => {
      console.log('dismissedModal', dismissedModal);
      if (
        dismissedModal.role === 'finish' &&
        dismissedModal.data.agreement === 'confirm'
      ) {
        this.resolveRequest();
      }
    });
  }

  resolveRequest() {
    console.log('calling resolveRequest');

    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Resolving request`,
      })
      .then((onLoadSuccess) => {
        this.loadingData = onLoadSuccess;
        this.loadingData.present();
        const status = {
          status: 'F',
        };
        this.coreAPIService
          .resolveARequest(this.requestId, status)
          .then((result: any) => {
            if (this.loadingData !== undefined) {
              this.loadingData.dismiss().then(() => {
                this.loadingData = undefined;
              });
            }
            this.miscService.presentAlert({
              header: 'Success!!!',
              subHeader: 'Request Resolved.',
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
              message: `Request Resolved successfully. Click Ok to continue`,
            });
          })
          .catch((errorObj) => {
            this.loadingData.dismiss();
            const { error, status: statusCode } = errorObj;
            const errorMessages: string[] = [];
            for (const key in error) {
              if (error.hasOwnProperty(key) && typeof key !== 'function') {
                console.error(error[key][0]);
                errorMessages.push(error[key][0]);
              }
            }
            // show the errors as alert
            this.handleErrors(errorMessages, statusCode);
          });
      });
  }

  async displayRejectModal() {
    const modalController = await this.modalController.create({
      component: ConfirmModalComponent,
      id: 'confirm-modal',
      componentProps: {
        question: 'Are you sure to cancel your help on this request?',
        buttonLabel: 'finish',
        confirmLabel: 'Yes',
        denyLabel: 'No',
      },
    });

    await modalController.present();
    return await modalController.onDidDismiss().then((dismissedModal: any) => {
      console.log('dismissedModal', dismissedModal);
      if (
        dismissedModal.role === 'finish' &&
        dismissedModal.data.agreement === 'confirm'
      ) {
        this.removeRequest();
      }
    });
  }

  removeRequest() {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Removing request`,
      })
      .then((onLoadSuccess) => {
        this.loadingData = onLoadSuccess;
        this.loadingData.present();
        this.coreAPIService
          .unassignRequest(this.requestId)
          .then((result: any) => {
            if (this.loadingData !== undefined) {
              this.loadingData.dismiss().then(() => {
                this.loadingData = undefined;
              });
            }
            this.miscService.presentAlert({
              header: 'Success!!!',
              subHeader: 'Request Removed.',
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
              message: `Request removed successfully. Click Ok to continue`,
            });
          })
          .catch((errorObj) => {
            this.loadingData.dismiss();
            const { error, status: statusCode } = errorObj;
            const errorMessages: string[] = [];
            for (const key in error) {
              if (error.hasOwnProperty(key) && typeof key !== 'function') {
                console.error(error[key][0]);
                errorMessages.push(error[key][0]);
              }
            }
            // show the errors as alert
            this.handleErrors(errorMessages, statusCode);
          });
      });
  }

  async displayCloseRequestModal() {
  }

  editRequest() {
  }

  handleErrors(errorMessages: string[], statusCode) {
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({ message: errorMessages.join('. ') });
  }
}
