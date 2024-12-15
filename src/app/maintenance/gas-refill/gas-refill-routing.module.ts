import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GasRefillManagementComponent } from './gas-refill-management/gas-refill-management.component';
import { GasRefillSearchComponent } from './gas-refill-search/gas-refill-search.component';

const routes: Routes = [
  { path: '', component: GasRefillSearchComponent },
  { path: 'add-control', component: GasRefillManagementComponent },
  { path: 'edit-control', component: GasRefillManagementComponent },
  { path: 'view-control', component: GasRefillManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GasRefillRoutingModule { }
