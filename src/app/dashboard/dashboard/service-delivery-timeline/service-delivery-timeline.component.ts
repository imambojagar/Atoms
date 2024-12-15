import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../../../shared/primeng.module';
import { TimelineModule } from 'primeng/timeline';
import { ServicerequestService } from '../../../services/servicerequest.service';

@Component({
  selector: 'app-service-delivery-timeline',
  standalone: true,
  imports: [FormsModule, PrimengModule, ReactiveFormsModule, CommonModule, TimelineModule],
  templateUrl: './service-delivery-timeline.component.html',
  styleUrl: './service-delivery-timeline.component.scss'
})
export class ServiceDeliveryTimelineComponent {
  constructor(private servicerequestService: ServicerequestService, private cdr: ChangeDetectorRef) {

  }
  @Input('serviceDerlivery') serviceDerlivery: any;

  @Output() openModals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('showmodal') showmodal: boolean = false;
  events = [];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.serviceDerlivery);
    this.servicerequestService.GetWorkOrderById(this.serviceDerlivery?.callId).subscribe(
      res => {

        console.log(res.data.workOrderHistory);
        this.events = res.data.workOrderHistory.map((entry: any) => ({
          status: entry.workorderStatus?.name || "Unknown Status",
          date: new Date(entry.date),
          step: entry.step.name
        }));

        this.cdr.detectChanges();
      }
    )

  }
  close_modal() {
    this.openModals.emit(false);
    this.serviceDerlivery = null
    this.showmodal = false
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      // case 'high priority':
      //   return 'high-priority';
      case 'completed':
        return 'completed1';
      case 'closed':
        return 'closed1';
      case 'rejected':
        return 'rejected1';
      case 'open':
        return 'open1';
      case 'new':
        return 'new1';
      case 'overdue':
        return 'overdue1';
      case 'in progress':
        return 'in-progress1';
      default:
        return ''; // Default or no class
    }
  }
}
