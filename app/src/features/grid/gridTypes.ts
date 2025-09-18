// grid/gridTypes.ts
export type GridCell = {
  id: string;
  coordinates: { latitude: number; longitude: number }[]; // رباعيات المربعات
  occupancy: number; // 0..capacity
  color?: string; // اللون الناتج عن occupancy (اختيارية)
  title?: string;
  meta?: Record<string, any>;
};

export type GridBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type GridState = {
  cells: GridCell[];
  bounds: GridBounds;
  step: number; // حجم الخلية بالعقود
};