// bible-tracker.module.ts - Module for Bible Memorization Tracker
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibleTrackerComponent } from './bible-tracker.component';
import { GroupSelectorComponent } from './components/group-selector.component';
import { BookSelectorComponent } from './components/book-selector.component';
import { BookInfoComponent } from './components/book-info.component';
import { ChapterSelectorComponent } from './components/chapter-selector.component';
import { ChapterProgressComponent } from './components/chapter-progress.component';
import {TestamentSelectorComponent} from './components/testament-selector.component';

@NgModule({
  declarations: [
    BibleTrackerComponent,
    BookInfoComponent,
    ChapterSelectorComponent,
    ChapterProgressComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TestamentSelectorComponent,
    GroupSelectorComponent,
    BookSelectorComponent
  ],
  exports: [
    BibleTrackerComponent
  ]
})
export class BibleTrackerModule { }
