import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogoComponent, PasswordTogglerComponent } from '../../shared';
import { AuthService, ToastService } from '../../services';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    LogoComponent,
    PasswordTogglerComponent,
    RouterModule,
  ],
})
export class LoginPage {
  form = this.initForm();

  @ViewChild(LogoComponent) logo!: LogoComponent;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}

  initForm() {
    return this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.toastService.showDanger({
        message: 'Please review the entered data',
      });

      throw new Error('[Sign Up] Invalid form.');
    }

    const { email, password } = this.form.getRawValue();

    this.authService
      .signIn(email, password)
      .pipe(
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
}
