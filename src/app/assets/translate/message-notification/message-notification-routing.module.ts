import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditMsgNotifyComponent } from './add-edit-msg-notify/add-edit-msg-notify.component';
import { ViewMsgNotifyComponent } from './view-msg-notify/view-msg-notify.component';

const routes: Routes = [
  { path: 'add-control', component: AddEditMsgNotifyComponent },
  { path: 'edit-control', component: AddEditMsgNotifyComponent },
  { path: '', component: ViewMsgNotifyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageNotificationRoutingModule { }
