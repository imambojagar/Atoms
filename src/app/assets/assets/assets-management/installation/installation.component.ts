import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AssetFormService } from '../../asset-form.service';
import { PrimengModule } from '../../../../shared/primeng.module';

@Component({
  standalone: true,
  selector: 'app-installation',
  imports: [ReactiveFormsModule, PrimengModule],
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.scss']
})
export class InstallationComponent {
  acceptanceDate: Date = new Date()
  constructor(public assetFormService: AssetFormService
  ) {

  }
  ngOnInit(): void {
  }
  date(e: any) {

    this.assetFormService.installationForm.controls['acceptanceDate'].setValue(this.fixUTCDate(e));
  }

  fixUTCDate(date: any) {
    if (date) {
      date.setTime(new Date(new Date(date.getTime() - (date.getTimezoneOffset() * 60 *
        1000)).toUTCString()));
    }
    return date
  }
}
