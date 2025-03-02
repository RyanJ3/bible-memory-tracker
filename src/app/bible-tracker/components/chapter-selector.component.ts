// components/chapter-selector.component.ts - Component for selecting Bible chapter
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChapterProgress } from '../models';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-chapter-selector',
  imports: [
    FormsModule,
    NgClass,
    NgForOf
  ],
  template: `
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">Chapter Progress</h2>

      <div class="bg-white p-4 rounded shadow mb-4">
        <div class="mb-3">
          <label for="chapter-select" class="block text-sm font-medium text-gray-700 mb-1">
            Select Chapter:
          </label>
          <select
            id="chapter-select"
            [(ngModel)]="selectedChapter"
            (change)="onChapterSelect()"
            class="w-full p-2 border rounded"
          >
            <option *ngFor="let chapter of currentBookProgress; let i = index" [value]="chapter.chapter">
              Chapter {{ chapter.chapter }}
              {{
                chapter.completed ? ' (Completed)' :
                  (chapter.inProgress ? ' (In Progress)' : ' (Not Started)')
              }}
            </option>
          </select>
        </div>

        <!-- Chapter Overview -->
        <div class="mb-3">
          <p class="text-sm text-gray-500 mb-2">Quick Overview:</p>
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let chapter of currentBookProgress; trackBy: trackByFn"
              (click)="selectChapter(chapter.chapter)"
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium hover:opacity-80"
              [ngClass]="{
                'bg-gray-200 text-gray-800': !chapter.inProgress && !chapter.completed,
                'bg-blue-100 text-blue-800': chapter.inProgress && !chapter.completed,
                'bg-green-100 text-green-800': chapter.completed,
                'ring-2 ring-blue-500': chapter.chapter === selectedChapter
              }"
            >
              {{ chapter.chapter }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChapterSelectorComponent {
  @Input() currentBookProgress: ChapterProgress[] = [];
  @Input() selectedChapter: number = 1;

  @Output() chapterSelect = new EventEmitter<number>();

  onChapterSelect(): void {
    this.chapterSelect.emit(this.selectedChapter);
  }

  selectChapter(chapterNumber: number): void {
    this.selectedChapter = chapterNumber;
    this.chapterSelect.emit(chapterNumber);
  }

  trackByFn(index: number): number {
    return index;
  }
}
