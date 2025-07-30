import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    request: []
}

export const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        setrequest:(state, action)=>{
            state.request = [...state.request,action.payload];
            //console.log(state.request.title);
        },
        clearAllrequests: (state) => {
            state.request =[]
            },
    },
});

// Action creators are generated for each case reducer function
export const { setrequest, clearAllrequests } = requestSlice.actions;


export const selectRequest = (state) => state.request.request;

export default requestSlice.reducer