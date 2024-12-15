import { AppUrl } from 'src/app/atoms-http/models/app-url';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { HTTPService } from 'src/app/atoms-http/services/http.service';
import { I } from '@angular/cdk/keycodes';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  dateFormat = 'MMM dd, yyyy - hh:mm:ss ';

  constructor(private datePipe: DatePipe, private baseService: HTTPService) {

  }


  public exportDataSourceAsExcelFileByCode(dataSourceCode: number, excelFileName: string, includedColumns: any[], rows: any[]): void {
    const dataSourceModel: any = {
      dataSourceCode,
      includedColumns: includedColumns?.map(x => x.name),
      queryParameterValuesDictionary: null,
    };


    if (rows && rows.length > 0) {

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
      const workbook: XLSX.WorkBook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],

      };
      const wscols = includedColumns.map(x => ({ width: x.width }));
      worksheet['!cols'] = wscols;

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }


  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const exportDate = (
      (this.datePipe.transform(new Date(), this.dateFormat) as any)
    ) as Date;

    FileSaver.saveAs(
      data,
      fileName + '_export_' + exportDate + EXCEL_EXTENSION
    );
  }

}
