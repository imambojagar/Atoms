import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { AddNewEmployeeComponent } from './add-employee/add-new-employee.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeePositionRateComponent } from './employee-position-rate/employee-position-rate.component';
// import { RotaComponent } from './rota/rota.component';
import { CustomerExperienceComponent } from './customer-experience/customer-experience.component';
import { ViewEmployeeComponent } from './employee/view-employee/view-employee.component';
import { MyRotaModule } from './my-rota/my-rota.module';
import { RotaComponent } from './my-rota/rota.component';

const routes: Routes = [
  { path: 'employees', component: EmployeesComponent },
  { path: 'add-new-employee', component: AddNewEmployeeComponent },
  { path: 'organisation', component: OrganisationComponent },
  {
    path: 'shifts',
    children: [{ path: '', component: ShiftsComponent }],
  },
  {
    path: 'employee',
    children: [
      { path: '', component: EmployeeComponent },
      // { path: 'add-control', component: ViewEmployeeComponent },
      // { path: 'edit-control', component: ViewEmployeeComponent },
    ],
  },
  // {
  //   path: 'employee',
  //   loadChildren: () =>
  //     import('./employee/employee.module').then(
  //       (module) => module.EmployeeModule
  //     ),
  // },
  {
    path: 'employee-position-rate',
    children: [{ path: '', component: EmployeePositionRateComponent }],
  },
  {
    path: 'rota',
    children: [{ path: '', component: RotaComponent }],
  },
  {
    path: 'customer-experience',
    children: [{ path: '', component: CustomerExperienceComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MyRotaModule],
  exports: [RouterModule],
})
export class HumanResourcesRoutingModule {}
