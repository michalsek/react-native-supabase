export function uniqueId() {
  return `${Date.now()}-${Math.random().toString(32).slice(2)}`;
}
