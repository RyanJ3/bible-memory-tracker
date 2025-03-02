// components/chapter-progress.component.ts - Component for displaying and modifying chapter progress
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BibleBook, ChapterProgress } from '../models';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-chapter-progress',
  imports: [
    NgClass,
    NgIf
  ],
  template: `
    <div *ngIf="currentBook && selectedChapterIndex >= 0 && selectedChapterIndex < currentBook.chapters.length"
         class="bg-white border rounded p-4 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">
          {{ currentBook.bookName }} {{ selectedChapter }}
          <span *ngIf="chapterProgress?.completed" class="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            Completed
          </span>
          <span *ngIf="!chapterProgress?.completed && chapterProgress?.inProgress"
                class="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            In Progress
          </span>
        </h3>
        <span class="text-gray-600">
          {{ chapterProgress?.memorizedVerses || 0 }} / {{ totalVerses }} verses
        </span>
      </div>

      <!-- Progress Details -->
      <div class="mb-4">
        <div class="flex flex-col space-y-1">
          <p class="text-sm text-gray-600">Total verses: {{ totalVerses }}</p>
          <p class="text-sm text-gray-600">Memorized: {{ chapterProgress?.memorizedVerses || 0 }}</p>
          <p class="text-sm text-gray-600">
            Remaining: {{ totalVerses - (chapterProgress?.memorizedVerses || 0) }}
          </p>
          <p class="text-sm text-gray-600">
            Progress: {{ progressPercent }}%
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            class="h-2 rounded-full"
            [ngClass]="{
              'bg-green-600': chapterProgress?.completed,
              'bg-blue-500': !chapterProgress?.completed && chapterProgress?.inProgress,
              'bg-gray-200': !chapterProgress?.inProgress
            }"
            [style.width.%]="progressPercent"
          ></div>
        </div>
      </div>

      <!-- Slider for Verse Progress -->
      <div class="mb-4 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">
            Verses Memorized: {{ chapterProgress?.memorizedVerses || 0 }}
          </span>
          <span class="text-sm text-gray-500">
            Total: {{ totalVerses }}
          </span>
        </div>
        <input
          type="range"
          min="0"
          [max]="totalVerses"
          [value]="chapterProgress?.memorizedVerses || 0"
          (input)="onSliderChange($event)"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex space-x-2">
          <button
            (click)="decrementVerses()"
            [disabled]="(chapterProgress?.memorizedVerses || 0) <= 0"
            class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l disabled:opacity-50 font-bold"
          >
            -
          </button>
          <button
            (click)="incrementVerses()"
            [disabled]="(chapterProgress?.memorizedVerses || 0) >= totalVerses"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r disabled:opacity-50 font-bold"
          >
            +
          </button>
        </div>
        <button
          (click)="onResetChapter()"
          class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded"
        >
          Reset Chapter
        </button>
      </div>
    </div>
  `
})
export class ChapterProgressComponent {
  @Input() currentBook: BibleBook | null = null;
  @Input() selectedChapter: number = 1;
  @Input() selectedChapterIndex: number = 0;
  @Input() chapterProgress: ChapterProgress | null = null;

  @Output() incrementVersesEvent = new EventEmitter<void>();
  @Output() decrementVersesEvent = new EventEmitter<void>();
  @Output() updateProgress = new EventEmitter<number>();
  @Output() resetChapter = new EventEmitter<void>();

  get totalVerses(): number {
    if (!this.currentBook || this.selectedChapterIndex < 0 || this.selectedChapterIndex >= this.currentBook.chapters.length) {
      return 0;
    }
    return this.currentBook.chapters[this.selectedChapterIndex];
  }

  get progressPercent(): number {
    if (!this.totalVerses) return 0;
    return Math.round(((this.chapterProgress?.memorizedVerses || 0) / this.totalVerses) * 100);
  }

  incrementVerses(): void {
    this.incrementVersesEvent.emit();
  }

  decrementVerses(): void {
    this.decrementVersesEvent.emit();
  }

  onSliderChange(event: any): void {
    const newValue = parseInt(event.target.value, 10);
    this.updateProgress.emit(newValue);
  }

  onResetChapter(): void {
    if (confirm(`Are you sure you want to reset progress for Chapter ${this.selectedChapter}?`)) {
      this.resetChapter.emit();
    }
  }
}
