import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pop-over',
  standalone: true,
  imports: [],
  templateUrl: './pop-over.component.html',
  styleUrl: './pop-over.component.scss'
})
export class PopOverComponent {
  @Input() buttonText: string | undefined;
  isActive = false;

  toggle() {
    this.isActive = !this.isActive;
  }
}
