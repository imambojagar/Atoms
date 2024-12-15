import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../i18n/translation.service';
import { NewEmployeeModel } from '../../../models/employee-model';
// import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { PrimengModule } from '../../../shared/primeng.module';
// import validateForm from '../../../shared/helpers/validateForm';
//remove
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, SharedModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [EmployeeService, MessageService, TranslationService]
})
export class LoginComponent {

  selectedLanguage: any | null = null;


  onLanguageSelected(event: any) {
    this.selectedLanguage = event.value;
  }
  // KeenThemes mock, change it to:

  loginForm!: FormGroup;
  hasError!: boolean;
  returnUrl!: string;
  isLoading$!: Observable<boolean>;
  employeeModel: NewEmployeeModel = new NewEmployeeModel();
  public isAuthenticated: boolean = false;
  userId: any;
  oldNotifications!: any[];
  totalRows: any;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(@Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    // private authService: AuthService,
    private messageService: MessageService,
    private api: EmployeeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private translationService: TranslationService,
    private employeeService: EmployeeService
  ) {
    this.selectedLanguage = 'en';
  }

  ngOnInit(): void {
    // redirect to home if already logged in
    if (this.employeeService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['frontend_admin', Validators.required],
      password: ['Aa@123', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      // validateForm.validateAllFormFields(this.loginForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Fill Required Data',
        life: 3000,
      });

      console.log("invalid");
    } else {
      this.employeeModel.userName = this.loginForm.value.username;
      this.employeeModel.password = this.loginForm.value.password;

      this.api.login(this.employeeModel).subscribe((res) => {
        const data = res;
        const token = res.token;
        const message = res.message;
        const userPhoto = res.profilePhotoName;
        this.isAuthenticated = res.isAuthenticated;
        console.log('user data', data);
        localStorage?.setItem('token', token);
        localStorage?.setItem('refreshToken', res.refreshToken);
        localStorage?.setItem('profileImg', userPhoto);
        localStorage?.setItem('userInfo', JSON.stringify(res));
        // this.authService.currentUserValue = res;
        if (this.isAuthenticated == false) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: message,
            life: 3000,
          });

          localStorage?.setItem('userId', res.userID);
          localStorage?.setItem('userLanguage', res.languageName || 'English');
          localStorage?.setItem('userName', res.username);
          localStorage?.setItem('userRoles', JSON.stringify(res.userRoles));
          localStorage?.setItem(
            'userAssetGroups',
            JSON.stringify(res.assetGroups)
          );
          if (res.assetGroups.length < 2) {
            localStorage?.setItem('selectedAssetGroup', JSON.stringify(res.assetGroups[0]))
          }
          else {
            console.log("222", res.assetGroups.filter((e: any) => e.code == 'FM')[0]);
            localStorage?.setItem('selectedAssetGroup', JSON.stringify(res.assetGroups.filter((e: any) => e.code == 'FM')[0]))
          }
          localStorage?.setItem('currentLanguageId', res.languageId);
          localStorage?.setItem('addToDictionary', res.addToDictionary);
          if (res.languageName === 'عربى') {
            localStorage?.setItem('language', 'ar');
            this.translationService.Current_Language.next('ar');
          } else {
            localStorage?.setItem(
              'language',
              res.languageName?.slice(0, 2).toLowerCase() || 'en'
            );
            this.translationService.Current_Language.next(
              res.languageName?.slice(0, 2).toLowerCase() || 'en'
            );
          }
          this.router.navigate(['/dashboard']);

        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
