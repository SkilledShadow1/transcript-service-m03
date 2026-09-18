import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

// Groupmates: Adam Kleinman, Skye Kaden, Alyssa Lin, Ryder Schmelzle
//
//
// LEGEND FOR REVIEWER ---------------->
// Mutant List
//   - Mutant 1: Killed
//   - Mutant 2: Killed
//   - Mutant 3: Killed
//   - Mutant 4: Killed
//   - Mutant 5: Innocuous
//   - Mutant 6: Killed
//   - Mutant 7: Innocuous
//
//

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  // Mutant 1 (AssignmentOperator)
  // src/transcript.service.ts:40:5
  // -       this._lastID += 1;
  // +       this._lastID -= 1;
  it('Kills Mutant 1. Student IDs should be in sequential, non-negative integers', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).toEqual(1);
    expect(id2).toEqual(2);
    expect(id3).toEqual(3);
  });

  // Mutant 2 (ArrayDeclaration)
  // src/transcript.service.ts:43:59
  // -       this._transcripts.push({ student: newStudent, grades: [] });
  // +       this._transcripts.push({ student: newStudent, grades: ["Stryker was here"] });
  it('Kills Mutant 2. After adding a new student, their transcript should contain 0 grades', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1).grades).toEqual([]);
  });
});

describe('nameToIDs', () => {
  // Mutant 3 (MethodExpression)
  //   src/transcript.service.ts:53:12
  // -       return this._transcripts
  // -         .filter(t => t.student.studentName === studentName)
  // +       return this._transcripts

  // Mutant 4 (ConditionalExpression)
  // src/transcript.service.ts:54:20
  // -         .filter(t => t.student.studentName === studentName)
  // +         .filter(t => true)
  it('Kills Mutants 3 and 4. Getting an ID for a specific student name should only' +
     'return IDs for students with that name', () => {
    db.addStudent('blair');
    db.addStudent('corey');
    db.addStudent('del');
    expect(db.nameToIDs('blair').length).toEqual(1);
  });
});

// Mutant 5 (StringLiteral): INNOCUOUS MUTANT
// src/transcript.service.ts:70:23
// -         throw new Error(`Transcript not found for student with ID ${id}`);
// +         throw new Error(``);

// EXPLANATION: Changing the internal error message being thrown doesn't actually affect getting the transcripts

describe('getGrade', () => {
  // Mutant 6 (ConditionalExpression)
  // src/transcript.service.ts:121:52
  // -       const course = transcript.grades.find(grade => grade.course === courseName);
  // +       const course = transcript.grades.find(grade => true);
  it('Kills Mutant 6. If specifying a course name, You should only be getting grades from courses with that name', () => {
    const id1 = db.addStudent('blair');
    db.addGrade(id1, 'Science', 95);
    db.addGrade(id1, 'Math', 83);
    expect(db.getGrade(id1, 'Math').course).toEqual('Math');
  });
});

// Mutant 7 (StringLiteral): INNOCUOUS MUTANT
// src/transcript.service.ts:125:9
// -           `Grades for course ${courseName} not found for student ${transcript.student.studentName} (ID: ${id})`,
// +           ``,

// EXPLANATION: Like Mutant 5, changing the text of an internal error message doesn't affect how getGrade functions.
