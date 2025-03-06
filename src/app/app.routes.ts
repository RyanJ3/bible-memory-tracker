// app.routes.ts
import { Routes } from '@angular/router';
import {BibleTrackerComponent} from './bible-tracker/bible-tracker.component';

export const routes: Routes = [
  { path: '', component: BibleTrackerComponent },  // Home page
  { path: 'stats', component: BibleTrackerComponent }, // stats page
  { path: '**', redirectTo: '' }  // Catch all other routes and redirect to home
];
