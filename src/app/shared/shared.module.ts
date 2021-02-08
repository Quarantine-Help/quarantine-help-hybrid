import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { FooterNavComponent } from './components/footer-nav/footer-nav.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [FooterNavComponent, ConfirmModalComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [FooterNavComponent, ConfirmModalComponent],
})
export class SharedModule {}
