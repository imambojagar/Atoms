import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetUtilizationComponent } from './asset-utilization.component';

const routes: Routes = [
  { path: '', component: AssetUtilizationComponent },
  { path: 'view-control', component: AssetUtilizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetUtilizationRoutingModule { }
