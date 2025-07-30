import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    customer: []
}

export const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomer:(state, action)=>{
            state.customer = [...state.customer,action.payload];
            //console.log(state.restaurant.title);
        },
        clearAllCustomers: (state) => {
            state.customer =[]
            },
    },
});

// Action creators are generated for each case reducer function
export const { setCustomer, clearAllCustomers } = customerSlice.actions;


export const selectCustomer = (state) => state.customer.customer;

export default customerSlice.reducer