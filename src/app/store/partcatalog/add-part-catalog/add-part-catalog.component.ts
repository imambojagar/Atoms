import { PartCatalogModel } from './../part-catalog.model';
/* import { TaxonomyService } from 'src/app/data/service/taxonomy.service'; */
import { PartCatalogService } from './../part-catalog.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  Message,
  MenuItem,
  SelectItem,
} from 'primeng/api';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import validateForm from 'src/app/shared/helpers/validateForm'; */
import {
  buildForm,
  buildStockForm,
  buildModelForm,
  buildSupplierForm,
  getPartCatalogModel,
} from '../add-part-form-builder';
import { CustomerService } from '../../../services/customer.service';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { StoreControlServiceService } from '../../store-control/store-control-service.service';
import { SupplierService } from '../../../services/supplier.service';
import { Lookup } from '../../../shared/enums/lookup';
import validateForm from '../../../shared/helpers/validateForm';
import { dateHelper } from '../../../shared/helpers/dateHelper';
/* import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { StoreControlServiceService } from '../../store-control/store-control-service.service';
import { CustomerService } from 'src/app/data/service/customer.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { PurchaseOrderService }  from 'src/app/data/service/purchase-order.service';*/

@Component({
  selector: 'add-part-catalog',
  templateUrl: './add-part-catalog.component.html',
  styleUrls: ['./add-part-catalog.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddPartCatalogComponent implements OnInit {
  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('queryData') queryData: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  @Input('model') model: PartCatalogModel | null = null;
  @Input('addCatalogForm') addCatalogForm!: FormGroup;

  @Input('modelInfo') modelInfo!:FormGroup;
  @Input('inventory') inventory!:FormGroup;
  @Input('supplier') supplier!:FormGroup;
  items!: MenuItem[];

  //Dropdown Lists
  partType: [] = [];
  cities: [] = [];
  manufacturer: any[] = [];
  warranty: [] = [];
  site: [] = [];
  customers: any[] = [];
  suppliers: any[] = [];
  models: any[] = [];
  stores: any[] = [];
  get isEdit() {
    return this.model != null;
  }

  constructor(
    private formbuilder: FormBuilder,
    private api: PartCatalogService,
    private router: Router,
    private messageService: MessageService,
    private customerService: CustomerService,
    private taxonomyService: TaxonomyService,
    private storeService: StoreControlServiceService,
    private supplierService: SupplierService

  ) {}

  close_modal() {
    this.openModals.emit(false);
  }

  ngOnInit(): void {
    if (this.addCatalogForm == null) {
      this.modelInfo = buildModelForm(this.formbuilder);
      this.inventory = buildStockForm(this.formbuilder);
      this.supplier = buildSupplierForm(this.formbuilder);
      this.addCatalogForm = buildForm(
        this.formbuilder,
        this.modelInfo,
        this.inventory,
        this.supplier
      );
    } else {
      this.model != null && this.GetViewData();
    }
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: this.isEdit ? 'Edit Part Catalog' : 'Add Part Catalog' },
    ];
    //get all dropdows
    this.getPartType();
    this.getMake();
    this.getWarranty();
    this.getManufacturer();

    if (this.model != null) {
      this.addCatalogForm.patchValue(this.model);
    }
    let inventoryIndex = 0;
    this.getControls('inventory').forEach(ctrl => {
      (ctrl as any).index = inventoryIndex ++;
      ctrl.controls['clientPart'].valueChanges.subscribe(c => {
        this.completeStores(c, (ctrl as any).index);
      });
    })
  }

  GetViewData() {
    let modelInfoCounter = 0,
      inventoryCounter = 0,
      supplierCounter = 0;
    this.customers = [];
    this.models = [];
    this.model!.modelInfo.forEach((e) => {
      this.taxonomyService
        .getSingleTaxonomy(e.assetModel as number)
        .subscribe((d) => {
          const obj = { modelName: d.data.taxonomyName, modelId: d.data.id };
          this.models.push(obj);
          e.assetModel = <any>{ ...(<any>obj) };
          this.getControls('modelInfo')[modelInfoCounter++].patchValue({
            assetModel: e.assetModel,
          });
        });
    });
    this.model!.inventory.forEach((e: any) => {
      this.completeStores({ id: e.clientPart }, inventoryCounter);
      const obj = <any>{ custName: e.clientPartName, id: e.clientPart };
      this.customers.push(obj);
      e.clientPart = <any>{ ...(<any>obj) };
      this.getControls('inventory')[inventoryCounter++].patchValue({
        clientPart: e.clientPart,
      });
    });
    this.model!.supplier.forEach((e: any) => {
      const obj = <any>{ suppliername: e.supplierName, id: e.supplier };
      this.customers.push(obj);
      e.supplier = <any>{ ...(<any>obj) };
      this.getControls('supplier')[supplierCounter++].patchValue({
        supplier: e.supplier,
      });
    });
    if (this.model!.manufacturerId)
    {
      this.taxonomyService.getSingleTaxonomy( this.model!.manufacturerId!).subscribe(x => {
        const obj = <any>{ id: this.model!.manufacturerId, taxonomyName: x.data.taxonomyName  }
        this.manufacturer.push(obj);
        this.model!.manufacturerId = {...obj as any};
        this.addCatalogForm.patchValue({ manufacturerId: this.model!.manufacturerId });
      })
    }

  }

  getPartType() {
    this.api
      .getLookups({ queryParams: Lookup.PartType })
      .subscribe((res) => (this.partType = res.data));
  }

  getMake() {
    this.api
      .getLookups({ queryParams: Lookup.City })
      .subscribe((res) => (this.cities = res.data));
  }

  getManufacturer() {
    this.taxonomyService.getTaxonomies({ }).subscribe(res => {
      this.manufacturer = res.data;
    })
  }
  getStoreOptions(index:number) {
    return this.stores.find(a => a.index == index)?.data;
  }
  completeStores(info: { id: number}, index: number) {
    let id = info.id;
    if (id == null) return;
    this.storeService
      .search({ store: null, siteId: id })
      .subscribe((a) => {
        let idx = this.stores.findIndex(a => a.index == index);
        if (idx > -1)  this.stores.splice(idx, 1);
        this.stores.push({
          data: a.data,
          index: index
        })
      });
  }
  completeModels($event: { query: string }) {
    this.taxonomyService
      .searchTaxonomy({ name: $event.query })
      .subscribe((a) => (this.models = a.data));
  }
  selectModel(
    $event: any, //{ manufacturerId: number; manufacturerName: string },
    index: number
  ) {
    this.getControls('modelInfo')[index].patchValue({
      manufact: $event.manufacturerName,
    });
  }
  getWarranty() {
    this.api
      .getLookups({ queryParams: Lookup.Warranty_Period })
      .subscribe((res) => (this.warranty = res.data));
  }
  changePartType(event: any) {
    this.addCatalogForm.value.PartType = event.value;
  }
  changeManufactureId(event: any) {
    this.addCatalogForm.value.manufacturerId = event.value;
  }
  completeManufacturer(name: any) {
    this.taxonomyService.searchManufacturerByName({ name: name.query }).subscribe((res) => {
      this.manufacturer = res.data;
    });
  }
  changeWarranty(event: any) {
    this.addCatalogForm.value.warranty = event.value;
    debugger
  }
  changeSite(event: any) {
    this.addCatalogForm.value.site = event.value;
  }

  savePartCatalog() {
    debugger;
    if (this.addCatalogForm.invalid || this.modelInfo.invalid ||this.supplier.invalid ||this.inventory.invalid) {
      console.log(this.findInvalidControls());
      validateForm.validateAllFormFields(this.addCatalogForm);
      validateForm.validateAllFormFields(this.modelInfo);
      validateForm.validateAllFormFields(this.supplier);
      validateForm.validateAllFormFields(this.inventory);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let model = getPartCatalogModel(this.addCatalogForm.value);
      dateHelper.reverseDateFilds(model, ['endSupport', 'stopProduction']);
      if (this.model != null) {
        this.api
          .updatePartItem(model)
          .subscribe((res) => this.handAddEditDataResponse(res));
      } else {
        this.api
          .addPartCatalogItem(model)
          .subscribe((res) => this.handAddEditDataResponse(res));
      }
    }
  }

  private handAddEditDataResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;
    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.router.navigate(['store/part-catalog']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }

  cancel() {
    this.addCatalogForm.reset();
  }
  getControls(controlName: string): FormGroup[] {
    return (<FormArray>this.addCatalogForm.get(controlName)).controls as FormGroup[];
  }
  removeControl(controlName: string, index: number) {
    (this.addCatalogForm.get(controlName) as FormArray).removeAt(index);
  }
  addMoreModel() {
    (this.addCatalogForm.get('modelInfo') as FormArray).push(
      buildModelForm(this.formbuilder)
    );
  }
  addMoreinventory() {
    let frm = buildStockForm(this.formbuilder);
    (frm as any).index = this.getControls('inventory').length;
    frm.controls['clientPart'].valueChanges.subscribe(a => {
      this.completeStores(a as any, (frm as any).index);
    });
    (this.addCatalogForm.get('inventory') as FormArray).push(frm);
  }
  addMoreSupplier() {
    (this.addCatalogForm.get('supplier') as FormArray).push(
      buildSupplierForm(this.formbuilder)
    );
  }

  getCustomers($event: any) {
    this.customerService
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => (this.customers = a.data));
  }

  getSupplier($event: any) {
    this.supplierService
      .getAutoComplete({ supplierName: $event.query })
      .subscribe((a) => {
        this.suppliers = a;
      });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addCatalogForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
