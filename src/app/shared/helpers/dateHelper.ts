import { DatePipe } from '@angular/common';
import { isEmpty } from 'rxjs';
export class dateHelper {
  /// Pleas Use dd/mm/yy for p-calendar components

  /// @description Use it after getting the from backend
  public static parseDateFilds(object: any, fields: string[]) {
    if (Array.isArray(object))
      object.forEach((item) => this.updateDateFilds(item, fields));
    else this.updateDateFilds(object, fields);
  }
  private static updateDateFilds(object: any, fields: string[]) {
    let pipe = new DatePipe('en-us');
    fields.map((field) => {
      object[field] = pipe.transform(object[field], 'dd/MM/yyyy');
    });
  }
  public static parseTimeFilds(object: any, fields: string[]) {
    if (Array.isArray(object))
      object.forEach((item) => this.updateTimeFilds(item, fields));
    else this.updateTimeFilds(object, fields);
  }
  private static updateTimeFilds(object: any, fields: string[]) {
    let pipe = new DatePipe('en-us');
    fields.map((field) => {
      if (this.isEmpty(object, field)) {
        object[field] = null;
      }
      object[field] = pipe.transform(object[field], 'dd/MM/yyyy hh:mm');
    });
  }

  static isEmpty(object: any, field: any) {
    return (
      object[field] == null ||
      object[field] == undefined ||
      object[field].toString().trim() == ''
    );
  }
  /// @description Use it before sending data to backend
  public static reverseDateFilds(object: any, fields: string[]) {
    if (Array.isArray(object))
      object.forEach((item) => this.updateDateFields(item, fields));
    else this.updateDateFields(object, fields);
  }

  private static updateDateFields(object: any, fields: string[]) {
    let pipe = new DatePipe('en-us');
    fields.map((field) => {
      if (this.isEmpty(object, field)) {
        object[field] = null;
      }
      if (typeof object[field] == 'string' && object[field].indexOf('/') > -1) {
        let dateParts = object[field].split('/');
        object[field] = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
      } else {
        object[field] = pipe.transform(object[field], 'MM/dd/yyyy');
      }
    });
  }

  public static reverseTimeFilds(object: any, fields: string[]) {
    if (Array.isArray(object))
      object.forEach((item) => this.updateDateTimeFields(item, fields));
    else this.updateDateTimeFields(object, fields);
  }

  private static updateDateTimeFields(object: any, fields: string[]) {
    let pipe = new DatePipe('en-us');
    fields.map((field) => {
      if (this.isEmpty(object, field)) {
        object[field] = null;
      }
      if (typeof object[field] == 'string') {
        let dateParts = object[field].split('/');
        object[field] = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
      } else {
        object[field] = pipe.transform(object[field], 'MM/dd/yyyy hh:mm');
      }
    });
  }

  public static ConvertDateWithSameValue(date: Date | null): Date | null {
    if (date == null || date.toString().trim() == '' || date == undefined)
      return null;
    var isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); //.toISOString();
    return isoDate;
  }

  public static handleDateApi(date: any): Date | null {
    if (date == null) return null;
    console.log('json date', date);
    var dt = new Date(date); //.toISOString();
    console.log('converted date from json ', dt);
    return dt;
  }

  public static ConvertDateToStringTimeOnly(date: Date | null): string | null {
    const convDate: Date | null = this.ConvertDateWithSameValue(date);
    if (convDate == null) return null;
    let tm: string = convDate.toISOString();
    tm = tm.substr(11, 8);
    return tm;
  }

  public static stringTimeToDateTime(tm: any): Date | null {
    if (tm == null) return null;
    let strDate: string = new Date().toISOString();
    let day = strDate.substr(0, 10) + 'T' + tm + '.000';
    let date = new Date(day);
    return date;
  }
}
