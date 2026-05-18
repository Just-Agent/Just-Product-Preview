import type { Logger } from "./types.js";

export const consoleLogger: Logger = {
  info(message: string) {
    console.log(message);
  },
  warn(message: string) {
    console.warn(message);
  },
  error(message: string) {
    console.error(message);
  }
};

export const silentLogger: Logger = {
  info() {},
  warn() {},
  error() {}
};
