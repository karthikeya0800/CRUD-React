// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  itemsList: [],
};

// Create a slice of the state with actions and reducers
const itemsSlice = createSlice({
  name: "itemsList",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.itemsList = action.payload;
    },
    addItem: (state, action) => {
      state.itemsList = [action.payload, ...state.itemsList];
    },
    updateItem: (state, action) => {
      const index = state.itemsList.findIndex(
        (record) => record._id === action.payload._id
      );
      if (index !== -1) {
        state.itemsList[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      state.itemsList = state.itemsList.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

// Export actions for use in components
export const { setItems, addItem, updateItem, deleteItem } = itemsSlice.actions;

// Configure store
const store = configureStore({
  reducer: itemsSlice.reducer,
});

export default store;
