/* import { PurchaseOrderService } from 'src/app/data/service/purchase-order.service'; */
import { partDeliverService } from './../../part-delivery/partDelivery.service';
import { transactionRouteState } from './transactionRouteState';
import { PartCatalogService } from './../../partcatalog/part-catalog.service';
import { sparePartTransaction } from './../sparePartTransaction.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
} from 'primeng/api';
import { sparePartTransactionForm } from './transaction-form-builder';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { sparePartTransactionType } from 'src/app/shared/ENUMS/sparePartTransaction';
import { CustomerService } from 'src/app/data/service/customer.service'; */
import { DatePipe } from '@angular/common';
import { StoreControlServiceService } from '../../store-control/store-control-service.service';
import { Location } from '@angular/common';
import {
  PartDeliveryModel,
  spareParts,
} from '../../part-delivery/part-delivery.model';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { CustomerService } from '../../../services/customer.service';
import { SupplierService } from '../../../services/supplier.service';
import { EmployeeService } from '../../../services/employee.service';
import { AssetsService } from '../../../services/assets.service';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { Lookup } from '../../../shared/enums/lookup';
import { sparePartTransactionType } from '../../../shared/enums/sparePartTransaction';
import { firstValueFrom } from 'rxjs';
/* import { SupplierService } from 'src/app/data/service/supplier.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { AssetsService } from 'src/app/data/service/assets.service';
import { ServicerequestService } from 'src/app/data/service/servicerequest.service';
import { firstValueFrom } from 'rxjs';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  selector: 'add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddTransactionComponent implements OnInit {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('deposite') deposite: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  addTransactionForm!: FormGroup;
  items!: MenuItem[];
  //Dropdown Lists
  transactionStatus: [] = [];
  reserved: any[] = [
    { name: 'None', value: false },
    { name: 'In store', value: true },
  ];
  suppliers: any[] = [];
  customers: [] = [];
  poNoAutCompleteSource: any[] = [];
  partCatalogs: any[] = [];
  stores: [] = [];
  assignedEmpList: [] = [];
  assets: [] = [];
  // hideReceived: boolean = false;
  isdeposit: any;
  passedState: transactionRouteState = <any>null;

  showQuantityDialog = false;
  isEdit: boolean = false;
  siteId: any;
  isSiteAuto:boolean=false;
  isAssetAuto:boolean=false;
  constructor(
    private formbuilder: FormBuilder,
    private api: sparePartTransaction,
    private router: Router,
    private location: Location,
    private activatedRouter: ActivatedRoute,
    private customerService: CustomerService,
    private supplierService: SupplierService,
    private partCatalogService: PartCatalogService,
    private partDeliverySrvc: partDeliverService,
    private storeService: StoreControlServiceService,
    private empServices: EmployeeService,
    private assetService: AssetsService,
    private purchaseOrderService: PurchaseOrderService,
    private serviceRequest: ServicerequestService,
    private messageService: MessageService
  ) {}

  close_modal() {
    this.openModals.emit(false);
  }

  close_quantity_modal() {
    this.showQuantityDialog = !this.showQuantityDialog;
  }

  async ngOnInit(): Promise<void> {
    // Get Router Passed data

    this.passedState = <transactionRouteState>this.location.getState();
    // Build Form
    await this.buildForms();
    /* this.activatedRouter.queryParams.subscribe(async (a) => { */
      if (this.edit_asset_id) {
        this.isSiteAuto=false;
        this.isAssetAuto=false;
        this.getById(this.edit_asset_id, this.deposite);
      } else {
        const urlInfo = await firstValueFrom(this.activatedRouter.url);

        if (
          urlInfo[1].path == 'add-control' &&
          urlInfo[2].path.toLowerCase() == 'withdrawal'
        )
          this.isdeposit = false;
        if (
          urlInfo[1].path == 'add-control' &&
          urlInfo[2].path.toLowerCase() == 'deposit'
        )
          this.isdeposit = true;
      }
      this.getAndBindLookup(Lookup.SparePartTransactionStatus, (ab) => {
        this.transactionStatus = ab;
        const deposit = ab.find((x: any) => x.name == 'Deposit');
        const withdrawal = ab.find((x: any) => x.name == 'Withdrawal');
        this.addTransactionForm.patchValue({
          statusId: this.isdeposit ? deposit.id : withdrawal.id,
          type: this.isdeposit
            ? sparePartTransactionType.deposit
            : sparePartTransactionType.Withdrawal,
        });

        this.addTransactionForm.controls['statusId'].disable();
      });
    /* }); */

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Add Transaction' },
    ];
    //get all dropdows

    // this.getAndBindLookup(Lookup.SparePartReserved, (a) => (this.reserved = a));
    this.getAssignedEmployee();
  }

  private getById(id: any, isDeposite: any) {
    this.isdeposit = isDeposite;
    this.isEdit = true;
    this.api.getTransaction(id).subscribe((a) => {
      a.data.date = new DatePipe('en-us').transform(a.data.date, 'yyyy/MM/dd');
      a.data.supplier = a.data.supplierName;
      this.transactionHistory=new TransactionHistory();
      Object.assign( this.transactionHistory,a.data);
      this.addTransactionForm.patchValue(a.data);
      if (a.data.transactionDetails) {
        a.data.transactionDetails.forEach((transactionDetail: any) => {
          this.transactionDetailsForm.push(
            this.formbuilder.group({
              partCatalogNumId: {
                partName: transactionDetail.partCatalogNumId,
              },
              partCatalogName: transactionDetail.partCatalogName,
              description: transactionDetail.description,
              quantity: transactionDetail.quantity,
              storeId: transactionDetail.storeId,
              storeName: transactionDetail.storeName,
            })
          );
        });
        this.removeParts(0);
      } else {
        this.addMoreParts();
      }

      //  this.addTransactionForm.controls['receivedBy'].patchValue(a.data.relatedEmp);
      this.addTransactionForm.disable();
      this.callIdInfo(a.data.transactionDetails);
    });
  }

  private async buildForms() {
    let hasState =
      this.passedState &&
      this.passedState.preDefinedModels &&
      this.passedState.preDefinedModels.length > 0;
    this.addTransactionForm = sparePartTransactionForm.buildForm(
      sparePartTransactionType.deposit,
      this.formbuilder,
      !hasState ? this.getMoreTransactionDetails() : null
    );
    if (hasState) {
      this.isSiteAuto=false;
      this.isAssetAuto=false;
      this.passedState.preDefinedModels.forEach(async (a) => {
        await this.getAndBuildPartNoBasedOnPartDelivery(a);
      });
      this.removeParts(0);
    }
    else
    {
      this.isSiteAuto=true;
      this.isAssetAuto=true;
    }
  }
  callIdInfo(a: any) {
    if (this.isEdit == true) {
      a.forEach((p: any) => {
        this.getCallId(p);
      });
    }
  }

  getCallId(a: PartDeliveryModel) {
    this.partDeliverySrvc.get(a.id).subscribe((d) => {
      if (d.data.callId != null) {
        this.serviceRequest
          .getServiceRequestById(d.data.callId)
          .subscribe((x) => {
            this.addTransactionForm.patchValue({
              callIdName: x.data.callNo,
              callNo: x.data.callNo,
              callRequestId: x.data.id,
            });
          });
      }
    });
  }
  async getAndBuildPartNoBasedOnPartDelivery(a: PartDeliveryModel) {
    const getPartDelivery = await firstValueFrom(
      this.partDeliverySrvc.get(a.id)
    );

    this.addTransactionForm.controls['receivedBy'].patchValue(
      getPartDelivery.data.relatedEmp
    );
    if (getPartDelivery.data.callId != null) {
      this.serviceRequest
        .getServiceRequestById(getPartDelivery.data.callId)
        .subscribe((x) => {
          this.addTransactionForm.patchValue({
            callIdName: x.data.callNo,
            callNo: x.data.callNo,
            callRequestId: x.data.id,
          });
        });
    }
    this.addTransactionForm.controls['assetNumberAutoComplete'].disable();
    this.addTransactionForm.controls['assetSerialNumberAutoComplete'].disable();
    this.assetService
      .getAssetById(getPartDelivery.data.assetSN)
      .subscribe((x) => {
        this.siteId = x.data.site.id;
        this.addTransactionForm.patchValue({
          customerId: x.data.site.id,
          customerName: x.data.site.custName,
          assetNumber: x.data.multiAssets[0].assetNumber,
          assetName: x.data.modelDefinition.assetName,
          assetId: x.data.id,
          assetNumberAutoComplete: {
            assetNumber: x.data.multiAssets[0].assetNumber,
          },
          assetSerialNumberAutoComplete: {
            assetSerialNo: x.data.multiAssets[0].assetSerialNo,
          },
        });

        this.storeService
          .search({ store: null, siteId: x.data.site.id })
          .subscribe((a) => (this.stores = a.data));
        this.suppliers = [
          {
            suppliername: x.data.supplier.suppliername,
            id: x.data.supplier.id,
          },
        ];
        this.addTransactionForm.patchValue({
          supplierIdBind: this.suppliers[0],
          supplierId: this.suppliers[0].id,
        });
      });
    if (getPartDelivery.data.poNo != null) {
      this.purchaseOrderService
        .getPurcahseOrder(getPartDelivery.data.poNo)
        .subscribe((x) => {
          this.poNoAutCompleteSource = [
            {
              id: getPartDelivery.data.poNo,
              name: x.data.importCodeNo,
            },
          ];
          this.addTransactionForm.patchValue({
            poNo: this.poNoAutCompleteSource[0].name,
            purchaseOrderId: this.poNoAutCompleteSource[0].id,
            purchaseOrderNo: this.poNoAutCompleteSource[0].name,
          });
        });
    }
    this.addTransactionForm.patchValue({
      callId: getPartDelivery.data.callId,
      assetSN: a.assetSN,
    });

    (getPartDelivery.data.spareParts as spareParts[]).forEach((obj) => {
      let ctrl = this.getMoreTransactionDetails();
      let autoCompleteObj = { partName: (a as any).partNo, id: obj.partNo };
      this.partCatalogs = <any>[...this.partCatalogs, autoCompleteObj];
      ctrl.patchValue({
        partCatalogNumId: autoCompleteObj,
        partCatalogName: [''],
        description: obj.description,
        quantity: obj.qty,
        storeId: [''],
        storeName: [''],
      });
      this.addMoreParts(ctrl);
    });
  }

  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.api
      .getLookups({ queryParams: lookup })
      .subscribe((res) => targetProp(res.data));
  }
  completeAssetService(event: any) {
    this.assetService
      .GetAssetsAutoCompleteV2(event.query)
      .subscribe((a) => (this.assets = a.data));
  }
  onSelectAsset($event: any) {
    this.assetService.getAssetInfoById($event.id).subscribe((x) => {
      this.siteId = x.data.site.id;
      this.isSiteAuto=false;
      this.storeService
      .search({
        store: null,
        siteId: this.siteId ?? 0,
      })
      .subscribe((a) => (this.stores = a.data));
      this.addTransactionForm.patchValue({
        customerId: x.data.site.id,
        customerName: x.data.site.custName,
        assetNumber: x.data.multiAssets[0].assetNumber,
        assetNumberAutoComplete: {
          assetNumber: x.data.multiAssets[0].assetNumber,
        },
        assetSerialNumberAutoComplete: {
          assetSerialNo: x.data.multiAssets[0].assetSerialNo,
        },
        assetName: x.data.modelDefinition.assetName,
        assetSN: x.data.multiAssets[0].assetSerialNo,
        assetId: x.data.id,
      });
    });
  }
  getSupplier($event: any) {
    this.supplierService
      .getAutoComplete({ supplierName: $event.query })
      .subscribe((a) => {
        this.suppliers = a;
      });
  }
  selectSupplier(event: any) {
    this.addTransactionForm.controls['supplierId'].patchValue(event.id);
    this.addTransactionForm.controls['supplierIdBind'].patchValue(event);
  }
  getPoNos($event: any) {}

  getCustomers($event: any) {
    this.customerService
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => (this.customers = a.data));
  }
  onSelectCustomer(event: any)
  {
    this.siteId = event.id;
    this.storeService
      .search({
        store: null,
        siteId: event.id?? 0,
      })
      .subscribe((a) => (this.stores = a.data));
  }

  getPartCatalogs($event: any) {
    return this.partCatalogService
      .getAutoComplete({ partName: $event.query })
      .subscribe((d) => {
        this.partCatalogs = d;
      });
  }

  onSelectTransaction(event: any) {
    this.addTransactionForm.value.transactionStatus = event.value;
  }

  onSelectReserved(event: any) {
    this.addTransactionForm.value.reserved = event.value;
  }

  onSelectSupplier(event: any) {
    this.addTransactionForm.value.supplier = event.value;
  }

  addTransactionSubmit() {
    let model = sparePartTransactionForm.getModel(
      this.addTransactionForm.getRawValue()
    );
    if (this.addTransactionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else if (model.transactionDetails.length == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Pleas Add At Leas Row At Required Spare Parts',
        life: 3000,
      });
      return;
    } else {
      (model.transactionDetails as any[]).forEach((x) => {
        x.partCatalogName = null;
        x.storeName = null;
      });
      this.api.addTransaction(model).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.addTransactionForm.reset();
          this.router.navigate(['/store/spare-part-transaction']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });
    }
  }

  cancel() {
    this.addTransactionForm.reset();
  }

  get transactionDetailsForm(): FormArray {
    return this.addTransactionForm.get('transactionDetails') as FormArray;
  }
  partsControl() {
    return this.transactionDetailsForm.controls;
  }
  removeParts(index: number) {
    this.transactionDetailsForm.removeAt(index);
  }
  getMoreTransactionDetails() {
    let controls = sparePartTransactionForm.buildPartsForm(this.formbuilder);
    controls.controls['description'].disable();
    return controls;
  }
  addMoreParts(ctrl: FormGroup | null = null) {
    ctrl = ctrl ?? this.getMoreTransactionDetails();
    this.transactionDetailsForm.push(ctrl);
  }

  setDescription($event: any, i: number) {
    this.partsControl()[i].patchValue({
      description: $event.desc,
    });
    this.storeService
      .search({
        store: null,
        siteId: this.siteId ?? 0,
      })
      .subscribe((a) => (this.stores = a.data));
  }

  getAssignedEmployee() {
    this.empServices.searchRoles({ fixedName: 'r-6' }).subscribe((res) => {
      let id = res.data[0].id;
      this.empServices.getEmployeeByRole([id]).subscribe((res) => {
        this.assignedEmpList = res;
      });
    });
  }

  IsLessThanZero(input: HTMLInputElement) {
    return parseInt(input.value) < 0;
  }
  onClearAsset()
  {
    this.isSiteAuto=true;
    this.stores=[];
    this.addTransactionForm.controls["assetName"].setValue('');
    this.addTransactionForm.controls["assetSN"].setValue('');
  }
}
