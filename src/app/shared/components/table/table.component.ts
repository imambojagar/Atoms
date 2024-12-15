
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedTable } from './table';
import { FormBuilder, FormControl } from '@angular/forms';
import { ComparisonOperations } from './comparison.enum';
import { TrPipe } from '../../pipes/tr.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../primeng.module';
@Component({
  standalone: true,
  imports: [TrPipe, TranslateModule, CommonModule, PrimengModule],
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  // filterText: FormControl;

  @Input() tableData: SharedTable = new SharedTable();
  @Input() StatusStyle: boolean = false;
  @Input() loading: boolean = false;
  @Input() checkbox: boolean = false;
  @Input() hidePagination: boolean = false;
  @Output() deleteRow = new EventEmitter<string>();
  @Output() addRow = new EventEmitter<string>();
  @Output() editRow = new EventEmitter<string>();
  @Output() showDetails = new EventEmitter<string>();
  @Output() other = new EventEmitter<string>();
  @Output() extraDetails = new EventEmitter<string>();

  @Output() cellClick = new EventEmitter<string>();

  p: number = 1;
  constructor(private fb: FormBuilder) {

  }


  ngOnInit(): void {
    // this.filterText = this.fb.control('');

  }

  delete(id: any) {
    this.deleteRow.emit(id);
  }

  add() {
    this.addRow.emit();
  }

  edit(id: any) {
    this.editRow.emit(id);
  }

  details(info: any) {
    this.showDetails.emit(info);
  }

  otherFun(info: any) {
    this.other.emit(info);
  }

  extraDetailsFunction(info: any) {
    this.extraDetails.emit(info);
  }

  cellClickEvent(info: any, header: any) {
    let obj = {
      info: info,
      header: header
    }
    this.cellClick.emit(JSON.stringify(obj));

  }

  inClickHeader(header: any) {
    return this.tableData.cellClickHeaders.includes(header);
  }

  get actionListOrButtons() {
    let actions = 0;
    if (this.tableData.deleteRow) actions++
    if (this.tableData.showDetails) actions++
    if (this.tableData.addRow) actions++
    if (this.tableData.extraDetails) actions++

    return actions > 2
  }

  rowContainsFilterText(row: any) {
    // let str = '';
    // Object.keys(row).forEach(e => {
    //   str += row[e].toString();
    // })
    // return str.toLowerCase().includes(this.filterText.value.toString().toLowerCase());
    return true;
  }


  getClass(header: string, value: any) {
    let classes = ``;

    if (this.tableData.tdStyles[header]) {

      this.tableData.tdStyles[header].forEach((e: any) => {
        let validCase = true;
        e.operationValue.forEach((obVal: any) => {
          switch (obVal.operation) {
            case ComparisonOperations['=']:
              validCase = validCase && (obVal.value == value)
              break;
            case ComparisonOperations['!=']:
              validCase = validCase && (obVal.value != value)
              break;
            case ComparisonOperations['>']:
              validCase = validCase && (value > obVal.value)
              break;
            case ComparisonOperations['<']:
              validCase = validCase && (value < obVal.value)
              break;
            default:
              break;
          }

        });
        if (validCase)
          classes += ` ${e.class}`;
      });

    }

    return classes;



  }
}
