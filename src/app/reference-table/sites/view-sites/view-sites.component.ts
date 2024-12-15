import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TransactionHistory } from '../../../shared/models/transaction-history';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Attachments,
  BuildingsModleB,
  CustNameLangsModel,
  CustomerModelB,
  DepartmentModelB,
  FloorModelB,
  RoomModelB,
} from '../../../models/customer-model';
import { environment } from '../../../../environments/environment.development';
import { Departments } from '../../../models/department-model';
import { CustomerService } from '../../../services/customer.service';
import { LookupService } from '../../../services/lookup.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { DepartmentService } from '../../../services/department.service';
import { EmployeeService } from '../../../services/employee.service';
import { LanguagesService } from '../../../services/languages.service';
import { LookupValue } from '../../../models/lookup-model';
import { Lookup } from '../../../shared/enums/lookup';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TrPipe } from '../../../shared/pipes/tr.pipe';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-view-sites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TrPipe,
    TranslateModule,
    AttachmentsComponent,
    SkeletonLoaderComponent,
    TransactionHistoryComponent,
  ],
  templateUrl: './view-sites.component.html',
  styleUrl: './view-sites.component.scss',
  providers: [TranslatePipe],
})
export class ViewSitesComponent implements OnChanges {
  @Input('showmodal') showAddModal: boolean = false;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('site_id') site_id: any;
  @Input('site_index') site_index: any;
  @Input('status') status: any;
  @Input('editData') editData: any;

  transactionHistory!: TransactionHistory;
  PAGE_TITLE = 'site';
  frmCustomer!: FormGroup;
  frmBuilding!: FormGroup;
  frmFloor!: FormGroup;
  frmDepartment!: FormGroup;
  frmRoom!: FormGroup;
  model!: CustomerModelB;

  id = 0;
  tabIndex: number = 0;
  attachmentName!: string;
  baseUrl: string = environment.BaseURL;
  showDialog: boolean = false;

  //#region Lookups
  depLookup: Departments[] = [];
  assignedEmp = [];
  custCat = [];
  custTypes = [];
  city = [];
  group = [];
  orgList = [];
  floorsList = [];
  buildingsList = [];
  departmentsList = [];
  roomsList = [];
  readonly: boolean = false;
  //#endregion

  createdOn: any;
  modifiedOn: any;
  attachmentForm!: FormGroup;
  home: any;
  addSite: any;
  visibleBuildingModel: boolean = false;
  visibleFloorModel: boolean = false;
  visibleDepartmentModel: boolean = false;
  visibleRoomModel: boolean = false;

  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;

  buildingIndex!: number;
  floorIndex!: number;
  departmentIndex!: number;

  currentUserLanguage: string =
    localStorage.getItem('userLanguage') || 'English';

  currentUserLanguageId: number = JSON.parse(
    localStorage.getItem('currentLanguageId') || '1'
  );

  attachmentNames: string[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private api: CustomerService,
    private lookupService: LookupService,
    private router: ActivatedRoute,
    private messageService: MessageService,
    private depService: DepartmentService,
    private route: Router,
    private confirmationService: ConfirmationService,
    private empServices: EmployeeService,
    private languagesService: LanguagesService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init() {
    this.callApi();
    this.callNameLangsLookupApi();

    this.resolveWhenCallOneIsReady;
    this.resolveNameLangLookupIsReady;

    // this.router.queryParams.subscribe((params: any) => {
    this.id = this.site_id;
    this.tabIndex = this.site_index;
    // let data = { id: this.id, index: this.tabIndex };
    // if (data) {this.id = data.id;}

    // this.id = 0;
    //   this.tabIndex = params.index;
    //   if (params.data) this.id = params.data;

    this.intializeComponent();
    // });
    this.getLookUps();
  }

  //#region async functions
  notifyThatCallOneIsDone: any;
  resolveWhenCallOneIsReady = new Promise(
    (resolve) => (this.notifyThatCallOneIsDone = resolve)
  );

  callApi() {
    this.depService.GetDepartmentsAutoComplete().subscribe({
      next: (res) => {
        this.depLookup = res.data;
        this.cdr.detectChanges();
        console.error('this.depLookup', this.depLookup);
      },
      error: (e) => {
        console.error('unable to read DepartmentsLookupList', e);
      },
      complete: () => {
        this.notifyThatCallOneIsDone();
        this.cdr.detectChanges();
      },
    });
  }

  notifyNameLangLookupIsDone: any;
  resolveNameLangLookupIsReady = new Promise(
    (resolve) => (this.notifyNameLangLookupIsDone = resolve)
  );

  callNameLangsLookupApi() {
    this.languagesService.getLanguages({}).subscribe({
      next: (res: any) => {
        this.nameLangs = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('cant load name langs api', err);
      },
      complete: () => {
        this.notifyNameLangLookupIsDone();
        this.cdr.detectChanges();
      },
    });
  }
  //#endregion

  //#region Loaded by Id
  LoadById() {
    this.api.getSingleCustomer(this.id).subscribe({
      next: (res) => {
        this.transactionHistory = new TransactionHistory();
        Object.assign(this.transactionHistory, res.data);
        this.createdOn = res.createdOn;
        this.modifiedOn = res.modifiedOn;
        this.model = res as CustomerModelB;
        this.InitializeModel();
        if (res.attachments && res.attachments[0].attachmentName) {
          this.attachmentNames[0] = res.attachments[0].attachmentName;
        }
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('unable to load customer', e);
      },
    });
  }

  changeTabIndex(tab: any) {
    if (tab.index == 1 || this.status == 'edit') {
      this.inViewMode = false;
      this.inEditMode = true;
    } else if (tab.index == 0 || this.status == 'view') {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }
  //#endregion

  //#region intialize Component
  intializeComponent() {
    if (this.id == 0) {
      this.intializeNewModel();
      this.InitializeModel();
      this.inAddMode = true;
    } else {
      if (this.tabIndex == 0 || this.status == 'view') {
        this.inViewMode = true;
        this.readonly = true;
      } else {
        this.inEditMode = true;
      }
      this.LoadById();
    }
  }

  intializeNewModel() {
    this.model = {
      id: 0,
      buildings: [{ floors: [{ departments: [{ rooms: [] }] }] }],
      translations: [],
    };
  }

  InitializeModel() {
    this.InitilaizeCustNameLangsLookupList();
    this.InitializeForm();
  }
  //#endregion

  //#region Form Intialization
  InitializeForm() {
    this.frmCustomer = this.createForm(this.model);
    this.frmBuilding = this.createNewBuildingsFormArray();
    this.frmFloor = this.createNewFloorFormArray();
    this.frmDepartment = this.createNewDepartmentFormArray();
    this.frmRoom = this.createNewRoomFormArray();
  }

  createNewBuildingsFormArray() {
    let frm: FormGroup = this.fb.group({
      clientBuildingId: [null, Validators.required],
    });
    return frm;
  }

  createNewFloorFormArray() {
    let frm: FormGroup = this.fb.group({
      floor: [null, Validators.required],
    });
    return frm;
  }

  createNewDepartmentFormArray() {
    let frm: FormGroup = this.fb.group({
      department: [null, Validators.required],
    });
    return frm;
  }

  createNewRoomFormArray() {
    let frm: FormGroup = this.fb.group({
      room: [null, Validators.required],
    });
    return frm;
  }

  createForm(model: CustomerModelB) {
    let frm: FormGroup = this.fb.group({
      id: [],
      custName: [, Validators.required],
      nameAsLang: [],
      customerCode: [],
      custCategoryId: [],
      custCategoryName: [],
      custTypeId: [],
      custTypeName: [],
      custGroupId: [],
      custGroupName: [],
      cityId: [],
      cityName: [],
      operatingUnitNumber: [''],
      operatingUnitName: [''],
      assignedEmployeeId: [],
      assignedEmployeeUserName: [],
      orgName: [],
      organizationId: [],
      attachments: this.fb.array([
        (this.attachmentForm = this.fb.group({
          attachmentName: [],
          attachmentURL: [],
          customerId: [0],
          id: [0],
        })),
      ]),
      translations: this.createCustNameLangsFormArray(model.translations ?? []),
      buildings: this.createBuildingsFormArray(model.buildings ?? []),
    });
    frm.patchValue(model);
    return frm;
  }
  //#endregion

  //#region Attatchments
  createAttatchmentsFormArray(attatchments: Attachments[] | null): FormArray {
    const controls = attatchments?.map((v) => {
      return this.newAttatchmentFormGroup();
    });
    return new FormArray(controls ?? []);
  }
  newAttatchmentFormGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      customerId: [0],
      attachmentName: [],
      attachmentURL: [],
    });
  }

  get attachments(): FormArray {
    return this.frmCustomer.get('attachments') as FormArray;
  }

  addAttatchmentFormGroup() {
    this.attachments.push(this.newAttatchmentFormGroup());
  }
  addAttatchmentFormGroupByName(attachmentName: string) {
    let model: Attachments = {
      id: 0,
      customerId: 0,
      attachmentName: attachmentName,
    };
    let FG = this.newAttatchmentFormGroup();
    FG.patchValue(model);
    this.attachments.push(FG);
  }
  onRemoveAttatchment() {
    this.attachments.clear();
  }
  attachmentReady(event: any) {
    this.attachmentForm.value.attachmentName = event[0];
  }
  //#endregion

  //#region Buildings
  createBuildingsFormArray(buildings: BuildingsModleB[] | null): FormArray {
    const controls = buildings?.map((v) => {
      return this.newBuildingFormGroup(v.floors ?? []);
    });
    return new FormArray(controls ?? []);
  }

  newBuildingFormGroup(floors: FloorModelB[]): FormGroup {
    return this.fb.group({
      id: [0],
      customerId: [0],
      clientBuildingId: [],
      clientBuildingName: [],
      floors: this.createFloorsFormArray(floors),
    });
  }

  newBuildingWithData(building: any, floors: FloorModelB[]): FormGroup {
    return this.fb.group({
      id: [0],
      customerId: [this.id],
      clientBuildingId: [building.id],
      clientBuildingName: [building.name],
      floors: this.createFloorsFormArray(floors),
    });
  }

  get buildings(): FormArray {
    return this.frmCustomer.get('buildings') as FormArray;
  }

  addBuildingFormGroup() {
    this.buildings.push(this.newBuildingFormGroup([]));
  }

  removeBuilding(i: number) {
    this.buildings.removeAt(i);
  }

  showBuildingDialog() {
    this.visibleBuildingModel = true;
  }

  addBuilding(event: any) {
    this.buildings.push(
      this.newBuildingWithData(this.frmBuilding.value.clientBuildingId, [])
    );
  }

  changeBuildingValue(event: any) {
    this.frmBuilding.value.clientBuildingId = event.value;
  }
  //#endregion

  //#region  Floor form methods
  createFloorsFormArray(floors: FloorModelB[] | null): FormArray {
    const controls = floors?.map((v) => {
      return this.newFloorFormGroup(v.departments ?? []);
    });
    return new FormArray(controls ?? []);
  }

  newFloorFormGroup(departments: DepartmentModelB[]): FormGroup {
    return this.fb.group({
      id: [0],
      buildingId: [0],
      clientFloorId: [],
      clientFloorName: [],
      departments: this.createDepartmentsFormArray(departments),
    });
  }

  newFloorWithDataFormGroup(
    building: number,
    floor: any,
    departments: DepartmentModelB[]
  ): FormGroup {
    return this.fb.group({
      id: [0],
      buildingId: [building],
      clientFloorId: [floor.id],
      clientFloorName: [floor.name],
      departments: this.createDepartmentsFormArray(departments),
    });
  }

  floors(i: number): FormArray {
    return this.buildings.at(i).get('floors') as FormArray;
  }

  newFloorModel(): FloorModelB {
    let m: FloorModelB = {
      id: 0,
      buildingId: 0,
      departments: [],
    };
    return m;
  }

  addFloorModel(
    buildingId: number,
    clientFloorId: number,
    clientFloorName: string
  ): FormGroup {
    return this.fb.group({
      id: [0],
      buildingId: [0],
      clientFloorId: [clientFloorId],
      clientFloorName: [clientFloorName],
      departments: this.createDepartmentsFormArray([]),
    });
  }

  addFloorFormGroup(i: number) {
    let m = this.newFloorModel();
    let fg = this.newFloorFormGroup([]);
    fg.patchValue(m);
    this.floors(i).push(fg);
  }

  removeFloor(i: number, ifloor: number) {
    this.floors(i).removeAt(ifloor);
  }

  showFloorDialog(buildingIndex: number) {
    this.buildingIndex = buildingIndex;
    this.visibleFloorModel = true;
    this.frmFloor.reset();
  }

  addFloor() {
    this.floors(this.buildingIndex).push(
      this.addFloorModel(
        this.buildingIndex,
        this.frmFloor.value.floor.id,
        this.frmFloor.value.floor.name
      )
    );
    this.visibleFloorModel = false;
  }

  changeFloorValue(event: any) {
    this.frmFloor.value.floor = event.value;
  }
  //#endregion

  //#region  Department form methods
  departments(i: number, ifloor: number): DepartmentModelB[] {
    return this.floors(i).at(ifloor).get('departments')
      ?.value as DepartmentModelB[];
  }

  createDepartmentsFormArray(
    departments: DepartmentModelB[] | null
  ): FormArray {
    const controls = departments?.map((v) => {
      return this.newDepartmentFormGroup(v.rooms ?? []);
    });
    return new FormArray(controls ?? []);
  }

  newDepartmentFormGroup(rooms: RoomModelB[]): FormGroup {
    return this.fb.group({
      id: [0],
      floorId: [0],
      departmentId: [],
      departmentName: [],
      rooms: this.createRoomsOptionsFormArray(rooms),
    });
  }

  showDepartmentDialog(buildingIndex: number, floorIndex: number) {
    this.buildingIndex = buildingIndex;
    this.floorIndex = floorIndex;
    this.visibleDepartmentModel = true;
    this.frmDepartment.reset();
  }

  addDepartmentModel(departmentId: number, departmentName: string): FormGroup {
    return this.fb.group({
      id: [0],
      floorId: [0],
      departmentId: [departmentId],
      departmentName: [departmentName],
      rooms: this.createRoomsOptionsFormArray([]),
    });
  }

  departmentsArray(buildingIndex: number, floorIndex: number): FormArray {
    return this.floors(buildingIndex)
      .at(floorIndex)
      .get('departments') as FormArray;
  }

  addDepartment() {
    this.departmentsArray(this.buildingIndex, this.floorIndex).push(
      this.addDepartmentModel(
        this.frmDepartment.value.department.id,
        this.frmDepartment.value.department.departmentName
      )
    );
    this.visibleDepartmentModel = false;
  }

  removeDepartment(
    buildingIndex: number,
    floorIndex: number,
    departmentIndex: number
  ) {
    this.departmentsArray(buildingIndex, floorIndex).removeAt(departmentIndex);
  }
  //#endregion

  //#region Rooms
  createRoomsOptionsFormArray(rooms: RoomModelB[] | null): FormArray {
    const controls = rooms?.map((v) => {
      return this.newRoomOptionFormGroup();
    });
    return new FormArray(controls ?? []);
  }

  newRoomOptionFormGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      departmentId: [0],
      clientroomId: [],
      roomName: [],
    });
  }

  rooms(
    buildingIndex: number,
    floorIndex: number,
    departmentIndex: number
  ): FormArray {
    return this.departmentsArray(buildingIndex, floorIndex)
      .at(departmentIndex)
      .get('rooms') as FormArray;
  }

  showRoomDialog(
    buildingIndex: number,
    floorIndex: number,
    departmentIndex: number
  ) {
    this.buildingIndex = buildingIndex;
    this.floorIndex = floorIndex;
    this.departmentIndex = departmentIndex;
    this.visibleRoomModel = true;
    this.frmRoom.reset();
  }

  addRoom() {
    this.rooms(this.buildingIndex, this.floorIndex, this.departmentIndex).push(
      this.addRoomModel(
        this.frmRoom.value.room.id,
        this.frmRoom.value.room.name
      )
    );
    this.visibleRoomModel = false;
  }

  addRoomModel(clientRoomId: number, roomName: string): FormGroup {
    return this.fb.group({
      id: [0],
      departmentId: [0],
      clientroomId: [clientRoomId],
      roomName: [roomName],
    });
  }

  removeRoom(
    buildingIndex: number,
    floorIndex: number,
    departmentIndex: number,
    roomIndex: number
  ) {
    this.rooms(buildingIndex, floorIndex, departmentIndex).removeAt(roomIndex);
  }
  //#endregion

  //#region name languages
  nameLangs: LookupValue[] = [];

  InitilaizeCustNameLangsLookupList() {
    let custNameLangs: CustNameLangsModel[] = [];
    this.nameLangs?.forEach((b) => {
      let m = this.model.translations?.find((v) => v.langId == b.id);
      if (m) {
        m.langName = b.name;
        custNameLangs.push(m);
      } else {
        m = {
          id: 0,
          customerId: 0,
          langId: b.id,
          langName: b.name,
        };
        custNameLangs.push(m);
      }
    });
    this.model.translations = custNameLangs;
  }

  createCustNameLangsFormArray(
    custNameLangs: CustNameLangsModel[] | null
  ): FormArray {
    const controls = custNameLangs?.map((v) => {
      return this.newCustNameLangsFormGroup();
    });
    return new FormArray(controls ?? []);
  }

  get custNameLangs() {
    return <FormArray>this.frmCustomer?.get('translations');
  }

  newCustNameLangsFormGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      customerId: [this.id || 0],
      langId: [],
      nameValue: [],
      langName: [],
    });
  }

  addCustNameLangFormGroup() {
    this.custNameLangs.push(this.newCustNameLangsFormGroup());
  }
  //#endregion

  //#region fill lookups
  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('fired')
    );
  }

  getLookUps() {
    this.api.getCustCat().subscribe((res: any) => {
      this.custCat = res;
      this.cdr.detectChanges();
    });
    this.api.getCustTypes().subscribe((res: any) => {
      this.custTypes = res;
      this.cdr.detectChanges();
    });
    this.api.getCities().subscribe((res: any) => {
      this.city = res;
      this.cdr.detectChanges();
    });
    this.api.getGroupLeader().subscribe((res: any) => {
      this.group = res;
      this.cdr.detectChanges();
    });
    this.api
      .getAssignedEmp(['d7586299-2127-4a05-a12b-cda836cf29bb'])
      .subscribe((res: any) => {
        this.assignedEmp = res;
        this.cdr.detectChanges();
      });
    this.api.getOrganizations({}).subscribe((res) => {
      this.orgList = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getLookUps(Lookup.Floor).subscribe((res: any) => {
      this.floorsList = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getLookUps(Lookup.Building).subscribe((res: any) => {
      this.buildingsList = res.data;
      this.cdr.detectChanges();
    });
    this.lookupService.getLookUps(Lookup.Rooms).subscribe((res: any) => {
      this.roomsList = res.data;
      this.cdr.detectChanges();
    });

    this.empServices.searchRoles({ fixedName: 'r-6' }).subscribe((res) => {
      let id = res.data[0].id;
      this.empServices.getEmployeeByRole([id]).subscribe((res) => {
        this.assignedEmp = res;
      });
      this.cdr.detectChanges();
    });
  }
  //#endregion

  //#region Save and Delete
  save() {
    let m = this.frmCustomer.value as CustomerModelB;
    m.translations?.forEach((language) => {
      if (language.langId == this.currentUserLanguageId) {
        language.nameValue = m.custName;
      }
    });

    if (m.id == 0) {
      //add
      this.api.postCustoemr(m).subscribe({
        next: (res) => {
          this.apiResponse(res);
        },
        error: (e) => {
          console.error('unable to save customer', e);
        },
      });
    } else {
      //update
      this.api.updateCustomer(m).subscribe({
        next: (res) => {
          this.apiResponse(res);
        },
        error: (e) => {
          console.error('unable to save customer', e);
        },
      });
    }
  }

  deleteCustomer() {
    this.router.queryParams.subscribe((params: any) => {
      this.id = params.data;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this Site?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.api.deleteCustomer(this.id).subscribe((res) => {
            this.apiResponse(res);
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

  apiResponse(res: any) {
    const message = res.message;
    const sucess = res.isSuccess;

    if (sucess == true) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
      this.close_add_modal();
      // this.route.navigate(['reference-table/customer']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
  //#endregion

  onShowDialog() {}
  onHide() {
    this.showDialog = false;
  }
  openDialog() {
    this.showDialog = true;
  }

  close_add_modal() {
    this.frmCustomer.reset();
    this.openModals.emit(false);
  }
}
