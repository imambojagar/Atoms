import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,

} from '@angular/router';
import { AuthenticationService } from 'src/app/atoms-http/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard  implements CanActivate{
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(private authenticationService: AuthenticationService, private router: Router,private titleService:Title) { }

  canActivate(route: ActivatedRouteSnapshot,) {
    this.titleService.setTitle(route.data.title);

    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['SYS/dashboard']);

   
    return false;
    }
    
    return true;
  }
}