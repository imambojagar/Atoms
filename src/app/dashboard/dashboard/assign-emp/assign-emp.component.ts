import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../../shared/components/file-upload-component/file-upload-component';
import { PrimengModule } from '../../../shared/primeng.module';
import { EmployeeService } from '../../../services/employee.service';
import { Role } from '../../../shared/enums/role';
import { ServicerequestService } from '../../../services/servicerequest.service';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-assign-emp',
  standalone: true,
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, PrimengModule, FileUploadComponent, ReactiveFormsModule,],
  templateUrl: './assign-emp.component.html',
  styleUrl: './assign-emp.component.scss'
})
export class AssignEmpComponent implements OnInit {

  @Input('showmodal') showmodal: boolean = false;


  @Input('activeRow') activeRow: any;
  @ViewChild('assignemp') public modalComponent: any;
  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() activeRowreset: EventEmitter<void> = new EventEmitter<void>(); // Change to emit void

  // Model for the template-driven form
  model = {
    assignedEmployee: '',
    engineerId: '',
    employeeId: ''
  };

  // Options for the p-dropdown
  assignedEmployees = [];

  constructor(private employeeService: EmployeeService, private serviceRequestService: ServicerequestService,
    private messageService: MessageService,) {



  }
  ngOnInit(): void {
    console.log(this.activeRow);

    this.getAssignedEmployees(Role.engineersvalue, this.activeRow?.assetId)
  }
  save() {
    let body = {
      "workOrderId": this.activeRow.workOrderId,
      "assignedEngineerId": this.model.engineerId
    }
    this.serviceRequestService.AssignEngineerToWorkOrder(body).pipe(catchError(this.handleError))
      .subscribe({
        next: () => {
          console.log('Service request saved successfully');
          // You can also reset the form or close the modal here if needed
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service request saved successfully',
            life: 3000 // Toast duration (optional)
          });
          this.close_modal();
        },
        error: (error) => {
          console.error('Error saving service request:', error);
        }
      });
  }

  close_modal() {
    this.openModals.emit(false);
    this.activeRowreset.emit();  // Emit event to reset activeRow in parent
  }

  getAssignedEmployees(value: string, assetId: number) {
    this.employeeService
      .GetUserByRoleValue(value, assetId)
      .subscribe((res: any) => {
        this.assignedEmployees = res;
        // this.model.engineerId = res.userId
      });
  }
  // Method to handle dropdown change and assign the selected engineer's ID
  selectEng(event: any) {
    const selectedEmployee = event.value; // Get the selected employee object
    if (selectedEmployee) {
      this.model.engineerId = selectedEmployee.userId; // Assign the userId to engineerId
      this.model.employeeId = selectedEmployee;
    }
  }
  selectEngId(event: any) {
    const selectedEmployee = event.value; // Get the selected employee object
    if (selectedEmployee) {
      this.model.engineerId = selectedEmployee.userId; // Assign the userId to engineerId
      this.model.assignedEmployee = selectedEmployee;
    }
  }


  private handleError(error: any): any {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }

}
