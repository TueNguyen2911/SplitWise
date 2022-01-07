import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'

export const getUserById = createAsyncThunk('currentUser/getUserById', async (arg, thunkAPI) => {
  try {
    const userId = thunkAPI.getState().userAuth.userId
    const docSnap = await getDoc(doc(db, 'Users', userId))
    return docSnap.data()
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})
const initialState = {
  data: {}
}
export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    resetCurrentUser: () => initialState,
    saveCurrentUserData: (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { saveCurrentUserData, resetCurrentUser } = currentUserSlice.actions
export default currentUserSlice.reducer
