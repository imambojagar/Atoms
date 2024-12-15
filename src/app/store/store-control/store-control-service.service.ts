import { Injectable } from '@angular/core';
/* import { environment } from 'src/environments/environment'; */
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StoreControlServiceService {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; //environment.BaseURL;
  url: string = 'Store/';

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
    return this.http.post(this.baseUrl + this.url + 'search', data).pipe(
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

  export(data: any) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.post(this.baseUrl + this.url + 'ExportExcel', data, httpOptions);
  }
}
