import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    jobs: []
}

export const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        setJob:(state, action)=>{
            state.jobs = [...state.jobs,action.payload];
            //console.log(state.restaurant.title);
        },
        clearAllJob: (state) => {
            state.jobs =[]
            },
    },
});

// Action creators are generated for each case reducer function
export const { setJob, clearAllJob } = jobSlice.actions;


export const selectJob = (state) => state.jobs.jobs;

export default jobSlice.reducer