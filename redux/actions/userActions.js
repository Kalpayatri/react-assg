import { createAction } from '@reduxjs/toolkit';

export const addUser = createAction('user/addUser', (userData) => {
  return {
    payload: userData,
    meta: {
      handleDuplicates: true,
      saveToLocalStorage: true, 
    },
  };
});

export const deleteUser = createAction('user/deleteUser', (email) => {
  return {
    payload: email,
    meta: {
      removeFromLocalStorage: true, 
    },
  };
});

export const updateUser = createAction('user/updateUser', (userData) => {
  return {
    payload: userData,
    meta: {
      saveToLocalStorage: true, 
    },
  };
});
