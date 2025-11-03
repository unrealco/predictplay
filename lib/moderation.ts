export const DISALLOWED = ["self-harm", "illegal", "explicit sexual content", "incitement"];

export function isAllowed(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  return !DISALLOWED.some(k => text.includes(k));
}
