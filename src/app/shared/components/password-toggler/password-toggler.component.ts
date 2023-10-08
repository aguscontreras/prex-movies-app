import { CommonModule } from '@angular/common';
import { Component, ContentChild } from '@angular/core';
import { IonInput, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-password-toggler',
  templateUrl: './password-toggler.component.html',
  styleUrls: ['./password-toggler.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PasswordTogglerComponent {
  showPassword = false;

  @ContentChild(IonInput) input?: IonInput;

  toggleVisibility() {
    if (this.input) {
      this.showPassword = !this.showPassword;
      this.input.type = this.showPassword ? 'text' : 'password';
    }
  }
}
