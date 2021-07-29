/* eslint-disable no-param-reassign */
// because it is required
import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    userStr: '',
    csv: undefined,
    state: 'waiting', // waiting, loading
    error: undefined,
    tableData: undefined,
  },
  reducers: {
    saveCsv(state, action) {
      state.csv = action.payload;
    },
    saveUserStr(state, action) {
      state.userStr = action.payload;
    },
    startLoading(state) {
      state.tableData = undefined;
      state.csv = undefined;
      state.state = 'loading';
      state.error = undefined;
    },
    successLoading(state, action) {
      state.tableData = action.payload;
      state.state = 'waiting';
    },
    errorLoading(state, action) {
      state.state = 'waiting';
      state.error = action.payload;
    },
  },
});

export const {
  saveCsv, saveUserStr, startLoading, successLoading, errorLoading,
} = appSlice.actions;
export default appSlice.reducer;
