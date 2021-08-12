/* eslint-disable no-param-reassign */
// because it is required
import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    userStr: '',
    csv: undefined,
    state: 'waiting', // waiting, loading
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
    },
    successLoading(state, action) {
      state.tableData = action.payload;
      state.state = 'waiting';
    },
    errorLoading(state) {
      state.state = 'waiting';
    },
  },
});

export const {
  saveCsv, saveUserStr, startLoading, successLoading, errorLoading
} = appSlice.actions;
export default appSlice.reducer;
