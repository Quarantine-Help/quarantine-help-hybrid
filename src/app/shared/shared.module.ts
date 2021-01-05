import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FooterNavComponent } from '../components/footer-nav/footer-nav.component';

@NgModule({
  declarations: [FooterNavComponent],
  imports: [CommonModule, IonicModule],
  exports: [FooterNavComponent],
})
export class SharedModule {}
