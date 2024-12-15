import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PrimengModule } from '../../../shared/primeng.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { Departments } from '../../../models/department-model';
import { DepartmentService } from '../../../services/department.service';
import { Router } from '@angular/router';
import validateForm from '../../../shared/helpers/validateForm';

@Component({
  selector: 'app-add-department',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PrimengModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss',
  providers: [DatePipe],
})
export class AddDepartmentComponent implements OnChanges {
  @Input('showmodal') showAddDepartment: boolean = false;
  @ViewChild('drawer') public deptComponent: any;
  @Output() openDeptModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('department_id') department_id: any = 0;
  @Input('department_index') department_index: any;

  items!: MenuItem[];
  addDepartment!: FormGroup;
  isSubmitted = false;
  departmentModel: Departments = new Departments();
  constructor(
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private api: DepartmentService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.Init();
  }

  Init(){
    this.addDepartment = this.formbuilder.group({
      departmentName: ['', Validators.required],
      departmentCode: [''],
      costCenterNumber: [''],
      costCenterName: [''],
    });
  }

  addDepartmentSubmit() {
    console.log(this.addDepartment.value);
    this.isSubmitted = true;
    if (this.addDepartment.invalid) {
      validateForm.validateAllFormFields(this.addDepartment);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.departmentModel.departmentName =
        this.addDepartment.value.departmentName;
      this.departmentModel.costCenterNumber =
        this.addDepartment.value.costCenterNumber;
      this.departmentModel.costCenterName =
        this.addDepartment.value.costCenterName;

      this.api.postDepartment(this.departmentModel).subscribe((res: any) => {
        console.log('Department model :', this.departmentModel);
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
          this.Init();
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

  close_add_modal() {
    this.addDepartment.reset();
    this.openDeptModals.emit(false);
  }
}
