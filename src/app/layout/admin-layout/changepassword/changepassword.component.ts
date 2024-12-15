import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../../services/employee.service';
import validateForm from '../../../shared/helpers/validateForm';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../../shared/primeng.module';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [
    PrimengModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
})
export class ChangepasswordComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  photoName: string[] = [];
  baseUrl: string = environment.BaseURL.replace('api/', 'attachment/');
  userInfo: any = localStorage.getItem('userInfo');
  profileImageId = localStorage.getItem('profileImg');
  profileImg: string = this.baseUrl + this.profileImageId;
  isSaving: boolean = false;
  userLang: any;
  displayModal: boolean = false; // Local variable to control modal visibility
  modalSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private empService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private modalService: ModalService // Inject ModalService
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      userId: localStorage.getItem('userId'),
      ImageUrl: this.profileImageId ?? [],
      password: [],
      cPassword: [],
    });
    this.getUserLang();

    // Subscribe to the modal visibility observable to react to open/close requests
    this.modalSubscription = this.modalService.modalVisibility$.subscribe((visible: boolean) => {
      this.displayModal = visible;
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe(); // Unsubscribe when the component is destroyed
    }
  }

  get employeeControls() {
    return this.employeeForm.controls;
  }

  confirmPasswordMatch() {
    const password: string = this.employeeForm.value.password;
    const confirmPassword: string = this.employeeForm.value.cPassword;

    if (password !== confirmPassword) {
      this.employeeForm.controls['cPassword'].setErrors({ mismatch: true });
    } else {
      return null;
    }
  }

  attachmentReady(event: any) {
    this.employeeForm.get('imageUrl')?.setValue(event[0]);
  }

  updateProfile() {
    let model = this.employeeForm.getRawValue();

    console.log(model);

    if (this.employeeForm.invalid) {
      validateForm.validateAllFormFields(this.employeeForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });
    } else {
      this.confirmationService.confirm({
        message: 'Are you sure you want to update your profile?',
        header: 'Confirm',
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.isSaving = true;
          this.empService.updatePassword(model).subscribe((res) => {
            this.apiResponse(res);
            // localStorage.setItem(
            //   'profileImg',
            //   this.employeeForm.value.imageUrl
            // );
            this.employeeForm.reset();
            this.isSaving = false;
            this.closeModal(); // Close modal after save
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
  }

  // Close the modal
  closeModal() {
    this.modalService.closeModal();
  }

  getUserLang() {
    this.userLang = localStorage.getItem('userLanguage');
  }

  apiResponse(res: any) {
    const message = res.message;
    if (res.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
}
