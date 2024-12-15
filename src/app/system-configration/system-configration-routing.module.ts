import { ViewManagerAssignedComponent } from './manager-assigned/view-manager-assigned/view-manager-assigned.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { InstructionManagmentComponent } from './instruction-text/instructions-managment/instruction-managment.component';
import { InstructionDescriptionManagmentComponent } from './instruction-description/instructions-managment/instruction-description-managment.component';
import { InstructionDescriptionMappingComponent } from './instruction-description-mapping/instruction-description-mapping-managment/instruction-description-mapping.component';
import { EditLookupComponent } from './lookup-control/edit-lookup/edit-lookup.component';
import { RolesControlComponent } from './roles/roles-control/roles-control.component';
import { DefectsControlComponent } from './defects-control/defects-control.component';

const routes: Routes = [
  {
    path: 'permissions',
    component: PermissionsComponent,
  }, {
    path: 'modeldefects',
    component: DefectsControlComponent,
  },
  // app-routing.module.ts

  {
    path: 'instructiontext',
    loadChildren: () =>
      import('./instruction-text/instruction-text.module').then((m) => m.InstructionTextModule),
  },
  {
    path: 'instructiondescription',
    loadChildren: () =>
      import('./instruction-description/instruction-description.module').then((m) => m.InstructionDescriptionModule),
  },
  {
    path: 'instructionDescriptionMapping',
    loadChildren: () =>
      import('./instruction-description-mapping/instruction-description-mapping.module').then((m) => m.InstructionDescriptionMappingModule),
  },
  {
    path: 'lookups',
    loadChildren: () =>
      import('./lookup-control/lookup-control.module').then((m) => m.LookupControlModule),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('./roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'managerassigned',
    loadChildren: () =>
      import('./manager-assigned/manager-assigned.module').then((m) => m.ManagerAssignedModule),
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemConfigrationRoutingModule { }
