import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/userAuthSlice'
import currentUserReducer from './slices/currentUserSlice'
import groupReducer from './slices/groupSlice'
import usersReducer from './slices/usersSlice'
export const store = configureStore({
  reducer: {
    userAuth: authReducer,
    currentUser: currentUserReducer,
    groups: groupReducer,
    users: usersReducer
  }
})
