import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrcalCodeService {
  baseUrl: string = environment.BaseURL;
  url: string = 'OrcalCode/';
  constructor(private http: HttpClient) {}

  addOrcalCode(data: any) {
    return this.http.post(this.baseUrl + this.url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getOrcalCodes(data: any) {
    return this.http.post(this.baseUrl + this.url + 'search/', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  updateOrcalCodes(data: any) {
    return this.http.put(this.baseUrl + this.url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  deleteOrcalCodes(id: number) {
    return this.http.delete(this.baseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
