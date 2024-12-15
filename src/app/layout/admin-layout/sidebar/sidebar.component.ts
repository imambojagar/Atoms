import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, OnInit, ViewChild, ViewEncapsulation, HostListener, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { PrimengModule } from '../../../shared/primeng.module';
import { StyleClassModule } from 'primeng/styleclass';
import { WINDOW } from '../main-layout/admin-layout.component';

// import { UserPanelComponent } from './user-panel.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatSlideToggleModule,
    RouterModule,
    CommonModule,
    PrimengModule,
    StyleClassModule
  ],
})
export class SidebarComponent implements OnInit {

  @Input() showToggle = true;
  @Input() showUser = true;
  @Input() showHeader = true;
  @Input() toggleChecked = false;

  @Output() toggleCollapsed = new EventEmitter<void>();

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChildren('sidebar') sidebars!: QueryList<ElementRef>;

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
  changed: boolean = false;
  toggle() {
    this.showToggle = !this.showToggle;
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  isMobile: any = null;
  options: any;

  constructor(@Inject(WINDOW) private window: Window, @Inject(DOCUMENT) private _document: Document,) {}

  ngOnInit(): void {
    let useragent = (this.window.navigator != undefined) ? this.window.navigator.userAgent : '';
    this.isMobile =  /iPhone|iPad|iPod|Android/i.test(useragent);
    if(this.isMobile) {
      this.isExpanded = false
    } else {
      this.isExpanded = true
    }

  }

  closeCallback(e: any): void {
      this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;



}


