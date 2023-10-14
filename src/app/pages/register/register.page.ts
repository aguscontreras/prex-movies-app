import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AuthService, ToastService } from '../../services';
import { SignUpReq } from '../../models';
import { concatMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { PasswordTogglerComponent } from '../../shared';
import { PASSWORD_REGEX } from '../../core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    LogoComponent,
    PasswordTogglerComponent,
  ],
})
export class RegisterPage {
  form = this.initForm();

  @ViewChild(LogoComponent) logo!: LogoComponent;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private navController: NavController
  ) {}

  initForm() {
    return this.formBuilder.nonNullable.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
    });
  }

  backToPreHome() {
    this.navController.navigateBack('/pre-home');
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.toastService.showDanger({
        message: 'Please review the entered data',
      });

      throw new Error('[Sign Up] Invalid form.');
    }

    const { firstname, lastname, password, email } = this.form.getRawValue();

    const body: SignUpReq = {
      name: `${firstname} ${lastname}`,
      password,
      email,
    };

    this.authService
      .signUp(body)
      .pipe(
        concatMap(() => this.authService.signIn(email, password)),
        concatMap(() => this.logo.initAnimation()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.router.navigate(['/home']),
      });
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get passworValidation() {
    const { value } = this.password;

    return {
      hasNumber: new RegExp('(?=.*\\d).+').test(value),
      hasLowercase: new RegExp('(?=.*[a-z])(?=.*[a-zA-Z])').test(value),
      hasUppercase: new RegExp('(?=.*[A-Z])(?=.*[a-zA-Z])').test(value),
      isLongEnough: new RegExp('^.{8,}$').test(value),
    };
  }
}
