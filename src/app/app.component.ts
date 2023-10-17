import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService, LoaderService, UserService } from './services';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    HttpClientModule,
  ],
})
export class AppComponent {
  public appPages = [{ title: 'Movies', url: '/home', icon: 'videocam' }];

  loading$ = this.loaderService.loading$;

  currentUser$ = this.userService.currentUser$;

  constructor(
    private readonly loaderService: LoaderService,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  onSignOut() {
    this.authService.signOut();
  }
}
