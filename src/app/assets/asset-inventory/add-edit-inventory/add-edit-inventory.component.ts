import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import {
  buildForm,
  buildtDetailsForm,
  getInventoryModel,
} from './form-builder';
import { AssetInventory } from '../../../models/asset-inventory-model';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { AssetsService } from '../../../services/assets.service';
import { AssetTransferService } from '../../../services/asset-transfer.service';
import { CustomerService } from '../../../services/customer.service';
import { AssetInventoryService } from '../../../services/asset-inventory.service';
import { LookupService } from '../../../services/lookup.service';
import { Lookup } from '../../../shared/enums/lookup';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule, DatePipe } from '@angular/common';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-add-edit-inventory',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrPipe,
    TranslateModule,
    TransactionHistoryComponent,
  ],
  providers: [DatePipe],
  templateUrl: './add-edit-inventory.component.html',
  styleUrl: './add-edit-inventory.component.scss',
})
export class AddEditInventoryComponent implements OnChanges {
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_inventory_id') edit_asset_inventory_id: any;
  @Input('edit_asset_inventory_index') edit_asset_inventory_index: any;

  PAGE_TITLE: 'asset-inventory' = 'asset-inventory';

  assetInventoryForm!: FormGroup;
  detailsForm!: FormGroup;
  inventoryModel: AssetInventory = new AssetInventory();
  id!: number;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  details: any[] = [];
  customers: any[] = [];
  buildingList: any[] = [];
  floorList: any[] = [];
  departmentList: any[] = [];
  roomList: any[] = [];
  assetList: any[] = [];
  statusList: any[] = [];
  detailsFlag: boolean = false;
  transactionHistory!: TransactionHistory;
  addOrEditFlag: boolean = false;
  get CurrentModel(): AssetInventory {
    return this.assetInventoryForm.getRawValue();
  }
  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private assetService: AssetsService,
    private assetTransfer: AssetTransferService,
    private customerService: CustomerService,
    private formbuilder: FormBuilder,
    private api: AssetInventoryService,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['edit_asset_inventory_id'] && changes['edit_asset_inventory_id'].currentValue) {
      console.log('Initializing with ID:', changes['edit_asset_inventory_id'].currentValue);
      this.Init();
    } else {
      console.warn('No ID provided for initialization');
    }
  }


  Init(): void {
    this.detailsForm = buildtDetailsForm(this.formbuilder);
    this.assetInventoryForm = buildForm(this.formbuilder, this.detailsForm);
    console.log('edit_asset_inventory_id', this.edit_asset_inventory_id);
    // this.route.queryParams.subscribe((params: any) => {
    // this.id = params.data;
    // if (this.edit_asset_inventory_id) {
    console.log('Im in edit', this.edit_asset_inventory_id);
    this.id = this.edit_asset_inventory_id;
    this.isAddMode = !this.id;
    this.addOrEditFlag = true;
    console.log('id:', this.edit_asset_inventory_id);
    console.log('this.isAddMode', this.isAddMode);
    this.inventoryModel.id = this.edit_asset_inventory_id;
    this.tabIndex = this.edit_asset_inventory_index;
    // }else{
    //   this.isAddMode = true;
    // }

    // });
    if (this.isAddMode == false) {
      this.getInventorybyId(this.id);
    }

    // this.items = [
    //   // { label: 'Home', routerLink: ['/'] },
    //   {
    //     label: this.isAddMode ? 'Add Asset Inventory' : 'Edit Asset Inventory',
    //   },
    // ];
    this.getlookups(Lookup.SurveyStatus, (c) => (this.statusList = c));
  }

  buildtDetailsForm(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      assetSurveyId: 0,
      assetId: null,
      assetSerialNo: null,
      assetNumber: null,
      assetName: null,
      bind: null,
      tagCode: null,
      statusId: null,
      statusName: null,
    });
  }

  ngOnInit(): void {
    this.detailsForm = buildtDetailsForm(this.formbuilder);
    this.assetInventoryForm = buildForm(this.formbuilder, this.detailsForm);
    this.isAddMode = !this.edit_asset_inventory_id;

    console.log('id:', this.edit_asset_inventory_id);
    console.log('this.isAddMode', this.isAddMode);
    this.inventoryModel.id = this.edit_asset_inventory_id;
    this.tabIndex = this.edit_asset_inventory_index;
    this.tabIndex = this.edit_asset_inventory_index;
    if (!this.isAddMode) {
      this.getInventorybyId(this.inventoryModel.id);
    }
    // this.items = [
    //   { label: 'Home', routerLink: ['/'] },
    //   {
    //     label: this.isAddMode ? 'Add Asset Inventory' : 'Edit Asset Inventory',
    //   },
    // ];
    this.getlookups(Lookup.SurveyStatus, (c) => (this.statusList = c));
  }

  getInventorybyId(id: number): void {
    this.api.getSingle(id).subscribe({
      next: (res: any) => {
        const { data, message, isSuccess } = res;

        if (!isSuccess) {
          this.showError(message);
          return;
        }

        console.log('Fetched Inventory Data:', data);
        this.initializeTransactionHistory(data);

        this.populateFormDetails(data);
        this.setFormControls(data);

        this.detailsFlag = this.details.length > 0;

        if (this.detailsFlag) {
          this.patchDetailsToFormArray(data.details);
        }
      },
      error: (err) => {
        console.error('Error fetching inventory:', err);
        this.showError('An unexpected error occurred while fetching inventory data.');
      },
    });
  }

  private initializeTransactionHistory(data: any): void {
    this.transactionHistory = new TransactionHistory();
    Object.assign(this.transactionHistory, data);
  }

  private populateFormDetails(data: any): void {
    this.details = data.details || [];
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
  }

  private setFormControls(data: any): void {
    dateHelper.parseDateFilds(data, ['surveyDate']);
    this.assetInventoryForm.patchValue(data);

    this.assetInventoryForm.controls['siteBind'].patchValue({
      custName: data.siteName,
    });

    const value = this.CurrentModel;

    this.buildingList = [{ name: value.buildingName, id: value.buildingId }];
    this.floorList = [{ name: value.floorName, id: value.floorId }];
    this.departmentList = [{ name: value.departmentName, id: value.departmentId }];
    this.roomList = [{ name: value.roomName, id: value.roomId }];
  }

  private patchDetailsToFormArray(details: any[]): void {
    const detailsFormArray = <FormArray>this.assetInventoryForm.controls['details'];

    // Ensure there are enough FormArray controls
    while (detailsFormArray.length < details.length) {
      this.addMoreDetails();
    }

    details.forEach((detail, index) => {
      const formGroup = detailsFormArray.at(index);
      const objToBind = {
        assetSerialNo: detail.assetSerialNo,
        assetNumber: detail.assetNumber,
        assetName: detail.assetName,
        id: detail.assetId,
      };

      formGroup.patchValue({ bind: objToBind });
      this.assetList = [...this.assetList, objToBind];
    });

    console.log('Updated Details in FormArray:', this.assetInventoryForm.controls['details'].value);
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  }


  onSubmit() {
    console.log("assetInventoryForm", this.assetInventoryForm);
    if (this.assetInventoryForm.invalid) {
      validateForm.validateAllFormFields(this.assetInventoryForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      if (this.isAddMode) {
        this.save();
      } else {
        this.update();
      }
    }
  }

  save() {
    let model = getInventoryModel(this.assetInventoryForm.value);
    console.log('model', model);
    dateHelper.reverseDateFilds(model, ['surveyDate']);
    model.surveyCode = '1';
    if (this.detailsFlag == false) {
      model.details = [];
    }
    console.log('model after', model);
    this.api.post(model).subscribe((res: any) => {
      console.log('api res:', res);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });

        this.assetInventoryForm.reset();
        this.close_modal();
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

  update() {
    let model = getInventoryModel(this.assetInventoryForm.value);
    dateHelper.reverseDateFilds(model, ['surveyDate']);
    if (this.detailsFlag == false) {
      model.details = [];
    }
    console.log('model', model);
    this.api.update(model).subscribe((res: any) => {
      console.log('api res:', res);
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        // this.router.navigate(['/assets/asset-inventory']);
        this.close_modal();
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

  delete() {
    this.inventoryModel.id = this.id;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.delete(this.inventoryModel.id).subscribe((res: any) => {
          console.log('delete res', res);
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            // this.router.navigate(['/assets/asset-inventory']);
            this.close_modal();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  //details
  detailsControl() {
    return (<FormArray>this.assetInventoryForm.get('details')).controls;
  }
  removeDetails(index: number) {
    (this.assetInventoryForm.get('details') as FormArray).removeAt(index);
  }
  addMoreDetails() {
    (this.assetInventoryForm.get('details') as FormArray).push(
      buildtDetailsForm(this.formbuilder)
    );
  }

  //autocomplets
  getCustomers($event: any) {
    this.customerService
      .GetCustomersAutoComplete($event.query)
      .subscribe((a) => (this.customers = a.data));
  }
  getBuildingList($event: any) {
    this.buildingList = [];
    this.floorList = [];
    this.departmentList = [];
    console.log('$event', $event);
    this.assetInventoryForm.controls['siteId'].patchValue($event.value.id);
    this.assetTransfer
      .getBuildingLookup({ siteId: $event.value.id })
      .subscribe((a) => {
        this.buildingList = a.data;
      });
  }
  getFloorList($event: any) {
    console.log(' building $event', $event);
    this.assetTransfer
      .getFloorLookup({
        siteId: this.assetInventoryForm.value.siteId,
        buildingId: $event.value.buildingId,
      })
      .subscribe((res: any) => {
        this.floorList = res.data;
      });
  }
  getDepartments($event: any) {
    console.log('floor $event', $event);
    this.assetTransfer
      .getDepLookup({
        siteId: this.assetInventoryForm.value.siteId,
        buildingId: this.assetInventoryForm.value.buildingId,
        floorId: $event.value.floorId,
      })
      .subscribe((res: any) => {
        this.departmentList = res.data;
      });
  }

  getRooms($event: any) {
    console.log('Department $event', $event);
    this.assetTransfer
      .getRoomLookup({
        siteId: this.assetInventoryForm.value.siteId,
        buildingId: this.assetInventoryForm.value.buildingId,
        floorId: this.assetInventoryForm.value.floorId,
        departmentId: $event.value.departmentId,
      })
      .subscribe((res: any) => {
        this.roomList = res.data;
      });
  }

  filterByName($event: any) {
    this.assetService
      .GetAssetsAutoCompleteMultiFilter({ assetNumber: $event.query })
      .subscribe((d) => (this.assetList = d.data));
  }
  selectAsset(event: any, i: number) {
    console.log('Asset event', event);
    this.detailsControl()[i].patchValue({
      assetId: event.value.id,
      assetSerialNo: event.value.assetSerialNo,
      assetNumber: event.value.assetNumber,
      assetName: event.value.assetName,
    });
    this.detailsFlag = true;
  }

  getValueFor(frm: any, key: string, prop: string) {
    if (key in (frm.getRawValue() ?? {}))
      if (frm.getRawValue()[key] != null)
        return frm.getRawValue()[key][prop] ?? '';
    return '';
  }
  cancel() {
    this.assetInventoryForm.reset();
  }
  getlookups(lookup: Lookup, cb: (data: any) => {}) {
    this.api.getLookups(lookup).subscribe((a: any) => cb(a.data));
  }

  close_modal() {
    this.assetInventoryForm.reset();
    this.openModals.emit(false);
  }
}
