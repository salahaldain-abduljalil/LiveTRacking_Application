// grid/gridSlice.ts
import { GridState, GridCell, GridBounds } from './gridTypes';

// نقطة بداية بسيطة للحالة
const initialBounds: GridBounds = {
  north: 25.0,
  south: 24.5,
  east: 46.9,
  west: 46.4,
};

const initialState: GridState = {
  cells: [],
  bounds: initialBounds,
  step: 0.01,
};


// helper: حيّز الخلية من الزوايا
const makeCellFromOrigin = (
  id: string,
  lat: number,
  lon: number,
  step: number
): GridCell => ({
  id,
  occupancy: Math.floor(Math.random() * 9), // قيمة افتراضية للتصوّر
  coordinates: [
    { latitude: lat, longitude: lon },
    { latitude: lat, longitude: lon + step },
    { latitude: lat + step, longitude: lon + step },
    { latitude: lat + step, longitude: lon },
  ],
  title: `Cell ${id}`,
});

// simple reducer-like functions (بدون مكتبة)
export const gridReducer = (state: GridState = initialState, action: any): GridState => {
  switch (action?.type) {
    case 'grid/reset':
      return { ...state, cells: [], bounds: initialBounds, step: 0.01 };
    case 'grid/generate':
      // action.payload: { bounds: GridBounds, step?: number }
      const bounds = action.payload?.bounds ?? state.bounds;
      const step = action.payload?.step ?? state.step;

      const newCells: GridCell[] = [];
      let idCounter = 0;
      for (let lat = bounds.south; lat < bounds.north; lat += step) {
        for (let lon = bounds.west; lon < bounds.east; lon += step) {
          newCells.push(makeCellFromOrigin(`cell_${idCounter++}`, lat, lon, step));
        }
      }
      return { ...state, cells: newCells, bounds };
    case 'grid/updateCell':
      // payload: { id, occupancy }
      return {
        ...state,
        cells: state.cells.map((c) =>
          c.id === action.payload?.id ? { ...c, occupancy: action.payload.occupancy } : c
        ),
      };
    default:
      return state;
  }
};

// مثال: تحديث اللون بناءً على occupancy (ليس ضمن state مباشرة)
export const colorForOccupancy = (occ: number, max = 9): string => {
  if (occ < max / 3) return 'rgba(34,197,94,0.6)'; // أخضر
  if (occ < (2 * max) / 3) return 'rgba(245,158,11,0.6)'; // برتقالي
  return 'rgba(239,68,68,0.6)'; // أحمر
};