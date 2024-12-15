import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import { QuotationService } from '../../../services/quotaion.service';
import { CustomerService } from '../../../services/customer.service';
import { AssetsService } from '../../../services/assets.service';
import { WorkOrderService } from '../../../services/work-order.service';
import { PartCatalogService } from '../../../store/partcatalog/part-catalog.service';
import { EmployeeService } from '../../../services/employee.service';
import { SupplierService } from '../../../services/supplier.service';
import { attachments, QuotationModel } from '../../../models/quotation-model';
import { Role } from '../../../shared/enums/role';
import validateForm from '../../../shared/helpers/validateForm';
import { Lookup } from '../../../shared/enums/lookup';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { Role } from 'src/app/data/Enum/role';
import { QuotationModel } from 'src/app/data/models/quotation-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { attachments } from 'src/app/data/models/quotation-model';
import { CustomerService } from 'src/app/data/service/customer.service';
import { EmployeeService } from 'src/app/data/service/employee.service';
import { QuotationService } from 'src/app/data/service/quotaion.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { WorkOrderService } from 'src/app/data/service/work-order.service';
import { PartCatalogService } from 'src/app/modules/store/partcatalog/part-catalog.service';
import validateForm from 'src/app/shared/helpers/validateForm';
import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

type Tabs = 'QuotationInfo' | 'PrintInfo' | 'MaintenanceCost';
@Component({
  selector: 'app-quotation-management',
  templateUrl: './quotation-management.component.html',
  styleUrls: ['./quotation-management.component.scss'],
})
export class QuotationManagementComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Input('querydata') querydata: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  transactionHistory!: TransactionHistory
  constructor(
    private activatedRoute: ActivatedRoute,
    private quotationService: QuotationService,
    private siteService: CustomerService,
    private assetService: AssetsService,
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private workorderservice: WorkOrderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private partCatalogService: PartCatalogService,
    private workOrdersService: WorkOrderService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService
  ) {}

 
  spare_Part!: FormGroup;
  printInfo_SparePart!: FormGroup;
  estimated_Workinghour!: FormGroup;
  attachmentName: any[] = [];
  activeTab: Tabs = 'QuotationInfo';
  items!: MenuItem[];
  quotationForm!: FormGroup;
  attachmentForm!: FormGroup;
  quotationModel: QuotationModel = new QuotationModel();
  msgs!: Message[];
  uploadedFiles: any[] = [];
  fileList: any[] = [];
  quotationTypes: any[] = [];
  currencies: any[] = [];
  quotationStatus: any[] = [];
  quotationOfferType: any[] = [];
  suppliers: any[] = [];
  assetSerialNumber: any[] = [];
  assignedEmployess: any[] = [];
  quotationCallLastSituation: any[] = [];
  sparePartList: any;
  printInfoSparePartList!: any;
  estimatedWorkinghourList!: any;
  assetSerialNumberList: [] = [];
  SiteList: [] = [];
  sparePartAutoComplete: [] = [];
  fileName = '';
  siteContactsForm!: FormGroup;
  quotationSparePartsForm!: FormGroup;
  id: any;
  workerorderId: any;
  callRequestId: any;
  isExternal: boolean = false;
  typeScreen: string = 'Add';
  listDefect: any[] = [];
  assginedEmployeeId: any;
  tabIndex: number = 0;
  createdOn!: any;
  modifiedOn!: any;
  fromDate!: any;
  toDate!: any;
  ParentWOId: any;
  steps: any[] = [];
  callDisabled: string = 'false';
  assetId: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }
  

  close_modal() {
    this.openModals.emit(false);
  }

   Init(): void {
    this.quotationForm = this.buildForm(this.formbuilder);

    /* this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.workerorderId = params['workerorderId'];
      this.ParentWOId = params['ParentWOId'];
    }); */

    if(this.querydata) { 
      this.id = this.querydata['id'];
      this.workerorderId = this.querydata['workerorderId'];
      this.ParentWOId = this.querydata['ParentWOId'];
    }

    /* this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please Fill Required Data',
      life: 3000,
    });
 */
    this.items = [{ label: 'Home', routerLink: ['/'] }];

    if (!(this.id == undefined || this.id == 0)) {
      this.GetLookupCallLastSituationBasedOnCase(
        this.ParentWOId,
        false,
        this.id,
        'Q'
      );
    } else {
      this.GetLookupCallLastSituationBasedOnCase(this.ParentWOId, true, 0, 'Q');
    }

    this.workOrdersService
      .getStepsWorkOrder(this.ParentWOId)
      .subscribe((res1) => {
        if (res1.isSuccess) {
          this.steps = res1.data;
        }
      });

    this.getQuotationType();
    this.getQuotationOfferType();
    this.getSuppliers();
    this.getQuotationStatus();
    this.getCurrency();

    if (this.id == undefined || this.id == 0) {
      this.typeScreen = 'Add';
      this.getworkorderInfo(
        this.workerorderId == undefined ? 0 : this.workerorderId
      );
    } else {
      if (this.router.url.includes('view')) {
        this.typeScreen = 'View';
        this.quotationForm.disable();
        this.getQuotation(this.id);
      } else {
        this.typeScreen = 'Edit';
        this.getQuotation(this.id);
      }
    }
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  // #region Control
  quotationPrintInfoSpareParts() {
    return (<FormArray>this.quotationForm.get('quotationPrintInfoSpareParts'))
      .controls;
  }

  addMorePrintInfoSparePart() {
    (this.quotationForm.get('quotationPrintInfoSpareParts') as FormArray).push(
      this.formbuilder.group({
        id: 0,
        description_Print: [''],
        quantity_Print: 0,
        returnedQuantity_Print: 0,
        unitPrice_Print: 0,
        discount_Print: 0,
        quotationId: 0,
      })
    );
  }

  estimatedWorkingHours() {
    return (<FormArray>this.quotationForm.get('estimatedWorkingHours'))
      .controls;
  }

  addMoreEstimatedWorkingHour() {
    (this.quotationForm.get('estimatedWorkingHours') as FormArray).push(
      this.formbuilder.group({
        id: 0,
        assignedEmployeeId: 0,
        workingHours: 0,
        quotationId: 0,
      })
    );
  }

  quotationSpareParts() {
    return (<FormArray>this.quotationForm.get('quotationSpareParts')).controls;
  }

  removeSparePart(index: number) {
    (this.quotationForm.get('quotationSpareParts') as FormArray).removeAt(
      index
    );
  }

  addMoreSparePart() {
    (this.quotationForm.get('quotationSpareParts') as FormArray).push(
      this.formbuilder.group({
        partId: '',
        partNo: '',
        description: '',
        quantity: '',
        unitPrice: '',
        discount: '',
        quotationTypeId: '',
        quotationId: 0,
      })
    );
  }

  removeControl(controlName: string, index: number) {
    (this.quotationForm.get(controlName) as FormArray).removeAt(index);
  }

  getControls(controlName: string) {
    return (<FormArray>this.quotationForm.get(controlName)).controls;
  }

  //#endregion

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      console.log(event.files);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'File Upload',
      detail: 'File Uploaded Successfully ! ',
    });
  }

  getworkorderInfo(workerorderId: number) {
    this.workorderservice.getWorkOrder(workerorderId).subscribe((res) => {
      if (res.data == null) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'work order does not exist',
          life: 3000,
        });
        setTimeout(() => {
          // this.router.navigate(['main/maintenance/service-request']);
        }, 3000);
      } else {
        this.quotationForm.patchValue({ workOrderNo: res.data.workOrderNo });
        this.quotationForm.patchValue({ workOrderId: res.data.id });
        this.quotationForm.patchValue({ callNo: res.data.callRequest.callNo });
        this.quotationForm.patchValue({
          callRequestId: res.data.callRequest.id,
        });
        this.quotationForm.patchValue({
          assetId: res.data.callRequest.asset.id,
        });
        this.quotationForm.patchValue({
          assetSerialNo: res.data.callRequest.asset.assetSerialNo,
        });
        this.quotationForm.patchValue({
          assetNumber: res.data.callRequest.asset.assetNumber,
        });
        this.quotationForm.patchValue({
          assetName: res.data.callRequest.asset.modelDefinition.assetName,
        });
        this.setExistingSpareParts(res.data.sparePartsWorkOrders);
        this.assetId = res.data.callRequest.asset.id;
        this.getAssignedEmployess(Role.engineersvalue, this.assetId);
      }
    });
  }

  setExistingSpareParts(quotationSpareParts: any[]) {
    quotationSpareParts.forEach((p, index) => {
      (this.quotationForm.get('quotationSpareParts') as FormArray).push(
        this.formbuilder.group({
          partId: p.sparePart.id,
          partNo: '',
          description: p.sparePart.partName,
          quantity: p.qty,
          unitPrice: '',
          discount: '',
          quotationTypeId: '',
          quotationId: 0,
        })
      );
      (this.quotationForm.get('quotationSpareParts') as FormArray)
        .at(index)
        .get('partId')
        ?.setValue({ partNo: p.sparePart.partNo, id: p.sparePart.id });
    });

    if (
      this.typeScreen != 'View' &&
      (this.quotationForm.get('quotationSpareParts') as FormArray).length == 0
    ) {
      (this.quotationForm.get('quotationSpareParts') as FormArray).push(
        this.formbuilder.group({
          partId: null,
          partNo: '',
          description: '',
          quantity: 0,
          unitPrice: '',
          discount: '',
          quotationTypeId: '',
          quotationId: 0,
        })
      );
    }

    // (this.quotationForm.get('quotationSpareParts') as FormArray).push( this.buildSparepart(this.formbuilder) );
    (this.quotationForm.get('quotationPrintInfoSpareParts') as FormArray).push(
      this.buildPrintInfoSparepart(this.formbuilder)
    );
    (this.quotationForm.get('estimatedWorkingHours') as FormArray).push(
      this.buildEstimatedWorkinghour(this.formbuilder)
    );
  }

  onSelectSparePart(event: any) {
    var dto = {
      id: 0,
      partNo: event.query,
      partName: '',
      AssetId: this.assetId,
    };

    this.partCatalogService.GetPartAutoComplete(dto).subscribe((data: any) => {
      this.sparePartAutoComplete = data.data;
    });
  }

  bindSparePart(event: any, index: number) {
    let isExists: boolean = false;

    (
      this.quotationForm.get('quotationSpareParts') as FormArray
    ).controls.forEach((element, i) => {
      if (element.value.partId?.id == event.id && i != index) {
        (this.quotationForm.get('quotationSpareParts') as FormArray)
          .at(index)
          .get('description')
          ?.setValue('');
        (this.quotationForm.get('quotationSpareParts') as FormArray)
          .at(index)
          .get('partId')
          ?.setValue('');
        isExists = true;
      }
    });

    if (isExists == false) {
      (this.quotationForm.get('quotationSpareParts') as FormArray)
        .at(index)
        .get('description')
        ?.setValue(event.partName);
      (this.quotationForm.get('quotationSpareParts') as FormArray)
        .at(index)
        .get('partId')
        ?.setValue({ partNo: event.partNo, id: event.id });
    }
  }

  clearSparePart(index: number) {
    (this.quotationForm.get('quotationSpareParts') as FormArray)
      .at(index)
      .get('partId')
      ?.setValue(0);
  }

  save() {
    if (this.quotationForm.invalid) {
      validateForm.validateAllFormFields(this.quotationForm);
      this.quotationForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let finalData: any = this.getQuotaionModel(this.quotationForm.value);

      //Attachment
      if (!finalData.Attachments) {
        finalData.Attachments = [];
      }
      (this.attachmentForm.get('attachments') as FormArray).controls.forEach(
        (element) => {
          let attach = new attachments();
          attach.id = element.value.id;
          attach.attachmentName = element.value.attachmentName;
          finalData.Attachments.push(attach);
          // this.quotationModel.attachments.push(attach);
        }
      );

      if (finalData.supplierId == 0) {
        finalData.supplierId = null;
      }

      if (finalData.currencyId == 0) {
        finalData.currencyId = null;
      }

      if (finalData.offerTypeId == 0) {
        finalData.offerTypeId = null;
      }

      finalData.parentWOId = this.ParentWOId;

      finalData.workOrderId = this.workerorderId;
      finalData.ContractStatusId = 178;

      // ------------------------------------

      let total = 0;
      finalData.quotationSpareParts.forEach((p: any) => {
        total = total + p.quantity;
      });

      finalData.total = total; 

      if (this.id == undefined || this.id == 0) {
        this.quotationService.saveQuotation(finalData).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.Init();
            this.close_modal();
            // this.router.navigate(['maintenance/quotations']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message,
              life: 3000,
            });
          }
        });
      } else {
        finalData.workOrderId = this.quotationForm.value.workOrderId;
        finalData.ContractStatusId = 178;
        this.quotationService.updateQuotation(finalData).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.router.navigate(['maintenance/quotations']);
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
  }

  getQuotation(quotationId: number) {
    this.quotationService.getQuotation(quotationId).subscribe((res) => {
      if (res.isSuccess) {
        const data = res.data;
        this.transactionHistory=new TransactionHistory();
        Object.assign( this.transactionHistory,res.data);
        this.quotationForm.patchValue(data);
        this.createdOn = data.createdOn;
        this.modifiedOn = data.modifiedOn;
        this.assetId = data.assetId;
        this.quotationForm.patchValue({
          quotationDate: new Date(res.data.quotationDate),
        });

        this.quotationService
          .getLookup(Lookup.QuotationOfferType)
          .subscribe((res1: any) => {
            let reslut: any[] = [];
            reslut = res1.data;
            let main = reslut.filter((x) => x.value == 2)[0];
            if (res.data.offerTypeId != main.id) {
              this.callDisabled = 'true';
              this.quotationForm.value.CallLastSituationId = null;
            } else {
              this.callDisabled = 'false';
            }
          });

        this.getAssignedEmployess(Role.engineersvalue, this.assetId);

        //  quotationSpareParts
        let quotationSpareParts: any[] = [];
        quotationSpareParts = res.data.quotationSpareParts;
        if (quotationSpareParts.length == 0) {
          (this.quotationForm.get('quotationSpareParts') as FormArray).push(
            this.formbuilder.group({
              partId: null,
              description: null,
              quantity: null,
              unitPrice: null,
              discount: null,
              quotationTypeId: null,
              quotationId: null,
            })
          );
        } else {
          quotationSpareParts.forEach((p, index) => {
            (this.quotationForm.get('quotationSpareParts') as FormArray).push(
              this.formbuilder.group({
                partId: p.partId,
                description: p.description,
                quantity: p.quantity,
                unitPrice: p.unitPrice,
                discount: p.discount,
                quotationTypeId: p.quotationTypeId,
                quotationId: p.quotationId,
              })
            );
            (this.quotationForm.get('quotationSpareParts') as FormArray)
              .at(index)
              .get('partId')
              ?.setValue({ partNo: p.partNo, id: p.partId });
          });
        }

        //  quotationPrintInfoSpareParts
        let quotationPrintInfoSpareParts: any[] = [];
        quotationPrintInfoSpareParts = res.data.quotationPrintInfoSpareParts;
        if (quotationPrintInfoSpareParts.length == 0) {
          (
            this.quotationForm.get('quotationPrintInfoSpareParts') as FormArray
          ).push(
            this.formbuilder.group({
              description_Print: null,
              quantity_Print: 0,
              returnedQuantity_Print: 0,
              unitPrice_Print: 0,
              discount_Print: 0,
              quotationId: null,
            })
          );
        } else {
          quotationPrintInfoSpareParts.forEach((p) => {
            (
              this.quotationForm.get(
                'quotationPrintInfoSpareParts'
              ) as FormArray
            ).push(
              this.formbuilder.group({
                description_Print: p.description_print,
                quantity_Print: p.quantity,
                returnedQuantity_Print: p.returnedQuantity_print,
                unitPrice_Print: p.unitPrice_Print,
                discount_Print: p.discount_Print,
                quotationId: p.quotationId,
              })
            );
          });
        }

        //  estimatedWorkingHours
        let estimatedWorkingHours: any[] = [];
        estimatedWorkingHours = res.data.estimatedWorkingHours;
        estimatedWorkingHours.forEach((p) => {
          (this.quotationForm.get('estimatedWorkingHours') as FormArray).push(
            this.formbuilder.group({
              assignedEmployeeId: p.assignedEmployeeId,
              workingHours: p.workingHours,
              quotationId: p.quotationId,
            })
          );
        });

        this.quotationForm.patchValue({
          startOfWorkTime:
            res.data.startofWorkTime == null
              ? null
              : new Date(res.data.startofWorkTime),
          endOfWorkTime:
            res.data.endofWorkTime == null
              ? null
              : new Date(res.data.endofWorkTime),
        });

        //Attachment
        this.attachmentName = [];
        var att = res.data.attachments as any[];
        if (att != null) {
          att.forEach((element) => {
            (this.attachmentForm.get('attachments') as FormArray).push(
              this.formbuilder.group({
                id: element.id,
                attachmentName: element.attachmentName,
                quotationId: element.quotationId,
                //  attachmentName: element.attachmentName,
                //  attachmentURL: element.attachmentURL,
              })
            );

            this.attachmentName.push(element.name);
          });
        }
      }
    });
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Quotation?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.quotationService.deleteQuotation(this.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.router.navigate(['maintenance/quotations']);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
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

  cancel() {
    this.router.navigate(['maintenance/quotations']);
  }

  selectQuotationDate() {
    this.quotationForm.controls['quotationDate'].setValue(
      this.quotationForm.value.quotationDate
    );
  }

  convertTimeToMinutes(data: any) {
    var splitTime = data.split(' ');
    let hours: number = 0;

    if (splitTime[1] == 'PM' || splitTime[1] == 'م') {
      hours = 12;
    }

    var splitTimeHAM = data.split(':');
    hours = (hours + Number(splitTimeHAM[0])) * 60;

    var splitMinute = splitTimeHAM[1].split(' ');
    let minutes = (hours + Number(splitMinute[0])) / 60;
    return minutes;
  }

  getQuotaionModel(formValue: any) {
    let model = { ...formValue };
    model.quotationSpareParts = [];
    model.estimatedWorkingHours = [];
    model.quotationPrintInfoSpareParts = [];
    let spares: any[] = formValue.quotationSpareParts;

    spares.forEach((y) => {
      if (y.partId != null && y.partId.id != null && y.partId.id != 0) {
        let item = {
          id: y.id,
          partId: y.partId.id,
          quantity: y.quantity == '' || y.quantity == null ? 0 : y.quantity,
          unitPrice: y.unitPrice == '' || y.unitPrice == null ? 0 : y.unitPrice,
          discount: y.discount == '' || y.discount == null ? 0 : y.discount,
          quotationTypeId: y.quotationTypeId == 0 ? null : y.quotationTypeId,
          quotationId: y.quotationId,
        };
        model.quotationSpareParts.push(item);
      }
    });

    let estimateds: any[] = formValue.estimatedWorkingHours;
    estimateds.forEach((y) => {
      if (y.assignedEmployeeId != null && y.assignedEmployeeId != '0') {
        let item = {
          id: y.id,
          assignedEmployeeId: y.assignedEmployeeId,
          quotationId: y.quotationId,
          workingHours:
            y.workingHours == '' || y.workingHours == null ? 0 : y.workingHours,
        };
        model.estimatedWorkingHours.push(item);
      }
    });

    let infoSpares: any[] = formValue.quotationPrintInfoSpareParts;
    infoSpares.forEach((y) => {
      if (y.description_Print != null && y.description_Print != '') {
        let item = {
          id: y.id,
          description_Print: y.description_Print,
          quotationId: y.quotationId,
          discount_Print:
            y.discount_Print == '' || y.discount_Print == null
              ? 0
              : y.discount_Print,
          quantity_Print:
            y.quantity_Print == '' || y.quantity_Print == null
              ? 0
              : y.quantity_Print,
          returnedQuantity_Print:
            y.returnedQuantity_Print == '' || y.returnedQuantity_Print == null
              ? 0
              : y.returnedQuantity_Print,
          unitPrice_Print:
            y.unitPrice_Print == '' ? 0 : y.returnedQuantity_Print,
        };
        model.quotationPrintInfoSpareParts.push(item);
      }
    });

    return model;
  }

  cloneAndChangeProp(arr: any[], act: (n: any, old: any) => any) {
    return arr.map((a) => {
      let newInst = { ...a };
      act(newInst, a);
      return newInst;
    });
  }

  buildSparepart(formbuilder: FormBuilder) {
    return formbuilder.group({
      partNo: [''],
      description: [''],
      quantity: [''],
      unitPrice: [''],
      discount: [''],
      quotationTypeId: [''],
      quotationId: 0,
    });
  }

  buildPrintInfoSparepart(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      description_Print: [''],
      quantity_Print: 0,
      returnedQuantity_Print: 0,
      unitPrice_Print: 0,
      discount_Print: 0,
      quotationId: 0,
    });
  }

  buildEstimatedWorkinghour(formbuilder: FormBuilder) {
    return formbuilder.group({
      id: 0,
      assignedEmployeeId: 0,
      workingHours: 0,
      quotationId: 0,
    });
  }

  // buildAttachment(formbuilder: FormBuilder) {
  //   return formbuilder.group({
  //     id: 0,
  //     attachmenName: 0,
  //     quotationId: 0,
  //   });
  // }

  buildForm(formbuilder: FormBuilder) {
    //Attachment
    this.attachmentForm = this.formbuilder.group({
      attachments: this.formbuilder.array([]),
    });

    return formbuilder.group({
      id: 0,
      assetId: [null],
      assetSerialNo: [null],
      assetNumber: [null],
      assetName: [null],
      callNo: [null],
      callRequestId: [null],
      workOrderNo: [null],
      workOrderId: [null],
      quotationNo: [null],
      quotationNoManual: [null, Validators.required],
      quotationDateText: [null],
      quotationDate: [null, Validators.required],
      mapItemsToPrint: [false],
      faxNo: [null],
      callLastSituationId: [null],
      relatedEmployeeId: [null],
      statusId: [null],
      siteNamePrint: [null],
      presentedTo: [null],
      subject: [null],
      fax: [null],
      createdOn: [null],
      modifiedOn: [null],
      conditions: [null],
      endpage: [null],
      hideDescInprint: [false],
      travelingHours: [null],
      attachments: this.formbuilder.array([]),
      quotationSpareParts: this.formbuilder.array([]),
      quotationPrintInfoSpareParts: this.formbuilder.array([]),
      estimatedWorkingHours: this.formbuilder.array([]),
      currencyId: [null],
      offerTypeId: [null, Validators.required],
      supplierId: [null],
      startOfWorkTime: [null],
      endOfWorkTime: [null],
    });
  }

  //#region ON Change
  changeGuotationTypes(event: any) {
    this.quotationForm.value.QuotationTypeId = event.value;
  }

  changeQuotationOfferType(event: any) {
    this.quotationForm.value.OfferTypeId = event.value;
    let offerType = this.quotationOfferType.filter(
      (x) => x.id == event.value
    )[0];
    if (offerType.value == 1) {
      this.callDisabled = 'false';
    } else {
      this.callDisabled = 'true';
      this.quotationForm.value.CallLastSituationId = null;
    }
  }

  changeSupplier(event: any) {
    this.quotationForm.value.supplierId = event.value;
  }

  changeCurrency(event: any) {
    this.quotationForm.value.currencyId = event.value;
  }

  changeCallLastSituation(event: any) {
    this.quotationForm.value.CallLastSituationId = event.value;
  }

  changeRelatedEmployee(event: any) {
    this.quotationForm.value.RelatedEmployeeId = event.value;
  }

  onMapItemsToPrintChange(event: any) {
    this.quotationForm.value.MapItemsToPrint = event.target.checked;
    // perform some action when the checkbox state changes
  }

  // ready(event:any){
  //   console.log("event",event);
  //   this.quotationModel.attachments.push({
  //     quotationId: this.quotationModel.id, attachmenName: event[0], id: 0,
  //     attachmentURL: null
  //   });
  //   // this.imgFlag=true;
  // }

  // handleFileInput(files: any) {
  //   this.fileList = files.currentFiles[0];
  //   // this.fileList = this.quotationModel.attachments;
  //   debugger
  //   this.quotationService.uploadFiles(this.fileList).subscribe((res) => {
  //     const data = res.data;
  //     this.attachmentForm.value.attachmenName = data[0];
  //     const sucess = res.isSuccess;
  //     const message = res.message;
  //     if (sucess == true) {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: message,
  //         life: 3000,
  //       });
  //     } else {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: message,
  //         life: 3000,
  //       });
  //     }
  //   });
  // }
  //#endregion

  //#region DROP

  GetLookupCallLastSituationBasedOnCase(
    parentWOId: any,
    isAdd: any,
    id: number,
    typeTransaction: string
  ) {
    this.workOrdersService
      .GetLookupCallLastSituationBasedOnCase(
        parentWOId,
        isAdd,
        id,
        typeTransaction
      )
      .subscribe((res: any) => {
        this.quotationCallLastSituation = res.data;
      });
  }

  getQuotationType() {
    this.quotationService
      .getLookup(Lookup.QuotationType)
      .subscribe((res: any) => {
        this.quotationTypes = res.data;
        this.quotationTypes.splice(0, 0, {
          id: 0,
          name: 'Select',
          value: null,
        });
      });
  }

  getCurrency() {
    this.quotationService.getLookup(Lookup.Currency).subscribe((res: any) => {
      this.currencies = res.data;
      this.currencies.splice(0, 0, { id: 0, name: 'Select', value: null });
    });
  }

  getQuotationOfferType() {
    this.quotationService
      .getLookup(Lookup.QuotationOfferType)
      .subscribe((res: any) => {
        this.quotationOfferType = res.data;
        this.quotationOfferType.splice(0, 0, {
          id: 0,
          name: 'Select',
          value: null,
        });
      });
  }

  getSuppliers() {
    this.supplierService.getSuppliersAutoComplete('').subscribe((res: any) => {
      this.suppliers = res.data;
      this.suppliers.splice(0, 0, { id: 0, name: 'Select', value: null });
    });
  }

  getQuotationStatus() {
    this.quotationService
      .getLookup(Lookup.QuotationStatus)
      .subscribe((res: any) => {
        this.quotationStatus = res.data;
        this.quotationStatus.splice(0, 0, {
          id: 0,
          name: 'Select',
          value: null,
        });
      });
  }

  getAssignedEmployess(value: any, assetId?: number) {
    // return this.quotationService
    //   .getAssignedEmp(['70ade82e-e791-4527-8220-043383d55b45'])
    //   .subscribe((res: any) => {
    //     console.log('Assign', res);
    //     this.assignedEmployess = res;
    //   });
    this.employeeService
      .GetUserByRoleValue(value, assetId)
      .subscribe((res: any) => {
        this.assignedEmployess = res;
      });
  }

  //#endregion

  //#region AutoComplete
  searchSiteBySN($event: any) {
    this.siteService.GetCustomersAutoComplete($event.query).subscribe((res) => {
      this.SiteList = res.data;
    });
  }

  //---------------------------
  searchAssetBySN(event: any) {
    this.assetService
      .GetAssetsAutoCompleteMultiFilter(<any>{ AssetSerialNumber: event.query })
      .subscribe((res) => {
        this.assetSerialNumberList = res.data;
      });
  }

  onSelectAsset(event: any) {
    this.quotationModel.assetId = event.id;
    this.quotationModel.assetSerialNo = event.assetSerialNumer;
  }

  //---------------------------------
  searchPartByN(event: any) {
    this.partCatalogService
      .getAutoComplete(<any>{ PartNo: event.query })
      .subscribe((res: any) => {
        this.sparePartAutoComplete = res;
      });
  }

  onSelectPartNo(event: any) {
    this.quotationForm.value.SparePart.PartNo = event.partName;
  }

  // onSelectPart(event:any){
  //   this.AssetSerialNumer=event.id;
  //   this.quotationModel.=this.AssetSerialNumer;
  //   this.quotationModel.AssetSerialNo=event.assetSerialNumer;
  //   console.log("this.AssetSerialNumer",this.AssetSerialNumer)
  // }

  //#endregion

  clickStep(step: any) {
    if (step.typeTransaction == 'W') {
      if (step.processed == false) {
        if (step.parentWOId == null) {
          this.router.navigate(['/maintenance/work-orders/add-control'], {
            queryParams: { callId: step.callId },
          });
        } else {
          this.router.navigate(['/maintenance/work-orders/add-control'], {
            queryParams: { callId: step.callId, ParentWOId: step.parentWOId },
          });
        }
      } else {
        let perantId = step.parentWOId == null ? step.id : step.parentWOId;
        this.workOrdersService
          .GetPreviousAndNextStepById('W', step.id, perantId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                if (res.data.previousId == null) {
                  this.router.navigate(
                    ['/maintenance/work-orders/view-control'],
                    { queryParams: { id: step.id, callId: step.callId } }
                  );
                } else {
                  this.router.navigate(
                    ['/maintenance/work-orders/view-control'],
                    {
                      queryParams: {
                        id: step.id,
                        ParentWOId: step.parentWOId,
                        callId: step.callId,
                      },
                    }
                  );
                }
              } else {
                if (res.data.previousId == null) {
                  this.router.navigate(
                    ['/maintenance/work-orders/edit-control'],
                    { queryParams: { id: step.id, callId: step.callId } }
                  );
                } else {
                  this.router.navigate(
                    ['/maintenance/work-orders/edit-control'],
                    {
                      queryParams: {
                        id: step.id,
                        ParentWOId: step.parentWOId,
                        callId: step.callId,
                      },
                    }
                  );
                }
              }
            }
          });
      }
    }

    if (step.typeTransaction == 'Q') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              this.router.navigate(['/maintenance/quotations/add-control'], {
                queryParams: {
                  workerorderId: last.data.previousId,
                  ParentWOId: step.parentWOId,
                },
              });
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('Q', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.router.navigate(['/maintenance/quotations/view-control'], {
                  queryParams: {
                    id: step.id,
                    workerorderId: res.data.previousId,
                    ParentWOId: step.parentWOId,
                  },
                });
              } else {
                this.router.navigate(['/maintenance/quotations/edit-control'], {
                  queryParams: {
                    id: step.id,
                    workerorderId: res.data.previousId,
                    ParentWOId: step.parentWOId,
                  },
                });
              }
            }
          });
      }
    }

    if (step.typeTransaction == 'PR') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              this.router.navigate(
                ['/maintenance/purchase-order/add-control'],
                {
                  queryParams: {
                    quotationId: last.data.previousId,
                    ParentWOId: step.parentWOId,
                    isPR: 'PR',
                  },
                }
              );
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('PR', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.router.navigate(
                  ['/maintenance/purchase-order/view-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PR',
                    },
                  }
                );
              } else {
                this.router.navigate(
                  ['/maintenance/purchase-order/edit-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PR',
                    },
                  }
                );
              }
            }
          });
      }
    }

    if (step.typeTransaction == 'PO') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              this.router.navigate(
                ['/maintenance/purchase-order/add-control'],
                {
                  queryParams: {
                    quotationId: last.data.previousId,
                    ParentWOId: step.parentWOId,
                    isPR: 'PO',
                  },
                }
              );
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('PO', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                this.router.navigate(
                  ['/maintenance/purchase-order/view-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PO',
                    },
                  }
                );
              } else {
                this.router.navigate(
                  ['/maintenance/purchase-order/edit-control'],
                  {
                    queryParams: {
                      id: step.id,
                      quotationId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                      isPR: 'PO',
                    },
                  }
                );
              }
            }
          });
      }
    }

    if (step.typeTransaction == 'PD') {
      if (step.processed == false) {
        this.workOrdersService
          .lastTransaction(step.parentWOId)
          .subscribe((last) => {
            if (last.isSuccess) {
              if (last.typeTransaction == 'PO') {
                this.router.navigate(
                  ['/store/part-delivery/add-part-delivery'],
                  {
                    queryParams: {
                      poId: last.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              } else {
                this.router.navigate(
                  ['/store/part-delivery/add-part-delivery'],
                  {
                    queryParams: {
                      workOrderId: last.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  }
                );
              }
            }
          });
      } else {
        this.workOrdersService
          .GetPreviousAndNextStepById('PD', step.id, step.parentWOId)
          .subscribe((res) => {
            if (res.isSuccess) {
              if (res.data.nextId != null) {
                if (res.data.previousType == 'PO') {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 0,
                      poId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                } else {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 0,
                      workOrderId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                }
              } else {
                if (res.data.previousType == 'PO') {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 1,
                      poId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                } else {
                  this.router.navigate(['store/partDelivery/edit-control'], {
                    queryParams: {
                      data: step.id,
                      index: 1,
                      workOrderId: res.data.previousId,
                      ParentWOId: step.parentWOId,
                    },
                  });
                }
              }
            }
          });
      }
    }
  }

  //Attachment
  attachmentReady(event: any) {
    (this.attachmentForm.get('attachments') as FormArray).push(
      this.formbuilder.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );
  }

  selectStartDate($event: any) {
    // this.startDate = $event;
    // this.startFlag = true;
    if (
      this.quotationForm.value.startOfWorkTime >
      this.quotationForm.value.endOfWorkTime
    ) {
      this.quotationForm.controls['startOfWorkTime'].setValue(null);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The Start date is greater than the End date',
        life: 3000,
      });
    } else {
    }
  }

  selectEndDate($event: any) {
    if (
      this.quotationForm.value.endOfWorkTime <
      this.quotationForm.value.startOfWorkTime
    ) {
      this.quotationForm.controls['endOfWorkTime'].setValue(null);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The End date is less than the Start date',
        life: 3000,
      });
    } else {
    }
  }
}
