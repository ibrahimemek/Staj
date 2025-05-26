import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <header>
        <nav>
          <div class="nav-content">
            <div class="welcome-text">
              <div>Emek Library</div>
              <div class="welcome-subtext">You are welcome.</div>
            </div>
            <div class="nav-right">
              <ng-container *ngIf="authService.isAuthenticated(); else loginLink">
                <button (click)="logout()" class="logout-button">Logout</button>
              </ng-container>
              <ng-template #loginLink>
                <a routerLink="/login" routerLinkActive="active">Login</a>
                <a routerLink="/register" routerLinkActive="active">Register</a>
              </ng-template>
            </div>
          </div>
        </nav>
      </header>

      <div class="menu-section" *ngIf="authService.isAuthenticated() && !isAuthPage()">
        <div class="menu-content">
          <button class="menu-toggle" (click)="togglePanel()">
            <i class="fas fa-bars"></i>
            <span class="menu-text">Panel</span>
          </button>
        </div>
      </div>

      <div class="main-container">
        <div class="panel" [class.open]="isPanelOpen" *ngIf="authService.isAuthenticated() && !isAuthPage()">
          <div class="panel-content">
            <a routerLink="/books/add" class="panel-item">
              <i class="fas fa-plus"></i> Add Book
            </a>
            <a [routerLink]="['/books']" [queryParams]="{mode: 'update'}" class="panel-item">
              <i class="fas fa-edit"></i> Update Books
            </a>
            <a [routerLink]="['/books']" [queryParams]="{mode: 'delete'}" class="panel-item" *ngIf="authService.isAdmin()">
              <i class="fas fa-trash"></i> Delete Books
            </a>
          </div>
        </div>

        <main [class.with-panel]="isPanelOpen">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8f9fa;
    }

    header {
      background-color: #1b4332;
      padding: 1rem;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .welcome-text {
      font-weight: bold;
      color: #fff;
      margin-left: 0;
      line-height: 1.2;
    }

    .welcome-text > div:first-child {
      font-size: 1.5rem;
    }

    .welcome-subtext {
      font-size: 1rem;
      font-weight: normal;
      opacity: 0.9;
    }

    .menu-section {
      padding: 1rem 0;
      display: flex;
      background-color: white;
      border-bottom: 1px solid #d8f3dc;
    }

    .menu-content {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      padding-left: 1rem;
    }

    .menu-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #2d6a4f;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      color: white;
      font-size: 1rem;
      transition: background-color 0.2s;
      position: relative;
      z-index: 1100;
    }

    .menu-toggle:hover {
      background-color: #1b4332;
    }

    .menu-text {
      font-weight: 500;
    }

    .main-container {
      display: flex;
      flex: 1;
      position: relative;
    }

    .panel {
      position: fixed;
      left: -200px;
      top: 0;
      bottom: 0;
      width: 200px;
      background-color: #fff;
      box-shadow: 2px 0 4px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      z-index: 1000;
      margin-top: 140px;
      overflow-y: auto;
    }

    .panel.open {
      transform: translateX(200px);
    }

    .panel-content {
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .panel-item {
      padding: 1rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      color: #1b4332;
      background-color: #d8f3dc;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .panel-item:hover {
      background-color: #b7e4c7;
      transform: translateX(5px);
    }

    .panel-item i {
      font-size: 1.2rem;
      width: 24px;
    }

    main {
      flex: 1;
      padding: 2rem;
      margin: 0 auto;
      width: 100%;
      transition: margin-left 0.3s ease;
    }

    main.with-panel {
      margin-left: 200px;
    }

    .nav-right {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-right a {
      color: white;
      text-decoration: none;
      padding: 0.5rem;
    }

    .nav-right a:hover {
      color: #b7e4c7;
    }

    .nav-right a.active {
      border-bottom: 2px solid #b7e4c7;
    }

    .logout-button {
      background: none;
      border: 1px solid #b7e4c7;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .logout-button:hover {
      background-color: rgba(183, 228, 199, 0.1);
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isPanelOpen = false;
  private routerSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isAuthPage() || !this.authService.isAuthenticated()) {
        this.isPanelOpen = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isPanelOpen = false;
    this.router.navigate(['/books'], { queryParams: {} });
  }

  isAuthPage(): boolean {
    const isAuth = this.router.url === '/login' || this.router.url === '/register';
    if (isAuth) {
      this.isPanelOpen = false;
    }
    return isAuth;
  }
}
