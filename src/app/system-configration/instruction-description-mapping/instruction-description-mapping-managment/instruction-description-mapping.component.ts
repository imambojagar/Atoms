import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  ConfirmationService,
  MessageService,
  MenuItem,
  ConfirmEventType,
} from 'primeng/api';
import { InstructionDescriptionService } from '../../../services/instruction-description.service';
import { InstructionTextDescriptionMappingService } from '../../../services/instruction-text-description-mapping.service';
import { InstructionTextService } from '../../../services/instruction-text.service';
export function buildUpdateValuesForm(formbuilder: FormBuilder) {
  return formbuilder.group({
    ListinstructionText: [''],
    ListinstructionDescription: [''],
    updateFormValues: [''],
  });
}

@Component({
  selector: 'add-name-definition',
  templateUrl: './instruction-description-mapping.component.html',
  styleUrls: ['./instruction-description-mapping.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService],
})
export class InstructionDescriptionMappingComponent implements OnInit {

  showmodal: boolean = false;
  showmodal1: boolean = false;
  items!: MenuItem[];
  ListinstructionDescription: any[] = [];
  ListinstructionText: any[] = [];
  inputForm!: FormGroup;
  updateForm!: FormGroup;
  updateFormValues: any[] = [];
  totalRows!: number;
  loading!: boolean;
  ListInstructionTextDescription = [];
  filter: any = {
    instructionDescription: "",
    pageSize: 10,
    pageNumber: 1,

  };
  displayUpdate: boolean = false;

  searchValue: string = ''; // For search input

  constructor(private svc: InstructionDescriptionService, private cdr: ChangeDetectorRef,
    private svcText: InstructionTextService, private fb: FormBuilder,
    private svcTextDescription: InstructionTextDescriptionMappingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.inputForm = this.fb.group({
      ListinstructionText: [],
      ListinstructionDescription: []
    });
    this.updateForm = this.fb.group({
      ListinstructionText: [],
      ListinstructionDescription: [],
      updateFormValues: this.fb.array([]),
    });

    this.getAllInstructionDescription();
    this.getAllInstructionText();
    this.getInstructionTextDescriptionMapping();

    this.items = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Instruction Text & Description Mapping' },
    ];

  }

  getInstructionTextDescriptionMapping() {
    this.svcTextDescription.getInstructionTextDescriptionMapping(this.filter).subscribe((res) => {
      this.totalRows = res.totalRows;
      this.ListInstructionTextDescription = res.data;

      this.cdr.detectChanges();

    });
  }

  close_modal() {
    this.showmodal = !this.showmodal;
    this.ngOnInit()
  }

  close_modals() {
    this.displayUpdate = !this.displayUpdate;
    this.ngOnInit()
  }
  getAllInstructionDescription() {
    this.svc.GetAllInstructionDescription().subscribe(res => {
      this.ListinstructionDescription = res.data;

      this.cdr.detectChanges();
    });
  }

  getAllInstructionText() {
    this.svcText.GetAllInstructionText().subscribe(res => {
      this.ListinstructionText = res.data;

      this.cdr.detectChanges();
    });
  }

  Save() {

    let InputDto: any = {
      instructionDescriptionsId: 0
    };
    const Id = this.inputForm.value.ListinstructionDescription?.id;

    // Check if instructionDescriptionsId is valid
    if (Id) {
      InputDto.instructionDescriptionsId = Id
      this.svcTextDescription.addInstructionTextDescription(InputDto).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.filter.instructionDescription = "";
          this.getInstructionTextDescriptionMapping();
          this.inputForm.reset();
          this.close_modal()
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });

        } else {
          this.getInstructionTextDescriptionMapping();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      });
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Instruction Description is required.",
        life: 3000,
      });
    }
  }

  paginate(event: any) {
    this.loading = true;
    this.filter.pageNumber = event.page + 1;
    setTimeout(() => {
      this.svcTextDescription.getInstructionTextDescriptionMapping(this.filter).subscribe((res) => {
        const data = res.data;
        this.ListInstructionTextDescription = data;
        this.totalRows = res.totalRows;
        this.loading = false;

        this.cdr.detectChanges();
      });
    }, 500);
  }

  onDelete(Id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      rejectButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svcTextDescription.deleteInstructionTextDescription(Id).subscribe((res) => {
          this.getInstructionTextDescriptionMapping();
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

  onChange(event: any) {

    this.filter.instructionDescription = event.value.description;
    this.loading = true;
    this.filter.pageNumber = 1;
    setTimeout(() => {
      this.svcTextDescription.getInstructionTextDescriptionMapping(this.filter).subscribe((res) => {
        const data = res.data;
        this.ListInstructionTextDescription = data;
        this.totalRows = res.totalRows;
        this.loading = false;

        this.cdr.detectChanges();
      });
    }, 500);
  }
  openFilterModal() {
    this.showmodal = true
  }

  addMoreValues() {
    (this.updateForm.get('updateFormValues') as FormArray).push(
      buildUpdateValuesForm(this.fb)
    );

  }
  removeValues(index: number) {
    (this.updateForm.get('updateFormValues') as FormArray).removeAt(index);
  }
  UpdateFromValuesControl() {
    return (<FormArray>this.updateForm.get('updateFormValues')).controls;
  }

  onHide($event: any) {
    this.updateForm.reset();
    const itemControls = <FormArray>this.updateForm.controls['updateFormValues'];
    itemControls.clear();
  }

  showUpdateDialog(data: any) {

    this.svcTextDescription.getInstructionTextDescriptionMappingById(data.id).subscribe(res => {
      data.instructionsText = res.data;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.updateForm.controls['ListinstructionDescription'].setValue(data);
        this.displayUpdate = true;
        const itemControls = <FormArray>this.updateForm.controls['updateFormValues'];
        if (data.instructionsText.length > 0) {
          for (let index = 0; index < data.instructionsText.length; index++) {
            this.addMoreValues();
            const itemFormGroup = <FormGroup>itemControls.controls[index];
            itemFormGroup.controls['ListinstructionDescription'].setValue(data);
            itemFormGroup.controls['ListinstructionText'].setValue(data.instructionsText[index]);

            this.cdr.detectChanges();
          }
        } else {
          this.addMoreValues();
          const itemFormGroup = <FormGroup>itemControls.controls[0];
          itemFormGroup.controls['ListinstructionDescription'].setValue(data);

          this.cdr.detectChanges();

        }

      }
    });



  }

  onUpdate() {
    let listInputDto = [];
    if (this.updateForm.value.updateFormValues.length > 0) {
      const uniqueSet = new Set(); // Create a Set to store unique values

      for (let i = 0; i < this.updateForm.value.updateFormValues.length; i++) {
        const instructionTextId = this.updateForm.value.updateFormValues[i].ListinstructionText.id
        const instructionDescriptionsId = this.updateForm.value.updateFormValues[0].ListinstructionDescription.id

        // Check if the combination of instructionTextId and instructionDescriptionsId is unique
        const uniqueKey = `${instructionTextId}_${instructionDescriptionsId}`;
        if (!uniqueSet.has(uniqueKey)) {
          listInputDto.push({ instructionTextId, instructionDescriptionsId });
          uniqueSet.add(uniqueKey); // Add the unique key to the Set
        }
      }
    }
    if (listInputDto != null) {
      this.svcTextDescription.updateInstructionTextDescription(listInputDto).subscribe((res) => {
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          this.filter.instructionDescription = "";
          this.getInstructionTextDescriptionMapping();
          this.close_modals()

          this.cdr.detectChanges();
          this.inputForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });
          this.getInstructionTextDescriptionMapping();
          this.updateForm.reset();
          this.updateFormValues = [];
          this.displayUpdate = false;
          const itemControls = <FormArray>(
            this.updateForm.controls['updateFormValues']
          );

          itemControls.clear();

        } else {
          this.getInstructionTextDescriptionMapping();
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

  async opensearch() {
    this.showmodal = true;
  }
  // Global search and filter logic
  applyGlobalFilter(event: Event) {
    if (this.searchValue) {
      this.searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.ListInstructionTextDescription = this.ListInstructionTextDescription.filter((row: any) =>
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
    this.getInstructionTextDescriptionMapping()
    this.cdr.detectChanges();
  }
}
