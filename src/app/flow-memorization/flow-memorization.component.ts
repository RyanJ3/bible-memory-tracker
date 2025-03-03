// src/app/flow-memorization/flow-memorization.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flow-memorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flow-memorization.component.html',
  styleUrls: ['./flow-memorization.component.scss']
})
export class FlowMemorizationComponent implements OnInit {
  input: string = `Psalm 23

1 The Lord is my shepherd, I lack nothing.
2 He makes me lie down in green pastures,
he leads me beside quiet waters,
3 he refreshes my soul.
He guides me along the right paths
for his name's sake.
4 Even though I walk
through the darkest valley,
I will fear no evil,
for you are with me;
your rod and your staff,
they comfort me.
5 You prepare a table before me
in the presence of my enemies.
You anoint my head with oil;
my cup overflows.
6 Surely your goodness and love will follow me
all the days of my life,
and I will dwell in the house of the Lord
forever.`;
  output: string = '';
  bookTitle: string = 'Psalms';
  chapter: string = '23';
  isLoading: boolean = false;
  isProcessed: boolean = false;
  verses: any[] = [];

  ngOnInit(): void {
    this.handleFormat();
  }

  // Function to reduce text (only first letter of each word)
  reduceText(text: string): string {
    const lines = text.split('\n');
    const processedLines: string[] = [];

    const pattern = /[a-zA-Z]+/g;

    for (let i = 0; i < lines.length; i++) {
      const processed = lines[i].replace(pattern, match => match.charAt(0));
      processedLines.push(processed);
    }

    return processedLines.join('\n');
  }

  // Function to parse verses into objects
  parseVerses(text: string): any[] {
    const lines = text.split('\n');
    const verses: any[] = [];
    let currentVerse = '';
    let currentVerseNum = '';
    let headerText = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      const verseMatch = line.match(/^(\d+:\d+|\d+)\s+(.*)$/);

      if (verseMatch) {
        if (currentVerse) {
          verses.push({
            number: currentVerseNum,
            text: currentVerse.trim()
          });
        } else if (headerText && !verses.length) {
          verses.push({
            number: "Header",
            text: headerText.trim()
          });
        }

        currentVerseNum = verseMatch[1];
        currentVerse = verseMatch[2];
      } else if (currentVerseNum) {
        currentVerse += ' ' + line;
      } else {
        if (headerText) headerText += ' ';
        headerText += line;
      }
    }

    if (currentVerse) {
      verses.push({
        number: currentVerseNum,
        text: currentVerse.trim()
      });
    } else if (headerText && !verses.length) {
      verses.push({
        number: "Header",
        text: headerText.trim()
      });
    }

    return verses;
  }

  handleFormat(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.output = this.reduceText(this.input);
      this.verses = this.parseVerses(this.output);
      this.isLoading = false;
      this.isProcessed = true;
    }, 300);
  }

  getVerseChunks(): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < this.verses.length; i += 5) {
      chunks.push(this.verses.slice(i, i + 5));
    }
    return chunks;
  }
}
