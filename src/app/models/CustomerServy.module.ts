import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchCustomerServyComponent } from './search-customer-service/search-customer-service.component';
import { CustomerServyManagementComponent } from './customer-service-management/customer-service-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerServyModuleRoutingModule } from './CustomerServy-routing.module';
import { DateUTCPipe } from 'src/app/shared/pipes/date-utc.pipe';
import { QuestionsCustomerExperienceTeamComponent } from './questions-customer-experience-team/questions-customer-experience-team.component';
import { SearchQuestionsCustomerExperienceTeamComponent } from './search-questions-customer-experience-team/search-questions-customer-experience-team.component';


@NgModule({
  declarations: [
    SearchCustomerServyComponent,
    CustomerServyManagementComponent,
    QuestionsCustomerExperienceTeamComponent,
    SearchQuestionsCustomerExperienceTeamComponent
  ],
  imports: [
    CommonModule,
    CustomerServyModuleRoutingModule,
    SharedModule
  ],
  providers:[
    DatePipe
  ]
})
export class CustomerServyModule { }
