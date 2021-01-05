import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { LatLng } from 'src/app/models/geo';
import { RequestView, UserThemeColorPrimary } from 'src/app/models/ui';
import { CoreAPIService } from 'src/app/shared/services/core-api/core-api.service';
import { MiscService } from 'src/app/shared/services/misc/misc.service';

@Component({
  selector: 'app-request-info-modal',
  templateUrl: './request-info-modal.component.html',
  styleUrls: ['./request-info-modal.component.scss'],
})
export class RequestInfoModalComponent implements OnInit {
  request: {
    createdAt: string;
    deadline: string;
    description: string;
    id: number;
    status: string;
    type: string;
  };
  selectedRequests: any[];
  pendingRequestCount: number;
  loadingAni: HTMLIonLoadingElement;
  userThemeColorPrimary: UserThemeColorPrimary;
  constructor(
    public modalCtrl: ModalController,
    private coreAPIService: CoreAPIService,
    private miscService: MiscService
  ) {
    this.userThemeColorPrimary = 'primaryAF';
  }
  // Data passed in by componentProps
  @Input() viewportX: string;
  @Input() viewportY: string;
  @Input() coordinates: LatLng; // ??????? Remove these. not yused
  @Input() markerData: RequestView;
  ngOnInit() {
    console.log('RequestInfoModalComponent');
    console.log('markerData', this.markerData);
    this.selectedRequests = [];
    this.pendingRequestCount = this.calcPendingCount(this.markerData);
    console.log('pendingRequestCount', this.pendingRequestCount);
  }

  onCheckBoxEvent(isChecked, checkedRequestNo, checkedRequestId) {
    console.log(
      'isChecked, requestNo, requestId',
      isChecked,
      checkedRequestNo,
      checkedRequestId
    );
    console.log('selectedRequests', this.selectedRequests);
    if (isChecked) {
      this.selectedRequests.push(checkedRequestId);
    } else {
      this.selectedRequests = this.selectedRequests.filter((requestId) => {
        return requestId !== checkedRequestId;
      });
    }
    console.log('selectedRequests', this.selectedRequests);
  }

  /**
   * Calculates the no of pending requests, ie requests with status 'P'
   * @param requests requests to be checked for pending status
   * @returns The number of pending requests
   */
  calcPendingCount({ requests }): number {
    const pendingRequestCount = requests.reduce((count, request) => {
      if (request.status === 'P') {
        count += 1;
      }
      return count;
    }, 0);
    return pendingRequestCount;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  acceptSelectedRequests() {
    this.miscService
      .presentLoadingWithOptions({
        duration: 0,
        message: `Sending Request`,
      })
      .then((onLoadSuccess) => {
        this.loadingAni = onLoadSuccess;
        this.loadingAni.present();
        const acceptRequests = [];
        console.log(this.markerData);
        this.selectedRequests.forEach((selectedRequestId) => {
          acceptRequests.push(
            this.coreAPIService.assignAFRequestsAsHL(
              this.markerData.id,
              selectedRequestId
            )
          );
        });

        Promise.allSettled(acceptRequests)
          .then((results) => {
            // Dismiss & destroy loading controller on
            if (this.loadingAni !== undefined) {
              this.loadingAni.dismiss().then(() => {
                this.loadingAni = undefined;
              });
            }
            const isAllSuccess = results.every(
              (result) => result.status === 'fulfilled'
            );

            const failedRequests = results.filter(
              (result) => result.status === 'rejected'
            );

            if (isAllSuccess) {
              this.miscService.presentAlert({
                header: 'Success 😊',
                message:
                  acceptRequests.length === 1
                    ? 'The selected request is accepted'
                    : 'The selected requests are accepted',
                subHeader: null,
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      console.log('Confirm Ok');
                      this.closeModal();
                    },
                  },
                ],
              });
            } else {
              failedRequests.map((failure: any) => {
                console.log('failure', failure);
                this.handleErrors(failure.reason);
              });
            }
          })
          .catch((errorObj) => {
            this.loadingAni.dismiss();
            this.handleErrors(errorObj);
          });
      })
      .catch((error) => alert(error));
  }

  handleErrors(errorObj) {
    const { error, status: statusCode } = errorObj;
    const errorMessages: string[] = [];
    for (const key in error) {
      if (error.hasOwnProperty(key) && typeof key !== 'function') {
        errorMessages.push(error[key] || error[key][0]);
      }
    }
    console.log(...errorMessages, statusCode);
    this.miscService.presentAlert({
      message: errorMessages.join('. '),
      subHeader: null,
      buttons: ['Ok'],
    });
  }
}
