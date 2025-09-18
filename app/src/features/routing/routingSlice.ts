// routing/routingSlice.ts
import { GridBounds } from "../grid/gridTypes"; // استخدام اختيارى لو ربطنا Grid مع Routing

export type RouteStep = {
  id: string;
  name: string;
  params?: Record<string, any>;
};

export type RoutingState = {
  path: string[];
  history: RouteStep[];
  current?: RouteStep;
  bounds?: GridBounds;
};

const initialState: RoutingState = {
  path: ["Map"],
  history: [],
  current: { id: "step_map", name: "Map" },
};

export const routingReducer = (
  state: RoutingState = initialState,
  action: any
): RoutingState => {
  switch (action?.type) {
    case "routing/navigate":
      const nextPath = [...state.path, action.payload?.to || "Unknown"];
      const nextStep: RouteStep = {
        id: `step_${action.payload?.to}`,
        name: action.payload?.to,
      };
      return {
        ...state,
        path: nextPath,
        history: [...state.history, nextStep],
        current: nextStep,
      };
    case "routing/back":
      const newPath =
        state.path.length > 1 ? state.path.slice(0, -1) : state.path;
      const currentFromHistory = state.history[state.history.length - 1];
      return {
        ...state,
        path: newPath,
        current: currentFromHistory ?? state.current,
        history: state.history.length > 0 ? state.history.slice(0, -1) : [],
      };
    case "routing/reset":
      return initialState;
    default:
      return state;
  }
};
