import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructionRoutingModule } from './instruction-routing.module';
import { InstructionDescriptionMappingComponent } from './instruction-description-mapping-managment/instruction-description-mapping.component';
import { PrimengModule } from '../../shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [
    InstructionDescriptionMappingComponent
  ],
  imports: [
    CommonModule,
    InstructionRoutingModule,
    SharedModule,
    PrimengModule,
    FormsModule, ReactiveFormsModule, ToastModule, BreadcrumbModule
  ],
})
export class InstructionDescriptionMappingModule { }
