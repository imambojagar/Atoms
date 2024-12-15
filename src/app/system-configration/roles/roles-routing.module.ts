import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesControlComponent } from './roles-control/roles-control.component';

const routes: Routes = [{ path: '', component: RolesControlComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule { }
