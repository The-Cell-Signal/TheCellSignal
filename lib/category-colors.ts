export const CATEGORY_COLORS: Record<string, string> = {
  Partnerships: '#3A8549',
  Research: '#1B6B6B',
  Sustainability: '#7C9A3B',
  Company: '#B8862B'
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#231F20';
}
