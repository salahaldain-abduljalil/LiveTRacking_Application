import { configureStore } from '@reduxjs/toolkit';
import { gridReducer } from '../features/grid/gridSlice';
import { routingReducer } from '../features/routing/routingSlice';

export const store = configureStore({
  reducer: {
    grid: gridReducer,
    routing: routingReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
