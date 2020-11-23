import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FooterNavPageRoutingModule } from './footer-nav-routing.module';
import { FooterNavPage } from './footer-nav.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, FooterNavPageRoutingModule],
  declarations: [FooterNavPage],
  exports: [FooterNavPage]
})
export class FooterNavPageModule {}
