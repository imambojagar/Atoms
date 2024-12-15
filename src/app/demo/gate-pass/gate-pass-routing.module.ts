import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GatePassViewComponent } from './gate-pass-view/gate-pass-view.component';
import { GatePassControlComponent } from './gate-pass-control/gate-pass-control.component';

const routes: Routes = [
  { path: '', component: GatePassViewComponent },
  { path: 'add-control', component: GatePassControlComponent },
  { path: 'edit-control', component: GatePassControlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GatePassRoutingModule {}
