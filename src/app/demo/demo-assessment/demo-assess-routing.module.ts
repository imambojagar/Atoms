import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoAssessViewComponent } from './demo-assess-view/demo-assess-view.component';
import { DemoAssessControlComponent } from './demo-assess-control/demo-assess-control.component';

const routes: Routes = [
  { path: '', component: DemoAssessViewComponent },
  { path: 'add-control', component: DemoAssessControlComponent },
  { path: 'edit-control', component: DemoAssessControlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoAssessRoutingModule {}
