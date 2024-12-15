import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { Role } from '../../../shared/enums/role';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../shared/components/file-upload-component/file-upload-component';
import { PrimengModule } from '../../../shared/primeng.module';
import { LookupService } from '../../../services/lookup.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-reject-request',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [CommonModule, FormsModule, PrimengModule, FileUploadComponent, ReactiveFormsModule,],
  templateUrl: './reject-request.component.html',
  styleUrl: './reject-request.component.scss'
})
export class RejectRequestComponent {

  @Input('showmodal') showmodal: boolean = false;


  @Input('activeRow') activeRow: any;
  @ViewChild('reject') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() activeRowreset: EventEmitter<void> = new EventEmitter<void>(); // Change to emit void

  // Model for the template-driven form
  model = {
    rejectionReason: '',
    workorderId: '',
    feedback: ''
  };

  // Options for the p-dropdown
  rejectionReasons: any = [];

  constructor(private lookupService: LookupService, private serviceRequestService: ServicerequestService,
    private messageService: MessageService) {



  }
  ngOnInit(): void {
    console.log(this.activeRow);

    this.getLookups2()
  }
  save() {
    let body = {
      "workOrderId": this.activeRow.workOrderId,
      "rejectReasonId": this.model.rejectionReason,
      "feedback": this.model.feedback
    }
    this.serviceRequestService.RejectWorkOrderByCallCenter(body)
      .pipe(
        catchError(this.handleError.bind(this)) // Bind 'this' context for error handler
      )
      .subscribe({
        next: () => {
          console.log('Service request rejected successfully');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service request rejected successfully',
            life: 3000 // Toast duration (optional)
          });
          this.close_modal(); // Close the modal
        },
        error: (err) => {
          // Display error toast message
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Failed to reject the service request',
            life: 5000 // Toast duration for error
          });
        }
      });
  }
  close_modal() {
    this.openModals.emit(false);
    this.activeRowreset.emit();  // Emit event to reset activeRow in parent
  }

  getLookups2() {
    this.lookupService
      .getLookUps(1303)
      .subscribe((res: any) => {
        this.rejectionReasons = res.data;
      })
  }
  // Method to handle dropdown change and assign the selected engineer's ID

  private handleError(error: any): any {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }
}
