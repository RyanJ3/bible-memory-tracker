// app.routes.ts
import { Routes } from '@angular/router';
import { FlowMemorizationComponent } from './flow-memorization/flow-memorization.component';
import {BibleTrackerComponent} from './bible-tracker/bible-tracker.component';

export const routes: Routes = [
  { path: '', component: BibleTrackerComponent },  // Home page
  { path: 'stats', component: BibleTrackerComponent },  // Bible dropdown route
  { path: 'flow-memorization', component: FlowMemorizationComponent },  // FLOW memorization tool route
  { path: '**', redirectTo: '' }  // Catch all other routes and redirect to home
];
