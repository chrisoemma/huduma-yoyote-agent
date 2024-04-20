import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getAccount = createAsyncThunk(
  'requests/getAccount',
  async (userId) => {
    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/users/agent/${userId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);



export const deleteDocument = createAsyncThunk(
  'account/deleteDocument',
  async ({documentId}:any) => {
    try {
     
      const header: any = await authHeader();
      const response = await fetch(`${API_URL}/agents/documents/delete_document/${documentId}`, {
        method: 'DELETE',
        headers: header,
      });

      if (!response.status) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete document');
      }

      return (await response.json())
    } catch (error) {
      throw error;
    }
  }
);

export const getAgentDocumentToRegister = createAsyncThunk(
  'account/getAgentDocumentToRegister',
  async (id) => {
    console.log('agent-id',id);

    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/agents/agent_working_documents/${id}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);

export const getDocuments = createAsyncThunk(
  'account/getDocuments',
  async ({ agentId }: any) => {

    console.log('documemnyddId', agentId);
    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/agents/documents/${agentId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);


export const createDocument = createAsyncThunk(
  'account/createDocument',
  async ({data,agentId}:any) => {

    const response = await fetch(`${API_URL}/agents/documents/${agentId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) 
  },
);

function updateStatus(state: any, status: any) {
  if (status === '' || status === null) {
    state.status = '';
    return;
  }
}


const AccountSlice = createSlice({
  name: 'account',
  initialState: {
    account: {},
    documentToRegister: [],
    documents: [],
    document:{},
    loading: false,
  },
  reducers: {
    clearMessage(state: any) {
      state.status = null;
    },
  },
  extraReducers: builder => {

    //categories
    builder.addCase(getAccount.pending, state => {
      // console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getAccount.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.account = action.payload.data.account;
      }
      state.loading = false;
    });
    builder.addCase(getAccount.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
    });

    //data 

    builder.addCase(getAgentDocumentToRegister.pending, state => {
       console.log('Pending111111');
      state.loading = true;
    });
    builder.addCase(getAgentDocumentToRegister.fulfilled, (state, action) => {

      console.log('Full fielddddd');
       console.log('payload data',action.payload);

      if (action.payload.status) {
        state.documentToRegister = action.payload.data.documents;
      }
      state.loading = false;
    });
    builder.addCase(getAgentDocumentToRegister.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);

      state.loading = false;
    });



    //Documents

    builder.addCase(getDocuments.pending, state => {
      state.loading = true;
    });
    builder.addCase(getDocuments.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.documents = action.payload.data.documents;
      }
      state.loading = false;
    });
    builder.addCase(getDocuments.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
    });



      //create document

      builder.addCase(createDocument.pending, state => {
        console.log('Pending');
        state.loading = true;
        updateStatus(state, '');
      });
      builder.addCase(createDocument.fulfilled, (state, action) => {
           console.log('sucesss')
           console.log('dayaa',action.payload)
  
        state.loading = false;
        updateStatus(state, '');
  
        if (action.payload.status) {
            state.document = { ...action.payload.data.document };
            updateStatus(state, '');
        } else {
            updateStatus(state, action.payload.status);
        }
  
        state.documents.push(state.document);
  
      });
      builder.addCase(createDocument.rejected, (state, action) => {
        console.log('Rejected');
        state.loading = false;
        updateStatus(state, '');
      });


      //delete

      builder.addCase(deleteDocument.pending, (state) => {
    
        state.loading = true;
        updateStatus(state, '');
      });
  
      builder.addCase(deleteDocument.fulfilled, (state, action) => {
  
                console.log('action.payload.data', action.payload.data);
        const deletedDocumentId = action.payload.data.document.id;


            
        state.documents = state.documents.filter((document) => document.id !== deletedDocumentId);
  
        state.loading = false;
        updateStatus(state, '');
      });
  
      builder.addCase(deleteDocument.rejected, (state, action) => {
        console.log('Delete Business Rejected');
        state.loading = false;
        updateStatus(state, '');
      });
  },

});

export const { clearMessage } = AccountSlice.actions;

export default AccountSlice.reducer;