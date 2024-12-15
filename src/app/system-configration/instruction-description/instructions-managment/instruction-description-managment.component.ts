import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  MenuItem,
  ConfirmEventType,
} from 'primeng/api';
import { InstructionDescriptionService } from '../../../services/instruction-description.service';
import { LookupService } from '../../../services/lookup.service';
import { Lookup } from '../../../shared/enums/lookup';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../../shared/primeng.module';

@Component({

  selector: 'add-name-definition',
  templateUrl: './instruction-description-managment.component.html',
  styleUrls: ['./instruction-description-managment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService],
})
export class InstructionDescriptionManagmentComponent implements OnInit {
  searchValue: string = ''; // For search input
  items!: MenuItem[];
  instructionDescriptionList = [];
  instructionDescriptionCategoryList: any[] = [];
  instructionDescription!: FormGroup;
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  totalRows!: number;
  loading!: boolean;
  descriptionId!: number;
  showmodal: boolean = false;
  showmodal1: boolean = false;
  filter: any = {
    text: "",
    pageSize: 10,
    pageNumber: 1,

  };
  InputModel = {
    id: 0,
    description: '',
    Category: ''
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef,
    private svc: InstructionDescriptionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private lookupService: LookupService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.getInstructionText();
    this.getLookup();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Create Instruction Description' },
    ];
    this.instructionDescription = this.fb.group({
      instrDescription: ['', Validators.required],
      category: ['', Validators.required]
    });


  }
  getInstructionText() {
    this.svc.searchInstructionDescription(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.instructionDescriptionList = res.data;

      this.cdr.detectChanges();

    });
  }
  onHideDialog() {
    this.instructionDescription.reset();
  }
  showAddDialog() {
    this.displayAdd = true;
  }
  showUpdateDialog(data: any) {
    this.displayUpdate = true;
    this.instructionDescription.controls['instrDescription'].setValue(data.description);
    this.instructionDescription.controls['category'].setValue(data.category);
  }
  openModal() {
    this.showmodal = true;
  }

  close_modal() {
    this.showmodal = !this.showmodal;
    this.ngOnInit()
  }
  close_modals() {
    this.displayUpdate = !this.displayUpdate;
    this.ngOnInit()
  }
  onAdd() {

    if (!this.instructionDescription.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Data validation error occurred",
        life: 3000,
      });
      return;
    }

    this.InputModel.description = this.instructionDescription.value.instrDescription;
    this.InputModel.Category = this.instructionDescription.value.category;
    this.svc.addInstructionDescription(this.InputModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.getInstructionText();
        this.close_modal()
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

  onUpdate() {

    if (!this.instructionDescription.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Data validation error occurred",
        life: 3000,
      });
      return;
    }
    this.InputModel.id = this.descriptionId;
    this.InputModel.description = this.instructionDescription.value.instrDescription;
    this.InputModel.Category = this.instructionDescription.value.category;
    this.svc.updateInstructionDescription(this.InputModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.getInstructionText();
        this.close_modals()
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

  onDelete(data: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svc.deleteInstructionDescription(data.id).subscribe((res) => {
          this.getInstructionText();
          const message = res.message;
          const sucess = res.isSuccess;
          if (sucess == true) {
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

  paginate(event: any) {
    this.loading = true;
    //console.log('paginate event', event);
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.svc.searchInstructionDescription(this.filter).subscribe((res) => {
        const data = res.data;
        this.instructionDescriptionList = data;
        this.totalRows = res.totalRows;
        this.loading = false;

        this.cdr.detectChanges();
      });
    }, 500);
  }

  getLookup() {
    this.lookupService.getLookUps(Lookup.InstructionDescriptionCategory).subscribe((res: any) => {
      this.instructionDescriptionCategoryList = res.data;

      this.cdr.detectChanges();
    })

  }
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.instructionDescriptionList = this.instructionDescriptionList.filter((row: any) =>
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
    this.getInstructionText()
    this.cdr.detectChanges();
  }
}
