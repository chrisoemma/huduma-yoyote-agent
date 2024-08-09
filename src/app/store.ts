import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from '../features/auth/userSlice';
import RegisterSlice from '../features/registers/RegisterSlice';
import OnboardingSlice from '../features/onboarding/OnboardingSlice';
import languageSlice from '../costants/languageSlice';
import ThemeSlice from '../features/settings/ThemeSlice';
import ChartSlice from '../features/home/ChartSlice';
import CommissionSlice from '../features/commissions/CommissionSlice';
import AccountSlice from '../features/account/AccountSlice';
import professionsSlice from '../features/professionsSlice';
import LocationSlice from '../components/Location/LocationSlice';



const reducers = combineReducers({
  user: userReducer,
  registers:RegisterSlice,
  onboarding:OnboardingSlice,
  language:languageSlice,
  theme:ThemeSlice,
  charts:ChartSlice,
  commissions:CommissionSlice,
  account:AccountSlice,
  locations:LocationSlice,
  professions:professionsSlice
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};


const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({

  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
