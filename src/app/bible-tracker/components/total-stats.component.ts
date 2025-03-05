// components/total-stats.component.ts
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleTrackerService } from '../bible-tracker-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BIBLE_DATA } from '../models';

@Component({
  selector: 'app-total-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-4 rounded shadow mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Overall Memorization Progress</h2>
        <div class="flex items-center space-x-2">
          <div class="flex items-center text-xs">
            <div class="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
            <span>Verses</span>
          </div>
          <div class="flex items-center text-xs">
            <div class="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Chapters</span>
          </div>
          <div class="flex items-center text-xs">
            <div class="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>Books</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
          <div class="flex justify-between items-center mb-1">
            <h3 class="text-sm font-medium text-blue-800">Total Verses Memorized</h3>
            <span class="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">{{ overallPercentComplete }}%</span>
          </div>
          <p class="text-2xl font-bold text-blue-900">{{ totalMemorizedVerses }} <span class="text-sm text-blue-600">/ {{ totalBibleVerses }}</span></p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="overallPercentComplete"></div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg shadow-sm">
          <div class="flex justify-between items-center mb-1">
            <h3 class="text-sm font-medium text-green-800">Completed Chapters</h3>
            <span class="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">{{ chapterPercentComplete }}%</span>
          </div>
          <p class="text-2xl font-bold text-green-900">{{ totalCompletedChapters }} <span class="text-sm text-green-600">/ {{ totalBibleChapters }}</span></p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-green-500 h-2 rounded-full" [style.width.%]="chapterPercentComplete"></div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm">
          <div class="flex justify-between items-center mb-1">
            <h3 class="text-sm font-medium text-purple-800">Books with Memorization</h3>
            <span class="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full">{{ bookPercentComplete }}%</span>
          </div>
          <p class="text-2xl font-bold text-purple-900">{{ booksWithMemorization }} <span class="text-sm text-purple-600">/ {{ totalBibleBooks }}</span></p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-purple-500 h-2 rounded-full" [style.width.%]="bookPercentComplete"></div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Testament Progress</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button (click)="selectTestament('Old Testament')" class="bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors duration-200 rounded-lg p-3 text-left cursor-pointer">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-amber-800">Old Testament</span>
              <span class="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">{{ oldTestamentPercent }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-amber-500 h-2 rounded-full" [style.width.%]="oldTestamentPercent"></div>
            </div>
            <div class="flex justify-end mt-2">
              <span class="text-xs text-amber-800">Click to view</span>
            </div>
          </button>

          <button (click)="selectTestament('New Testament')" class="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200 rounded-lg p-3 text-left cursor-pointer">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-indigo-800">New Testament</span>
              <span class="text-xs px-2 py-1 bg-indigo-200 text-indigo-800 rounded-full">{{ newTestamentPercent }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-indigo-500 h-2 rounded-full" [style.width.%]="newTestamentPercent"></div>
            </div>
            <div class="flex justify-end mt-2">
              <span class="text-xs text-indigo-800">Click to view</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `
})
export class TotalStatsComponent implements OnInit, OnDestroy {
  // Overall Bible statistics
  totalBibleVerses: number = 0;
  totalBibleChapters: number = 0;
  totalBibleBooks: number = 0;

  // Memorization statistics
  totalMemorizedVerses: number = 0;
  totalCompletedChapters: number = 0;
  booksWithMemorization: number = 0;

  // Calculated percentages
  overallPercentComplete: number = 0;
  chapterPercentComplete: number = 0;
  bookPercentComplete: number = 0;

  // Testament stats
  oldTestamentPercent: number = 0;
  newTestamentPercent: number = 0;

  // Event emitter for testament selection
  @Output() testamentSelected = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  constructor(private bibleTrackerService: BibleTrackerService) {
    // Calculate Bible totals
    this.calculateBibleTotals();
  }

  ngOnInit(): void {
    // Subscribe to progress changes
    this.bibleTrackerService.progress$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateStatistics();
      });

    // Initial statistics update
    this.updateStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateBibleTotals(): void {
    // Count total verses, chapters, and books in the Bible
    this.totalBibleBooks = Object.keys(BIBLE_DATA).length;

    let totalVerses = 0;
    let totalChapters = 0;

    Object.values(BIBLE_DATA).forEach(book => {
      totalVerses += book.totalVerses;
      totalChapters += book.totalChapters;
    });

    this.totalBibleVerses = totalVerses;
    this.totalBibleChapters = totalChapters;
  }

  /**
   * Handles testament selection from the UI and emits an event to the parent component
   * @param testament The selected testament ('Old Testament' or 'New Testament')
   */
  selectTestament(testament: string): void {
    this.testamentSelected.emit(testament);
  }

  private updateStatistics(): void {
    // Get total statistics using the service method
    const totalStats = this.bibleTrackerService.calculateTotalStats();

    // Update component properties
    this.totalMemorizedVerses = totalStats.memorizedVerses;
    this.totalCompletedChapters = totalStats.completedChapters;
    this.booksWithMemorization = totalStats.booksWithMemorization;
    this.totalBibleVerses = totalStats.totalVerses;
    this.totalBibleChapters = totalStats.totalChapters;
    this.totalBibleBooks = totalStats.totalBooks;

    // Calculate percentages
    this.overallPercentComplete = Math.round((totalStats.memorizedVerses / totalStats.totalVerses) * 100) || 0;
    this.chapterPercentComplete = Math.round((totalStats.completedChapters / totalStats.totalChapters) * 100) || 0;
    this.bookPercentComplete = Math.round((totalStats.booksWithMemorization / totalStats.totalBooks) * 100) || 0;

    // Old Testament specific stats
    let oldTestamentTotal = 0;
    let oldTestamentMemorized = 0;

    // New Testament specific stats
    let newTestamentTotal = 0;
    let newTestamentMemorized = 0;

    // Go through each book in the Bible data for testament-specific stats
    Object.entries(BIBLE_DATA).forEach(([bookName, bookData]) => {
      const bookStats = this.bibleTrackerService.calculateBookStats(bookName);

      // Add to testament specific counts
      if (bookData.testament === 'Old Testament') {
        oldTestamentTotal += bookData.totalVerses;
        oldTestamentMemorized += bookStats.memorizedVerses;
      } else if (bookData.testament === 'New Testament') {
        newTestamentTotal += bookData.totalVerses;
        newTestamentMemorized += bookStats.memorizedVerses;
      }
    });

    // Calculate testament percentages
    this.oldTestamentPercent = Math.round((oldTestamentMemorized / oldTestamentTotal) * 100) || 0;
    this.newTestamentPercent = Math.round((newTestamentMemorized / newTestamentTotal) * 100) || 0;

    // Calculate percentages
    this.overallPercentComplete = Math.round((memorizedVerses / this.totalBibleVerses) * 100) || 0;
    this.chapterPercentComplete = Math.round((completedChapters / this.totalBibleChapters) * 100) || 0;
    this.bookPercentComplete = Math.round((booksWithMem.size / this.totalBibleBooks) * 100) || 0;

    // Calculate testament percentages
    this.oldTestamentPercent = Math.round((oldTestamentMemorized / oldTestamentTotal) * 100) || 0;
    this.newTestamentPercent = Math.round((newTestamentMemorized / newTestamentTotal) * 100) || 0;
  }
}
