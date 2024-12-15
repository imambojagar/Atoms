import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { buildRoomForm } from '../data/gas-room-form-builder';
import { GasRoomService } from '../data/gas-room.service';
import { RoomModel } from '../data/gas-room.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { cylinderProperties } from '../../ordering-cylinders-lox/data/ordering-cylinders-lox.model';
import { CustomerService } from '../../../services/customer.service';
import validateForm from '../../../shared/helpers/validateForm';
import { PrimengModule } from '../../../shared/primeng.module';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { TransactionHistory } from '../../../models/transaction-history';


@Component({
  standalone: true,
  selector: 'app-gas-room-view-control',
  imports: [PrimengModule, FormsModule, ReactiveFormsModule, TransactionHistoryComponent],
  templateUrl: './gas-room-view-control.component.html',
  styleUrls: ['./gas-room-control.component.scss'],
})
export class GasRoomViewControlComponent implements OnChanges {
  /* @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>(); */

  @Input('showmodal') showmodal : boolean = false ;
  @ViewChild('drawer') public modalComponent: any;
  @Input('editIndex') editIndex: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('edit_asset_id') edit_asset_id: number = 0;

  transactionHistory!: TransactionHistory;
  roomFg!: FormGroup;
  id: number = 0;
  tabIndex: number = 0;
  model!: RoomModel;

  items!: MenuItem[];

  sitesList: any[] = [];

  inAddMode: boolean = false;
  inEditMode: boolean = false;
  inViewMode: boolean = false;

  cylindersArr = cylinderProperties;

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private api: GasRoomService,
    private apiCustomer: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  close_modal() {
    this.openModals.emit(false);
  }

   Init() {
    /* this.router.queryParams.subscribe((params: any) => { */
      this.id = 0;
      this.tabIndex = this.editIndex; // params.index;
      if (this.edit_asset_id) this.id =  this.edit_asset_id;// params.data;
    /* }); */
    this.buildForm();

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Medical Gas Room' },
    ];
  }

  buildForm() {
    if (this.id == 0) {
      this.model = { id: 0 };
      this.roomFg = buildRoomForm(this.model, this.fb);
      this.inAddMode = true;
      console.log('Add Form Group:', this.roomFg.value);
    } else {
      if (this.tabIndex == 0) {
        this.inViewMode = true;
      } else {
        this.inEditMode = true;
      }
      this.getRoomData();
    }
  }

  getRoomData() {
    this.api.getRoomById(this.id).subscribe((res: any) => {
      this.model = res.data as RoomModel;
      this.transactionHistory=new TransactionHistory();
      Object.assign( this.transactionHistory,res.data);
      if (res.data.customerName) {
        this.model.customerName = {
          custName: res.data.customerName,
        };
      }
      this.roomFg = buildRoomForm(this.model, this.fb);
      console.log('Edit Form Group:', this.roomFg.value);
    });
  }

  changeTabIndex(tab: any) {
    if (tab.index == 1) {
      this.inViewMode = false;
      this.inEditMode = true;
    } else {
      this.inViewMode = true;
      this.inEditMode = false;
    }
  }

  searchSites(name: any) {
    this.apiCustomer
      .searchCustomer({ custName: name.query })
      .subscribe((res: any) => {
        this.sitesList = res.data;
      });
  }
  sendSiteId(site: any) {
    this.roomFg.controls['customerId'].setValue(site.id);
  }
  //#region Save and Delete
  save() {
    if (this.roomFg.invalid) {
      validateForm.validateAllFormFields(this.roomFg);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      let m = this.roomFg.value as RoomModel;
      if (m.id == 0) {
        //add
        this.api.addRoom(m).subscribe({
          next: (res: any) => {
            this.apiResponse(res);
            this.Init();
            this.close_modal();
            console.log('customer added successfully', res);
          },
          error: (e) => {
            console.error('unable to save customer', e);
          },
        });
      } else {
        //update
        this.api.updateRoom(m).subscribe({
          next: (res: any) => {
            this.apiResponse(res);
            this.close_modal();
            console.log('customer updated successfully', res);
          },
          error: (e) => {
            console.error('unable to save customer', e);
          },
        });
      }
    }
  }

  deleteRoom() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete This Room?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteRoom(this.id).subscribe((res: any) => {
          this.apiResponse(res);
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have cancelled',
        });
      },
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
      this.route.navigate(['maintenance/gas-room']);
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
}
