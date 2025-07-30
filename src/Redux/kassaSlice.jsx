import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

export const kassaSlice = createSlice({
    name: 'kassa',
    initialState,
    reducers: {
        addToKassa: (state, action) => {
        state.items =[...state.items, action.payload]
        },
        removeFromKassa: (state, action) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            let newKassa = [...state.items];
            if(index < 0){
                newKassa.splice(index,1);
            }else{
                console.warn(`Cant remove Ls (id: ${action.payload.id}) as its not in your scanned Kassa`)
            }
            state.items = newKassa;
        },
        clearAllKassa: (state) => {
            state.items =[]
            },
    },
})

// Action creators are generated for each case reducer function
export const { addToKassa, removeFromKassa, clearAllKassa } = kassaSlice.actions


export const selectKassaItems = (state) => state.kassa.items;

export const selectKassaItemsWithId=(state, id) => state.kassa.items.filter((item)=> item.id === id);

export const selectKassaTotal=(state)=>
    state.kassa.items.reduce((total,item)=> total += ((item.price)*1),0);              //(item.price)*1 cuz item.price is string. *1 to convert into number

export default kassaSlice.reducer