import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';



const routes: Routes = [
  
    
      
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'login', pathMatch: 'full'},//should be error 404
    
  
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule {}
