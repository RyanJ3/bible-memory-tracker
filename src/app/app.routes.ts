// app.routes.ts
import { Routes } from '@angular/router';
import { BibleDropdownComponent } from './bible-dropdown/bible-dropdown.component';

export const routes: Routes = [
  { path: '', component: BibleDropdownComponent },  // This makes it show on the home page
  { path: 'bible', component: BibleDropdownComponent },  // Alternative route
  { path: '**', redirectTo: '' }  // Catch all other routes and redirect to home
];
