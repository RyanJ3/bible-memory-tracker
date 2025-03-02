// models.ts - Contains all the data models for the application

export class BibleBook {
  testament: string;
  bookName: string;
  group: string;
  chapters: number[];
  totalChapters: number;
  totalVerses: number;

  constructor(testament: string, bookName: string, group: string, chapters: number[]) {
    this.testament = testament;
    this.bookName = bookName;
    this.group = group;
    this.chapters = chapters;
    this.totalChapters = chapters.length;
    this.totalVerses = this.getTotalVerses();
  }

  getTotalVerses(): number {
    return this.chapters.reduce((sum, verses) => sum + verses, 0);
  }
}

export interface ChapterProgress {
  chapter: number;
  memorizedVerses: number;
  inProgress: boolean;
  completed: boolean;
}

export interface BookProgress {
  [key: string]: ChapterProgress[];
}

export interface GroupStats {
  percentComplete: number;
  completedChapters: number;
  totalChapters: number;
}

export interface BookStats {
  percentComplete: number;
  memorizedVerses: number;
  totalVerses: number;
  completedChapters: number;
  inProgressChapters: number;
}

export const BIBLE_DATA: { [key: string]: BibleBook } = {
  Genesis: new BibleBook("Old Testament", "Genesis", "Torah", [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26]),
  Exodus: new BibleBook("Old Testament", "Exodus", "Torah", [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38]),
  Leviticus: new BibleBook("Old Testament", "Leviticus", "Torah", [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34]),
  Psalms: new BibleBook("Old Testament", "Psalms", "Wisdom", [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6]),
  Proverbs: new BibleBook("Old Testament", "Proverbs", "Wisdom", [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31]),
  Job: new BibleBook("Old Testament", "Job", "Wisdom", [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17]),
  Isaiah: new BibleBook("Old Testament", "Isaiah", "Prophets", [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24]),
  Jeremiah: new BibleBook("Old Testament", "Jeremiah", "Prophets", [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34]),
  Ezekiel: new BibleBook("Old Testament", "Ezekiel", "Prophets", [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35]),
  Matthew: new BibleBook("New Testament", "Matthew", "Gospels", [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20]),
  Mark: new BibleBook("New Testament", "Mark", "Gospels", [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20]),
  Luke: new BibleBook("New Testament", "Luke", "Gospels", [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53]),
  John: new BibleBook("New Testament", "John", "Gospels", [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25]),
  Romans: new BibleBook("New Testament", "Romans", "Pauline Epistles", [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27]),
  "1 Corinthians": new BibleBook("New Testament", "1 Corinthians", "Pauline Epistles", [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24]),
  "2 Corinthians": new BibleBook("New Testament", "2 Corinthians", "Pauline Epistles", [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14])
};
