import { AfterViewInit, Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DOCUMENT, NgClass } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PopOverComponent } from '../../../layout/admin-layout/components/pop-over/pop-over.component';
import { BubblePaginationDirective } from '../../../shared/directives/bubble-pagination.directive';
import { CustomDropdownComponent } from '../../../shared/components/custom-dropdown/custom-dropdown.component';
import { CommonService } from '../../../shared/services/common_service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-work-order-search',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink,
    BubblePaginationDirective,
    CustomDropdownComponent,
    PopOverComponent,
    NgbModule,
    SharedModule
  ],
  templateUrl: './work-order-search.component.html',
  styleUrl: './work-order-search.component.scss'
})
export class WorkOrderSearchComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild("hoverBtn") hoverBtn!: ElementRef;

  constructor(@Inject(DOCUMENT) private _document: Document,
    private commonService: CommonService,) {

  }

  displayedColumns: string[] = [
    'sn', 'assetname', 'manufacturer', 'site',
    'situation', 'totalworkinghours', 'currentsituation', 'nextstep', 'action'
  ];

  listData: any = [
    { id: 1, name: 'Under Repair Internal' },
    { id: 2, name: 'Waiting for quotation ' },
    { id: 3, name: 'Waiting for vendor ' },
    { id: 4, name: 'Waiting for delivery ' },
    { id: 5, name: 'Under Observation' },
    { id: 6, name: 'Fixed' },
    { id: 7, name: 'Waiting for it' }
  ]

  dropdownText: string = 'Next Step';

  popover_active: boolean = false;
  isLoading: boolean = false;
  recordsperPage: number = 10;
  currentPage = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  numberOfPages: number = 0;
  numbeOfRecords: number = 0;
  selectedItem: any = {};


  ngOnInit(): void {
    this.numberOfPages = ELEMENT_DATA.length / this.recordsperPage;
    this.numbeOfRecords = ELEMENT_DATA.length;
    this.dataToggle();
  }

  dataToggle() {
    this.commonService.updateConfig({
      appConfig: {
        showProgressBar: !this.isLoading,
        breadcrumText: 'Work Order'
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  popoverToggle() {
    this.popover_active = !this.popover_active
  }

  pagesEvent(event: PageEvent) {
    console.log("event", event);
    this.isLoading = false;
    // this.pageSize = event.pageSize + 1;
    event.pageIndex += 1;
    this.currentPage = event.pageIndex;
  }



  mouseEnter() {
    console.log("mouseEnter", this.hoverBtn.nativeElement);
    this.hoverBtn.nativeElement.click();
  }

  mouseLeave() {
    console.log("mouse leave :");
    this.hoverBtn.nativeElement.click();
  }

  selectedItems(item: any) {
    this.selectedItem = item;
  }

  exportWorkOrderList() {
    const header = ['Sn', 'Asset Name', 'Manufacturer', 'Site', 'Situation', 'Total Working Hours', 'Current Situation'];
  
    const data = this.dataSource.data;
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Work_Order_List');
    }
  
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = `${fileName}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    
}



const ELEMENT_DATA: any[] = [
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
  { sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal" },
];

