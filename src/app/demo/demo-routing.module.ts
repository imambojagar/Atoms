import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'request',
    loadChildren: () =>
      import('../demo/demo-request/demo-req.module').then(
        (module) => module.DemoReqModule
      ),
  },
  {
    path: 'assessment',
    loadChildren: () =>
      import('../demo/demo-assessment/demo-assess.module').then(
        (module) => module.DemoAssessModule
      ),
  },
  {
    path: 'evaluation',
    loadChildren: () =>
      import('../demo/evaluation/evaluation.module').then(
        (module) => module.EvaluationModule
      ),
  },
  {
    path: 'gate-pass',
    loadChildren: () =>
      import('../demo/gate-pass/gate-pass.module').then(
        (module) => module.GatePassModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule { }
