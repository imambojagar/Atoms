import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateRoutingModule } from './translate-routing.module';
import { AddEditTranslateComponent } from './add-edit-translate/add-edit-translate.component';
import { ViewTranslateComponent } from './view-translate/view-translate.component';
import { PrimengModule } from '../../shared/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
/* import { AddEditTranslateComponent } from './add-edit-translate/add-edit-translate.component';
import { ViewTranslateComponent } from './view-translate/view-translate.component'; */
/* import { PrimengModule } from 'src/app/shared/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module'; */


@NgModule({
  declarations: [
    AddEditTranslateComponent,
    ViewTranslateComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    TranslateRoutingModule,
    ReactiveFormsModule
  ],
})
export class TranslateModule { }
