import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ModelCreationService {
  //   baseUrl: string = environment.BaseURL;
  baseUrl: string = 'http://10.201.111.121:5000/api/';
  url: string = 'ModelCreation/';

  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http.post(this.baseUrl + this.url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  get(id: number) {
    return this.http.get(this.baseUrl + this.url + id).pipe(
      map((res: any) => {
        console.log('get res:', res);
        return res;
      })
    );
  }

  search(data: any) {
    return this.http
      .post(this.baseUrl + this.url + 'searchModelCreation', data)
      .pipe(
        map((res: any) => {
          console.log('search res', res);
          return res;
        })
      );
  }

  update(data: any) {
    return this.http.put(this.baseUrl + this.url, data).pipe(
      map((res: any) => {
        console.log('update res:', res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + this.url + id).pipe(
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
