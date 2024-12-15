import { Component } from '@angular/core';
import { ServiceRequestFormService } from '../../service-request-form.service';
import { AssetFormService } from '../../../../assets/assets/asset-form.service';
import { PrimengModule } from '../../../../shared/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ PrimengModule, FormsModule, ReactiveFormsModule],
  selector: 'app-maintenance-info',
  templateUrl: './maintenance-info.component.html',
  styleUrls: ['./maintenance-info.component.scss'],
  providers: [ServiceRequestFormService]
})
export class MaintenanceInfoComponent {
  constructor(
    public serviceRequestFormService: ServiceRequestFormService,
    public assetFormService:AssetFormService){

    }
}
