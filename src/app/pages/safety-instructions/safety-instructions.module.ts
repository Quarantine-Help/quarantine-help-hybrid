import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SafetyInstructionsPageRoutingModule } from './safety-instructions-routing.module';

import { SafetyInstructionsPage } from './safety-instructions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SafetyInstructionsPageRoutingModule
  ],
  declarations: [SafetyInstructionsPage]
})
export class SafetyInstructionsPageModule {}
