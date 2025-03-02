// components/book-selector.component.ts - Component for selecting Bible book
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BibleBook } from '../models';
import {KeyValuePipe, NgClass, NgForOf} from '@angular/common';
import {BibleTrackerService} from '../bible-tracker-service';

@Component({
  selector: 'app-book-selector',
  imports: [
    NgClass,
    KeyValuePipe,
    NgForOf
  ],
  template: `
    <div class="bg-white p-4 rounded shadow mb-6">
      <h3 class="text-lg font-semibold mb-2">{{ selectedGroup }} Books</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <button
          *ngFor="let book of booksInGroup | keyvalue"
          (click)="selectBook(book.key)"
          class="px-3 py-2 rounded-lg"
          [ngClass]="selectedBook === book.key ?
            'bg-blue-600 text-white' :
            'bg-gray-100 hover:bg-gray-200 text-gray-800'"
        >
          <div class="text-center">
            <div class="font-semibold text-sm">{{ book.key }}</div>
            <div class="mt-1 h-1 bg-gray-200 rounded-full">
              <div
                class="h-1 bg-green-500 rounded-full"
                [style.width.%]="getBookStats(book.key)"
              ></div>
            </div>
            <div class="text-xs mt-1">{{ getBookStats(book.key) }}% Complete</div>
          </div>
        </button>
      </div>
    </div>
  `
})
export class BookSelectorComponent {
  @Input() booksInGroup: { [key: string]: BibleBook } = {};
  @Input() selectedGroup: string = '';
  @Input() selectedBook: string = '';

  @Output() bookChange = new EventEmitter<string>();

  constructor(private bibleTrackerService: BibleTrackerService) {}

  selectBook(bookName: string): void {
    this.bookChange.emit(bookName);
  }

  getBookStats(bookName: string): number {
    return this.bibleTrackerService.calculateBookStats(bookName).percentComplete;
  }
}
