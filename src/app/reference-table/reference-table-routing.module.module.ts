import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgControlComponent } from './org-control/org-control.component';
import { SupplierComponent } from './supplier/supplier.component';
import { DepartmentComponent } from './department/department.component';
import { SitesComponent } from './sites/sites.component';
import { ModelCreationComponent } from './model-creation/model-creation.component';

const routes: Routes = [
  {
    path: 'define-organization',
    children: [{ path: '', component: OrgControlComponent }],
  },
  {
    path: 'supplier',
    children: [{ path: '', component: SupplierComponent }],
  },
  {
    path: 'department',
    children: [{ path: '', component: DepartmentComponent }],
  },
  {
    path: 'customer',
    children: [{ path: '', component: SitesComponent }],
  },
  {
    path: 'model-creation',
    children: [{ path: '', component: ModelCreationComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceTableRoutingModule {}
