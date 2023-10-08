import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogoComponent } from '../shared/components/logo/logo.component';
import { AuthService, ToastService } from '../services';
import { SignUpReq } from '../models';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  providers: [AuthService, ToastService],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LogoComponent,
  ],
})
export class RegisterPage {
  form = this.initForm();

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  initForm() {
    return this.formBuilder.nonNullable.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
          ),
        ],
      ],
    });
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
        switchMap(() => this.authService.signIn(email, password)),
        takeUntilDestroyed(this.destroyRef),
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
