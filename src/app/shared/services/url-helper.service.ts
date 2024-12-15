import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlHelperService {

  constructor(private http: HttpClient) {
  }

  get(url: string): Observable<any> {
      let options = new HttpHeaders();
      options=options.append("Access-Control-Allow-Origin", "*")

      return new Observable((observer) => {
          let objectUrl: string = null;

          this.http
              .get(url, {headers:options})
              .subscribe((m :any)=> {
                console.log(m)
                  objectUrl = URL.createObjectURL(m.blob());
                  observer.next(objectUrl);
              });

          return () => {
              if (objectUrl) {
                  URL.revokeObjectURL(objectUrl);
                  objectUrl = null;
              }
          };
      });
  }
}
