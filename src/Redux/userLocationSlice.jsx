import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
}

export const userLocationSlice = createSlice({
    name: 'userLocation',
    initialState,
    reducers: {
        addTouserLocation: (state, action) => {
        state.items =[...state.items, action.payload]
        },
        removeFromuserLocation: (state, action) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            let newuserLocation = [...state.items];
            if(index < 0){
                newuserLocation.splice(index,1);
            }else{
                console.warn(`Cant remove Ls (id: ${action.payload.id}) as its not in your scanned userLocation`)
            }
            state.items = newuserLocation;
        },
        clearAlluserLocation: (state) => {
            state.items =[]
            },
    },
})

// Action creators are generated for each case reducer function
export const { addTouserLocation, removeFromuserLocation, clearAlluserLocation } = userLocationSlice.actions


export const selectuserLocationItems = (state) => state.userLocation.items;
export default userLocationSlice.reducer