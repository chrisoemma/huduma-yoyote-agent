import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from '../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';
import { RootState } from '../../app/rootState';

export const getTermsDoc = createAsyncThunk(
  'terms/getTermsDoc',
  async (_,{getState}) => {

    const selectedLanguage = (getState() as RootState).language.selectedLanguage;
    const header = await authHeader(selectedLanguage);
    const response = await fetch(`${API_URL}/terms-links/active`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);


const TermsOfServiceSlice = createSlice({
  name: 'terms',
  initialState: {
    term:{},
    loading: false,
  },
  reducers: {
    clearMessage(state: any) {
      state.status = null;
    },
  },
  extraReducers: builder => {

    //businesses
    builder.addCase(getTermsDoc.pending, state => {
    
      state.loading = true;
    });
    builder.addCase(getTermsDoc.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.terms = action.payload.data;
      }
      state.loading = false;
    });
    builder.addCase(getTermsDoc.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
    });

  },
});

export const { clearMessage } = TermsOfServiceSlice.actions;

export default TermsOfServiceSlice.reducer;