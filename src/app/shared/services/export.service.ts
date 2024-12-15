import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ExportService {
  baseUrl: string = environment.BaseURL;

  constructor(private http: HttpClient) {}

  export(data: any, api: string) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.post<any>(this.baseUrl + api, data, httpOptions).pipe(
      map((res: any) => {
        console.log('api res', res);
        return res;
      })
    );
  }
}
