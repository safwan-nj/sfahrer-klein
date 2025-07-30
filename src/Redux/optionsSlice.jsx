import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    options: []
}

export const optionsSlice = createSlice({
    name: "options",
    initialState,
    reducers: {
        setOptions:(state, action)=>{
            state.options = [...state.options,action.payload];
            //console.log(state.restaurant.title);
        },
        clearAllOptions: (state) => {
            state.options =[]
            },
    },
});

// Action creators are generated for each case reducer function
export const { setOptions, clearAllOptions } = optionsSlice.actions;


export const selectOptions = (state) => state.options.options;

export default optionsSlice.reducer