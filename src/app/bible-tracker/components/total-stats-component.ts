// components/total-stats.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
      <h2 class="text-lg font-semibold mb-3">Overall Memorization Progress</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded">
          <h3 class="text-sm text-gray-500 mb-1">Total Verses Memorized</h3>
          <p class="text-2xl font-bold">{{ totalMemorizedVerses }} <span class="text-sm text-gray-500">/ {{ totalBibleVerses }}</span></p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="overallPercentComplete"></div>
          </div>
          <p class="text-sm text-blue-600 mt-1">{{ overallPercentComplete }}% of the Bible</p>
        </div>
        
        <div class="bg-blue-50 p-4 rounded">
          <h3 class="text-sm text-gray-500 mb-1">Completed Chapters</h3>
          <p class="text-2xl font-bold">{{ totalCompletedChapters }} <span class="text-sm text-gray-500">/ {{ totalBibleChapters }}</span></p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-green-500 h-2 rounded-full" [style.width.%]="chapterPercentComplete"></div>
          </div>
          <p class="text-sm text-green-600 mt-1">{{ chapterPercentComplete }}% of chapters complete</p>
        </div>
        
        <div class="bg-blue-50 p-4 rounded">
          <h3 class="text-sm text-gray-500 mb-1">Books with Memorization</h3>
          <p class="text-2xl font-bold">{{ booksWithMemorization }} <span class="text-sm text-gray-500">/ {{ totalBibleBooks }}</span></p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div class="bg-purple-500 h-2 rounded-full" [style.width.%]="bookPercentComplete"></div>
          </div>
          <p class="text-sm text-purple-600 mt-1">{{ bookPercentComplete }}% of books started</p>
        </div>
      </div>
      
      <div class="mt-4">
        <h3 class="text-sm text-gray-500 mb-2">Testament Progress</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border rounded p-3">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium">Old Testament</span>
              <span class="text-sm text-gray-600">{{ oldTestamentPercent }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-amber-500 h-2 rounded-full" [style.width.%]="oldTestamentPercent"></div>
            </div>
          </div>
          
          <div class="border rounded p-3">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium">New Testament</span>
              <span class="text-sm text-gray-600">{{ newTestamentPercent }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-indigo-500 h-2 rounded-full" [style.width.%]="newTestamentPercent"></div>
            </div>
          </div>
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
  
  private updateStatistics(): void {
    // Calculate overall memorization statistics
    let memorizedVerses = 0;
    let completedChapters = 0;
    const booksWithMem = new Set<string>();
    
    // Old Testament specific stats
    let oldTestamentTotal = 0;
    let oldTestamentMemorized = 0;
    
    // New Testament specific stats
    let newTestamentTotal = 0;
    let newTestamentMemorized = 0;
    
    // Go through each book in the Bible data
    Object.entries(BIBLE_DATA).forEach(([bookName, bookData]) => {
      const bookStats = this.bibleTrackerService.calculateBookStats(bookName);
      
      // Add to overall counts
      memorizedVerses += bookStats.memorizedVerses;
      completedChapters += bookStats.completedChapters;
      
      // Mark book as having memorization if any verses are memorized
      if (bookStats.memorizedVerses > 0) {
        booksWithMem.add(bookName);
      }
      
      // Add to testament specific counts
      if (bookData.testament === 'Old Testament') {
        oldTestamentTotal += bookData.totalVerses;
        oldTestamentMemorized += bookStats.memorizedVerses;
      } else if (bookData.testament === 'New Testament') {
        newTestamentTotal += bookData.totalVerses;
        newTestamentMemorized += bookStats.memorizedVerses;
      }
    });
    
    // Update component properties
    this.totalMemorizedVerses = memorizedVerses;
    this.totalCompletedChapters = completedChapters;
    this.booksWithMemorization = booksWithMem.size;
    
    // Calculate percentages
    this.overallPercentComplete = Math.round((memorizedVerses / this.totalBibleVerses) * 100) || 0;
    this.chapterPercentComplete = Math.round((completedChapters / this.totalBibleChapters) * 100) || 0;
    this.bookPercentComplete = Math.round((booksWithMem.size / this.totalBibleBooks) * 100) || 0;
    
    // Calculate testament percentages
    this.oldTestamentPercent = Math.round((oldTestamentMemorized / oldTestamentTotal) * 100) || 0;
    this.newTestamentPercent = Math.round((newTestamentMemorized / newTestamentTotal) * 100) || 0;
  }
}
