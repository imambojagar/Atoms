import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditLookupComponent } from './edit-lookup/edit-lookup.component';

const routes: Routes = [
  { path: 'edit-lookup', component: EditLookupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LookupControlRoutingModule { }
