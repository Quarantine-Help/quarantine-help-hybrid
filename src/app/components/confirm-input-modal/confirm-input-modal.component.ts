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

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
