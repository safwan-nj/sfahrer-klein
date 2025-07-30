import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

export const scannedInvoicesSlice = createSlice({
    name: 'scannedInvoices',
    initialState,
    reducers: {
        addToInvoices: (state, action) => {
        state.items =[...state.items, action.payload]
        },
        removeFromInvoices: (state, action) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            let newInvoices = [...state.items];
            if(index < 0){
                newInvoices.splice(index,1);
            }else{
                console.warn(`Cant remove Ls (id: ${action.payload.id}) as its not in your scanned Invoices`)
            }
            state.items = newInvoices;
        },
        clearAllInvoices: (state) => {
            state.items =[]
            },
    },
})

// Action creators are generated for each case reducer function
export const { addToInvoices, removeFromInvoices, clearAllInvoices } = scannedInvoicesSlice.actions


export const selectInvoicesItems = (state) => state.scannedInvoices.items;

export const selectInvoicesItemsWithId=(state, id) => state.invoices.items.filter((item)=> item.id === id);

export const selectInvoicesTotal=(state)=>
    state.invoices.items.reduce((total,item)=> total += ((item.price)*1),0);              //(item.price)*1 cuz item.price is string. *1 to convert into number

export default invoicesSlice.reducer