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
    const userSnapPromises = userId.map((id) => getDoc(doc(db, 'Users', id)))

    for (let i = 0; i < userSnapPromises.length; i++) {
      const userSnap = await userSnapPromises[i]
      const data = userSnap.data()
      userData.push(Object(data))
    }
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
    resetUsers: () => initialState
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
export const { saveUsersData, resetUsers } = usersSlice.actions

export default usersSlice.reducer
