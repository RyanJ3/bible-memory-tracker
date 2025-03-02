// components/book-info.component.ts - Component for displaying book information and statistics
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BibleBook } from '../models';

@Component({
  selector: 'app-book-info',
  template: `
    <div class="mb-6 bg-blue-50 p-4 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold">{{ currentBook?.bookName }}</h2>
        <div class="text-sm text-gray-600">
          {{ currentBook?.testament }} • {{ currentBook?.group }}
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white p-3 rounded shadow">
          <p class="text-sm text-gray-500">Verses Memorized</p>
          <p class="text-xl font-bold">{{ memorizedVerses }} / {{ totalVerses }}</p>
          <p class="text-sm text-blue-600">{{ percentComplete }}%</p>
        </div>
        <div class="bg-white p-3 rounded shadow">
          <p class="text-sm text-gray-500">Chapters</p>
          <p class="text-xl font-bold">{{ currentBook?.totalChapters }}</p>
        </div>
        <div class="bg-white p-3 rounded shadow">
          <p class="text-sm text-gray-500">Chapters Completed</p>
          <p class="text-xl font-bold">{{ completedChapters }} / {{ currentBook?.totalChapters }}</p>
        </div>
        <div class="bg-white p-3 rounded shadow">
          <p class="text-sm text-gray-500">Chapters In Progress</p>
          <p class="text-xl font-bold">{{ inProgressChapters }}</p>
        </div>
      </div>
      
      <!-- Book progress bar -->
      <div class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div 
            class="bg-blue-600 h-4 rounded-full" 
            [style.width.%]="percentComplete"
          ></div>
        </div>
      </div>
      
      <div class="mt-4 text-right">
        <button 
          (click)="onResetBook()"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Reset Book
        </button>
      </div>
    </div>
  `
})
export class BookInfoComponent {
  @Input() currentBook: BibleBook | null = null;
  @Input() memorizedVerses: number = 0;
  @Input() totalVerses: number = 0;
  @Input() completedChapters: number = 0;
  @Input() inProgressChapters: number = 0;
  
  @Output() resetBook = new EventEmitter<void>();

  get percentComplete(): number {
    if (!this.totalVerses) return 0;
    return Math.round((this.memorizedVerses / this.totalVerses) * 100);
  }
  
  onResetBook(): void {
    if (confirm(`Are you sure you want to reset all progress for ${this.currentBook?.bookName}?`)) {
      this.resetBook.emit();
    }
  }
}
