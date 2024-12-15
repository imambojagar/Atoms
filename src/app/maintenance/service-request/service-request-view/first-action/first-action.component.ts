import { Component } from '@angular/core';
import { ServiceRequestFormService } from '../../service-request-form.service';
import { PrimengModule } from '../../../../shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-first-action',
  imports: [PrimengModule, FormsModule, ReactiveFormsModule],
  templateUrl: './first-action.component.html',
  styleUrls: ['./first-action.component.scss'],
  providers: [ServiceRequestFormService]
})
export class FirstActionComponent {
constructor(
  public serviceRequestFormService: ServiceRequestFormService){}
}

