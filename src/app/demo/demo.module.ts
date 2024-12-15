import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { SharedModule } from 'primeng/api';
import { PrimengModule } from '../shared/primeng.module';


@NgModule({
  declarations: [],
  imports: [CommonModule, DemoRoutingModule, SharedModule, PrimengModule],
})
export class DemoModule { }
