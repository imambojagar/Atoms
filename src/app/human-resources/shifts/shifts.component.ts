import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftPeriodService } from '../../services/shift.service';
import { AssetGroupService } from '../../services/asset-group.service';
import { PrimengModule } from '../../shared/primeng.module';
import { CommonModule, DatePipe } from '@angular/common';
import { Shifts } from '../../models/shifts';
import { SharedTable } from '../../shared/components/table/table';
import { AddEditShiftComponent } from './add-edit-shift/add-edit-shift.component';

@Component({
  selector: 'app-shifts',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AddEditShiftComponent,
  ],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss',
  providers: [DatePipe],
})
export class ShiftsComponent implements OnInit {
  searchFilter = new Shifts();
  searchForm!: FormGroup;
  // items = [
  //   { label: 'Home', routerLink: ['/'] },
  //   { label: 'search Shift', routerLink: ['/hr/shifts'] },
  // ];
  tableConfig = new SharedTable();
  pageSize: number = 10;
  pageIndex: number = 1;
  shifts: any[] = [];
  AssetGroups: any[] = [];
  dataTable: any;
  searchValue: string = '';
  showFilterModal: boolean = false;
  addShiftLoaded: boolean = false;
  shift_id: any;
  status: string = '';
  balanceFrozen: boolean = false;
  shift_index: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private shiftsService: ShiftPeriodService,
    private assetGroupService: AssetGroupService
  ) {}

  ngOnInit(): void {
    this.getAssetGroups();
    this.searchForm = this.fb.group({
      assetGroup: [null],
      name: [null],
    });
    // this.tableConfig.tableHeaders = ['Name', 'Shift Type', 'From', 'To'];
    // this.tableConfig.deleteRow = true;
    // this.tableConfig.editRow = true;
    // this.tableConfig.idHeader = 'Id';
    // this.tableConfig.tableName = 'Shifts List';

    // this.tableConfig.clickableLinks = [{ header: 'Id' }];
    this.searchShifts();
  }

  searchShifts() {
    //  Object.bind(this.searchFilter, this.searchForm.value)

    this.searchFilter.assetGroup = this.searchForm.value.assetGroup;
    this.searchFilter.name = this.searchForm.value.name;
    // this.searchFilter = { ...this.searchFilter, ...this.searchForm.value };
    this.shiftsService.GetShifts(this.searchFilter).subscribe((data) => {
      this.tableConfig.pageFilter.totalItems = data['totalRows'];
      let tableData: any = [];
      // data['data']?.forEach((e: any) => {
      //   tableData.push({
      //     Id: e.id,
      //     Name: e.shiftName,
      //     'Shift Type': e.shiftType.name,
      //     From:
      //       e.startShift == null
      //         ? ''
      //         : this.datePipe.transform(e.startShift, 'HH:mm'),
      //     To:
      //       e.endShift == null
      //         ? ''
      //         : this.datePipe.transform(e.endShift, 'HH:mm'),
      //   });
      // });
      data['data']?.forEach((e: any) => {
        tableData.push({
          id: e.id,
          shiftName: e.shiftName,
          shiftType: e.shiftType.name,
          startShift:
            e.startShift == null
              ? ''
              : this.datePipe.transform(e.startShift, 'HH:mm'),
          endShift:
            e.endShift == null
              ? ''
              : this.datePipe.transform(e.endShift, 'HH:mm'),
        });
      });
      this.tableConfig.tableData = tableData;
      this.dataTable = tableData;
      this.tableConfig.pageFilter.totalRows = data.totalRows;

      this.cdr.detectChanges();
    });
    this.close_filter_modal();
  }

  reset() {
    this.searchForm.reset();
    this.searchShifts();
  }

  EditRecord(id: any) {
    // this.router.navigate(['pages/users-management/user-action'], { queryParams: { id: id } })
  }

  addShift() {
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.shift_id = params['id'];
    // });
    this.shift_id = 0;
    this.status = 'add';
    this.addShiftLoaded = true;
  }

  editShift(e: any) {
    this.shift_id = e.id;
    this.shift_index = e.index;
    this.status = 'edit';
    this.addShiftLoaded = true;
  }

  veiwShift(e: any) {
    this.shift_id = e.id;
    this.status = 'view';
    this.addShiftLoaded = true;
  }

  deleteShift(shift: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + shift.Name + '?',
      header: 'Confirm',
      rejectButtonStyleClass: 'btn btn-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shiftsService.deleteshift(shift.Id).subscribe((res: any) => {
          this.searchShifts();
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer Deleted',
          life: 3000,
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
  paginate(e: any) {
    this.searchFilter.pageNumber = e;
    this.tableConfig.pageFilter.pageNumber = e;
    this.searchShifts();
  }

  // toggleAdd() {
  //   this.router.navigate(['/hr/shifts/shift-management']);
  // }

  close_filter_modal() {
    this.showFilterModal = false;
  }

  selectShift(event: any) {
    this.getShifts(event.query);
    this.searchFilter.name = event.query;
  }
  getShifts(searchText: any = '') {
    var dto = { name: searchText };
    this.shiftsService.ShiftsAutoComplete(dto).subscribe((res) => {
      this.shifts = res.data;
    });
  }

  bindShift(event: any) {
    this.searchFilter.name = event.shiftName;
  }
  shiftClear() {
    this.searchFilter.name = '';
  }
  getAssetGroups() {
    this.assetGroupService.searchAssetGroups({}).subscribe((res: any) => {
      this.AssetGroups = res.data;
      this.cdr.detectChanges();
    });
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.dataTable = this.dataTable.filter((row: any) =>
        Object.values(row).some((val: any) =>
          String(val).toLowerCase().includes(this.searchValue)
        )
      );
    } else {
      this.resetGlobalFilter();
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.getAssetGroups();
    this.searchShifts();
    this.cdr.detectChanges();
  }

  toggleFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  toggleAdd() {
    this.addShiftLoaded = !this.addShiftLoaded;
    this.getAssetGroups();
    this.searchShifts();
    this.cdr.detectChanges();
  }
}
