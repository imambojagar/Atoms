import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PrimengModule } from '../../../shared/primeng.module';
import { FileUploadComponent } from '../../../shared/components/file-upload-component/file-upload-component';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsTableLookupComponent } from '../../../shared/components/assets-table-lookup/assets-table-lookup.component';
import { EmployeeService } from '../../../services/employee.service';
import { dateHelper } from '../../../shared/helpers/dateHelper';
import { AssetTransferService } from '../../../services/asset-transfer.service';
import { MessageService } from 'primeng/api';
import validateForm from '../../../shared/helpers/validateForm';
import { CustomerService } from '../../../services/customer.service';
import { Role } from '../../../shared/enums/role';
import { Lookup } from '../../../shared/enums/lookup';

@Component({
  selector: 'app-view-add-control',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, FileUploadComponent, ReactiveFormsModule, AssetsTableLookupComponent],
  providers:[EmployeeService],
  templateUrl: './view-control.component.html',
  styleUrl: './add-control.component.scss'
})
export class ViewControlComponent implements OnChanges {


  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Input('navIndes') navIndes: number = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;

  Room:any =[];
  selectedRoom:string ='09/11/2024';
  sendStartdate: string = '09/11/2024';
  senderEndate: string = '09/11/2024';
  receverStartdate: string = '09/11/2024';
  receverEndate: string = '09/11/2024';
  uploadpath = '';
  fileList1!: string[];
  senderFileList!: any[];
  receiverFileList!: any[];
  addAssetForm: any;
  timezon = new FormControl(Intl.DateTimeFormat().resolvedOptions().timeZone);
  checkboxes: boolean[] = [];
  movetofolder: boolean[] = [];
  movetoReceiverfolder: boolean[] = [];
  alert: { type: any; message: string; } | undefined;
  timezonedisabled: boolean = false;
  senderFlag: boolean = false;
  recieverFlag: boolean = false;
  disableSenderStatus: boolean = false;
  disableReceiverStatus: boolean = false;
  departmentList: [] = [];
  buildingList: [] = [];
  floorList: [] = [];
  roomList: [] = [];
  id: number = 0;
  siteId!: number;
  buildingId!: number;
  floorId!: number;
  roomId!: number;
  departmentId!: number;
  showDialog!: boolean;
  disableButton: boolean = false;
  users: any[] = [];
  employeesSender: [] = [];
  employeesReceiver: [] = [];
  minDateVal = new Date();
  empRole: any;
  roleValue: any;
  searchForm!: FormGroup;
  userId: any;
  roleId: any;
  assignedFEFlage: boolean = false;
  disabledFlag: boolean = false;
  isAddMode!: boolean;
  isViewMode: boolean = false;
  allowSender: boolean = false;
  allowReceiver: boolean = false;
  destSiteList: [] = [];

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute,private messageService: MessageService,
    private api: AssetTransferService, private router: Router, private employeeService: EmployeeService,  private siteApi: CustomerService) {
      this.createForm();
   }

  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  }

   Init(): void {
    this.id = this.edit_asset_id; // this._route.snapshot.queryParams['id'];
    if(this.id) {
      this.getDataToEdit();
    } else {
      this.assetTransferSenderTimers().push(
        this.newSender()
      );

      this.assetTransferReceiverTimers().push(
        this.newReceiver()
      );

      this.disableSenderStatus = true;
      this.disableReceiverStatus = true;
    }

    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    this.empRole = JSON.parse(localStorage.getItem('userRoles') || '{}');
    this.userId = localStorage.getItem('userId');
    console.log('roles', this.empRole);

    if(this.empRole.lenth > 0) {
      this.empRole.forEach((e: any) => {
        this.roleValue = e.value;
        if (this.roleValue == 'R-2') {
          this.assignedFEFlage = false;
          this.senderFlag = true;
          this.recieverFlag = true;
        }

        if (this.roleValue == 'R-7' || this.roleValue == 'R-33') {
          this.senderFlag = true;
          this.recieverFlag = true;
          this.assignedFEFlage = true;
          this.disabledFlag = false;
          this.isViewMode = true;
        }

        if (this.roleValue == 'R-13' || this.roleValue == 'R-1') {
          this.allowSender = true;
          this.allowReceiver = true;
          this.isViewMode = true;
        }

        console.log('e:', e.value);
      });
    }
  }

  async getDataToEdit() {
    await this.api.getSingleTransfer(this.id).subscribe((res: any) => {
      const data = res.data;
      const message = res.message;
      const sucess = res.isSuccess;
     /*  this.transactionHistory=new TransactionHistory();
      Object.assign( this.transactionHistory,res.data); */
      console.log("edit data", res);
      if (sucess == true) {
        if (data.assetTransferSenderTimers) {
          data.assetTransferSenderTimers.forEach((x:any)=>{
            this.assetTransferSenderTimers().push(
              this._formBuilder.group({
                id: x.id,
                startDateTime: new Date(x.startDateTime),
                endDateTime: new Date(x.endDateTime),
                workingHours: x.workingHours
              })
            );

          })
        }
        if (this.assetTransferSenderTimers().length==0) {
           this.newSender();
        }
        if (data.assetTransferReceiverTimers) {
          data.assetTransferReceiverTimers.forEach((x: any)=>{
            this.assetTransferReceiverTimers().push(
              this._formBuilder.group({
                id: x.id,
                startDateTime: new Date(x.startDateTime),
                endDateTime: new Date(x.endDateTime),
                workingHours: x.workingHours
              })
            );

          });
        }

        if (this.assetTransferReceiverTimers().length==0) {
           this.newReceiver();
        }

        this.patchData(data);
      } else {
        this.newSender();
        this.newReceiver();
        this.disableSenderStatus = true;
        this.disableReceiverStatus = true;
      }
    });
  }

  createForm() {
    this.addAssetForm = this._formBuilder.group({
      id: 0,
      transferNo: [''],
      transferCode: [''],
      assetId: ['',Validators.required],
      assetSerialNo:[''],
      assetNumber:[''],
      comment:[''],
      destSiteId: ['',Validators.required],
      destSiteIdString:[''],
      destBuildingId: ['',Validators.required],
      destBuildingName:[''],
      destFloorId: ['',Validators.required],
      destFloorName: [''],
      destDepartmentId:['',Validators.required],
      destDepartmentName:[''],
      destRoomId: [''],
      destRoom: [''],
      senderSiteId: ['',Validators.required],
      senderSiteName:[''],
      senderDepartmentId: [''],
      senderDepartmentName:[''],
      senderBuildingId:[''],
      senderBuildingName:[''],
      senderFloorId:[''],
      senderFloorName:[''],
      senderRoomId:[''],
      senderRoom:[''],
      senderAssignedEmployeeId: [''],
      senderAssignedEmployeeName: [''],
      senderMachineStatusId: [''],
      senderMachineStatusName: [''],
      senderComment: [''],
      senderTravelingHours: [''],
      senderAttachmentName: [''],
      receiverAssignedEmployeeId: [''],
      receiverAssignedEmployeeName: [''],
      receiverMachineStatusId: [''],
      receiverMachineStatusName:[''],
      receiverComment: [''],
      receiverTravelingHours: [''],
      receiverAttachmentName: [''],
      assetName:[''],
      modelId:[''],
      modelName:[''],
      manufacturerId:[''],
      manufacturerName:[''],
      supplierId:[''],
      supplierName:[''],
      receiverEndUserId:[''],
      receiverEndUserName:[''],
      assetTransferSenderTimers: this._formBuilder.array([]),
      assetTransferReceiverTimers: this._formBuilder.array([]),
      senderAttachments: this._formBuilder.array([]),
      receiverAttachments: this._formBuilder.array([]),
      /* sender_folders: this._formBuilder.array([], [Validators.required]),
      receiver_folders: this._formBuilder.array([], [Validators.required]), */
    });

    this.setvalidationstatus();
    this.timezonedisabled = false;
    this.timezon.enable();
  }

  patchData(dataSet: any) {
    console.log("dataSet", dataSet);
    this.addAssetForm.patchValue({
      emailtype: dataSet.email_type,
      id: this.id,
      transferNo: dataSet.transferNo,
      transferCode:dataSet.transferCode,
      assetId: dataSet.assetId,
      assetSerialNo:dataSet.assetSerialNo,
      assetNumber:dataSet.assetNumber,
      comment:dataSet.comment,
      destSiteId: dataSet.destSiteId,
      destSiteIdString:dataSet.destSiteIdString,
      destBuildingId: dataSet.destBuildingId,
      destBuildingName:dataSet.destBuildingName,
      destFloorId: dataSet.destFloorId,
      destFloorName: dataSet.destFloorName,
      destDepartmentId:dataSet.destDepartmentId,
      destDepartmentName:dataSet.destDepartmentName,
      destRoomId: dataSet.destRoomId,
      destRoom: dataSet.destRoom,
      senderSiteId: dataSet.senderSiteId,
      senderSiteName:dataSet.senderSiteName,
      senderDepartmentId: dataSet.senderDepartmentId,
      senderDepartmentName:dataSet.senderDepartmentName,
      senderBuildingId:dataSet.senderBuildingId,
      senderBuildingName:dataSet.senderBuildingName,
      senderFloorId:dataSet.senderFloorId,
      senderFloorName:dataSet.senderFloorName,
      senderRoomId:dataSet.senderRoomId,
      senderRoom:dataSet.senderRoom,
      senderAssignedEmployeeId: dataSet.senderAssignedEmployeeId,
      senderAssignedEmployeeName: dataSet.senderAssignedEmployeeName,
      senderMachineStatusId: dataSet.senderMachineStatusId,
      senderMachineStatusName: dataSet.senderMachineStatusName,
      senderComment: dataSet.senderComment,
      senderTravelingHours: dataSet.senderTravelingHours,
      senderAttachmentName: dataSet.senderAttachmentName,
      receiverAssignedEmployeeId: dataSet.receiverAssignedEmployeeId,
      receiverAssignedEmployeeName: dataSet.receiverAssignedEmployeeName,
      receiverMachineStatusId: dataSet.receiverMachineStatusId,
      receiverMachineStatusName:dataSet.receiverMachineStatusName,
      receiverComment: dataSet.receiverComment,
      receiverTravelingHours: dataSet.receiverTravelingHours,
      receiverAttachmentName: dataSet.receiverAttachmentName,
      assetName:dataSet.assetName,
      modelId:dataSet.modelId,
      modelName:dataSet.modelName,
      manufacturerId:dataSet.manufacturerId,
      manufacturerName:dataSet.manufacturerName,
      supplierId:dataSet.supplierId,
      supplierName:dataSet.supplierName,
      receiverEndUserId:dataSet.receiverEndUserId,
      receiverEndUserName:dataSet.receiverEndUserName
    });

    if (dataSet.senderAssignedEmployeeId) {
      this.disableSenderStatus = false;
    } else {
      this.disableSenderStatus = true;
    }
    if (dataSet.receiverAssignedEmployeeId) {
      this.disableReceiverStatus = false;
    } else {
      this.disableReceiverStatus = true;
    }

   /*  if(dataSet.email_type == 'imap') {
      this.emailtypeselected = false;
    }

    this.emailtypedisabled = true;
    this.addAssetForm.get('emailaddress').disable();
    this.accountactive = dataSet.is_active; */



      /* if(dataSet.mailboxes.length > 0) {
          this.checkboxes = new Array(dataSet.mailboxes.length);
          dataSet.mailboxes.forEach((key: any, index: number) => {
              this.movetofolder[index] = key.is_move;
              this.sender_folders().push(this.setSender(key, index));

              this.checkboxes[index] = false;
              this.checkboxes.fill(false);
          });

            console.log("edit ingest date time", formatDate(dataSet.mailboxes[0].ingest_from_datetime, 'yyyy-MM-dd', 'en-US'));


          this.timezon.setValue(dataSet.mailboxes[0].ingest_from_timezone);
          this.timezonedisabled = true;
          this.timezon.disable();
          this.setvalidationstatus();
      } */
  }

  close_modal() {
    this.showDialog = false;
    this.openModals.emit(false);
  }

  openDialog() {
    this.showDialog = !this.showDialog;
    console.log('this.showDialog', this.showDialog);
  }

  clearValue(event: any) {
      event.target.value = '';
  }

  setSenderFileList(event: FileList) {
    console.log(event);
    this.senderFileList = Array.from(event).map((f: any) => {
        return { id: f.id , attachmentName: f.name }
      }
    );
  }

  setReciverFileList(event: FileList) {
    console.log(event);
    this.receiverFileList = Array.from(event).map((f: any) => {
        return { id: f.id , attachmentName: f.name }
      }
    );
  }



  newSender(): FormGroup {
    return this._formBuilder.group({
        id: [0],
        startDateTime: [null],
        endDateTime: [null],
        workingHours: [null]
    });
  }

  newReceiver(): FormGroup {
    return this._formBuilder.group({
      id: [0],
      startDateTime: [null],
      endDateTime: [null],
      workingHours: [null]
    });
  }

  setSender(item:any, i: any): FormGroup {
    let fs =  this._formBuilder.group({
        id:item.id,
        is_checked: false,
        startDateTime: item.startDateTime ? formatDate(item.startDateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US') : formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
        endDateTime: item.startDateTime ? formatDate(item.startDateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US') : formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
        workingHours: item.workingHours
     });

     /* this.moveSelection(fs, i); */
     return fs;
  }

  setReceiver(item:any, i: any): FormGroup {
    let fs =  this._formBuilder.group({
        id:item.id,
        is_checked: false,
        startDateTime: item.startDateTime ? formatDate(item.startDateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US') : formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
        endDateTime: item.startDateTime ? formatDate(item.startDateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US') : formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
        workingHours: item.workingHours
     });

     /* this.moveSelection(fs, i); */
     return fs;
  }


  moveSelection(item: any, i: number) {
    /* event.stopPropagation(); */
        /* item.controls['is_move'] = this.movetofolder[i]; */
        /* this.addAssetForm.value['sender_folders'][i]['is_move'] =  this.movetofolder[i];
        console.log('item', item); */
        console.log('item', item);
        if(this.movetofolder[i]) {
            item.controls['move_to_folder'].setValidators(Validators.required)
        } else  {
            item.controls['move_to_folder'].clearValidators();
        }
        item.controls['move_to_folder'].updateValueAndValidity();
        /* console.log('addAssetForm', this.addAssetForm); */
  }

  removeSender(i:number) {
      this.sender_folders().removeAt(i);
      /* this.indexh--; */
  }



  delete_folder() {
        let atleastOneSelected = this.checkboxes.some(checkbox => checkbox === true);
        /* let allSelected = this.checkboxes.every(checkbox => checkbox === true); */

        if (!atleastOneSelected) {
            this.alertMessage('error', "No rows selected.");
          return;
        }

        /* if (allSelected) {
            this.alertMessage('error', "At least one row should be present.");
          return;
        } */
        // this.checkboxes.reverse();

        for (let i = this.checkboxes.length-1; i >= 0; i--) {
          // If selected, then delete that row.

          console.log('checkboxes',  this.checkboxes[i]);
          if (this.checkboxes[i]) {
            // this.groups.splice(i, 1);

            console.log('sender_folders',  this.sender_folders().controls[i].value.id);
            // [i].controls['id'].value);
            /* idtodelete = this.sender_folders().value[0].id; */
            /* this.indexh--; */
              this.deletebyId(this.sender_folders().controls[i].value.id, i);

          }
        }

        // Remove entries from checkboxes array.
        this.checkboxes = this.checkboxes.filter(checkbox => checkbox === false);
    }

    sender_folders() : FormArray {
      /* return this.addAssetForm.get("sender_folders") as FormArray */
      return this.addAssetForm.controls.sender_folders as FormArray;
    }

    receiver_folders() : FormArray {
      /* return this.addAssetForm.get("sender_folders") as FormArray */
      return this.addAssetForm.controls.receiver_folders as FormArray;
    }

    deletebyId(idtodele: number, i:number) {
      if(this.sender_folders().length > 1) {
          this.sender_folders().removeAt(i);
          console.log("idtodelete", idtodele);
          /* this.addAssetForm.delete_from_ingest_mailbox({
              "id": idtodele,
              "user_id": this.userId
          }).subscribe({
              next: (respo) => {

                if (respo.status.toLowerCase() == 'success') {
                  this.alertMessage('success', respo.message);
                } else {
                  this.alertMessage('warning', respo.response);
                }
              },
              error: (err) => {
                this.alertMessage('error', "Connection error.");
              }
          }); */
      } else {
          // this.alertMessage('error', "At least one folder must required.");
      }
    }

  setvalidationstatus() {
      /* if(this.addAssetForm.get('emailtype').value == 'exchange') {
          this.addAssetForm.get('tenant_id').setValidators(Validators.required);
          this.addAssetForm.get('client_id').setValidators(Validators.required);
          this.addAssetForm.get('client_secret').setValidators(Validators.required);
          this.addAssetForm.get('password').clearValidators();
      } else {
          this.addAssetForm.get('password').setValidators(Validators.required);

          this.addAssetForm.get('tenant_id').clearValidators();
          this.addAssetForm.get('client_id').clearValidators();
          this.addAssetForm.get('client_secret').clearValidators();
      }

          this.addAssetForm.get('tenant_id').updateValueAndValidity();
          this.addAssetForm.get('client_id').updateValueAndValidity();
          this.addAssetForm.get('client_secret').updateValueAndValidity();
          this.addAssetForm.get('password').updateValueAndValidity(); */
  }


  createPayload(data: any) {
    let action: String;
    if (this.id != 0) {
      action = "update"
    } else {
      action = "add";
    }

    if (!data.senderAttachments) {
      data.senderAttachments = [];
    }

    if (!data.receiverAttachments) {
      data.receiverAttachments = [];
    }

    /* console.log('data.sender_folders', data.sender_folders);
    console.log('data.sender_folders', data.receiver_folders); */

   let dataSet = {
    id: this.id,
    transferNo:  data.transferNo,
    transferCode: data.transferCode,
    assetId: data.assetId,
    destSiteId: data.destSiteId,
    destBuildingId: data.destBuildingId,
    destFloorId: data.destFloorId,
    destDepartmentId:data.destDepartmentId,
    destRoom: data.destRoom,
    senderSiteId: data.transferCode,
    senderDepartmentId: data.transferCode,
    senderAssignedEmployeeId: data.destRoom,
    senderMachineStatusId: data.transferCode,
    senderComment: data.destRoom,
    senderStartDate: data.senderStartDate,
    senderEndDate: data.senderEndDate,
    senderWorkingHours: data.senderWorkingHours,
    senderTravelingHours: data.senderTravelingHours,
    senderAttachmentName: data.senderAttachmentName,
    receiverAssignedEmployeeId: data.receiverAssignedEmployeeId,
    receiverMachineStatusId: data.receiverMachineStatusId,
    receiverComment: data.receiverComment,
    receiverStartDate: data.receiverStartDate,
    receiverStartDateStr: data.receiverStartDateStr,
    receiverEndDate: data.receiverEndDate,
    receiverWorkingHours: data.destRoom,
    receiverTravelingHours: data.destRoom,
    receiverAttachmentName: data.destRoom,
    modelId:data.transferCode,
    modelName:data.destRoom,
    manufacturerId:data.transferCode,
    manufacturerName:data.destRoom,
    supplierId:data.transferCode,
    supplierName:data.destRoom,
    senderBuildingId:data.transferCode,
    senderBuildingName:data.destRoom,
    senderFloorId:data.transferCode,
    senderFloorName:data.destRoom,
    senderRoom:data.destRoom,
    assetTransferSenderTimers: data.assetTransferSenderTimers,
    assetTransferReceiverTimers: data.assetTransferReceiverTimers,
    senderAttachments: this.senderFileList,
    receiverAttachments: this.receiverFileList
  };

   /*
      if(action == "update") {
          dataSet ["id"] = this.id;
      }
           assetTransferSenderTimers: this._formBuilder.array([]),
           assetTransferReceiverTimers: this._formBuilder.array([]),
           senderAttachments: this._formBuilder.array([]),
           receiverAttachments: this._formBuilder.array([]),
      */

    return dataSet;
  }

  submitForm() {
    // stop here if form is invalid
    if (this.addAssetForm.invalid) {
      validateForm.validateAllFormFields(this.addAssetForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      if (this.id) {
        this.updateForm();
      } else {
        this.saveForm();
      }
    }
  }



  saveForm() {

    let payload = this.createPayload(this.addAssetForm.value);
    this.api.postAssetTransfer(payload).subscribe((res: any) => {
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
        // this.addAssetForm.reset();
        this.router.navigate(['/maintenance/asset-transfer']);
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

  updateForm() {
    let payload = this.createPayload(this.addAssetForm.value);
    this.api.updateAssetTransfer(payload).subscribe((res: any) => {
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
        this.router.navigate(['/maintenance/asset-transfer']);
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


  assetTransferSenderTimersForm!: FormGroup;
  assetTransferReceiverTimersForm!:FormGroup;

 /*  save() {
    let model = getAssetTransferModel(this.addAssetForm.value);
    model.assetTransferSenderTimers=[];
    model.assetTransferReceiverTimers=[];
    (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).controls.forEach((element) => {
      var s:any;
      var dto={
        id:0,
        startDateTime:s,
        endDateTime:s,
        workingHours:null
      }
      dto.id=element.value.id;
      try
      {
        dto.startDateTime = dateHelper.ConvertDateToStringTimeOnly(element.value.startDateTime);
      }
      catch{}
      try
      {
        dto.endDateTime = dateHelper.ConvertDateToStringTimeOnly(element.value.endDateTime);
      }
      catch{}
      dto.workingHours = element.value.workingHours;
      model.assetTransferSenderTimers.push(dto);
    });

    (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).controls.forEach((element) => {
      var s:any;
      var dto={
        id:0,
        startDateTime:s,
        endDateTime:s,
        workingHours:null
      }
      dto.id=element.value.id;
      try
      {
        dto.startDateTime = dateHelper.ConvertDateToStringTimeOnly(element.value.startDateTime);
      }
      catch{}
      try
      {
        dto.endDateTime = dateHelper.ConvertDateToStringTimeOnly(element.value.endDateTime);
      }
      catch{}
      dto.workingHours = element.value.workingHours;
      model.assetTransferReceiverTimers.push(dto);
    });

    if (model.senderAssignedEmployeeId == '') {
      model.senderAssignedEmployeeId = null;
    }
    if (model.receiverAssignedEmployeeId == '') {
      model.receiverAssignedEmployeeId = null;
    }

    if (!model.senderAttachments) {
      model.senderAttachments = [];
    }
    (
      this.attachmentSenderForm.get('attachments') as FormArray
    ).controls.forEach((element) => {
      let attach = new Attachments();
      attach.id = element.value.id;
      attach.attachmentName = element.value.attachmentName;
      //attach.attachmentURL = null;
      model.senderAttachments.push(attach);
    });

    if (!model.receiverAttachments) {
      model.receiverAttachments = [];
    }
    (
      this.attachmentReceiverForm.get('attachments') as FormArray
    ).controls.forEach((element) => {
      let attach = new Attachments();
      attach.id = element.value.id;
      attach.attachmentName = element.value.attachmentName;
      //attach.attachmentURL = null;
      model.receiverAttachments.push(attach);
    });
    this.api.postAssetTransfer(model).subscribe((res: any) => {
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
        // this.addAssetForm.reset();
        this.router.navigate(['/maintenance/asset-transfer']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  } */

   /*  update() {
      let model = getAssetTransferModel(this.addAssetForm.value);
      model.assetTransferSenderTimers=[];
      model.assetTransferReceiverTimers=[];
      (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).controls.forEach((element) => {
        if (element.value.startDateTime != null &&  element.value.endDateTime != null)
        {
          var s:any;
          var dto={
            id:0,
            startDateTime:s,
            endDateTime:s,
            workingHours:null
          }
          dto.id=element.value.id;
          try
          {
            dto.startDateTime = dateHelper.ConvertDateWithSameValue(element.value.startDateTime);
          }
          catch{}
          try
          {
            dto.endDateTime = dateHelper.ConvertDateWithSameValue(element.value.endDateTime);
          }
          catch{}
          dto.workingHours = element.value.workingHours;
          model.assetTransferSenderTimers.push(dto);
        }

      });

      (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).controls.forEach((element) => {
        if (element.value.startDateTime != null &&  element.value.endDateTime != null)
        {
          var s:any;
          var dto={
            id:0,
            startDateTime:s,
            endDateTime:s,
            workingHours:null
          }
          dto.id=element.value.id;
          try
          {
            dto.startDateTime = dateHelper.ConvertDateWithSameValue(element.value.startDateTime);
          }
          catch{}
          try
          {
            dto.endDateTime = dateHelper.ConvertDateWithSameValue(element.value.endDateTime);
          }
          catch{}
          dto.workingHours = element.value.workingHours;
          model.assetTransferReceiverTimers.push(dto);
        }

      });
      if (!model.senderAttachments) {
        model.senderAttachments = [];
      }
      (
        this.attachmentSenderForm.get('attachments') as FormArray
      ).controls.forEach((element) => {
        let attach = new Attachments();
        attach.id = element.value.id;
        attach.attachmentName = element.value.attachmentName;
        //attach.attachmentURL = null;
        model.senderAttachments.push(attach);
      });

      if (!model.receiverAttachments) {
        model.receiverAttachments = [];
      }
      (
        this.attachmentReceiverForm.get('attachments') as FormArray
      ).controls.forEach((element) => {
        let attach = new Attachments();
        attach.id = element.value.id;
        attach.attachmentName = element.value.attachmentName;
        //attach.attachmentURL = null;
        model.receiverAttachments.push(attach);
      });
      console.log('model', model);
      this.api.updateAssetTransfer(model).subscribe((res) => {
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
          this.router.navigate(['/maintenance/asset-transfer']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });
    }   */

     /*  delete() {
        this.route.queryParams.subscribe((params: any) => {
          this.transferAssetModel.id = params.data;
          console.log('this.transferAssetModel.id', this.transferAssetModel.id);
          this.confirmationService.confirm({
            message: 'Are you sure you want to delete this ?',
            header: 'Confirm',
            rejectButtonStyleClass: 'p-button-danger',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.api
                .deleteAssetTransfer(this.transferAssetModel.id)
                .subscribe((res) => {
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
                    this.router.navigate(['/maintenance/asset-transfer']);
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
      } */

        selectSenderStart($event: any,i :any) {

          if (
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value == null ||
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value == null ||
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value == '' ||
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value == ''
          ) {
            return;
          }

          if ((this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value > (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value) {
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('workingHours')?.setValue(0);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'The Start date is greater than the End date',
              life: 3000,
            });
          } else if ((this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value< this.minDateVal) {
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('workingHours')?.setValue(0);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'The sender start date is greater than the creation date',
              life: 3000,
            });
          } else {
            this.calculateTimeSender(i);
          }

        }


      selectSenderEnd($event: any,i :any) {

        if ((this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value ) {
          if ((this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value < (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value) {
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.setValue(null);
            (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('workingHours')?.setValue(0);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'The End date is less than the Start date',
              life: 3000,
            });
          } else {
            this.calculateTimeSender(i);
          }
        }
      }

      calculateTimeSender(i :any) {
        if (
          (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value == null ||
          (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value == null ||
          (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value == '' ||
          (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value == ''
        ) {
          return;
        }
        let end = new Date((this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('endDateTime')?.value).getTime();
        let start = new Date((this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('startDateTime')?.value).getTime();
        let minute = (end - start) / (1000 * 60 * 60);
        (this.assetTransferSenderTimersForm.get('assetTransferSenderTimers') as FormArray).at(i).get('workingHours')?.setValue(minute.toFixed(2));
      }

      selectReceiverStart($event: any,i :any) {

        if (
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value == null ||
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value == null ||
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value == '' ||
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value == ''
        ) {
            return;
          }

          if ((this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value > (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value) {
            (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
            (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('workingHours')?.setValue(0);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'The Start date is greater than the End date',
              life: 3000,
            });
          } else if ((this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value  < this.minDateVal) {
            (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
            (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('workingHours')?.setValue(0);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'The receiver start date should be greater than creation date',
              life: 3000,
            });
          } else {
            this.calculateTimeReceiver(i);
          }
        }


      selectReceiverEnd($event: any,i :any) {

        if ((this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value) {
          if ((this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value < (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value) {
            (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.setValue(null);
            (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('workingHours')?.setValue(0);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'The End date is less than the Start date',
              life: 3000,
            });
          } else {
            this.calculateTimeReceiver(i);
          }
        }
      }

      calculateTimeReceiver(i :any) {
        if (
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value == null ||
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value == null ||
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value == '' ||
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value == ''
        ) {
          return;
        }
        let end = new Date((this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('endDateTime')?.value).getTime();
        let start = new Date(
          (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('startDateTime')?.value
        ).getTime();
        let minute = (end - start) / (1000 * 60 * 60);
        (this.assetTransferReceiverTimersForm.get('assetTransferReceiverTimers') as FormArray).at(i).get('workingHours')?.setValue(minute.toFixed(2));

      }


  alertMessage(type: string, message: any) {
    this.alert = {
      type: type,
      message: message
    };
    setTimeout(() => {
      this.alert = undefined;
    }, 3000);
  }

  onCloseDialog(event: any) {
    console.log('isChecked event', event);
    this.addAssetForm.controls['assetId'].setValue(event.id);
    this.getEmployeeSenderID(event.site.id, event.id);
    if (this.siteId != undefined && this.siteId != null) {
      this.getEmployeeReciverID(this.siteId, event.id);
    }
    this.addAssetForm.controls['assetSerialNo'].patchValue(
      event.assetSerialNo
    );
    this.addAssetForm.controls['assetNumber'].setValue(event.assetNumber);
    this.addAssetForm.controls['assetName'].patchValue(
      event.modelDefinition.assetName
    );
    this.addAssetForm.controls['modelName'].patchValue(
      event.modelDefinition.modelName
    );
    this.addAssetForm.controls['manufacturerName'].patchValue(
      event.modelDefinition.manufacturerName
    );
    if (event.supplier == null) {
      this.addAssetForm.controls['supplierName'].setValue(null);
    } else {
      this.addAssetForm.controls['supplierName'].patchValue(
        event.supplier.suppliername
      );
    }

    this.addAssetForm.controls['senderSiteName'].patchValue(
      event.site.custName
    );
    this.addAssetForm.controls['senderSiteId'].patchValue(event.site.id);
    this.addAssetForm.controls['senderBuildingName'].patchValue(
      event.building.name
    );
    this.addAssetForm.controls['senderBuildingId'].patchValue(
      event.building.id
    );
    this.addAssetForm.controls['senderFloorName'].patchValue(
      event.floor.name
    );
    this.addAssetForm.controls['senderFloorId'].patchValue(event.floor.id);

    if (event.department == null) {
      this.addAssetForm.value.senderDepartmentId = null;
      this.addAssetForm.controls['senderDepartmentName'].setValue(null);
    } else {
      this.addAssetForm.controls['senderDepartmentName'].patchValue(
        event.department.departmentName
      );
      this.addAssetForm.controls['senderDepartmentId'].patchValue(
        event.department.id
      );
    }
    if (event.room == null) {
      this.addAssetForm.controls['senderRoom'].patchValue(null);
    } else {
      this.addAssetForm.controls['senderRoom'].patchValue(event.room.name);
      this.addAssetForm.controls['senderRoomId'].patchValue(event.room.id);
    }

    this.showDialog = false;
  }

  onHide(event: any) {
    console.log('on hide event', event);
    this.showDialog = event;
    console.log('this.showDialog', this.showDialog);
  }

  cancel() {
    this.addAssetForm.reset();
    this.router.navigate(['/maintenance/asset-transfer']);
  }

  getEmployeeSenderID(siteId: any, assetId?: number) {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroupBySite('R-6', siteId, assetId)
      .subscribe((res: any) => {
        this.employeesSender = res;
      });
  }

  getEmployeeReciverID(siteId: any, assetId?: number) {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroupBySite('R-6', siteId, assetId)
      .subscribe((res: any) => {
        this.employeesReceiver = res;
      });
  }

  getAllEmployeeReciverSiteID(siteId: any) {
    this.employeeService
      .GetUserByRoleValueSiteAndAssetGroupBySiteId(siteId, '')
      .subscribe((res: any) => {
        this.users = res;
      });
  }

  assetTransferSenderTimers(): FormArray {
    return  this.addAssetForm.controls.assetTransferSenderTimers as FormArray;
  }

  assetTransferReceiverTimers(): FormArray {
    // return (<FormArray>this.addAssetForm.get('assetTransferReceiverTimers')).controls;
    return  this.addAssetForm.controls.assetTransferReceiverTimers as FormArray;
  }
  addAssetTransferSenderTimers() {
    /* (this.addAssetForm.get('assetTransferSenderTimers') as FormArray).push({
        id: [0],
        startDateTime: [null],
        endDateTime: [null],
        workingHours: [null]
      }
    ); */
    // this.receiver_folders().push(this.newReceiver());
    this.assetTransferSenderTimers().push(this.newSender());
  }

  addAssetTransferReceiverTimers() {
    /* (this.addAssetForm.get('assetTransferReceiverTimers') as FormArray).push({
        id: [0],
        startDateTime: [null],
        endDateTime: [null],
        workingHours: [null]
      }
    ); */
    this.assetTransferReceiverTimers().push(this.newReceiver());
  }

  deleteAssetTransferSenderTimers(i:any) {
    /* if ((this.addAssetForm.get('assetTransferSenderTimers') as FormArray).length == 1) {
      return;
    }
    (this.addAssetForm.get('assetTransferSenderTimers') as FormArray).removeAt(i); */
    if (this.assetTransferSenderTimers().length == 1) {
      return;
    }

    this.assetTransferSenderTimers().removeAt(i);
  }

  deleteAssetTransferReceiverTimers(i:any) {
    /* if ((this.addAssetForm.get('assetTransferReceiverTimers') as FormArray).length == 1) {
      return;
    }
    (this.addAssetForm.get('assetTransferReceiverTimers') as FormArray).removeAt(i); */

    if (this.assetTransferReceiverTimers().length == 1) {
      return;
    }

    this.assetTransferReceiverTimers().removeAt(i);
  }

  fillSite(event: any) {
    this.siteApi
      .GetCustomersAutoCompleteWithoutConditionSites(event.query)
      .subscribe((res: any) => {
        this.destSiteList = res.data;
      });
  }

  //fill department
  getDepartment() {
    this.api.getDepartment({}).subscribe((res: any) => {
      this.departmentList = res.data;
    });
  }

  selectSite(event: any) {
    this.addAssetForm.controls['destSiteIdString'].patchValue({
      custName: event.custName,
    });
    this.addAssetForm.controls['destSiteId'].patchValue(event.id);
    this.siteId = event.id;
    if (
      this.addAssetForm.value.assetId != null &&
      this.addAssetForm.value.assetId != undefined
    ) {
      this.getEmployeeReciverID(
        this.siteId,
        this.addAssetForm.value.assetId
      );
      this.getAllEmployeeReciverSiteID(this.siteId);
    }
    this.siteBuildingsLookups(this.siteId);
    this.floorList = [];
    this.departmentList = [];
  }

  //#region Site Building Floor Department Relation
  siteBuildingsLookups(siteId: number) {
    this.api.getBuildingLookup({ siteId: siteId }).subscribe((res) => {
      this.buildingList = res.data;
    });
  }

  //select lookups
  changeBuilding(event: any) {
    this.addAssetForm.value.destBuildingId = event.value;
    this.buildingId = event.value;
    this.buildingFloorsLookups(this.siteId, this.buildingId);
  }

  changeFloor(event: any) {
    this.addAssetForm.value.destFloorId = event.value;
    this.floorId = event.value;
    this.floorDepsLookups(this.siteId, this.buildingId, event.value);
  }
  changeDepartment(event: any) {
    this.addAssetForm.value.destDepartmentId = event.value;
    this.departmentId = event.value;
    this.buildingRoomsLookups(
      this.siteId,
      this.buildingId,
      this.floorId,
      event.value
    );
  }
  changeRoom(event: any) {
    this.addAssetForm.value.destRoomId = event.value;
  }
  changeAssignedSender(event: any) {
    this.addAssetForm.value.senderAssignedEmployeeId = event.value;
  }
  changereceiverEndUserName(event: any) {
    this.addAssetForm.value.receiverEndUserId = event.value;
  }
  changeAssignedReceiver(event: any) {
    this.addAssetForm.value.receiverAssignedEmployeeId = event.value;
  }
  changeMachineSender(event: any) {
    this.addAssetForm.value.senderMachineStatusId = event.value;
  }

  //bind lookup and role
  getAndBindLookup(lookup: Lookup, targetProp: (a: any) => void) {
    this.api
      .getLookups({ queryParams: lookup })
      .subscribe((res) => targetProp(res.data));
  }
  getAndBindRole(role: Role, targetProp: (a: any) => void) {
    this.api.getRole([role]).subscribe((res) => targetProp(res));
  }

  buildingFloorsLookups(siteId: number, buildingId: number) {
    this.api
      .getFloorLookup({ siteId: siteId, buildingId: buildingId })
      .subscribe((res) => {
        this.floorList = res.data;
      });
  }

  floorDepsLookups(siteId: number, buildingId: number, floorId: number) {
    this.api
      .getDepLookup({
        siteId: siteId,
        buildingId: buildingId,
        floorId: floorId,
      })
      .subscribe((res) => {
        this.departmentList = res.data;
      });
  }

  buildingRoomsLookups(
    siteId: number,
    buildingId: number,
    floorId: number,
    departmentId: number
  ) {
    this.api
      .getRoomLookup({
        siteId: siteId,
        buildingId: buildingId,
        floorId: floorId,
        departmentId: departmentId,
      })
      .subscribe((res) => {
        this.roomList = res.data;
      });
  }

}
