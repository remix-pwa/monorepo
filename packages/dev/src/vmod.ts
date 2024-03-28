export const id = (name: string) => `virtual:${name}`;
export const resolve = (id: string) => `\0${id}`;
export const url = (id: string) => `/@id/__x00__${id}`;
