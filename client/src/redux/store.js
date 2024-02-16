// Redux store
import { configureStore } from '@reduxjs/toolkit';
import {alertSlice} from './features/alertSlice';
import {appSlice} from './features/appSlice';
import { userSlice } from './features/userSlice';

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    app: appSlice.reducer,
    user: userSlice.reducer,
  },
})

