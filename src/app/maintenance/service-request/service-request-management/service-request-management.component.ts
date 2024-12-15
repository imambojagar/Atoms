import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ServiceRequestFormService } from '../service-request-form.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { CallInfoComponent } from './call-info/call-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from '../../../shared/components/transaction-history/transaction-history.component';
import { ServiceReviewComponent } from './service-review/service-review.component';
import { MaintenanceInfoComponent } from './maintenance-info/maintenance-info.component';
import { FirstActionComponent } from './first-action/first-action.component';
import { AttachmentsComponent } from '../../../shared/components/attachments/attachments.component';
/* import { TransactionHistory } from 'src/app/shared/models/transaction-history'; */

@Component({
  standalone: true,
  selector: 'app-service-request-management',
  templateUrl: './service-request-management.component.html',
  imports: [
    PrimengModule,
    CallInfoComponent,
    FormsModule,
    ReactiveFormsModule,
    TransactionHistoryComponent,
    ServiceReviewComponent,
    MaintenanceInfoComponent,
    FirstActionComponent,
    AttachmentsComponent
  ],
  styleUrls: ['./service-request-management.component.scss'],
  providers: [MessageService, ConfirmationService, ServiceRequestFormService],
})
export class ServiceRequestManagementComponent implements OnChanges {

  @Input('showmodal') showmodal : boolean = false ;
  @Input('edit_asset_id') edit_asset_id: any = 0;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('drawer') public modalComponent: any;

  items!: MenuItem[];
  uploadedFiles: any[] = [];
  id: any;

  constructor(
    public serviceRequestFormService: ServiceRequestFormService,
    private activatedRoute: ActivatedRoute,
    private messageService:MessageService,
    private router: Router
  ) {
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Add Service Request'},
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
     this.Init();
  }

  Init(): void {
    this.serviceRequestFormService.isSubmitted=false;
    this.serviceRequestFormService.checkMode1()
    this.serviceRequestFormService.intiateForm()
    this.serviceRequestFormService.checkMode()
    this.serviceRequestFormService.isClose=false;
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.serviceRequestFormService.id = params['id'];
        this.serviceRequestFormService.getServiceRequestById()
      }

    })

  }

  displatMsg(message:any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  }

  saveServiceRequest() {
     this.serviceRequestFormService.CheckWarning();
      this.messageService.messageObserver.subscribe((res : any) => {
       console.log("message", res.severity);
       if(res.severity.toLowerCase() == "success" ) {
        this.Init();
        this.close_model();
      }
    }); // severity

  }

  serviceRequestClick(id:any) {
    // this.router.navigate([''], { queryParams: { id: id } });
    window.open("#/maintenance/service-request/edit-control?id=" +id,"_blank");
  }

  close_model() {
    this.openModals.emit(false);
  }

  close_Warning_model() {
    this.serviceRequestFormService.showDialogWarning = false;
  }

}
