import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CommonModule, DOCUMENT } from '@angular/common';
import { CommonService } from '../../../shared/services/common_service';
import { AuthService } from '../../../services/auth.service';
import { PrimengModule } from '../../../shared/primeng.module';
import { FileServiceService } from '../../../services/file-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SignalRService } from '../../../services/signal-r.service';
import { systemNotifications } from '../../../services/notifications.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModalService } from '../../modal.service';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../../services/employee.service';
import validateForm from '../../../shared/helpers/validateForm';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    PrimengModule,
    CommonModule, ChangepasswordComponent, FormsModule, ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  /* @HostBinding('class') class = 'matero-header'; */
  userData: any;

  @Input() showToggle = true;
  @Input() showBranding = false;
  @Input() isInProgress = false;
  breadCrumbText: any = null;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('hamburger', { static: false }) public hamburger: ElementRef | undefined;

  @ViewChild('profile', { static: false }) public profile: ElementRef | undefined;
  @ViewChild('notifications', { static: false }) public notifications: ElementRef | undefined;
  bodytag: any;
  sidebars: any;
  options: any;
  $sidebar: any;
  $content: any;
  $nano: any;
  changed: boolean = false;
  userName!: string;
  role!: string;
  imageSource: any;

  notificationss: any[] = [];
  pageSize: number = 10;
  pageNumber: number = 1;

  count: any = 0;

  title: any;
  text: any;
  constructor(@Inject(DOCUMENT) private _document: Document,
    private fileService: FileServiceService, private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private notificationsAPI: systemNotifications,
    public signalRService: SignalRService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    /* private commonService: CommonService,  */
    private empService: EmployeeService,
    private confirmationService: ConfirmationService,
    private authService: AuthService) { }

  AssetGroup: any;
  AssetGroups: any[] = JSON.parse(localStorage.getItem('userAssetGroups') || '{}')
  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  ngOnInit() {

    /* this.bodytag = this._document.getElementsByTagName('body'); */
    this.AssetGroup = JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}')
    console.log("asset group", this.AssetGroup);
    this.userName = localStorage.getItem('userName') || '{}'
    this.role = JSON.parse(localStorage.getItem('userRoles') || '{}')[0]?.name


    // this.commonService.getData().subscribe(data => {
    //   if(data) {
    //     this.userData = data;
    //   }
    //   this.breadCrumbTitle = this.userData.appConfig.breadcrumText ?? "";
    // });

    this.employeeForm = this.formBuilder.group({
      userId: localStorage.getItem('userId'),
      // imageUrl: this.profileImageId ?? [],
      password: [],
      cPassword: [],
    });
    this.getUserLang();

    // Subscribe to the modal visibility observable to react to open/close requests
    this.displayModal = false

  }

  handleSidebarToggle = () => { this.toggleSidebar.emit(!this.isExpanded); }

  toggleFullscreen() {
    /* if (screenfull.isEnabled) {
      screenfull.toggle();
    } */
  }

  ngAfterViewInit(): void {
   // this.downloadImage(localStorage.getItem('profileImg'))
    /* const profile = document.getElementById('profile'),
    notifications = document.getElementById('notifications'); */

    /* Promise.resolve().then(() => {
      this.commonService.getData().subscribe((data: any) => {
        if (data) {
          this.userData = data;
          this.breadCrumbText = data.appConfig.breadcrumText;
        }
      });
    }); */

    /*  $(".hamburger").on('click', function() {
       $(this).toggleClass("is-active");
     }); */
    const elements = this._document.querySelectorAll('.nano');

    this.hamburger?.nativeElement.addEventListener('click', () => {
      this.hamburger?.nativeElement.classList.toggle('is-active');
      this._document.body.classList.toggle('sidebar-hide');
      elements[0].classList.toggle('has-scrollbar');
    });

    this.profile?.nativeElement.addEventListener('click', () => {
      this.profile?.nativeElement.classList.toggle('active');
    });
    this.notifications?.nativeElement.addEventListener('click', () => {
      this.notifications?.nativeElement.classList.toggle('active');
    });


    /* elements[0].classList.toggle('has-scrollbar'); */

    if (this._document.body.classList.contains('sidebar-hide')) {
      elements[0].classList.remove('has-scrollbar');
    } else {
      elements[0].classList.add('has-scrollbar');
    }


    this.sidebars = this._document.querySelectorAll('.sidebar');
    this.sidebars.forEach((sidebarElement: any) => {

      var sidebarLinks = sidebarElement.querySelectorAll('li a.sidebar-sub-toggle');
      sidebarLinks.forEach(function (link: any) {
        link.addEventListener('click', function (e: Event) {
          e.preventDefault();
          link.parentNode.classList.toggle('open');
        });
      });
    });


  }


  isShow() {
    window.HTMLBodyElement
    return this._document.body.classList.contains('sidebar-hide')  //hasClass('sidebar-hide');
  }


  logout() {

    this.authService.logout()
  }
  switchAssetGroup() {
    localStorage.setItem('selectedAssetGroup', JSON.stringify(this.AssetGroup))
    this.cdr.detectChanges()
    window.location.href = '/';

  }
  downloadImage(imageName: any) {
    this.fileService.downloadImage(imageName).subscribe(res => {
      var a = imageName.split(".")
      this.imageSource = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/${a[1]};base64, ${res}`);
      this.imageSource = this.imageSource.changingThisBreaksApplicationSecurity
      this.cdr.detectChanges()

    })


  }
  onScrollingFinished() {
    this.pageNumber += 1;
    this.LoadNotification();
  }

  public LoadNotification() {
    let userId = localStorage.getItem('userId');
    this.notificationsAPI.getAll({ userId: userId, pageNumber: this.pageNumber, pageSize: this.pageSize }).subscribe((res) => {
      const data = res.data;
      const message = res.message;
      const isSuccess = res.isSuccess;
      if (isSuccess == true) {
        (data as any[]).forEach(ele => {

          this.notificationss.push(ele);
        })

        this.count = res.totalRows;
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
  }

  public addReceiveNotificationListener = () => {
    this.signalRService.hubConnection.on('receiveNotification', (res : any) => {
      this.notificationss.unshift(res[0][0]);
      if (res.length > 0) {
        this.count += res.length;
      }
      res[0].forEach((e: any) => {
        this.title = e.title;
        this.text = e.text;
      });
      console.log('title+text', this.title);
      this.messageService.add({
        severity: 'warn',
        summary: 'New Notification',
        detail: this.title + ' : ' + this.text,
        life: 5000,
      });
      console.log('Notification Data', res);
    });
  };

  public addReceiveNotificationCountListener = () => {
    this.signalRService.hubConnection.on('receiveNotificationCount', (res : any) => {
      this.count = res;
      console.log('Notification Count', res);
    });
  };

  private addReceiveVisitsNotificationListener() {
    this.signalRService.hubConnection.on(
      'receiveVisitsNotification',
      (res: any) => {
        const data = res.data;
        const message = res.message;
        const sucess = res.isSuccess;
        if (sucess == true) {
          console.log('engVisits', data.visits);
          // this.notifications=data.visits;
          // this.count=data.count;
          localStorage.setItem('engVisits', JSON.stringify(data.visits));
          localStorage.setItem('notifyNum', data.count);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        }
      }
    );
  }
  openModal() {
    console.log("hi");

    this.displayModal = true;
  }

  // Close the modal
  closeModal() {
    this.displayModal = false;
  }


  employeeForm!: FormGroup;
  photoName: string[] = [];
  baseUrl: string = environment.BaseURL.replace('api/', 'attachment/');
  userInfo: any = localStorage.getItem('userInfo');
  profileImageId = localStorage.getItem('profileImg');
  profileImg: string = this.baseUrl + this.profileImageId;
  isSaving: boolean = false;
  userLang: any;
  displayModal: boolean = false; // Local variable to control modal visibility
  modalSubscription!: Subscription;




  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe(); // Unsubscribe when the component is destroyed
    }
  }

  get employeeControls() {
    return this.employeeForm.controls;
  }

  confirmPasswordMatch() {
    const password: string = this.employeeForm.value.password;
    const confirmPassword: string = this.employeeForm.value.cPassword;

    if (password !== confirmPassword) {
      this.employeeForm.controls['cPassword'].setErrors({ mismatch: true });
    } else {
      return null;
    }
  }

  attachmentReady(event: any) {
    this.employeeForm.get('imageUrl')?.setValue(event[0]);
  }


  updateProfile() {
    let model = this.employeeForm.value;
    model.ImageUrl = ''
    // if (this.employeeForm.invalid) {
    //   validateForm.validateAllFormFields(this.employeeForm);
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Please Fill Required Data',
    //     life: 3000,
    //   });
    // } else {
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to update your profile?',
    //   header: 'Confirm',
    //   rejectButtonStyleClass: 'p-button-danger',
    //   accept: () => {
    //     this.isSaving = true;
    this.empService.updatePassword(model).subscribe((res) => {

      const message = res.message;
      if (res) {
        this.employeeForm.reset();
        this.isSaving = false;
        this.closeModal(); // Close modal after save
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: message,
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 3000,
        });
      }
    });
    // },
    // reject: () => {
    //   this.messageService.add({
    //     severity: 'warn',
    //     summary: 'Cancelled',
    //     detail: 'You have cancelled',
    //   });
    // },
    // });
    // }
  }



  getUserLang() {
    this.userLang = localStorage.getItem('userLanguage');
  }

  apiResponse(res: any) {
    const message = res.message;
    if (res.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: message,
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  }
}

interface MenuItem {
  title: string;
  open?: boolean;
  subItems?: MenuItem[];
}

export const DEFAULTS = {
  // duration od animations
  duration: 300,

  // set small sidebar when window width < resizeWnd
  resizeWnd: 1000
};
