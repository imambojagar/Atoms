import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderingCylindersLoxService {
  BaseUrl = 'http://10.201.111.121:5000/api/'; // environment.BaseURL;
  url = 'BackupRequest/';
  constructor(private http: HttpClient) {}

  addRequest(model: any) {
    return this.http.post(this.BaseUrl + this.url, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateRequest(model: any) {
    return this.http.put(this.BaseUrl + this.url, model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSingleRequest(id: number) {
    return this.http.get(this.BaseUrl + this.url + id).pipe();
  }

  deleteRequest(id: number) {
    return this.http.delete(this.BaseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  calculateRequest(model: any) {
    return this.http.post(this.BaseUrl + this.url + 'caclulate', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  searchRequest(model: any) {
    return this.http.post(this.BaseUrl + this.url + 'search', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  prMultiUpdate(model: any) {
    return this.http.put(this.BaseUrl + this.url + 'pr/multi', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  poMultiUpdate(model: any) {
    return this.http.put(this.BaseUrl + this.url + 'po/multi', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  invoiceMultiUpdate(model: any) {
    return this.http.put(this.BaseUrl + this.url + 'invoice/multi', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  prfMultiUpdate(model: any) {
    return this.http.put(this.BaseUrl + this.url + 'prf/multi', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  pcdMultiUpdate(model: any) {
    return this.http.put(this.BaseUrl + this.url + 'pcd/multi', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  moveStep(id: number) {
    return this.http.put(this.BaseUrl + this.url + 'move/' + id, '').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  poSummition(model: any) {
    return this.http.post(this.BaseUrl + this.url + 'sum', model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
