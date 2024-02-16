// appSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    dopen: true,
  },
  reducers: {
    updateOpen: (state, action) => {
      state.dopen = action.payload;
    },
  },
});

export const { updateOpen } = appSlice.actions;

