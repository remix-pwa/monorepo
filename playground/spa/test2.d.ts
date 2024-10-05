// test2.d.ts

/// <reference lib="WebWorker" />

// Declare everything globally so users don’t have to import anything
declare const name: string;
declare function greet(): string;

declare class Person {
  constructor(name: string);
  name: string;
}

export {}; // To prevent this file from being treated as a script
