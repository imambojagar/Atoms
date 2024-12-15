
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Asset } from 'src/app/data/models/asset';
import { attachments, ppmAssets, PpmModel } from 'src/app/data/models/ppm-model';
import { AssetsService } from 'src/app/data/service/assets.service';
import { PpmService } from 'src/app/data/service/ppm.service';
import { dateHelper } from 'src/app/shared/helpers/dateHelper';
import { AssetFormService } from '../../../systemsettings/assets/asset-form.service';
import { SupplierService } from 'src/app/data/service/supplier.service';
import { TransactionHistory } from 'src/app/shared/models/transaction-history';

@Component({
  selector: 'edit-delete-ppm',
  templateUrl: './edit-delete-ppm.component.html',
  styleUrls: ['./edit-delete-ppm.component.scss']
})
export class EditDeletePpmComponent {

  userDialog!: boolean;
  submitted!: boolean;
  linkDialog: boolean = false;
  ppmModel: PpmModel = new PpmModel();
  addPpmForm !: FormGroup;
  allData!: any;
  start: any;
  items!: MenuItem[];
  imgFlag: boolean = false;
  cer !: FormGroup;
  uploadedFiles: any[] = [];
  period: any[] = [];
  assigned: [] = [];
  TypeService: any[] = [];
  groupLeader: [] = [];
  contractList: [] = [];
  contractNum: number = 0;
  fromFlag: boolean = false;
  toFlag: boolean = false;
  fileList: File[] = [];
  tabIndex: number = 0;
  createdOn!: any;
  modifiedOn!: any;
  fromDate!: any;
  toDate!: any;
  addImg!: boolean;
  PpmAssets: any;
  showDialog!: boolean;
  totalRows!: number;
  assetsData: [] = [];
  searchFilter = new Asset();
  searchForm!: FormGroup
  pageSize = 10;
  selectedRowIds: Set<number> = new Set<number>();
  selectedId!: string;
  serialNumbersArray: Set<string> = new Set<string>();
  isDeleted: boolean = false;
  isChecked: any[] = [];
  suppliers: any[] = [];
  contractNumber: any;
  timePeriodValue!: any;
  contractId: any;
  contractName: any;
  attachmentForm!: FormGroup;
  attachmentName: any[] = [];
  check: boolean;

  timePeriod: any;

  isShow: boolean = true;
  autoRenew: boolean = false;
  p: any;


  timeFrame: [] = [];
  transactionHistory: TransactionHistory

  filter = {
    pageSize: 10,
    pageNumber: 1,
    maintenanceContractNumber: null,
    maintenanceContractName: null,
    assetId: null,
    contractStatus: null,
    contractType: null,
    siteId: null,
    contractEndDate: null,
  }
  isShowInstructionDescription: boolean = true;
  InstructionDescription: any[] = [];
  isInstruction: boolean = true;

  constructor(private supplierApi: SupplierService, public assetFormService: AssetFormService, private apiAsset: AssetsService, private router: ActivatedRoute, private route: Router, private formbuilder: FormBuilder, private api: PpmService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getTimeFrame();
    this.getTimePeriod();
    this.addPpmForm = this.formbuilder.group({
      id: 0,
      timePeriodId: ['', Validators.required],
      timePeriodName: [''],
      assignedToId: ['', Validators.required],
      assignedToName: '',
      ppmTasks: [''],
      maintenanceContractId: 0,
      maintenanceContractContractNumber: [''],
      maintenanceContractContractName: [''],
      typeOfServiceId: 0,
      typeOfServiceName: [''],
      executionTimeFrameId: [null, Validators.required],
      executionTimeFrameName: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      ppmAssets: this.formbuilder.array([]),
      groupLeaderId: 0,
      groupLeaderUserName: [''],
      comments: [''],
      workPerformedBy: [''],
      numOfVisitsDone: 0,
      supplierName: [''],
      supplierId: [''],
      autoRenew: [''],
      instructionDescription: [''],
      InstructionDescriptionId:0,
      instructionDescriptionView:['']
    })

    this.attachmentForm = this.formbuilder.group({
      attachments: this.formbuilder.array([]),
    });

    this.router.queryParams.subscribe((params: any) => {

      this.ppmModel.id = params.data;
      this.tabIndex = params.index;
      this.api.getSinglePpm(params.data).subscribe(res => {
        const data = res.data;
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res.data);
        console.log("data from api", res.data)
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.getAllInstructionDescription(res.data.ppmAssets[0].assetId);
          this.addPpmForm.controls['timePeriodId'].setValue(data.timePeriodId);
          this.timePeriodValue = data.timePeriodId;
          this.start = data.fromDate;
          this.start = data.fromDate;
          this.addPpmForm.controls['toDate'].setValue(dateHelper.handleDateApi(data.toDate));
          this.addPpmForm.controls['fromDate'].setValue(dateHelper.handleDateApi(data.fromDate));
          this.addPpmForm.controls['timePeriodName'].setValue(data.timePeriodName);
          
          if (data.instructionDescription) {
            this.addPpmForm.controls['instructionDescriptionView'].setValue(data.instructionDescription);
           this.addPpmForm.controls['instructionDescription'].setValue(data.instructionDescriptionId);
            this.isShowInstructionDescription = false;
          }

          this.addPpmForm.controls['assignedToId'].setValue(data.assignedToId);
          this.addPpmForm.controls['assignedToName'].setValue(data.assignedToName);
          this.addPpmForm.controls['ppmTasks'].setValue(data.ppmTasks);
          this.addPpmForm.controls['autoRenew'].setValue(data.autoRenew);
          this.addPpmForm.controls['executionTimeFrameId'].setValue(data.executionTimeFrameId);
          this.addPpmForm.controls['executionTimeFrameName'].setValue(data.executionTimeFrameName);
          this.autoRenew = data.autoRenew;
          this.addPpmForm.controls['maintenanceContractId'].setValue({ id: data.maintenanceContractId, contractNumber: data.contractNumber });
          this.contractId = data.maintenanceContractId;
          this.addPpmForm.controls['maintenanceContractContractNumber'].setValue({ contractNumber: data.contractNumber });
          this.contractName = data.contractNumber;
          this.contractName = data.contractNumber;
          this.addPpmForm.controls['maintenanceContractContractName'].setValue(
            data.maintenanceContractContractName);
          this.addPpmForm.controls['typeOfServiceId'].setValue(data.typeOfServiceId);
          this.addPpmForm.controls['typeOfServiceName'].setValue(data.typeOfServiceName);
          this.addPpmForm.controls['groupLeaderId'].setValue(data.groupLeaderId);
          this.addPpmForm.controls['groupLeaderUserName'].setValue(data.groupLeaderUserName);
          this.addPpmForm.controls['comments'].setValue(data.comments);
          this.addPpmForm.controls['supplierId'].setValue(data.supplierId);
          this.addPpmForm.controls['supplierName'].patchValue({ suppliername: data.supplierName });
          this.api.getLookups({ queryParams: 32 }).subscribe(res => {
            this.period = res.data;
            this.p = this.period.find(x => x.id == this.timePeriodValue)
            this.timePeriod = this.p.value;
            this.p = this.period.find(x => x.id == this.timePeriodValue)
            this.timePeriod = this.p.value;
          })

          
          console.log("this.timePeriod", this.timePeriod)
          console.log("PPPP", this.p)
          console.log("PPPP", this.p)
          this.PpmAssets = data.ppmAssets;
          if (data.typeOfServiceId == 66) {
            this.check = false;
          }
          else {
            this.check = true;
          }
          //
          this.attachmentName = [];
          var att = data.attachments as any[];
          if (att != null) {
            att.forEach(element => {
              (this.attachmentForm.get('attachments') as FormArray).push(
                this.formbuilder.group({
                  attachmentName: element.attachmentName,
                  attachmentURL: element.attachmentName,
                  id: element.id,
                })
              );
              this.attachmentName.push(element.attachmentName);
            });
          }
          this.setExsitingAssets(this.PpmAssets);
          this.createdOn = data.createdOn;
          this.modifiedOn = data.modifiedOn;
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      })

    })

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'PPMs Schedule' },
    ];

    this.getAssignedTo();
    this.getTypeService();
    


  }

  updatePpm() {
    console.log("this.contractNum", this.contractNum)
    this.ppmModel.timePeriodId = this.addPpmForm.value.timePeriodId;
    this.ppmModel.assignedToId = this.addPpmForm.value.assignedToId;
    this.ppmModel.typeOfServiceId = this.addPpmForm.value.typeOfServiceId;
    this.ppmModel.executionTimeFrameId = this.addPpmForm.value.executionTimeFrameId;
    this.ppmModel.comments = this.addPpmForm.value.comments;
    this.ppmModel.ppmAssets = this.PpmAssets;
    this.ppmModel.autoRenew = this.autoRenew;
    this.ppmModel.fromDate = dateHelper.ConvertDateWithSameValue(this.addPpmForm.value.fromDate);
    this.ppmModel.toDate = dateHelper.ConvertDateWithSameValue(this.addPpmForm.value.toDate);
    this.ppmModel.supplierId = this.addPpmForm.value.supplierId;
    this.ppmModel.attachments = [];
    this.ppmModel.ppmAssets = this.PpmAssets;
    this.ppmModel.autoRenew = this.autoRenew;
    this.ppmModel.fromDate = dateHelper.ConvertDateWithSameValue(this.addPpmForm.value.fromDate);
    this.ppmModel.toDate = dateHelper.ConvertDateWithSameValue(this.addPpmForm.value.toDate);
    this.ppmModel.supplierId = this.addPpmForm.value.supplierId;
    
    this.ppmModel.InstructionDescriptionId = this.addPpmForm.value.instructionDescription;


    this.ppmModel.attachments = [];
    (this.attachmentForm.get('attachments') as FormArray).controls.forEach(
      (element) => {
        let attach = new attachments();
        attach.id = element.value.id;
        attach.id = element.value.id;
        attach.attachmentName = element.value.attachmentName;
        attach.ppmId = this.ppmModel.id;
        attach.ppmId = this.ppmModel.id;
        this.ppmModel.attachments.push(attach);
      }
    );





    if (!this.contractNum) {
      this.ppmModel.maintenanceContractId = this.contractId;
    }
    else { this.ppmModel.maintenanceContractId = this.contractNum; }
    console.log(this.ppmModel)
    if (this.timePeriodValue != this.addPpmForm.value.timePeriodId ||
      this.fromDate != this.addPpmForm.value.fromDate ||
      this.toDate != this.addPpmForm.value.toDate) {
      this.confirmationService.confirm({
        message: 'You have changed values , Are you sure you want to recreat this PPM Plan?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.ppmModel.reCreateVisitsConfirmed = true;
          console.log(this.ppmModel)
          this.api.updatePpm(this.ppmModel).subscribe(res => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
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
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
          }
        }
      });
    }
    else {
      console.log(this.ppmModel)
      this.api.updatePpm(this.ppmModel).subscribe(res => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
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
    }

  }

  selectFromDate(event: any) {
    console.log("from date", event)
    if (this.timePeriod == null || this.timePeriod == undefined || this.timePeriod == '') {
      this.messageService.add({
        severity: 'warning',
        summary: 'Warning',
        detail: "Please Select Time PPM Frequency First !",
        life: 3000,
      });
    }
    this.start = event;
    this.calcEndDate(this.start);
  }
  setCheckbox(event: any) {
    this.autoRenew = event.checked;
  }



  setExsitingAssets(asset: ppmAssets[]) {
    asset.forEach((a) => {
      (this.addPpmForm.get('ppmAssets') as FormArray).push(
        this.formbuilder.group({
          assetId: a.assetId,
          assetName: a.assetName,
          assetNumber: a.assetNumber,
          assetSerialNo: a.assetSerialNo,
          ppmId: a.ppmId,
          id: a.id
        }));

    });
    console.log("this.isChecked", this.isChecked);
  }

  searchSupplier(event: any) {
    this.supplierApi
      .getSupplier({ suppliername: event.query })
      .subscribe((res) => {
        this.suppliers = res.data;
      });
  }
  onSelectSupplier(event: any) {
    this.addPpmForm.controls['supplierId'].patchValue(event.id);
    this.addPpmForm.controls['supplierName'].patchValue({
      suppliername: event.suppliername,
    });

    console.log('supp event', event.id);
  }
  deletePpm() {
    this.router.queryParams.subscribe((params: any) => {
      this.ppmModel.id = params.data;
      console.log(this.ppmModel.id)
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this PPM?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deletePpm(this.ppmModel.id).subscribe(res => {
            const message = res.message;
            const sucess = res.isSuccess;
            if (sucess == true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: message,
                life: 3000,
              });
              this.route.navigate(['/maintenance/ppm']);
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
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
          }
        }

      });

    })
  }

  getTimePeriod() {
    this.api.getLookups({ queryParams: 32 }).subscribe(res => {
      this.period = res.data;
    })
  }


  getAssignedTo() {
    this.api.getLookups({ queryParams: 33 }).subscribe(res => {
      this.assigned = res.data;
    })
  }


  getTypeService() {
    this.api.getLookups({ queryParams: 34 }).subscribe(res => {
      this.TypeService = res.data;
    })
  }

  changePeriod(event: any) {

    this.addPpmForm.value.timePeriodId = event.value;
    this.p = this.period.find(x => x.id == event.value)
    console.log("p", this.p)
    this.timePeriod = this.p.value;
    console.log("this.timePeriod", this.timePeriod)
    this.isShow = false;
    this.p = this.period.find(x => x.id == event.value)
    console.log("p", this.p)
    this.timePeriod = this.p.value;
    console.log("this.timePeriod", this.timePeriod)
    this.isShow = false;
    if (this.timePeriod && this.start) {
      this.calcEndDate(this.start);
    }


  }
  calcEndDate(startDate: any) {
    debugger;
    let end = new Date(startDate);
    if (this.timePeriod == 49) {
      end.setMonth(end.getMonth() + 0);
      var toDate = new Date(end.setDate(end.getDate()));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }
    else if (this.timePeriod == 50) {
      end.setMonth(end.getMonth() + 0);
      var toDate = new Date(end.setDate(end.getDate() + 7));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }
    else if (this.timePeriod == 51) {
      end.setMonth(end.getMonth() + 0);
      var toDate = new Date(end.setDate(end.getDate() + 14));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }
    else {
      end.setMonth(end.getMonth() + this.timePeriod);
      var toDate = new Date(end.setDate(end.getDate() - 1));
      this.addPpmForm.controls['toDate'].setValue(toDate)
    }
  }

  changeAssigned(event: any) {
    this.addPpmForm.value.assignedToId = event.value;
    console.log(" this.addPpmForm.value.assignedToId", this.addPpmForm.value.assignedToId)
  }

  changeService(event: any) {
    this.addPpmForm.value.typeOfServiceId = event.value;
    if (event.value == this.TypeService[1].id) {
      this.check = false;


    } else {
      this.check = true;


    }
  }



  searchContract(event: any) {
    this.filter.maintenanceContractNumber = event.query;
    console.log("this.filter.maintenanceContractNumber", this.filter.maintenanceContractNumber)
    this.api.getContractNum({ maintenanceContractNumber: event.query }).subscribe((res) => {
      const data = res.data;
      console.log('contract:', data);
      this.contractList = data;
      this.contractNumber = data.contractNumber;
    });
  }

  onSelectContract(event: any) {
    this.contractNum = event.id;
    console.log("this.contractNum", this.contractNum)
  }



  cancel() {
    this.addPpmForm.reset();
  }


  handleChange() {

    this.api.getSinglePpm(this.ppmModel.id).subscribe((res) => {
      const data = res.data;
      this.transactionHistory = new TransactionHistory();
      Object.assign(this.transactionHistory, res.data);
      this.addPpmForm.controls['timePeriodId'].setValue(data.timePeriodId);
      this.addPpmForm.controls['timePeriodName'].setValue(data.timePeriodName);
      this.addPpmForm.controls['assignedToId'].setValue(data.assignedToId);
      this.addPpmForm.controls['assignedToName'].setValue(data.assignedToName);
      this.addPpmForm.controls['ppmTasks'].setValue(data.ppmTasks);
      this.addPpmForm.controls['maintenanceContractId'].setValue(data.maintenanceContractId);
      this.addPpmForm.controls['maintenanceContractContractNumber'].setValue(data.maintenanceContractContractNumber);
      this.addPpmForm.controls['maintenanceContractContractName'].setValue(data.maintenanceContractContractName);
      this.addPpmForm.controls['typeOfServiceId'].setValue(data.typeOfServiceId);
      this.addPpmForm.controls['typeOfServiceName'].setValue(data.typeOfServiceName);
      this.addPpmForm.controls['groupLeaderId'].setValue(data.groupLeaderId);
      this.addPpmForm.controls['groupLeaderUserName'].setValue(data.groupLeaderUserName);
      this.addPpmForm.controls['comments'].setValue(data.comments);
      this.createdOn = data.createdOn;
      this.modifiedOn = data.modifiedOn;


    });
  }

  attachmentReady(event: any) {
    (this.attachmentForm.get('attachments') as FormArray).push(
      this.formbuilder.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );

  }

  changeTimeFrame(event: any) {
    this.addPpmForm.value.executionTimeFrameId = event.value;
  }
  getTimeFrame() {
    this.api.getLookups({ queryParams: 400 }).subscribe((res) => {
      this.timeFrame = res.data;
    });
  }


  changeInstructionDescription(event: any) {
    this.addPpmForm.value.InstructionDescriptionId = event.value;
  }



  getAllInstructionDescription(assetId: number) {
    this.apiAsset.GetAssetInstructionDescriptionById(assetId).subscribe(res => {
      let InstructionDes = [];
      if (res.data.length > 0) {
        this.isInstruction = false;
        for (let v = 0; v < res.data.length; v++) {
          InstructionDes.push(res.data[v].instructionDescription)
        }
        this.InstructionDescription = InstructionDes;
      }
      else {
        this.isInstruction = true;
      }
    });
  }




}
