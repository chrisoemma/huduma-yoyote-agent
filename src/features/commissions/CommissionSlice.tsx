import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authHeader } from '../../utils/auth-header';
import { API_URL } from '../../utils/config';

export const getActiveCommissions = createAsyncThunk(
    'commissions/getActiveCommissions',
    async (agentId) => {
        let header: any = await authHeader();
        const response = await fetch(`${API_URL}/agents/agent_active_commissions/${agentId}`, {
            method: 'GET',
            headers: header,
        });
        return (await response.json()) as any;
    },
);


export const getPaidCommissions = createAsyncThunk(
    'commissions/getPaidCommissions',
    async (agentId) => {
        let header: any = await authHeader();
        const response = await fetch(`${API_URL}/agents/agent_paid_commissions/${agentId}`, {
            method: 'GET',
            headers: header,
        });
        return (await response.json()) as any;
    },
);

const CommissionSlice = createSlice({
    name: 'commissions',
    initialState: {
        activeCommissions: [],
        paidCommissions: [],
        loading: false,
    },
    reducers: {
        clearMessage(state: any) {
            state.status = null;
        },
    },
    extraReducers: builder => {


        builder.addCase(getActiveCommissions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getActiveCommissions.fulfilled, (state, action) => {
            
            if (action.payload.status) {
                state.activeCommissions = action.payload.data.commissions;
            }
            state.loading = false;
        });
        builder.addCase(getActiveCommissions.rejected, (state, action) => {
            console.log('Rejected');
            console.log(action.error);
            state.loading = false;
        });
        //paid 

        builder.addCase(getPaidCommissions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getPaidCommissions.fulfilled, (state, action) => {

            if (action.payload.status) {
                state.paidCommissions = action.payload.data.commissions;
            }
            state.loading = false;
        });
        builder.addCase(getPaidCommissions.rejected, (state, action) => {
            console.log('Rejected');
            console.log(action.error);
            state.loading = false;
        });
    },
});

export const { clearMessage } = CommissionSlice.actions;

export default CommissionSlice.reducer;