import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/config'
const initialState = { data: [], status: 'idle', error: null }
/**
 * @param {userId} array of users' id
 */
export const getUsersByIds = createAsyncThunk('users/getUsersByIds', async (userId, thunkAPI) => {
  try {
    let userData = []
    const q = query(collection(db, 'Users'), where('id', 'in', userId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      userData.push(Object(doc.data()))
    })
    return userData
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    saveUsersData: (state, action) => {
      state.data = action.payload
    },
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersByIds.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getUsersByIds.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getUsersByIds.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.data = {}
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveUsersData } = usersSlice.actions

export default usersSlice.reducer
