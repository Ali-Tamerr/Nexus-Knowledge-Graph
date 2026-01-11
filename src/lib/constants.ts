export const BRAND_COLOR = '#3B82F6';

export const GROUP_COLORS: Record<number, string> = {
  0: '#8B5CF6',
  1: '#3B82F6',
  2: '#10B981',
  3: '#F59E0B',
  4: '#EF4444',
  5: '#EC4899',
  6: '#06B6D4',
  7: '#84CC16',
};

export const NODE_COLORS = [
  '#8B5CF6',
  '#3B82F6', 
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

export type RelationshipType = 'supports' | 'contradicts' | 'neutral';

export const RELATIONSHIP_COLORS: Record<string, string> = {
  supports: '#10B981',
  contradicts: '#EF4444',
  neutral: '#6B7280',
};
