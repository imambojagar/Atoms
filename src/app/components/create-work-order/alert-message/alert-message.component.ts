import { Component, ViewEncapsulation } from '@angular/core';
import { AlertService } from './alert-service';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class AlertMessageComponent {
  constructor(public alertService : AlertService){}
}
