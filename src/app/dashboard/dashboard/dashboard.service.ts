import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const MESSAGES = [
  {
    img: 'assets/images/heros/1.jpg',
    subject: 'Hydrogen',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/2.jpg',
    subject: 'Helium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/3.jpg',
    subject: 'Lithium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/4.jpg',
    subject: 'Beryllium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/6.jpg',
    subject: 'Boron',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
];

@Injectable()
export class DashboardService {
  baseUrl: string = 'http://10.201.111.121:5000/api/'; //environment.BaseURL;

  url: string = 'Dashboard/';

  constructor(private http: HttpClient) { }

  GetLookupFilter(typeEnum: any) {
    return this.http.get<any[]>(this.baseUrl + this.url + 'GetLookupFilter?typeEnum=' + typeEnum).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboardSites() {
    return this.http.get(this.baseUrl + this.url + 'GetDashboardSites').
      pipe(map((res: any) => {
        return res;
      }))
  }

  GetUsers() {
    return this.http.post(this.baseUrl + this.url + 'GetUsers', null).
      pipe(map((res: any) => {
        return res;
      }))
  }

  GetUserByRoleValueDashboard(value: any) {

    return this.http
      .get<any>(this.baseUrl + this.url + 'GetUserByRoleValueDashboard?value=' + value)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  GetDashboard1(data: any) {
    return this.http.post(this.baseUrl + this.url + 'GetDashboard1', data).
      pipe(map((res: any) => {
        return res;
      }))
  }


  GetDashboard2(data: any) {
    return this.http.post(this.baseUrl + this.url + 'GetDashboard2', data).
      pipe(map((res: any) => {
        return res;
      }))
  }

  GetDashboard3(data: any) {
    return this.http.post(this.baseUrl + this.url + 'GetDashboard3', data).
      pipe(map((res: any) => {
        return res;
      }))
  }

  GetDashboard4(data: any) {
    return this.http.post(this.baseUrl + this.url + 'GetDashboard4', data).
      pipe(map((res: any) => {
        return res;
      }))
  }

  GetDashboard5(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard5', data).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard6(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard6', data).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard7(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard7', data).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard8(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard8', data).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard9(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard9', data).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard10(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard10', data).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard1FMS(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard1FMS', null).
      pipe(map((res: any[]) => {
        return res;
      }))
  }

  GetDashboard2FMS(data: any) {
    return this.http.post<any[]>(this.baseUrl + this.url + 'GetDashboard2FMS', null).
      pipe(map((res: any[]) => {
        return res;
      }))
  }



  GetFMSPriorityDashboard() {
    return this.http.get(this.baseUrl + this.url + 'GetFMSTaskByPriority').
      pipe(map((res: any) => {
        return res;
      }));
  }


  GetFMSTaskBySitesDashboard() {
    return this.http.get(this.baseUrl + this.url + 'GetFMSTaskBySites').
      pipe(map((res: any) => {
        return res;
      }));
  }
  GetDashboardServiceDeliveryCount() {
    return this.http.get(this.baseUrl + 'ServiceRequest/' + 'GetDashboardServiceDeliveryCount').
      pipe(map((res: any) => {
        return res;
      }));
  }

}
