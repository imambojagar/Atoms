import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit {
  style: any;
  private loaderSubscription!: Subscription;
  isVisible: boolean = false;

  @Input() color!: string;
  @Input()
  get size() {
    return this._size;
  }
  set size(value: number) {
    this._size = value;
    this.style = {
      transform: `translate(-50%, -50%) scale(${value})`,
    };
  }
  private _size: number = 1;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderSubscription = this.loaderService.loaderState$.subscribe(
      (isVisible : any) => {
        this.isVisible = isVisible;
      }
    );
  }

  ngOnDestroy() {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
