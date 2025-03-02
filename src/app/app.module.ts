// app.module.ts - Main application module
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BibleTrackerModule } from './bible-tracker/bible-tracker.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BibleTrackerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
