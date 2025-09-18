// routing/routingApi.ts
import { RoutingState } from './routingSlice';

type NavigatePayload = {
  to: string;
  params?: Record<string, any>;
};

export const createMockRoutingApi = () => {
  let state: RoutingState = {
    path: ['Map'],
    history: [],
    current: { id: 'step_Map', name: 'Map' },
  };

  const navigate = (payload: NavigatePayload) => {
    state = {
      ...state,
      path: [...state.path, payload.to],
      history: [...state.history, { id: `step_${payload.to}`, name: payload.to, params: payload.params }],
      current: { id: `step_${payload.to}`, name: payload.to, params: payload.params },
    };
    return state;
  };

  const back = () => {
    if (state.path.length <= 1) return state;
    const newPath = state.path.slice(0, -1);
    const newHistory = state.history.slice(0, -1);
    const current =
      newHistory.length > 0
        ? newHistory[newHistory.length - 1]
        : { id: 'step_Map', name: 'Map' };
    state = { ...state, path: newPath, history: newHistory, current };
    return state;
  };

  const reset = () => {
    state = {
      path: ['Map'],
      history: [],
      current: { id: 'step_Map', name: 'Map' },
    };
    return state;
  };

  return { navigate, back, reset, getState: () => state };
};

// مثال استخدام:
// const api = createMockRoutingApi();
// api.navigate({ to: 'Destination' });
// api.back();
// api.reset();