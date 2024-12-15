import { SharedModule } from 'primeng/api';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { DemoReqModule } from '../demo-request/demo-req.module';
import { EvaluationControlComponent } from './evaluation-control/evaluation-control.component';
import { EvaluationViewComponent } from './evaluation-view/evaluation-view.component';
import { DemoAssessControlComponent } from '../demo-assessment/demo-assess-control/demo-assess-control.component';
import { DemoReqControlComponent } from '../demo-request/demo-req-control/demo-req-control.component';

@NgModule({
  declarations: [
    EvaluationControlComponent,
    EvaluationViewComponent
  ],
  imports: [CommonModule, EvaluationRoutingModule, SharedModule, DemoReqModule, DemoReqModule],
})
export class EvaluationModule { }
