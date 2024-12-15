import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssetFormService } from '../../asset-form.service';
import { PrimengModule } from '../../../../shared/primeng.module';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PrimengModule],
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent {
  constructor(public assetFormService: AssetFormService
  ) {

  }
  ngOnInit(): void {

  }

}
