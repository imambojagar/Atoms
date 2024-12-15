import { Component, ViewEncapsulation } from '@angular/core';
import { AlertService } from '../../services/alert-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class AlertMessageComponent {
  constructor(public alertService: AlertService) {}
}
