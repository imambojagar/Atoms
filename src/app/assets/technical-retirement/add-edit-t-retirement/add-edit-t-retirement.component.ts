
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Message, MenuItem, ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
/* import { LookupService } from 'src/app/data/service/lookup.service'; */
import { buildForm, buildtRetirementPartsForm, getTechModel } from './add-form-builder';
import { TechnicalRetirementModel } from '../../../models/technical-retirement';
import { TransactionHistory } from '../../../models/transaction-history';
import { TechnicalRetirementService } from '../../../services/technical-retirement.service';
import { LookupService } from '../../../services/lookup.service';
import { PartCatalogService } from '../../../store/partcatalog/part-catalog.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { AssetsTableLookupComponent } from '../../../shared/components/assets-table-lookup/assets-table-lookup.component';
/* import validateForm from 'src/app/shared/helpers/validateForm';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { TechnicalRetirementModel } from 'src/app/data/models/technical-retirement';
import { TechnicalRetirementService } from 'src/app/data/service/technical-retirement.service';
import { PartCatalogService } from 'src/app/modules/store/partcatalog/part-catalog.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */


@Component({
  standalone: true,
  selector: 'add-edit-t-retirement',
  templateUrl: './add-edit-t-retirement.component.html',
  styleUrls: ['./add-edit-t-retirement.component.scss'],
  imports: [PrimengModule, CommonModule, ReactiveFormsModule, TransactionHistoryComponent, AttachmentsComponent, AssetsTableLookupComponent]
})
export class AddEditTRetirementComponent implements OnChanges {
  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;
  @Input('edit_asset_index') edit_asset_index: number = 0;

  techRetirementForm!: FormGroup;
  tRetirementParts!: FormGroup;

  tRetirementModel: TechnicalRetirementModel = new TechnicalRetirementModel();

  id!: any;
  isAddMode!: boolean;
  msgs!: Message[];
  items!: MenuItem[];
  tabIndex: number = 0;
  createdOn: any;
  modifiedOn: any;
  serialList: [] = [];
  catalogList: [] = [];
  catalogNameList: [] = [];
  reasonsOptions: [] = [];
  parts: any;
  assetNumberList: [] = [];

  isChecked = [];

  showDialog: boolean = false;
  attachments: any[] = [];
  partCatalogFlag: boolean = false;
  transactionHistory!: TransactionHistory
  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private api: TechnicalRetirementService,
    private lookupApi: LookupService,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private partCatalogApi: PartCatalogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(): void {
    this.reasonsLookup();
    this.tRetirementParts = buildtRetirementPartsForm(this.formbuilder);
    this.techRetirementForm = buildForm(this.formbuilder, this.tRetirementParts);
    /* this.route.queryParams.subscribe((params: any) => {
      this.id = params.data;
      this.isAddMode = !this.id;
      this.tRetirementModel.id = params.data;
      this.tabIndex = params.index;

    }); */

    this.id = this.edit_asset_id;
    this.isAddMode = !this.id;
    this.tRetirementModel.id = this.edit_asset_id;
    this.tabIndex = this.edit_asset_index;


    if (!this.isAddMode) {
      this.api.getSingle(this.id).subscribe((res: any) => {
        const data = res.data;
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res.data);
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          for (let index = 0; index < data.tRetirementParts.length - 1; index++) this.addMoretRetirementParts();

          dateHelper.parseDateFilds(data, ['retirementDate']);
          this.techRetirementForm.patchValue(data);
          this.parts = data.tRetirementParts;
          this.createdOn = data.createdOn;
          this.modifiedOn = data.modifiedOn;
          if (data.attachments.length > 0) {
            this.attachments = data.attachments;
            console.log("this.attachments", this.attachments)

          }

          if (data.tRetirementParts.length == 0) {
            return;
          } else {
            this.partCatalogFlag = true;
            let x = 0;
            (<FormArray>this.techRetirementForm.controls['tRetirementParts']).controls.forEach(
              (c) => {
                const objToBind = {
                  id: data.tRetirementParts[x].partCatalogItemId,
                  partName: data.tRetirementParts[x].partName,
                  partNumber: data.tRetirementParts[x].partNumber,
                };
                c.patchValue({ bind: objToBind });
                this.catalogList = <any>[...this.catalogList, objToBind];
                x++;
              }
            );
          }
          console.log('data', data);

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

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: this.isAddMode ? 'Add Technical Retirement' : 'Edit Technical Retirement' },
    ];


  }


  //fill autocomplete


  Fillcatalog(event: any) {
    this.partCatalogApi.searchPartCatalog({ partNumber: event.query }).subscribe((res: any) => {
      this.catalogList = res.data;
    });
  }

  FillcatalogName(event: any) {
    this.partCatalogApi.searchPartCatalog({ partName: event.query }).subscribe((res: any) => {
      this.catalogNameList = res.data;
    });
  }


  onCatalogSelect(i: number, event: any) {
    console.log("event", event)

    this.tRetirementPartsControl()[i].patchValue({
      partCatalogItemId: event.value.id,
      bind: event.value,
      partName: event.value.partName,
      partNumber: event.value.partNumber,

    });

    this.partCatalogFlag = true;
  }
  reasonsLookup() {
    this.api.getLookups({ queryParams: 415 }).subscribe((res: any) => {
      this.reasonsOptions = res.data;
    });
  }
  onSelectReason(event: any) {
    this.techRetirementForm.value.reasonId = event.value;
  }
  tRetirementPartsControl() {
    return (<FormArray>this.techRetirementForm.get('tRetirementParts')).controls;
  }
  removetRetirementParts(index: number) {
    (this.techRetirementForm.get('tRetirementParts') as FormArray).removeAt(
      index
    );
  }
  addMoretRetirementParts() {
    (this.techRetirementForm.get('tRetirementParts') as FormArray).push(buildtRetirementPartsForm(this.formbuilder));

  }
  onSubmit() {
    // stop here if form is invalid
    if (this.techRetirementForm.invalid) {
      validateForm.validateAllFormFields(this.techRetirementForm);
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
    let model = getTechModel(this.techRetirementForm.value);
    console.log('model', model);
    dateHelper.reverseDateFilds(model, ['retirementDate']);
    if (this.partCatalogFlag == false) {
      model.tRetirementParts = [];
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
        this.techRetirementForm.reset();
        this.close_modal();
        /*  this.router.navigate([
           '/systemsettings/technical-retirement',
         ]); */
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
    let model = getTechModel(this.techRetirementForm.value);
    console.log('model', model);
    dateHelper.reverseDateFilds(model, ['retirementDate']);
    if (this.partCatalogFlag == false) {
      model.tRetirementParts = [];
    }
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

        this.close_modal();
        /*  this.router.navigate([
           '/systemsettings/technical-retirement',
         ]); */
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
    this.route.queryParams.subscribe((params: any) => {
      this.tRetirementModel.id = params.data;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this ?',
        header: 'Confirm',
        rejectButtonStyleClass: 'btn btn-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api
            .delete(this.tRetirementModel.id)
            .subscribe((res: any) => {
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
                this.router.navigate([
                  '/systemsettings/technical-retirement',
                ]);
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
    });
  }
  handleChange() {
    this.api.getSingle(this.id).subscribe((res: any) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      if (sucess == true) {
        this.techRetirementForm.controls['assetIdString'].patchValue({ assetSerialNo: data.assetSerialNo });
        dateHelper.parseDateFilds(data, ['retirementDate']);
        this.techRetirementForm.patchValue(data);
        this.parts = data.tRetirementParts;
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        console.log('data', data);

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

  //LookUp

  openDialog() {
    this.showDialog = true;
    console.log("this.showDialog", this.showDialog);
  }
  onCloseDialog(event: any) {
    console.log("isChecked event", event);
    this.techRetirementForm.controls['assetId'].setValue(event.id);
    this.techRetirementForm.controls['assetSerialNo'].patchValue(event.assetSerialNo);
    this.techRetirementForm.controls['assetNumber'].setValue(event.assetNumber);
    this.techRetirementForm.controls['assetName'].setValue(event.modelDefinition.assetName);
    this.showDialog = false;

  }
  onHide(event: any) {
    console.log("on hide event", event);
    this.showDialog = event;
    console.log("this.showDialog", this.showDialog);
  }

  close_modal() {
    this.Init()
    this.openModals.emit(false);
    this.techRetirementForm.reset();
    this.cdr.detectChanges()
  }

  cancel() {
    this.techRetirementForm.reset();
  }

  ready(event: any) {
    console.log("attach", event);
    console.log("this.attachments", this.attachments);
    this.techRetirementForm.value.attachments = this.attachments;


  }
}
