import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetGroupService } from '../../../services/asset-group.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { AssetsService } from '../../../services/assets.service';
import { CustomerService } from '../../../services/customer.service';
import { AssetTransferService } from '../../../services/asset-transfer.service';

@Component({
  selector: 'app-asset-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './asset-search.component.html',
  styleUrl: './asset-search.component.scss'
})
export class AssetSearchComponent implements OnInit {

  searchForm!: FormGroup<any>;
  AssetGroups: any[] = [];
  @Input('filter') filter: any; // = { pageSize: 10, pageNumber: 1, assetSerialNo: '', assetNumber: ''};
  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawerFilter') public drawerFilter: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() AssetsTransferSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  serialList:[]=[];
  titleList:[]=[];
  assetNumberList:[]=[];
  departmentList:[]=[];
  siteList:[]=[];
  buildingList:[]=[]
  floorList:[]=[]

  constructor( private formbuilder: FormBuilder,
          private assetApi: AssetsService,
          private assetGroupService: AssetGroupService,
          private siteApi: CustomerService,
          private api: AssetTransferService,
        ) {

  }

  ngOnInit(): void {
    this.searchForm=this.formbuilder.group({
      id: null,
      transferNo: null,
      transferCode: null,
      assetId: null,
      destSiteId: null,
      destBuildingId: null,
      destFloorId: null,
      destDepartmentId: null,
      destRoom: null,
      senderSiteId: null,
      senderDepartmentId: null,
      senderAssignedEmployeeId: null,
      receiverAssignedEmployeeId: null,
      relatedToEmployeeId:null,
      assetGroup:null
    });

    this.getAssetGroups();
  }

  getAssetGroups(){
    this.assetGroupService.searchAssetGroups({  }).subscribe((res: any) => {
      this.AssetGroups = res.data
    });
  }

  close_modal() {
    this.openSearchModals.emit();
  }

  selectAssetSN(event: any) {
    this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
      this.serialList =res.data;

    });
    this.filter.assetSerialNo=event.query;
  }

  assetNumberFilter($event:any){
    this.filter.pageNumber=1;
    this.assetApi.searchAsset(<any>{assetNo:$event.query}).subscribe((res) => {
      this.assetNumberList =  res.data;

  })
  this.filter.assetNumber=$event.query;
  }

  siteNumberFilter(event: any) {
    this.filter.pageNumber=1;
    this.siteApi.searchCustomer({custName:event.query}).subscribe((res) => {
      const data = res.data;
      console.log("asset serial list", data)
      this.siteList = data;

    })
  }
  titleFilter(event:any){
    this.filter.pageNumber=1;
    this.api.getAssetTransfer({transferCode:event.query}).subscribe((res) => {
      this.titleList = res.data;
    });
  }
  onInput($event:any){
    this.filter.destRoom=$event.target.value;
  }


  search() {
    this.AssetsTransferSearch.emit(this.searchForm.value.assetGroup);    // this.getAssetsTransferSearch();
    this.showmodal = false;
  }

  Reset(){
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      id: null,
      transferNo: null,
      transferCode: null,
      assetId: null,
      destSiteId: null,
      destBuildingId: null,
      destFloorId: null,
      destDepartmentId: null,
      destRoom: null,
      senderSiteId: null,
      senderDepartmentId: null,
      senderAssignedEmployeeId: null,
      receiverAssignedEmployeeId: null,
      assetGroup:null
    };
    this.searchForm.reset();
    this.AssetsTransferSearch.emit(this.searchForm.value.assetGroup);
  }

}
