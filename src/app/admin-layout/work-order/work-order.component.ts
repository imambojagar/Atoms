import { AfterViewInit, Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';



import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { DOCUMENT, NgClass } from '@angular/common';
import { BubblePaginationDirective } from '../../shared/directives/bubble-pagination.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDropdownComponent } from '../../shared/components/custom-dropdown/custom-dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
import { PopOverComponent } from '../components/pop-over/pop-over.component';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgClass,
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatPaginator,
    BubblePaginationDirective,
    CustomDropdownComponent,
    PopOverComponent,
    NgbModule
  ],
  templateUrl: './work-order.component.html',
  styleUrl: './work-order.component.scss'
})
export class WorkOrderComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild("hoverBtn") hoverBtn!: ElementRef;

  constructor(@Inject(DOCUMENT) private _document: Document) {

  }



  displayedColumns: string[] = [
    'sn', 'assetname', 'manufacturer', 'site',
    'situation', 'totalworkinghours', 'currentsituation', 'nextstep', 'action'
  ];

  listData: any = [
    {id: 1, name: 'Under Repair Internal'},
    {id: 2, name: 'Waiting for quotation '},
    {id: 3, name: 'Waiting for vendor '},
    {id: 4, name: 'Waiting for delivery '},
    {id: 5, name: 'Under Observation'},
    {id: 6, name: 'Fixed'},
    {id: 7, name: 'Waiting for it'}
  ]

  dropdownText: string = 'Next Step';

  popover_active: boolean = false;
  isLoading: boolean = false;
  recordsperPage: number = 10;
  currentPage  = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  numberOfPages: number = 0;
  numbeOfRecords: number = 0;
  selectedItem: any = {};


  ngOnInit(): void {
    this.numberOfPages = ELEMENT_DATA.length / this.recordsperPage;
    this.numbeOfRecords= ELEMENT_DATA.length;
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
}



const ELEMENT_DATA: any[] = [
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
  {sn: '0022', assetname: "Sphygmomanometers, Mercury", manufacturer: "Riester/Empire N", site: "Al Rayyan Hospital", situation: "Under Repair Internal", totalworkinghours: "5", currentsituation: "Under Repair Internal"},
];

