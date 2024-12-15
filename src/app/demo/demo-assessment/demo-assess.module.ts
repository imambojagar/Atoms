import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoAssessRoutingModule } from './demo-assess-routing.module';

import { DemoAssessControlComponent } from './demo-assess-control/demo-assess-control.component';
import { DemoAssessViewComponent } from './demo-assess-view/demo-assess-view.component';
import { DemoReqModule } from '../demo-request/demo-req.module';

@NgModule({
  declarations: [DemoAssessControlComponent, DemoAssessViewComponent],
  imports: [CommonModule, DemoAssessRoutingModule, SharedModule, DemoReqModule],
})
export class DemoAssessModule { }
