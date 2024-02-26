import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getCommisionMonthly = createAsyncThunk(
    'charts/getCommisionMonthly',
    async ({agentId}:any) => {
      
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/agents/everyMonthlyCommision/${agentId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  const ChartSlice = createSlice({
    name: 'charts',
    initialState: {
        commissionChart:[],
        loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
       
      builder.addCase(getCommisionMonthly.pending, state => {
        state.loading = true;
      });
      builder.addCase(getCommisionMonthly.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.commissionChart = action.payload.data.requests_vs_sub_services;
        }
        state.loading = false;
      });
      builder.addCase(getCommisionMonthly.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });

    }
  });



  export const { clearMessage } = ChartSlice.actions;
  
  export default ChartSlice.reducer;