
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUrl } from 'src/app/atoms-http/models/app-url';
import { RequestParameter } from 'src/app/atoms-http/models/query-option';
import { HTTPService } from 'src/app/atoms-http/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AsideMenuService {
  requestParameter: RequestParameter;
  constructor(private httpService: HTTPService) { }


  getSideMenu(): Observable<any[]> {
    this.httpService.setProperties('Function/SideMenu', 'AsideMenuService', AppUrl.userManagementApiUrl);
    return this.httpService.getAll();

  }

}
