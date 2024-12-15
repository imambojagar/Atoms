import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AssetsService } from '../../../services/assets.service';
import { CustomerService } from '../../../services/customer.service';
import { SupplierService } from '../../../services/supplier.service';
import { AssetGroupService } from '../../../services/asset-group.service';

@Component({
  selector: 'app-search-technical-retairements',
  standalone: true,
  imports: [PrimengModule, CommonModule, ReactiveFormsModule],
  templateUrl: './search-technical-retairements.component.html',
  styleUrl: './search-technical-retairements.component.scss'
})
export class SearchTechnicalRetairementsComponent implements OnInit {

  @Input('filters') filters: any; // = { pageSize: 10, pageNumber: 1, assetSerialNo: '', assetNumber: ''};
  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawerFilter') public drawerFilter: any;
  @Output() openSearchModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() AssetsTransferSearch: EventEmitter<any> = new EventEmitter<any>();

  filter: any = {
    pageSize: 10,
    pageNumber: 1
  };

  serialList: [] = [];
  siteList: [] = [];
  assetNumbs:[]=[];
  assetNames:[]=[];
  departmentList:[]=[];
  reasonsOptions:[]=[];
  supplierList: any[] = [];
  assetGroupsList:any[]=[];
  searchForm!: FormGroup;

  constructor(
    private assetApi: AssetsService,
    private siteApi:CustomerService,
    private formbuilder: FormBuilder,
    private assetGroupService:AssetGroupService,
    private supplierService:SupplierService) {

  }

      ngOnInit(): void {
        this.searchForm = this.formbuilder.group({
          id: null,
          assetId: null,
          siteId: null,
          departmentId: null,
          retirementDateFrom: null,
          retirementDateTo: null,
          reasonId:null,
          assetGroup: [],
          supplier:[]
        })
      }

      serialNumberFilter(event: any){
        this.filter.pageNumber=1;
        this.assetApi.GetAssetsAutoComplete(event.query).subscribe((res) => {
          this.serialList =res.data;
        });

    }

   /*   {"pageSize":10,"pageNumber":1,"id":null,"assetId":666,"siteId":null,
   "departmentId":null,"retirementDateFrom":null,"retirementDateTo":null,"reasonId":null,
   "assetGroup":null} */
    
   selectAssetNum(event: any) {
      this.assetApi.GetAssetsAutoCompleteMultiFilter({assetNumber:event.query}).subscribe((res : any) => {
        this.assetNumbs =res.data;
        /* this.filter.assetId = res.data.assetId; */
      });
    }


    selectAssetName(event: any) {
      this.assetApi.searchAsset(<any>{assetName:event.query}).subscribe((res : any) => {
        this.assetNames = res.data;
        /* this.filter.assetId = res.data.assetId; */
        console.log("athis.assetNames",this.assetNames);
      });
    }

    siteNumberFilter(event: any) {
     
      this.siteApi.searchCustomer({custName:event.query}).subscribe((res) => {
        const data = res.data;
        console.log("asset serial list", data)
        this.siteList = data;
      })
    }

    selecteSite(event: any) {
      this.filter.siteId= event.value.id
      this.filter.pageNumber=1;
    }

    supplierFilter(name: any) {
      this.supplierService.getSupplier({ suppliername: name.query }).subscribe((res) => {
        const data = res.data;
        this.supplierList = data;
      });
    }

    searchAssetGroup() {
      this.assetGroupService
      .searchAssetGroups({  })
      .subscribe((res) => (this.assetGroupsList = res.data));
    }

    selectAsset(event: any, select_type: string) {
      /* switch(select_type) {
        case 'asset':
          this.filter.assetId = event.id;
          break;
        case 'suplier':
          this.filter.supplierId = event.id;
          break;
        default:
          this.filter.assetId = null;
          this.filter.supplierId = null;
          break;
      }
  */
      console.log("event",  event);
      if(select_type == 'asset') {
        this.filter.assetId = event.value.id;
      }

      if(select_type == 'suplier') {
        this.filter.supplierId = event.value.id;
      }
      console.log("selected filter", this.filter);
    }

     

    searchTechre() { 
     this.AssetsTransferSearch.emit(this.filter);
     this.close_modal();
    }

    close_modal() {
      this.filter = {
        pageSize: 10,
        pageNumber: 1
      };
      this.searchForm.reset();
      this.openSearchModals.emit();
    }

}
