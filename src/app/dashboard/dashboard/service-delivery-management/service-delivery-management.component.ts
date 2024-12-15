import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetsService } from '../../../services/assets.service';
import { MessageService, PrimeIcons } from 'primeng/api';
import { PrimengModule } from '../../../shared/primeng.module';
import { EmployeeService } from '../../../services/employee.service';
import { Lookup } from '../../../shared/enums/lookup';
import { LookupService } from '../../../services/lookup.service';
import { AssetGroup } from '../../../shared/enums/asset-group';
import { FileServiceService } from '../../../services/file-service.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ServiceRequestData } from '../../../models/service-request-data';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
// import { FileUploadComponent } from '../../../shared/components/file-upload-component/file-upload-component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { Attachments } from '../../../models/model-definition-model';
import { TransactionHistory } from '../../../models/transaction-history';
@Component({
  selector: 'app-service-delivery-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  standalone: true,
  imports: [FormsModule, PrimengModule, ReactiveFormsModule, CommonModule, AttachmentsComponent,
    MatSlideToggleModule,],
  templateUrl: './service-delivery-management.component.html',
  styleUrls: ['./service-delivery-management.component.scss'] // Fixed typo: styleUrl -> styleUrls

})
export class ServiceDeliveryManagementComponent implements OnInit {

  @Input('activeRow') activeRow: any;
  @Output() activeRowreset: EventEmitter<void> = new EventEmitter<void>(); // Change to emit void

  @Input('showmodal') showmodal: boolean = false;
  @ViewChild('addServiceReq') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  defectTypes: any[] = [];
  problemDescriptions: any[] = [];
  listEmployee: any[] = [];
  yesOrNo: any[] = [];
  ServicerequestForm!: FormGroup;
  attachmentName: any[] = [];
  asset_Numbers: any[] = [];

  safety: any[] = [];
  serviceRequestData: ServiceRequestData = new ServiceRequestData()
  requestedThrough: any;
  typeOfrequests: any;
  // test
  items: any[] = []; // Array to store data
  filteredItems: any[] = []; // Array to store filtered results
  selectedItem: any = null; // Selected item

  userAssetGroupSelected: any;

  FMLookup!: boolean;

  showSafety: string = 'false';

  activeState: boolean = true;
  senderFileList!: any[];

  attachmentAssetForm!: FormGroup;
  mode: string = 'add';

  transactionHistory!: TransactionHistory
  constructor(
    private serviceRequestService: ServicerequestService,
    private assetService: AssetsService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private lookupService: LookupService,
    private fileService: FileServiceService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService, private servicerequestService: ServicerequestService, private router: Router
  ) {
    this.userAssetGroupSelected = JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}');
    this.getLookup(this.userAssetGroupSelected.id);
    this.toggleLookupLabel();
  }

  ngOnInit(): void {
    if (this.employeeService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.initializeForm();

    this.getLookup();


    if (this.activeRow) {
      this.mode = 'view'
      this.getdatabyid()

      this.ServicerequestForm.disable()

    }
    else {
      this.mode = 'add'
    }

  }
  getdatabyid() {
    this.servicerequestService.GetWorkOrderById(this.activeRow?.callId).subscribe(
      res => {
        this.userAssetGroupSelected = { id: res.data.assetGroup.id, name: res.data.assetGroup.name };
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res.data);
        this.toggleLookupLabel();
        this.getLookup(res.data.assetGroup.id);
        console.log(this.listEmployee);

        const data = res.data
        this.ServicerequestForm.patchValue({
          id: data.id || 0,
          callCreatedBy: data.workOrderCreatedBy?.userName || localStorage.getItem('userName'),
          requestedDate: new Date(data.requestedDate),
          requestedTime: new Date(data.requestedDate),
          employeeCode: data.workOrderContactPerson[0] ?? '',
          name: data.workOrderContactPerson[0].name,
          telephone: data.workOrderContactPerson[0].mobilePhone,
          job: data.workOrderContactPerson[0].position,
          email: data.workOrderContactPerson[0].email,
          land: data.workOrderContactPerson[0].extension,
          comments: data.comments || ''
        });






        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('assetSerialNo')
          ?.setValue(res.data.asset.assetSerialNo);
        //(this.ServicerequestForm.get('assets') as FormArray).at(0).get('assetSerialNo')?.disable();
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('assetNumber')
          ?.setValue(res.data.asset.assetNumber);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('assetName')
          ?.setValue(res.data.asset.assetSerialNo);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('manufacturer')
          ?.setValue(res.data.manufacturer.name);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('site')
          ?.setValue(res.data.site.siteName);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('department')
          ?.setValue(res.data.department.departmentName);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('model')
          ?.setValue(res.data.model.name);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('equipmentStatus')
          ?.setValue(res.data.equipmentStatus);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('priority')
          ?.setValue(res.data.priority);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('callComments')
          ?.setValue(res.data.comments);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('defectType')
          ?.setValue(res.data.defectType);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('problemDescription')
          ?.setValue(res.data.problemDescription);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('Safety')
          ?.setValue(res.data.safety);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('requestedThrough')
          ?.setValue(res.data.requestedThrough);
        (this.ServicerequestForm.get('assets') as FormArray)
          .at(0)
          .get('typeofRequest')
          ?.setValue(res.data.typeofRequest);

        this.attachmentName = [];
        var att = res.data.workOrderAttachments as any[];
        if (att != null) {
          att.forEach((element) => {
            (this.attachmentAssetForm.get('attachments') as FormArray).push(
              this.fb.group({
                attachmentName: element.name,
                attachmentURL: element.name,
                id: element.id,
              })
            );
            this.attachmentName.push(element.name);
          });
        }
        if (res.data?.workOrderContactPerson) {
          let contacts: any = null;
          contacts = res.data?.workOrderContactPerson[0];

          var obj = {
            id: [contacts.id],
            employeeCode: [contacts],
            name: [contacts.name],
            telephone: [contacts.telephone],
            job: [contacts.job],
            email: [contacts.email],
            land: [contacts.land],
            contactUserId: [contacts.contactUserId],
          };
          this.ServicerequestForm.patchValue({ employeeCode: obj })
          debugger
          this.onSelectEmployee(obj)
          // Optionally, patch values for the attachments form if needed
          this.attachmentAssetForm.patchValue({
            attachments: data.workOrderAttachments || []
          });


          this.cdr.detectChanges();
        }
      })

  }
  // Method to filter items based on user input
  searchItems(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(query));
  }
  private initializeForm(): void {
    this.ServicerequestForm = this.fb.group({
      callCreatedBy: [{ value: localStorage.getItem('userName'), disabled: true }],
      requestedDate: [{ value: new Date(), disabled: true }, Validators.required],
      requestedTime: [{ value: new Date(), disabled: true }],


      assets: this.fb.array([]),
      id: [0],
      employeeCode: [''],
      name: [{ value: null, disabled: true }],
      telephone: [{ value: null, disabled: true }],
      job: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      land: [{ value: null, disabled: true }],

    });

    this.attachmentAssetForm = this.fb.group({
      attachments: this.fb.array([]),
    });
    this.addassets()
  }

  getLookup(assetGroup?: AssetGroup) {
    this.lookupService
      .getLookUps(
        assetGroup == AssetGroup.FMS ? Lookup.JobStatus : Lookup.DefectType
      )
      .subscribe((res: any) => {
        this.defectTypes = res.data;
        //this.defectTypes.splice(0, 0, { id: 0, name: 'Select', value: null });
      });

    this.lookupService
      .getLookUps(
        assetGroup == AssetGroup.FMS ? Lookup.JobPriority : Lookup.Asset_Replace
      )
      .subscribe((res: any) => {
        this.yesOrNo = res.data;
      });

    this.lookupService
      .getLookUps(
        assetGroup == AssetGroup.FMS ? Lookup.CostCode : Lookup.TypeOfRequest
      )
      .subscribe((res: any) => {
        this.typeOfrequests = res.data;
        // this.typeOfrequests.splice(0, 0, {
        //   id: 0,
        //   name: 'Select',
        //   value: null,
        // });
      });

    this.lookupService.getLookUps(Lookup.Safety).subscribe((res: any) => {
      this.safety = res.data;
      //this.safety.splice(0, 0, { id: 0, name: 'Select', value: null });
    });

    this.lookupService
      .getLookUps(Lookup.requestedThrough)
      .subscribe((res: any) => {
        this.requestedThrough = res.data;

      });
    if (assetGroup == AssetGroup.FMS) {
      this.lookupService
        .getLookUps(Lookup.ProblemDescription)
        .subscribe((res: any) => {
          this.problemDescriptions = res.data;
        });
    }

  }
  toggleLookupLabel() {
    if (this.userAssetGroupSelected.id == AssetGroup.FM) {
      this.FMLookup = true;
      // this.FMfirstAction = true;
    } else {
      this.FMLookup = false;
      // this.FMfirstAction = false;
    }
  }

  changeTypeOfReq(event: any) {

    if (event.value.value == 2) {
      this.showSafety = 'true';
    } else {
      this.showSafety = 'false';
    }
  }
  getAssetsDataByAssetNumber(searchText: string = ''): void {
    const dto = { assetNumber: searchText };
    this.assetService.GetAssetsAutoCompleteMultiFilter(dto).pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.asset_Numbers = res.data;
        this.triggerChangeDetection();
      });
  }

  selectAsset(i: number, data: any): void {
    const selectedAssetId = data.value?.id;
    if (!selectedAssetId) {
      return;
    }

    // Check if the asset already exists in the form array (excluding the current index)
    const isExist = this.assets.controls.some((control, index) =>
      index !== i && control.value.assetNumber?.id === selectedAssetId
    );

    if (isExist) {
      // If asset already exists, clear the current asset selection
      this.assets.at(i).get('assetNumber')?.setValue(null);
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Asset Already Added' },)
      return;
    }

    // Fetch the asset details from the service
    this.assetService.getAssetById(selectedAssetId).subscribe((res) => {
      const assetData = res.data;
      if (!assetData) {
        return;
      }

      const multiAsset = assetData.multiAssets?.[0];
      const modelDefinition = assetData.modelDefinition;
      const site = assetData.site;
      const department = assetData.department;

      // Update the form controls with fetched asset data
      const assetGroup = this.assets.at(i);
      assetGroup.patchValue({
        assetSerialNo: multiAsset?.assetSerialNo || '',
        assetNumber: data.value,
        manufacturer: modelDefinition?.manufacturerName || '',
        site: site?.custName || '',
        department: department?.departmentName || '',
        model: modelDefinition?.modelName || '',
        assetName: data.value.assetName || ''
      });
    });
  }



  get assets(): FormArray {
    return this.ServicerequestForm.get('assets') as FormArray;
  }

  newasset(): FormGroup {
    return this.fb.group({
      assetSerialNo: [{ value: null, disabled: true }],
      assetNumber: [null, Validators.required],
      assetName: [{ value: null, disabled: true }],
      manufacturer: [{ value: null, disabled: true }],
      site: [{ value: null, disabled: true }],
      department: [{ value: null, disabled: true }],
      model: [{ value: null, disabled: true }],
      priority: [null, Validators.required],
      callComments: [null],
      defectType: [null, Validators.required],
      // voiceNote: [null],
      problemDescription: [null],
      Safety: [null],
      requestedThrough: [null, Validators.required],
      typeofRequest: [null, Validators.required],
    });
  }

  addassets() {
    this.assets.push(this.newasset());
  }

  removeassetForm(i: number) {

    this.assets.removeAt(i);
  }

  onSelectEmployee(event: any): void {
    this.employeeService.GetEmployeeContactsAutoComplete(event.query)
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        this.listEmployee = data;
        this.triggerChangeDetection();
      });
  }

  bindEmployee(event: any): void {
    const employee = event.value;
    this.ServicerequestForm.patchValue({
      employeeCode: employee,
      name: employee.userName,
      telephone: employee.phone,
      job: employee.job,
      email: employee.email,
      land: employee.land
    });

    this.disableEmployeeFields();
  }

  private disableEmployeeFields(): void {
    ['name', 'telephone', 'job', 'email', 'land'].forEach(field => {
      this.ServicerequestForm.get(field)?.disable();
    });
  }

  clearEmployee(): void {
    this.ServicerequestForm.reset({
      employeeCode: '',
      name: '',
      telephone: '',
      job: '',
      email: '',
      land: ''
    });

    this.enableEmployeeFields();
  }

  private enableEmployeeFields(): void {
    ['name', 'telephone', 'job', 'email', 'land'].forEach(field => {
      this.ServicerequestForm.get(field)?.enable();
    });
  }

  downloadFile(): void {
    const fileName = this.ServicerequestForm.get('voiceNote') as FormControl;
    this.fileService.downloadImage(fileName.value).pipe(catchError(this.handleError))
      .subscribe(res => {
        const fileExtension = fileName.value.split('.').pop();
        const audio = new Audio(`data:audio/${fileExtension};base64,${res}`);
        audio.load();
        audio.play();
      });
  }


  save(): void {
    if (this.ServicerequestForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.ServicerequestForm.markAllAsTouched();
      console.log('Form is invalid. Please fill out all required fields.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Invalid',
        detail: 'Please fill out all required fields before submitting.',
        life: 3000 // Toast duration (optional)
      });
    }
    else { // Extract form values
      const formValue = this.ServicerequestForm.getRawValue();

      // Map each asset form group in the FormArray to the desired format for the request body
      const assetsArray = (formValue.assets as any[]).map(asset => ({
        assetId: asset.assetNumber?.id || null,
        equipmentStatusId: asset.defectType?.id || null,
        priorityId: asset.priority?.id || null,
        problemDescriptionId: asset.problemDescription?.id || null,
        comments: asset.callComments || '',
        requestedThroughId: asset.requestedThrough?.id || null,
        typeofRequestId: asset.typeofRequest?.id || null,
        safetyId: asset.Safety?.id || null
      }));

      // Prepare the request body
      const requestBody: any = {
        assets: assetsArray,
        workOrderContactPerson: [
          {
            id: formValue.id || 0,
            contactUserId: formValue.employeeCodee?.userId || ''
          }
        ],
        workOrderAttachments: []
      };
      if (!requestBody.workOrderAttachments) {
        requestBody.workOrderAttachments = [];
      }
      (this.attachmentAssetForm.get('attachments') as FormArray).controls.forEach(
        (element) => {
          let attach: any =
          {
            id: element.value.id,
            name: element.value.attachmentName,
            attachmentURL: null
          }
          requestBody.workOrderAttachments.push(attach);
        }
      );
      // Call the service to save the service request
      this.serviceRequestService.savenewServiceRequest(requestBody)
        .pipe(
          catchError(this.handleError.bind(this)) // Ensure 'this' context is bound to the error handler
        )
        .subscribe({
          next: (response) => {
            // Check if the response contains the expected data
            if (response && response.data) {
              console.log('Service request saved successfully');

              // Show a success toast message
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Service request saved successfully',
                life: 3000 // Toast duration
              });

              // Optionally close the modal if needed
              this.close_modal();
            } else {
              // Handle cases where the response does not have expected data
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.message,
                life: 3000
              });
              console.warn('No data returned in response:', response);
            }
          },
          error: (error) => {
            console.error('Error saving service request:', error);

            // Show an error toast message
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'An error occurred while saving the service request.',
              life: 5000 // Toast duration for error
            });
          }
        });
    }
  }

  // Error handler method
  handleError(error: any) {
    console.error('Error occurred:', error); // Log error to the console (optional)

    // Return an observable error to be caught in the subscribe block
    return throwError(() => new Error(error.message || 'Server error'));
  }




  private triggerChangeDetection(): void {
    this.cdr.detectChanges();
  }




  close_modal() {
    this.initializeForm();
    this.serviceRequestData = new ServiceRequestData()
    this.openModals.emit(false);
    this.activeRowreset.emit();  // Emit event to reset activeRow in parent

  }
  onTabClose(event: any) {
    // this.messageService.add({ severity: 'info', summary: 'Tab Closed', detail: 'Index: ' + event.index })
  }

  onTabOpen(event: any) {
    // this.messageService.add({ severity: 'info', summary: 'Tab Expanded', detail: 'Index: ' + event.index });
  }
  setSenderFileList(event: FileList) {
    console.log(event);
    this.senderFileList = Array.from(event).map((f: any) => {
      return { id: f.id, attachmentName: f.name }
    }
    );
  }



  attachmentReady(event: any) {
    (this.attachmentAssetForm.get('attachments') as FormArray).push(
      this.fb.group({
        attachmentName: event[0],
        attachmentURL: [''],
        id: 0,
      })
    );

  }
}
// get asset by id
// att.forEach(element => {
//   (this.attachmentAssetForm.get('attachments') as FormArray).push(
//     this.formbuilder.group({
//       attachmentName: element.attachmentName,
//       attachmentURL: element.attachmentURL,
//       id: element.id,
//     })
//   );
//   this.attachmentName.push(element.attachmentName);
// });
