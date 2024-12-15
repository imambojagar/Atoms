
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsBulkUpdateComponent } from './assets-bulk-update/assets-bulk-update.component';
import { AssetsManagementComponent } from './assets-management/assets-management.component';
import { AssetsComponent } from './assets.component';
import { UpdateAssetInformationComponent } from './update-asset-information/update-asset-information.component';


const routes: Routes = [
  { path: '', component: AssetsComponent },
  { path: 'add-control', component: AssetsManagementComponent },
  { path: 'edit-control', component: AssetsManagementComponent },
  { path: 'view-control', component: AssetsManagementComponent },
  { path: 'assets-bulk-update', component: AssetsBulkUpdateComponent }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { 


  
}
