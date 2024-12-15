import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  MenuItem,
  ConfirmEventType,
} from 'primeng/api';
import { InstructionTextService } from '../../../services/instruction-text.service';


@Component({
  selector: 'add-name-definition',
  templateUrl: './instruction-managment.component.html',
  styleUrls: ['./instruction-managment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService],
})
export class InstructionManagmentComponent implements OnInit {
  searchValue: string = ''; // For search input
  showmodal: boolean = false;
  showmodal1: boolean = false;
  items!: MenuItem[];
  instructionTextList = [];
  instructionText!: FormGroup;
  displayAdd: boolean = false;
  displayUpdate: boolean = false;
  totalRows!: number;
  loading!: boolean;
  instructionId!: number;

  filter: any = {
    text: "",
    isTextDescription: false,
    pageSize: 10,
    pageNumber: 1,

  };
  InputModel = {
    id: 0,
    text: '',
    isTextDescription: false
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef,
    private svc: InstructionTextService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.getInstructionText();
    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Create Instruction Text' },
    ];
    this.instructionText = this.fb.group({
      id: ['', Validators.required],
      instrText: ['', Validators.required]
    });


  }



  getInstructionText() {
    this.svc.searchInstructionText(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.instructionTextList = res.data;
      this.cdr.detectChanges()

    });
  }
  onHideDialog() {
    this.instructionText.reset();
  }
  showAddDialog() {
    this.displayAdd = true;
  }
  showUpdateDialog(name: any) {
    this.displayUpdate = true;
    this.instructionText.controls['instrText'].setValue(name);
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
  openFilterModal() {

  }
  onAdd() {
    this.InputModel.text = this.instructionText.value.instrText;
    this.svc.addInstructionText(this.InputModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.close_modal()
        this.getInstructionText();
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
    this.InputModel.id = this.instructionId;
    this.InputModel.text = this.instructionText.value.instrText;
    this.svc.updateInstructionText(this.InputModel).subscribe((res) => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
        this.close_modals()
        this.getInstructionText();

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
        this.svc.deleteInstructionText(data.id).subscribe((res) => {
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
      this.svc.searchInstructionText(this.filter).subscribe((res) => {
        const data = res.data;
        this.instructionTextList = data;
        this.totalRows = res.totalRows;
        this.loading = false;
        this.cdr.detectChanges()
      });
    }, 500);
  }
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.instructionTextList = this.instructionTextList.filter((row: any) =>
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
