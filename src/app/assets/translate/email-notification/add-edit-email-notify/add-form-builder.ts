

import { FormBuilder, Validators } from '@angular/forms';



export function getEmailNotifyModel(formValue: any) {
  let model = { ...formValue };
  return model;
}

export function buildForm(formbuilder: FormBuilder) {

  return formbuilder.group({
    id: 0,
    subject: null,
    body: null,
    isHTML: null,
    email: [null,Validators.email],
    sent: null,
    sendDate: null,
    ignore:null,
    userId: null,
    userName: null,
    attachments: formbuilder.array([]),
  });

}
