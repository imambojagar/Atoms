import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorsRoutingModule} from './errors-routing.module';
import { TranslationModule } from '../i18n/translation.module';
import { Error403Component } from './403.component';
import { Error404Component } from './404.component';
import { Error500Component } from './500.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
   ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    TranslationModule,

  ],

})
export class ErrorsModule {}
