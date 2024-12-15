import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetGroupComponent } from './asset-group/asset-group.component';
import { ViewNameDefinitionComponent } from './name-definition/view-name-definition/view-name-definition.component';
import { AddNameDefinitionComponent } from './name-definition/add-name-definition/add-name-definition.component';
import { EditDeleteNameDefinitionComponent } from './name-definition/edit-delete-name-definition/edit-delete-name-definition.component';
import { OrcalCodeControlComponent } from './name-definition/orcal-code-control/orcal-code-control.component';
import { ViewModelDefinitionComponent } from './model-defination/view-model-definition/view-model-definition.component';
import { AddModelComponent } from './taxonomy/add-model/add-model.component';
import { ViewTaxonomyComponent } from './taxonomy/view-taxonomy/view-taxonomy.component';
import { AssetsComponent } from './assets/assets.component';
import { AssetsManagementComponent } from './assets/assets-management/assets-management.component';
import { AssetsBulkUpdateComponent } from './assets/assets-bulk-update/assets-bulk-update.component';
import { AssetInventoryComponent } from './asset-inventory/asset-inventory.component';
import { UpdateAssetInformationComponent } from './assets/update-asset-information/update-asset-information.component';
import { TechnicalRetirementModel } from '../models/technical-retirement';
import { ViewTRetirementComponent } from './technical-retirement/view-t-retirement/view-t-retirement.component';
import { AssetUtilizationComponent } from './asset-utilization/asset-utilization.component';
import { VeiwMainteneceCcontractComponent } from './maintenece-ccontract/veiw-maintenece-ccontract/veiw-maintenece-ccontract.component';

const routes: Routes = [
  {
    path: 'asset-groups',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'name-definition',
    children: [
      { path: '', component: ViewNameDefinitionComponent },
      { path: 'add-control', component: AddNameDefinitionComponent },
      { path: 'edit-control', component: EditDeleteNameDefinitionComponent },
      { path: 'oracle-code-control', component: OrcalCodeControlComponent }
    ]
  }, {
    path: 'taxonomy',
    children: [
      { path: 'add-control', component: AddModelComponent },
      { path: '', component: ViewTaxonomyComponent },
    ]
  },
  {
    path: 'assets',
    children: [
      { path: '', component: AssetsComponent },
      { path: 'add-control', component: AssetsManagementComponent },
      { path: 'edit-control', component: AssetsManagementComponent },
      { path: 'view-control', component: AssetsManagementComponent },
      { path: 'assets-bulk-update', component: UpdateAssetInformationComponent },
      // { path: 'update-asset-information', component: UpdateAssetInformationComponent }
    ]
  },
  // {
  //   path: 'update-asset-information',
  //   children: [
  //     { path: '', component: UpdateAssetInformationComponent },
  //   ]
  // },
  {
    path: 'model-definition',
    children: [
      { path: '', component: ViewModelDefinitionComponent },
    ]
  },
  {
    path: 'lookup',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'maintenance-contract',
    children: [
      { path: '', component: VeiwMainteneceCcontractComponent },
    ]
  },
  {
    path: 'technical-retirement',
    children: [
      { path: '', component: ViewTRetirementComponent },
    ]
  },
  {
    path: 'survey',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'asset-inventory',
    children: [
      { path: '', component: AssetInventoryComponent },
    ]
  },
  {
    path: 'asset-utilization',
    children: [
      { path: '', component: AssetUtilizationComponent },
    ]
  },
  {
    path: 'translate',
    loadChildren: () =>
      import('./translate/translate.module').then((module) => module.TranslateModule)
  },
  {
    path: 'lang',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'email',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'custom-cards',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'permissions',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'insertruction-text',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'insertruction-description',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'insertruction-description-mapping',
    children: [
      { path: '', component: AssetGroupComponent },
    ]
  },
  {
    path: 'maintenence',
    children: [
      { path: '', component: VeiwMainteneceCcontractComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
