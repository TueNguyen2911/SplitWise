import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { signOut } from 'firebase/auth'
const initialState = { userId: null, error: null, status: 'idle' }

export const login = createAsyncThunk('userAuth/login', async (arg, thunkAPI) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, arg.email, arg.password)
    return userCredential.user.uid
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const logout = createAsyncThunk('userAuth/logout', async (arg, thunkAPI) => {
  try {
    await signOut(auth)
    return null
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    saveUserAuth: (state, action) => {
      state.userId = action.payload
      state.status = 'succeeded'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        saveUserAuth(state, action)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(logout.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = 'succeeded'
        saveUserAuth(state, action)
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveUserAuth } = userAuthSlice.actions

export default userAuthSlice.reducer
