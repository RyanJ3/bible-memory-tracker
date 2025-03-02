// bible-tracker.service.ts - Service for managing Bible memorization data with backend simulation
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { BibleBook, ChapterProgress, BookProgress, GroupStats, BookStats, BIBLE_DATA } from './models';

@Injectable({
  providedIn: 'root'
})
export class BibleTrackerService {
  private progressSubject = new BehaviorSubject<BookProgress>({});
  public progress$ = this.progressSubject.asObservable();

  // Simulated backend latency (in ms)
  private apiLatency = 300;

  constructor() {
    this.loadProgress();
  }

  /**
   * Load progress from simulated backend API
   */
  private loadProgress(): void {
    // Simulate API call with dummy data
    this.fetchProgressFromAPI().subscribe(
      (progress) => {
        this.progressSubject.next(progress);
      },
      (error) => {
        console.error('Error loading progress data:', error);
        // In case of error, initialize with empty progress
        this.progressSubject.next(this.initializeEmptyProgress());
      }
    );
  }

  /**
   * Simulates fetching progress data from a backend API
   */
  private fetchProgressFromAPI(): Observable<BookProgress> {
    // This is where you would make your actual API call in the future
    // For now, we're returning dummy data with a simulated delay

    // Create some sample progress data for demonstration
    const dummyProgress = this.initializeEmptyProgress();

    // Add some progress to John
    if (dummyProgress['John'] && dummyProgress['John'].length > 0) {
      // Chapter 1 completed
      dummyProgress['John'][0] = {
        chapter: 1,
        memorizedVerses: 51, // All verses in John 1
        inProgress: false,
        completed: true
      };

      // Chapter 2 in progress
      dummyProgress['John'][1] = {
        chapter: 2,
        memorizedVerses: 15, // Partial completion of John 2
        inProgress: true,
        completed: false
      };

      // Chapter 3 in progress
      dummyProgress['John'][2] = {
        chapter: 3,
        memorizedVerses: 20, // Partial completion of John 3
        inProgress: true,
        completed: false
      };
    }

    // Add some progress to Psalms
    if (dummyProgress['Psalms'] && dummyProgress['Psalms'].length > 0) {
      // Psalm A few completed psalms
      for (let i = 0; i < 10; i++) {
        if (dummyProgress['Psalms'][i]) {
          dummyProgress['Psalms'][i] = {
            chapter: i + 1,
            memorizedVerses: BIBLE_DATA['Psalms'].chapters[i], // Complete chapter
            inProgress: false,
            completed: true
          };
        }
      }
    }

    // Add some progress to Romans
    if (dummyProgress['Romans'] && dummyProgress['Romans'].length > 0) {
      // Romans 8 completed
      dummyProgress['Romans'][7] = {
        chapter: 8,
        memorizedVerses: 39, // All verses in Romans 8
        inProgress: false,
        completed: true
      };
    }

    // Simulate network delay
    return of(dummyProgress).pipe(
      delay(this.apiLatency)
    );
  }

  /**
   * Simulates saving progress data to a backend API
   */
  private saveProgressToAPI(progress: BookProgress): Observable<boolean> {
    // This is where you would make your actual API call in the future
    // For now, we're just simulating a successful save with a delay
    console.log('Saving progress to API:', progress);
    return of(true).pipe(
      delay(this.apiLatency)
    );
  }

  private initializeEmptyProgress(): BookProgress {
    const initialProgress: BookProgress = {};
    Object.keys(BIBLE_DATA).forEach(bookName => {
      const book = BIBLE_DATA[bookName];
      initialProgress[bookName] = Array(book.totalChapters).fill(null).map((_, i) => ({
        chapter: i + 1,
        memorizedVerses: 0,
        inProgress: false,
        completed: false
      }));
    });
    return initialProgress;
  }

  public getTestaments(): string[] {
    return [...new Set(Object.values(BIBLE_DATA).map(book => book.testament))].sort();
  }

  public getGroupsInTestament(testament: string): string[] {
    return [...new Set(
      Object.values(BIBLE_DATA)
        .filter(book => book.testament === testament)
        .map(book => book.group)
    )].sort();
  }

  public getBooksInGroup(group: string): { [key: string]: BibleBook } {
    return Object.entries(BIBLE_DATA)
      .filter(([_, book]) => book.group === group)
      .reduce((acc, [name, book]) => {
        acc[name] = book;
        return acc;
      }, {} as { [key: string]: BibleBook });
  }

  public calculateGroupStats(group: string): GroupStats {
    let groupMemorizedVerses = 0;
    let groupTotalVerses = 0;
    let groupCompletedChapters = 0;
    let groupTotalChapters = 0;
    const currentProgress = this.progressSubject.value;

    Object.entries(BIBLE_DATA)
      .filter(([_, book]) => book.group === group)
      .forEach(([name, book]) => {
        groupTotalVerses += book.totalVerses;
        groupTotalChapters += book.totalChapters;
        if (currentProgress[name]) {
          currentProgress[name].forEach(chapter => {
            if (chapter) {
              groupMemorizedVerses += chapter.memorizedVerses || 0;
              if (chapter.completed) {
                groupCompletedChapters++;
              }
            }
          });
        }
      });

    return {
      percentComplete: groupTotalVerses ? Math.round((groupMemorizedVerses / groupTotalVerses) * 100) : 0,
      completedChapters: groupCompletedChapters,
      totalChapters: groupTotalChapters
    };
  }

  public calculateTestamentStats(testament: string): { percentComplete: number } {
    let testamentMemorizedVerses = 0;
    let testamentTotalVerses = 0;
    const currentProgress = this.progressSubject.value;

    Object.entries(BIBLE_DATA)
      .filter(([_, book]) => book.testament === testament)
      .forEach(([name, book]) => {
        testamentTotalVerses += book.totalVerses;
        if (currentProgress[name]) {
          currentProgress[name].forEach(chapter => {
            if (chapter) {
              testamentMemorizedVerses += chapter.memorizedVerses || 0;
            }
          });
        }
      });

    return {
      percentComplete: testamentTotalVerses
        ? Math.round((testamentMemorizedVerses / testamentTotalVerses) * 100)
        : 0
    };
  }

  public calculateBookStats(bookName: string): BookStats {
    const book = BIBLE_DATA[bookName];
    const currentProgress = this.progressSubject.value;
    const bookProgress = currentProgress[bookName];

    if (!book || !bookProgress) {
      return {
        percentComplete: 0,
        memorizedVerses: 0,
        totalVerses: 0,
        completedChapters: 0,
        inProgressChapters: 0
      };
    }

    const memorizedVerses = bookProgress.reduce((sum, ch) => sum + (ch?.memorizedVerses || 0), 0);
    const completedChapters = bookProgress.filter(ch => ch?.completed).length;
    const inProgressChapters = bookProgress.filter(ch => ch?.inProgress && !ch?.completed).length;

    return {
      percentComplete: book.totalVerses ? Math.round((memorizedVerses / book.totalVerses) * 100) : 0,
      memorizedVerses,
      totalVerses: book.totalVerses,
      completedChapters,
      inProgressChapters
    };
  }

  public incrementVerses(bookName: string, chapterIndex: number): void {
    const book = BIBLE_DATA[bookName];
    if (!book) return;

    const maxVerses = book.chapters[chapterIndex];
    const currentProgress = { ...this.progressSubject.value };

    // Ensure the book entry exists
    if (!currentProgress[bookName]) {
      currentProgress[bookName] = Array(book.totalChapters).fill(null).map((_, i) => ({
        chapter: i + 1,
        memorizedVerses: 0,
        inProgress: false,
        completed: false
      }));
    }

    // Ensure chapter entry exists and is valid
    if (!currentProgress[bookName][chapterIndex]) {
      currentProgress[bookName][chapterIndex] = {
        chapter: chapterIndex + 1,
        memorizedVerses: 0,
        inProgress: false,
        completed: false
      };
    }

    const chapter = currentProgress[bookName][chapterIndex];

    if (chapter.memorizedVerses < maxVerses) {
      currentProgress[bookName][chapterIndex] = {
        ...chapter,
        memorizedVerses: chapter.memorizedVerses + 1,
        inProgress: true,
        completed: chapter.memorizedVerses + 1 === maxVerses
      };

      this.progressSubject.next(currentProgress);
      this.saveProgressToAPI(currentProgress).subscribe();
    }
  }

  public decrementVerses(bookName: string, chapterIndex: number): void {
    const book = BIBLE_DATA[bookName];
    if (!book) return;

    const currentProgress = { ...this.progressSubject.value };

    // Handle case where book or chapter doesn't exist yet
    if (!currentProgress[bookName] || !currentProgress[bookName][chapterIndex]) {
      return;
    }

    const chapter = currentProgress[bookName][chapterIndex];

    if (chapter.memorizedVerses > 0) {
      currentProgress[bookName][chapterIndex] = {
        ...chapter,
        memorizedVerses: chapter.memorizedVerses - 1,
        inProgress: chapter.memorizedVerses - 1 > 0,
        completed: false
      };

      this.progressSubject.next(currentProgress);
      this.saveProgressToAPI(currentProgress).subscribe();
    }
  }

  public updateChapterProgress(bookName: string, chapterIndex: number, newValue: number): void {
    const book = BIBLE_DATA[bookName];
    if (!book) return;

    const currentProgress = { ...this.progressSubject.value };

    // Ensure the book entry exists
    if (!currentProgress[bookName]) {
      currentProgress[bookName] = Array(book.totalChapters).fill(null).map((_, i) => ({
        chapter: i + 1,
        memorizedVerses: 0,
        inProgress: false,
        completed: false
      }));
    }

    // Ensure chapter entry exists
    if (!currentProgress[bookName][chapterIndex]) {
      currentProgress[bookName][chapterIndex] = {
        chapter: chapterIndex + 1,
        memorizedVerses: 0,
        inProgress: false,
        completed: false
      };
    }

    currentProgress[bookName][chapterIndex] = {
      ...currentProgress[bookName][chapterIndex],
      memorizedVerses: newValue,
      inProgress: newValue > 0,
      completed: newValue === book.chapters[chapterIndex]
    };

    this.progressSubject.next(currentProgress);
    this.saveProgressToAPI(currentProgress).subscribe();
  }

  public resetChapter(bookName: string, chapterIndex: number): void {
    const book = BIBLE_DATA[bookName];
    if (!book) return;

    const currentProgress = { ...this.progressSubject.value };

    // Ensure the book entry exists
    if (!currentProgress[bookName]) {
      currentProgress[bookName] = Array(book.totalChapters).fill(null).map((_, i) => ({
        chapter: i + 1,
        memorizedVerses: 0,
        inProgress: false,
        completed: false
      }));
    }

    currentProgress[bookName][chapterIndex] = {
      chapter: chapterIndex + 1,
      memorizedVerses: 0,
      inProgress: false,
      completed: false
    };

    this.progressSubject.next(currentProgress);
    this.saveProgressToAPI(currentProgress).subscribe();
  }

  public resetBook(bookName: string): void {
    const book = BIBLE_DATA[bookName];
    if (!book) return;

    const currentProgress = { ...this.progressSubject.value };
    currentProgress[bookName] = Array(book.totalChapters).fill(null).map((_, i) => ({
      chapter: i + 1,
      memorizedVerses: 0,
      inProgress: false,
      completed: false
    }));

    this.progressSubject.next(currentProgress);
    this.saveProgressToAPI(currentProgress).subscribe();
  }

  public resetGroup(group: string): void {
    const currentProgress = { ...this.progressSubject.value };

    Object.entries(BIBLE_DATA)
      .filter(([_, book]) => book.group === group)
      .forEach(([name, book]) => {
        currentProgress[name] = Array(book.totalChapters).fill(null).map((_, i) => ({
          chapter: i + 1,
          memorizedVerses: 0,
          inProgress: false,
          completed: false
        }));
      });

    this.progressSubject.next(currentProgress);
    this.saveProgressToAPI(currentProgress).subscribe();
  }

  public resetTestament(testament: string): void {
    const currentProgress = { ...this.progressSubject.value };

    Object.entries(BIBLE_DATA)
      .filter(([_, book]) => book.testament === testament)
      .forEach(([name, book]) => {
        currentProgress[name] = Array(book.totalChapters).fill(null).map((_, i) => ({
          chapter: i + 1,
          memorizedVerses: 0,
          inProgress: false,
          completed: false
        }));
      });

    this.progressSubject.next(currentProgress);
    this.saveProgressToAPI(currentProgress).subscribe();
  }
}
