import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

function updateStatus(state: any, status: any) {
    if (status === '' || status === null) {
        state.status = '';
        return;
    }

    if (status.error) {
        state.status = status.error;
        return;
    }

    state.status = 'Request failed. Please try again.';
    return;
}


export const getClients = createAsyncThunk(
    'registers/getClients',
    async ({ agentId }: any) => {
              console.log('agentid',agentId)
        let header: any = await authHeader();
        const response = await fetch(`${API_URL}/agents/clients/${agentId}`, {
            method: 'GET',
            headers: header,
        });
        return (await response.json()) as any;
    },
);

export const getProviders = createAsyncThunk(
    'registers/getProviders',
    async ({ agentId }: any) => {

        let header: any = await authHeader();
        const response = await fetch(`${API_URL}/agents/providers/${agentId}`, {
            method: 'GET',
            headers: header,
        });
        return (await response.json()) as any;
    },
);


export const createClient = createAsyncThunk(
    'registers/createClient',
    async ({ data, agentId }: any) => {
        const response = await fetch(`${API_URL}/agents/store_client/${agentId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    },
);

export const deleteClient = createAsyncThunk(
    'registers/deleteClient',
    async ({ clientId }: any) => {
        try {
            const header: any = await authHeader();
            const response = await fetch(`${API_URL}/agents/delete_client/${clientId}`, {
                method: 'DELETE',
                headers: header,
            });

            if (!response.status) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete task');
            }

            return (await response.json());
        } catch (error) {
            throw error;
        }
    }
);



export const updateClient = createAsyncThunk(
    'registers/updateClient',
    async ({ data, clientId }: any) => {
        console.log('clientId', clientId);
        const response = await fetch(`${API_URL}/agents/update_client/${clientId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    }
);



export const deleteProvider = createAsyncThunk(
    'registers/deleteProvider',
    async ({ providerId }: any) => {
        try {
            const header: any = await authHeader();
            const response = await fetch(`${API_URL}/agents/delete_provider/${providerId}`, {
                method: 'DELETE',
                headers: header,
            });

            if (!response.status) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete task');
            }

            return (await response.json());
        } catch (error) {
            throw error;
        }
    }
);



export const updateProvider = createAsyncThunk(
    'registers/updateProvider',
    async ({ data, providerId }: any) => {
        console.log('providerId', providerId);
        const response = await fetch(`${API_URL}/agents/update_provider/${providerId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    }
);


export const createProvider = createAsyncThunk(
    'registers/createProvider',
    async ({ data, agentId }: any) => {

        console.log('agent_id',agentId);
        const response = await fetch(`${API_URL}/agents/store_provider/${agentId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    },
);




const RegisterSlice = createSlice({
    name: 'registers',
    initialState: {
        clients: [],
        client:{},
        providers:[],
        provider:{},
        status:'',
        loading: false,
    },
    reducers: {
        clearMessage(state: any) {
            state.status = null;
        },
    },
    extraReducers: builder => {
             
        //get clients
        builder.addCase(getClients.pending, state => {
            console.log('Pending');
            state.loading = true;
        });
        builder.addCase(getClients.fulfilled, (state, action) => {
          //  console.log('Fulfilled case111',action.payload);
              
           
            if (action.payload.status) {
                state.clients = action.payload.data.clients.clients;
            }
            state.loading = false;
        });
        builder.addCase(getClients.rejected, (state, action) => {
            console.log('Rejected');
            state.loading = false;
        });


                  //get providers
        builder.addCase(getProviders.pending, state => {
            console.log('Pending');
            state.loading = true;
        });
        builder.addCase(getProviders.fulfilled, (state, action) => {
           // console.log('Fulfilled case111',action.payload);
              
           
            if (action.payload.status) {
                state.providers = action.payload.data.providers.providers;
            }
            state.loading = false;
        });
        builder.addCase(getProviders.rejected, (state, action) => {
            console.log('Rejected');
            state.loading = false;
        });



                  //create
        builder.addCase(createClient.pending, state => {
            console.log('Pending');
            state.loading = true;
            updateStatus(state, '');
        });
        builder.addCase(createClient.fulfilled, (state, action) => {

            state.loading = false;
            updateStatus(state, '');

            if (action.payload.status) {
                state.client = { ...action.payload.data.client };
                updateStatus(state, '');
            } else {
                updateStatus(state, action.payload.status);
            }

            state.clients.push(state.client);
        });
        builder.addCase(createClient.rejected, (state, action) => {
            console.log('Rejected');
            state.loading = false;
            updateStatus(state, '');
        });


        //provider

        builder.addCase(createProvider.pending, state => {
            console.log('Pending');
            state.loading = true;
            updateStatus(state, '');
        });
        builder.addCase(createProvider.fulfilled, (state, action) => {

            state.loading = false;
            updateStatus(state, '');

            if (action.payload.status) {
                state.provider = { ...action.payload.data.provider };
                updateStatus(state, '');
            } else {
                updateStatus(state, action.payload.status);
            }

            state.providers.push(state.provider);
        });
        builder.addCase(createProvider.rejected, (state, action) => {
            console.log('Rejected');
            state.loading = false;
            updateStatus(state, '');
        });



        builder.addCase(deleteClient.pending, (state) => {
            console.log('Delete client Pending');
            state.loading = true;
            updateStatus(state, '');
        });

        builder.addCase(deleteClient.fulfilled, (state, action) => {
            console.log('Delete client Fulfilled');
            const deletedClientId = action.payload.data.client.id;
            
            state.clients = state.clients.filter((client) => client.id !== deletedClientId);

            state.loading = false;
            updateStatus(state, '');
        });

        builder.addCase(deleteClient.rejected, (state, action) => {
            console.log('Delete Task Rejected');
            state.loading = false;
            updateStatus(state, '');
        });


        //update client

        builder.addCase(updateClient.pending, (state) => {
            console.log('Update Task Pending');
            state.loading = true;
            updateStatus(state, '');
        });

        builder.addCase(updateClient.fulfilled, (state, action) => {
            console.log('Update Task Fulfilled');

             console.log('action payload',action.payload);
            const updatedclient = action.payload.data.client;

            const clientIndex = state.clients.findIndex((client) => client.id === updatedclient.id);
            console.log('clientindex', clientIndex);
            if (clientIndex !== -1) {
                // Update the task in the array immutably
                state.clients = [
                    ...state.clients.slice(0, clientIndex),
                    updatedclient,
                    ...state.clients.slice(clientIndex + 1),
                ];
            }

            state.loading = false;
            updateStatus(state, '');
        });


        
        builder.addCase(updateClient.rejected, (state, action) => {
            console.log('Delete Task Rejected');
            state.loading = false;
            updateStatus(state, '');
        });


        builder.addCase(deleteProvider.pending, (state) => {
            console.log('Delete provider Pending');
            state.loading = true;
            updateStatus(state, '');
        });

        builder.addCase(deleteProvider.fulfilled, (state, action) => {
            console.log('Delete provider Fulfilled');
            const deletedproviderId = action.payload.data.provider.id;
            
            state.providers = state.providers.filter((provider) => provider.id !== deletedproviderId);

            state.loading = false;
            updateStatus(state, '');
        });

        builder.addCase(deleteProvider.rejected, (state, action) => {
            console.log('Delete Task Rejected');
            state.loading = false;
            updateStatus(state, '');
        });


        //update provider

        builder.addCase(updateProvider.pending, (state) => {
            console.log('Update Task Pending');
            state.loading = true;
            updateStatus(state, '');
        });

        builder.addCase(updateProvider.fulfilled, (state, action) => {
            console.log('Update Task Fulfilled');

          
            const updatedprovider = action.payload.data.provider;

            const providerIndex = state.providers.findIndex((provider) => provider.id === updatedprovider.id);
            console.log('providerindex', providerIndex);
            if (providerIndex !== -1) {
                // Update the task in the array immutably
                state.providers = [
                    ...state.providers.slice(0, providerIndex),
                    updatedprovider,
                    ...state.providers.slice(providerIndex + 1),
                ];
            }

            state.loading = false;
            updateStatus(state, '');
        });


        builder.addCase(updateProvider.rejected, (state, action) => {
            console.log('Delete provider Rejected');
            state.loading = false;
            updateStatus(state, '');
        });

    }
})

export const { clearMessage } = RegisterSlice.actions;

export default RegisterSlice.reducer;


