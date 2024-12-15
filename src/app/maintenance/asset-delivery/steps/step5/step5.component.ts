import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IAssetDelivery } from '../../../../models/asset-delivery-model';
import { AssetDeliveryService } from '../../../../services/asset-delivery.service';
import { Lookup } from '../../../../shared/enums/lookup';
/* import { Lookup } from 'src/app/data/Enum/lookup';
import { IAssetDelivery } from 'src/app/data/models/asset-delivery-model';
import { AssetDeliveryService } from 'src/app/data/service/asset-delivery.service'; */

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
})
export class Step5Component {
  @Input('updateParentModel') updateParentModel!: (part: Partial<IAssetDelivery>, isFormValid: boolean) => void;
  form!: FormGroup;
  @Input() defaultValues!: Partial<IAssetDelivery>;
  deliveryId: any;
  deliveryStatus: any[] = [];
  currentDelivery: any;
  id: any;
  private unsubscribe: Subscription[] = [];
  constructor(private _formbuilder: FormBuilder,
    private messageService: MessageService,
    private assetDeliveryService: AssetDeliveryService) { }

  ngOnInit() {
    this.currentDelivery = this.defaultValues;
    this.getLookups();
  }



  getLookups() {
    var deliveryStatusSB = this.assetDeliveryService.getLookup(Lookup.DeliveryStatus).subscribe((res: any) => {
      this.deliveryStatus = res.data
      this.deliveryStatus.splice(0, 0, { id: 0, name: "Select", value: null });
    });
    this.unsubscribe.push(deliveryStatusSB);
  }
  CompleteDelivery() {
    var currentStatus = this.deliveryStatus.filter(x => x.name == "Complete Delivery")[0];
    this.currentDelivery.statusId = currentStatus.id;
    this.updateDelivery(this.currentDelivery);
  }

  getDelivery(id: number) {
    var deliverySB = this.assetDeliveryService.getDelivery(id).subscribe(res => {
      if (res.isSuccess) {
        const data = res.data;
        this.updateParentModel(data, true);
      }
    });
    this.unsubscribe.push(deliverySB)
  }
  updateDelivery(data:any){
    this.assetDeliveryService.updateDelivery(data).subscribe(res => {
      const message = res.message;
      const sucess = res.isSuccess;
      if (sucess == true) {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000, });
       this.getDelivery(this.currentDelivery.id);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000, });
      }

    })
  }
}
