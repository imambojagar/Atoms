import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CylindersReferenceComponent } from './cylinders-reference/cylinders-reference.component';
import { PriceComponent } from './price/price.component';
import { PriceViewComponent } from './price-view/price-view.component';
import { CylindersReferenceViewComponent } from './cylinders-reference-view/cylinders-reference-view.component';

const routes: Routes = [
  { path: 'amount', component: CylindersReferenceViewComponent },
  { path: 'amount/add-control', component: CylindersReferenceComponent },
  { path: 'amount/edit-control', component: CylindersReferenceComponent },
  { path: 'price', component: PriceViewComponent },
  { path: 'price/add-control', component: PriceComponent },
  { path: 'price/edit-control', component: PriceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CylindersReferenceRoutingModule {}
