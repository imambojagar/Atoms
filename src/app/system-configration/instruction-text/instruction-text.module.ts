import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructionRoutingModule } from './instruction-routing.module';
import { InstructionManagmentComponent } from './instructions-managment/instruction-managment.component';

import { PrimengModule } from '../../shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    InstructionManagmentComponent
  ],
  imports: [
    CommonModule,
    InstructionRoutingModule,
    SharedModule,
    PrimengModule,
    FormsModule, ReactiveFormsModule
  ],
})
export class InstructionTextModule { }
