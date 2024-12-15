import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationModule } from '../i18n/translation.module';
import { AuthRoutingModule } from './auth-routing.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,

  ]
})
export class AuthModule {}
