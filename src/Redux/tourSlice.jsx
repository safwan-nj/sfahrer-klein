import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tour: []
}

export const tourSlice = createSlice({
    name: "tour",
    initialState,
    reducers: {
        setTour:(state, action)=>{
            state.tour = [...state.tour,action.payload];
            //console.log(state.restaurant.title);
        },
        clearAllTourss: (state) => {
            state.tour =[]
            },
    },
});

// Action creators are generated for each case reducer function
export const { setTour, clearAllTours } = tourSlice.actions;


export const selectTour = (state) => state.tour.tour;

export default tourSlice.reducer