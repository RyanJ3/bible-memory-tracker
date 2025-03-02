// app.component.ts - Root application component
import { Component } from '@angular/core';
import {BibleTrackerComponent} from './bible-tracker/bible-tracker.component';

// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-bible-tracker></app-bible-tracker>
    </div>
  `,
  imports: [
    BibleTrackerComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bible Memorization Tracker';
}
