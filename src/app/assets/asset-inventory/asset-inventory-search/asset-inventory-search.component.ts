import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AssetInventoryService } from '../../../services/asset-inventory.service';
import { CustomerService } from '../../../services/customer.service';
import { AssetTransferService } from '../../../services/asset-transfer.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-inventory-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './asset-inventory-search.component.html',
  styleUrl: './asset-inventory-search.component.scss',
})
export class AssetInventorySearchComponent implements OnInit {
  // @Input('filter') filter: any; // = { pageSize: 10, pageNumber: 1, assetSerialNo: '', assetNumber: ''};
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawerFilter') public drawerFilter: any;
  @Output() openSearchModals: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() AssetInventorySearch: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  assetInventorySearchForm!: FormGroup;
  titleList: [] = [];
  buildingList: any[] = [];
  floorList: any[] = [];
  roomList: [] = [];
  customers: [] = [];
  departmentList!: any[];

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private api: AssetInventoryService,
    private siteApi: CustomerService,
    private assetTransfer: AssetTransferService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.assetInventorySearchForm = this.buildFilterForm(this.fb);
    // this.search();
  }

  buildFilterForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      surveyNo: null,
      surveyCode: null,
      surveyDateFrom: null,
      surveyDateTo: null,
      siteId: null,
      buildingId: null,
      floorId: null,
      departmentId: null,
      roomId: null,
      assetId: null,
      statusId: null,
      isAutoComplete: null,
      assetGroup: null,
    });
  }

  resetFilter() {
    this.filter = {};
  }

  close_modal() {
    this.assetInventorySearchForm.reset();
    this.openSearchModals.emit();
  }

  search() {
    this.AssetInventorySearch.emit(this.filter);
    // this.Reset();
    // this.resetFilter();
    this.close_modal();
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
    };
    this.assetInventorySearchForm.reset();
  }

  fillTitle(event: any) {
    this.api.getAll({ surveyCode: event.value }).subscribe((res: any) => {
      const data = res.data;
      console.log('title', data);
      this.titleList = data;
    });
  }

  fillBuilding(event: any) {
    this.api.getAll({ buildingId: event.value }).subscribe((res: any) => {
      const data = res.data;
      console.log('building', data);
      this.buildingList = data;
    });
  }

  fillFloor(event: any) {
    this.api.getAll({ floorId: event.value }).subscribe((res: any) => {
      const data = res.data;
      console.log('floor', data);
      this.floorList = data;
    });
  }

  //site block
  getCustomers($event: any) {
    this.siteApi
      .GetCustomersAutoComplete($event.value)
      .subscribe((a) => (this.customers = a.data));
  }

  getBuildingList($event: any) {
    console.log('site event', $event);
    this.filter.siteId = $event.id;
    this.assetTransfer
      .getBuildingLookup({ siteId: $event.value.id })
      .subscribe((a) => {
        this.buildingList = a.data;
      });
  }

  getFloorList(event: any) {
    this.filter.buildingId = event.value;
    this.assetTransfer
      .getFloorLookup({
        siteId: this.assetInventorySearchForm.value.siteId.id,
        buildingId: event.value,
      })
      .subscribe((res: any) => {
        this.floorList = res.data;
      });
  }

  getDepartments(event: any) {
    this.filter.floorId = event.value;

    this.assetTransfer
      .getDepLookup({
        siteId: this.assetInventorySearchForm.value.siteId.id,
        buildingId: this.assetInventorySearchForm.value.buildingId,
        floorId: event.value,
      })
      .subscribe((res: any) => {
        this.departmentList = res.data;
      });
  }
  onSelectDept(event: any) {
    this.filter.departmentId = event.value;

    this.assetTransfer
      .getRoomLookup({
        siteId: this.assetInventorySearchForm.value.siteId.id,
        buildingId: this.assetInventorySearchForm.value.buildingId,
        floorId: this.assetInventorySearchForm.value.floorId,
        departmentId: event.value,
      })
      .subscribe((res: any) => {
        this.roomList = res.data;
      });
  }

  onSelectRoom(event: any) {
    this.filter.roomId = event.value;
  }
}
