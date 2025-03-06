// app.component.ts
import { Component } from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1 class="app-title">Bible App</h1>
        <nav class="app-nav">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/stats" class="nav-link" routerLinkActive="active">Stats</a>
        </nav>
      </header>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: 'Inter', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .app-header {
      padding: 20px 0;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }

    .app-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 16px;
      color: #1d4ed8;
    }

    .app-nav {
      display: flex;
      gap: 16px;
    }

    .nav-link {
      padding: 8px 16px;
      text-decoration: none;
      color: #4b5563;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-link:hover {
      background-color: #f3f4f6;
    }

    .nav-link.active {
      background-color: #dbeafe;
      color: #1d4ed8;
    }

    .app-content {
      padding: 20px 0;
    }

    @media (min-width: 640px) {
      .app-header {
        flex-direction: row;
        justify-content: space-between;
      }

      .app-title {
        margin-bottom: 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'Bible Memorization App';
}
