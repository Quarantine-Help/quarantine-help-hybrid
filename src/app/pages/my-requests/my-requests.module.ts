import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRequestsPageRoutingModule } from './my-requests-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MyRequestsPage } from './my-requests.page';
import { RequestComponent } from 'src/app/components/request/request.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MyRequestsPageRoutingModule,
  ],
  declarations: [MyRequestsPage, RequestComponent],
})
export class MyRequestsPageModule {}
