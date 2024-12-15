import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailNotificationRoutingModule } from './email-notification-routing.module';
import { AddEditEmailNotifyComponent } from './add-edit-email-notify/add-edit-email-notify.component';
import { ViewEmailNotifyComponent } from './view-email-notify/view-email-notify.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimengModule } from 'src/app/shared/primeng.module';


@NgModule({
  declarations: [
    AddEditEmailNotifyComponent,
    ViewEmailNotifyComponent
  ],
  imports: [
    CommonModule,
    EmailNotificationRoutingModule,
    SharedModule,
    PrimengModule
  ]
})
export class EmailNotificationModule { }
