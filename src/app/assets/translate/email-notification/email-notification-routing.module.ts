import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditEmailNotifyComponent } from './add-edit-email-notify/add-edit-email-notify.component';
import { ViewEmailNotifyComponent } from './view-email-notify/view-email-notify.component';

const routes: Routes = [
  { path: 'add-control', component: AddEditEmailNotifyComponent },
  { path: 'edit-control', component: AddEditEmailNotifyComponent },
  { path: '', component: ViewEmailNotifyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailNotificationRoutingModule { }
