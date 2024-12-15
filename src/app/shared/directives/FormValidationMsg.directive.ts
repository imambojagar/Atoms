import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[formValidation]'
})
export class FormValidationMsgDirective {

  @Input() formValidation: FormGroup = <any>null;
  constructor() { }

  @HostListener("click", [ "$event" ])
  handlClick() {
    if (this.formValidation == null) return;
    this.loopOverChilds(this.formValidation);
  }

  loopOverChilds(list: FormGroup | FormGroup[]) {
    if (Array.isArray(list)) {
      (list as FormGroup[]).forEach(X => this.validate(X));
    } else {
      this.validate(list as FormGroup);
    }
  }

  validate(group: FormGroup) {
    group.markAsTouched();
    group.markAsDirty();
    group.updateValueAndValidity();
    Object.values(group.controls).forEach(ctrl=> {
      ctrl.markAsTouched();
      ctrl.markAsDirty();
      ctrl.updateValueAndValidity({ 
        onlySelf: false,
        emitEvent: true,
      });
      if ((ctrl as any).controls) 
        this.loopOverChilds((ctrl as any).controls);
    })
  }

}
