import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import {
  defaultPrimaryColor,
  defaultUserType,
} from 'src/app/constants/core-api';
import { UserType } from 'src/app/models/core-api';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() question: string;
  @Input() buttonLabel: string;
  @Input() confirmLabel: string;
  @Input() denyLabel: string;
  isLoggedIn: boolean;
  userType: UserType;
  userThemeColorPrimary: string;
  authSubs: Subscription;
  modalForm: FormGroup;
  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.modalForm = new FormGroup({
      agreement: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.isLoggedIn = false;
    this.userType = defaultUserType;
    this.userThemeColorPrimary = defaultPrimaryColor;

    this.authSubs = this.authService.user.subscribe((user) => {
      if (user && user.email !== undefined && user.token !== undefined) {
        this.userType = user.type;
        this.isLoggedIn = true;
        this.userThemeColorPrimary =
          this.userType === 'AF' ? 'primaryAF' : 'primaryHL';
      } else {
        this.isLoggedIn = false;
        this.userType = defaultUserType;
        this.userThemeColorPrimary = defaultPrimaryColor;
      }
    });
  }

  dismissModal(role: 'finish' | 'close') {
    const modalData = {
      agreement: this.modalForm.get('agreement').value,
    };
    this.modalController.dismiss(modalData, role, 'confirm-modal');
  }
}
