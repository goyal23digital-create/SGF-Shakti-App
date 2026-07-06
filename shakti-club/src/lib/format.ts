/** Indian-grouping number format: 24380 → "24,380", 130000 → "1,30,000" */
export function fmt(n: number): string {
  return n.toLocaleString('en-IN');
}
