import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-input-modal.component.html',
  styleUrls: ['./confirm-input-modal.component.scss'],
})
export class ConfirmInputModalComponent implements OnInit {
  @Input() question: string;
  @Input() note: string;
  @Input() radioLabel: string;
  @Input() textboxLabel: string;
  @Input() button: string;

  constructor(public modalController: ModalController) {}
  amount: number;
  isChecked: boolean;
  hasAmount: boolean;
  ngOnInit() {
    this.isChecked = false;
  }

  amountChange() {
    this.hasAmount = Number.isInteger(this.amount);
    if (this.isChecked === true && typeof this.amount !== 'undefined') {
      this.isChecked = false;
    }
  }

  toggleCheckbox({ detail }) {
    this.isChecked = detail.checked;
    if (this.isChecked === true) {
      this.amount = undefined;
    }
  }

  dismissModal(role: 'finish' | 'close') {
    const modalData = {
      amount: Number.isInteger(this.amount) ? this.amount : 0,
      isChecked: this.isChecked,
    };
    this.modalController.dismiss(modalData, role, 'create-request-pay');
  }
}
