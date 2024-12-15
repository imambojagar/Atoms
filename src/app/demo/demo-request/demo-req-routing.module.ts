import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoReqViewComponent } from './demo-req-view/demo-req-view.component';
import { DemoReqControlComponent } from './demo-req-control/demo-req-control.component';

const routes: Routes = [
  { path: '', component: DemoReqViewComponent },
  { path: 'approvals', component: DemoReqViewComponent },
  { path: 'add-control', component: DemoReqControlComponent },
  { path: 'edit-control', component: DemoReqControlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoReqRoutingModule {}
