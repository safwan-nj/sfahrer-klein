import { configureStore } from '@reduxjs/toolkit'
import invoicesReducer from "./Redux/invoicesSlice"
import kassaReducer from "./Redux/kassaSlice"

import customerReducer from "./Redux/customerSlice"

import tourReducer from "./Redux/tourSlice"
import optionsReducer from "./Redux/optionsSlice"
import jobReducer from "./Redux/jobSlice"
import userLocationReducer from "./Redux/userLocationSlice"


export const store = configureStore({
  reducer: {
    invoices:invoicesReducer,
    kassa:kassaReducer,
    customer: customerReducer,
    tour: tourReducer,
    options: optionsReducer,
    jobs: jobReducer,
    userLocation: userLocationReducer
  },
})