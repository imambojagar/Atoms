import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
/* import { environment } from 'src/environments/environment'; */
import { Observable } from 'rxjs';
import { PartDeliveryModel } from './part-delivery.model';

@Injectable({
  providedIn: 'root',
})
export class partDeliverService {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; //environment.BaseURL;
  url: string = 'partDelivery/';
  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http
      .post<PartDeliveryModel>(this.baseUrl + this.url, data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  get(id: number) {
    return this.http
      .get<PartDeliveryModel>(this.baseUrl + this.url + id)
      .pipe(
        map((res: any) => {
          console.log('get res:', res);
          return res;
        })
      );
  }

  search(data: any) {
    console.log("filter to api",data)
    return this.http.post<any>(this.baseUrl + this.url + 'search', data).pipe(
      map((res: any) => {
        console.log("search res",res)
        return res;

      })
    );
  }

  update(data: any) {
    return this.http
      .put<PartDeliveryModel>(this.baseUrl + this.url, data)
      .pipe(
        map((res: any) => {
          console.log('update res:', res);
          return res;
        })
      );
  }

  delete(id: number) {
    return this.http
      .delete<PartDeliveryModel>(this.baseUrl + this.url + id)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getLookups(data: any) {
    return this.http
      .get<any>(
        this.baseUrl + 'Lookups/GetLookup?lookupEnum=' + data.queryParams
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
