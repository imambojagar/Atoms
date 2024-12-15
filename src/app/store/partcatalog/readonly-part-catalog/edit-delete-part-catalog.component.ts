/* import { dateHelper } from 'src/app/shared/helpers/dateHelper'; */
import { PartCatalogService } from './../part-catalog.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService, ConfirmationService, Message, MenuItem, ConfirmEventType, SelectItem } from "primeng/api";
/* import { AuthService } from "src/app/data/service/auth.service";
import { ApiService } from "src/app/data/service/name-definition.service";
import validateForm from "src/app/shared/helpers/validateForm"; */
import { PartCatalogModel } from "../part-catalog.model";
/* import { Lookup } from 'src/app/data/Enum/lookup'; */
import { buildForm, buildModelForm, buildStockForm, buildSupplierForm, getPartCatalogModel } from '../add-part-form-builder';
import { DatePipe } from '@angular/common';
/* import { CustomerService } from 'src/app/data/service/customer.service';
import { SupplierService } from 'src/app/data/service/supplier.service'; */
import { StoreControlServiceService } from '../../store-control/store-control-service.service';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { dateHelper } from '../../../shared/helpers/dateHelper';
/* import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */




@Component({
  selector: 'edit-delete-part-catalog',
  templateUrl: './edit-delete-part-catalog.component.html',
  styleUrls: ['./edit-delete-part-catalog.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class EditDeletePartCatalogComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('tabIndex') tabIndex : any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  partCatalogForm !: FormGroup;
  modelInfo!: FormGroup;
  inventory!: FormGroup;
  supplier!: FormGroup;
  partCatalogModel: PartCatalogModel = new PartCatalogModel();
  items!: MenuItem[];
  /* tabIndex: number = 0; */

   //Dropdown Lists
   partType:[] = [];
   warranty :[] = [];
   site :[] = [];
   customers: [] = [];
   suppliers: [] = [];
   model: any = null;

  constructor(private router: ActivatedRoute,
    private route:Router,
    private formbuilder: FormBuilder,
    private api: PartCatalogService,
    private storeService: StoreControlServiceService,
    private messageService: MessageService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

  Init(): void {
    this.modelInfo = buildModelForm(this.formbuilder);
    this.inventory = buildStockForm(this.formbuilder);
    this.supplier = buildSupplierForm(this.formbuilder);
    this.partCatalogForm = buildForm(this.formbuilder, this.modelInfo, this.inventory, this.supplier);

    /* this.router.queryParams.subscribe((params: any) => { */
      this.tabIndex = 1 //params.index;
      this.partCatalogModel.id = this.edit_asset_id; // params.data;
      this.api.getPartItem(this.edit_asset_id).subscribe(res => {
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);
        const data=res.data;
        this.model = data;
        const message=res.message;
        const sucess=res.isSuccess;
        if(sucess==true) {
          dateHelper.parseDateFilds(data, ['endSupport', 'stopProduction']);
          data.endSupportText = data.endSupport;
          data.stopProductionText = data.stopProduction;
          /* debugger; */
          for (let index = 0; index < data.modelInfo.length - 1; index++) this.addMoreModel();
          for (let index = 0; index < data.supplier.length - 1; index++) this.addMoreSupplier();
          for (let index = 0; index < data.inventory.length ; index++) this.addMoreinventory(data.inventory[index].store as any);
          (this.partCatalogForm.get('inventory') as FormArray).removeAt(data.inventory.length - 1);
          this.partCatalogForm.patchValue(data);
          this.modelInfo.patchValue(data.modelInfo);
          this.inventory.patchValue(data.inventory);
          this.supplier.patchValue(data.supplier);
          this.inventory=data.inventory;
        }
        else {
          this.messageService.add({severity:'error', summary: 'Error', detail: message,life:3000});
        }
      })
   /*  }) */


  }
  addMoreinventory(storeId: number) {
    let frm = buildStockForm(this.formbuilder);
    this.storeService.get(storeId)
    .subscribe((a) => {
      let frms = (this.partCatalogForm.get('inventory') as FormArray);
      let ctrl = Array.from(frms.controls).find(x => x.value.store.toString() == a.data.id) as FormControl;
      ctrl.patchValue({ storeName: a.data.storeName, store: a.data.id });
    });
    (this.partCatalogForm.get('inventory') as FormArray).push(frm) ;
  }
  addMoreSupplier() {
    (this.partCatalogForm.get('supplier') as FormArray).push(buildSupplierForm(this.formbuilder));
  }
  addMoreModel() {
    (this.partCatalogForm.get('modelInfo') as FormArray).push(buildModelForm(this.formbuilder));
  }
  supplierControl() {
    return (<FormArray>this.partCatalogForm.get('supplier')).controls;
  }
  inventoryControl() {
    return (<FormArray>this.partCatalogForm.get('inventory')).controls;
  }
  modelControl() {
    return (<FormArray>this.partCatalogForm.get('modelInfo')).controls;
  }
}
