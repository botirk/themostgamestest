import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app.js';

export default () => configureStore({
  reducer: { app: appReducer },
});