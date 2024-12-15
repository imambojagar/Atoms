import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  // public isLoading:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);

  //   constructor() { }

  private loaderSubject = new Subject<boolean>();
  loaderState$ = this.loaderSubject.asObservable();

  show() {
    this.loaderSubject.next(true);
  }

  hide() {
    this.loaderSubject.next(false);
  }
}
