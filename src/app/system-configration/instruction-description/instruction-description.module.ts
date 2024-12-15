import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructionRoutingModule } from './instruction-routing.module';
import { InstructionDescriptionManagmentComponent } from './instructions-managment/instruction-description-managment.component';

import { PrimengModule } from '../../shared/primeng.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InstructionDescriptionManagmentComponent
  ],
  imports: [
    CommonModule,
    InstructionRoutingModule,
    SharedModule,
    PrimengModule,
    ReactiveFormsModule, FormsModule
  ],
})
export class InstructionDescriptionModule { }
