import { createReducer } from "@reduxjs/toolkit";
import { addUser, deleteUser, updateUser } from "../actions/userActions";

const getInitialState = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return {
      users: JSON.parse(localStorage.getItem("users")) || [],
    };
  } else {
    return {
      users: [],
    };
  }
};

const initialState = getInitialState();

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addUser, (state, action) => {
      const existingUserIndex = state.users.findIndex(
        (user) => user.email === action.payload.email
      );

      if (existingUserIndex !== -1) {
        state.users[existingUserIndex] = action.payload;
      } else {
        state.users.push(action.payload);
      }

      if (action.meta.saveToLocalStorage) {
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    })
    .addCase(deleteUser, (state, action) => {
      state.users = state.users.filter((user) => user.email !== action.payload);

      if (action.meta.removeFromLocalStorage) {
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    })
    .addCase(updateUser, (state, action) => {
      const { email, updatedUserData } = action.payload;
      const indexToUpdate = state.users.findIndex(
        (user) => user.email === email
      );

      if (indexToUpdate !== -1) {
        state.users[indexToUpdate] = {
          ...state.users[indexToUpdate],
          ...updatedUserData,
        };
      }
    });
});

export default userReducer;
