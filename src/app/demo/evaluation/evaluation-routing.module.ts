import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationViewComponent } from './evaluation-view/evaluation-view.component';
import { EvaluationControlComponent } from './evaluation-control/evaluation-control.component';

const routes: Routes = [
  { path: '', component: EvaluationViewComponent },
  { path: 'add-control', component: EvaluationControlComponent },
  { path: 'edit-control', component: EvaluationControlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationRoutingModule {}
