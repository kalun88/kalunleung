export function makeDate(d: string | null | undefined): Date | null {
  if (!d) return null;
  try {
    return new Date(d.includes("T") ? d : d + "T00:00:00");
  } catch (e) {
    return null;
  }
}
