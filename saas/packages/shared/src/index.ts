export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
