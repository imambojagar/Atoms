import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class GasRoomService {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; // environment.BaseURL;

  url: string = 'Room/';

  constructor(private http: HttpClient) {}

  addRoom(data: any) {
    return this.http.post(this.baseUrl + this.url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateRoom(data: any) {
    return this.http.put(this.baseUrl + this.url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getRoomById(id: number) {
    return this.http.get(this.baseUrl + this.url + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteRoom(id: any) {
    return this.http.delete(this.baseUrl + this.url + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  searchRoom(filter: any) {
    return this.http.post(this.baseUrl + this.url + 'search', filter).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  roomDashboard(model: any) {
    return this.http.post(this.baseUrl + this.url + 'calculate', model).pipe();
  }

  medicalGasDailyReport(model: any) {
    return this.http
      .post(this.baseUrl + this.url + 'MGDailyInspectionReport', model)
      .pipe();
  }
}
