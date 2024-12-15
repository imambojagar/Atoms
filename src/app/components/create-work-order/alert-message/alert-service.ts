import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

  constructor() { }
  public isVisible: boolean = false;
  alertText: any;
  alerts = {
      'success': {
        msg: `success. (added: ${new Date().toLocaleTimeString()})`,
        timeout: 5000
      }
    };

  showAlert(type : any) : void {
    if (this.isVisible) { 
      return;
    } 
    // this.alertText = this.alerts[type].msg;
    this.isVisible = true;
    // setTimeout(()=> this.isVisible = false, this.alerts[type].timeout)
  }
}