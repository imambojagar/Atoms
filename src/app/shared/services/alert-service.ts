import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  public isVisible: boolean = false;
  public alertText: string = '';
  public alertIcon: string = '';
  public alertClass: string = '';
  public alertIconClass: string = '';

  constructor() {}

  alerts = {
    success: {
      msg: 'Request Successfully saved.',
      timeout: 5000,
      icon: 'fa-check',
      class: 'alert-success',
      iconClass: 'bg-success-circle',
    },
    error: {
      msg: 'Error occurred while request is saving.',
      timeout: 5000,
      icon: 'fa-times',
      class: 'alert-error',
      iconClass: 'bg-error-circle',
    },
    warning: {
      msg: 'Warning occurred while request is saving!',
      timeout: 5000,
      icon: 'fa-exclamation-triangle',
      class: 'alert-warning',
      iconClass: 'bg-warning-circle',
    },
  };

  showAlert(type: keyof typeof this.alerts): void {
    if (this.isVisible) {
      return;
    }
    const alert = this.alerts[type];
    this.alertText = alert.msg;
    this.alertIcon = alert.icon;
    this.alertClass = alert.class;
    this.alertIconClass = alert.iconClass;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, alert.timeout);
  }
}
