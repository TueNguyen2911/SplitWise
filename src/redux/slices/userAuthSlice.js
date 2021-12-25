import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
const initialState = { refreshToken: null, error: null, status: 'idle' }

export const login = createAsyncThunk('userAuth/login', async (arg, thunkAPI) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, arg.email, arg.password)
    return userCredential.user.refreshToken
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    saveUserAuth: (state, action) => {
      state.status = 'succeeded'
      state.refreshToken = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.refreshToken = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

// Action creators are generated for each case reducer function
export const { saveUserAuth } = authSlice.actions

export default authSlice.reducer
