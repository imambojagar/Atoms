import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { GasRoomService } from '../data/gas-room.service';
import { Router } from '@angular/router';
import { RecurrentTaskService } from '../../recurrent-task/recurrent-task.service';
import { ExportService } from '../../../shared/services/export.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { GasRoomControlComponent } from '../gas-room-control/gas-room-control.component';
import { GasRoomViewControlComponent } from '../gas-room-view-control/gas-room-view-control.component';

@Component({
  standalone: true,
  selector: 'app-gas-room-view',
  imports: [PrimengModule, ReactiveFormsModule, CommonModule, GasRoomControlComponent, GasRoomViewControlComponent],
  templateUrl: './gas-room-view.component.html',
  styleUrls: ['./gas-room-view.component.scss'],
})
export class GasRoomViewComponent {
  roomFG!: FormGroup;
  items!: MenuItem[];
  rooms: any[] = [];
  roomIdList: any[] = [];
  totalRows: number = 0;
  loading: boolean = false;
  showmodal: boolean = false;
  asset_id: number = 0;
  editIndex: number = 0;
  addTransferLoaded: boolean = false;
  viewTransfersLoaded: boolean = false;
  filterLoaded: boolean = false;

  filter: any = {
    pageSize: 10,
    pageNumber: 1,
  };

  siteList: [] = [];
  searchValue: any;

  constructor(
    private api: GasRoomService,
    private custApi: RecurrentTaskService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private exporteService:ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  close_modal() {
    this.showmodal = !this.showmodal;
  }

  ngOnInit() {
    this.Search();
    this.roomFG = this.fb.group({
      roomId: [],
      siteId: [],
    });
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Medical Gas Room' },
    ];
  }

  clearValue(event: any) {
    event.target.value = '';
  }

  async openModal() {
    this.asset_id = 0;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  async openView() {
    this.asset_id = 0;
    this.viewTransfersLoaded = !this.viewTransfersLoaded;
  }

  async openFilterModal() {
    this.filterLoaded = !this.filterLoaded;
  }

  Reset() {
    this.filter = {
      pageSize: 10,
      pageNumber: 1,
      roomId: null,
      siteId: null,
    };
    this.Search();
    this.roomFG.reset();
  }

  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.rooms = this.rooms.filter((row: any) =>
        Object.values(row).some((val: any) => String(val).toLowerCase().includes(this.searchValue))
      );
    }
    else {
      this.resetGlobalFilter()
    }
    this.cdr.detectChanges();
  }

  resetGlobalFilter() {
    this.searchValue = ''; // Clear the search input
    this.Search()
    this.cdr.detectChanges();
  }

  Search() {
    this.loading = true;
    let searchObj = { ...this.filter };
    searchObj.pageNumber = 1;
    this.api.searchRoom(searchObj).subscribe((res) => {
      const data = res.data;
      this.totalRows = res.totalRows;
      this.rooms = data;
      this.loading = false;
      this.cdr.detectChanges();
      //console.log(data);
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.api.searchRoom(this.filter).subscribe((res) => {
        const data = res.data;
        this.rooms = data;
        this.totalRows = res.totalRows;
        this.loading = false;
      });
    }, 500);
  }

  navToDetails(row: any, index: number) {
    /* this.router.navigate(['maintenance/gas-room/edit-control'], {
      queryParams: { data: row.id, index },
    }); */
    this.asset_id = row.id;
    this.editIndex = index;
    this.addTransferLoaded = !this.addTransferLoaded;
  }

  navToViewDetails(row: any, index: number) {
    /* this.router.navigate(['maintenance/gas-room/edit-control'], {
      queryParams: { data: row.id, index },
    }); */
    this.asset_id = row.id;
    this.editIndex = index;
    this.viewTransfersLoaded = !this.viewTransfersLoaded;
  }



  roomIdFilter(name: any) {
    this.api.searchRoom({ roomId: name.query }).subscribe((res) => {
      const data = res.data;
      this.roomIdList = data;
    });
  }

  siteFilter(e: any) {
    this.custApi.searchSites(e.query).subscribe((res) => {
      const data = res.data;
      this.siteList = data;
    });
  }

  deleteRoom(row: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Room?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteRoom(row.id).subscribe((res) => {
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: message,
              life: 3000,
            });
            this.Search();
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


  export() {
    let searchObj = { ...this.filter };

    this.exporteService
    .export(searchObj, 'Room/exportRooms')
    .subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'File should be downloaded now',
        life: 3000,
      });
      var downloadURL = URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Rooms-Report';
      link.click();
    });
  }



}
