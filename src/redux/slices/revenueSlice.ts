import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RevenueState, Revenue } from '../../types';

const initialState: RevenueState = {
  revenues: [],
  isLoading: false,
  error: null,
  selectedMonth: new Date().toISOString().slice(0, 7),
};

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRevenues: (state, action: PayloadAction<Revenue[]>) => {
      state.revenues = action.payload;
      state.error = null;
    },
    addRevenue: (state, action: PayloadAction<Revenue>) => {
      state.revenues.unshift(action.payload);
    },
    updateRevenue: (state, action: PayloadAction<Revenue>) => {
      const index = state.revenues.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.revenues[index] = action.payload;
      }
    },
    deleteRevenue: (state, action: PayloadAction<string>) => {
      state.revenues = state.revenues.filter((r) => r.id !== action.payload);
    },
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setRevenues,
  addRevenue,
  updateRevenue,
  deleteRevenue,
  setSelectedMonth,
  setError,
  clearError,
} = revenueSlice.actions;
export default revenueSlice.reducer;