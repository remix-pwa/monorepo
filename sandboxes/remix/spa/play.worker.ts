/// <reference path="./test2.d.ts" />

export const name = "John Doe";
export function greet() {
  return `Hello, ${name}`;
}
export class Person {
  constructor(name) {
    this.name = name;
  }
}