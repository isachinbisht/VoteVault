import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import policyReducer from './policySlice';
import boothReducer from './boothSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    policy: policyReducer,
    booth: boothReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
