
import { NgClass } from '@angular/common';
import { Component, HostBinding, Input, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {  MatDrawerContainer, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonService } from '../../../shared/services/common_service';

const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
const TABLET_MEDIAQUERY = 'screen and (min-width: 600px) and (max-width: 959px)';
const MONITOR_MEDIAQUERY = 'screen and (min-width: 960px)';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    SidebarComponent,
    MatProgressBarModule,
    MatSidenavContainer,
    HeaderComponent,
    MatDrawerContainer,
    MatSidenav,
  ],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: false }) sidenav :  MatSidenav | undefined;
  @ViewChild('content', { static: false }) content : MatSidenavContent | undefined;;
  @Input() isInProgress! : boolean;
  options: any = {headerPos: 'fixed', showHeader: true};
  themeColor: string = 'light'
  userData: any = {}
  breadCrumbTitle = '';
  get isOver(): boolean {
    return this.isMobileScreen;
  }

  private isMobileScreen = false;

  @HostBinding('class.matero-content-width-fix') get contentWidthFix() {
    return (
      this.isContentWidthFixed &&
      this.options.navPos === 'side' &&
      this.options.sidenavOpened &&
      !this.isOver
    );
  }

  private isContentWidthFixed = true;

  @HostBinding('class.matero-sidenav-collapsed-fix') get collapsedWidthFix() {
    return (
      this.isCollapsedWidthFixed &&
      (this.options.navPos === 'top' || (this.options.sidenavOpened && this.isOver))
    );
  }

  private isCollapsedWidthFixed = false;

  private layoutChangesSubscription = Subscription.EMPTY;

  sidebarExpanded = true;
  isMobile: any = null;

  constructor(
    private router: Router,
    /* private commonService: CommonService, */
    @Inject(WINDOW) private window: Window
  ) {
    /* this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
      if (this.isOver) {
        this.sidenav.close();
      }
      this.content.scrollTo({ top: 0 });
    }); */
  }

  ngOnInit() {
     /* this.commonService.getData().subscribe((data: any) => {
      if(data) {
        this.userData = data;
      }
    }); */

 /*  let useragent = (this.window.navigator != undefined) ? this.window.navigator.userAgent : '';
   this.isMobile =  /iPhone|iPad|iPod|Android/i.test(useragent);
   if(this.isMobile) {
    this.sidebarExpanded = false;
   } else {
    this.sidebarExpanded = true;
   } */
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  // TODO: Trigger when transition end
  resetCollapsedState(timer = 400) {
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
  }
  setProgressBar(progress: any) {
    this.isInProgress = progress;
  }

  setBreadCrumb(text: any) {
    this.breadCrumbTitle = text;
  }
}


import { InjectionToken } from "@angular/core";

export const WINDOW: any = new InjectionToken<Window>("WINDOW", {
  factory: () => (typeof window !== "undefined" ? window : ({} as Window)),
});

