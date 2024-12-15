import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditTranslateComponent } from './add-edit-translate/add-edit-translate.component';
import { ViewTranslateComponent } from './view-translate/view-translate.component';
import { MessageNotificationModel } from '../../models/msg-notify';
import { EmailNotifiactionModel } from '../../models/emailNotification';

const routes: Routes = [
  { path: 'add-control', component: AddEditTranslateComponent },
  { path: 'edit-control', component: AddEditTranslateComponent },
  { path: '', component: ViewTranslateComponent },
  {
    path: 'msg-notification', component: MessageNotificationModel
  },
  {
    path: 'email-notification', component: EmailNotifiactionModel
    /* loadChildren: () =>
      import('./email-notification/email-notification.module').then(
        (module) => module.EmailNotificationModule
      ), */
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranslateRoutingModule { }
