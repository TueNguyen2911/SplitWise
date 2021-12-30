import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/config'
const initialState = { data: {}, status: 'idle', error: null }

export const getExpenseFormById = createAsyncThunk(
  'expenseForm/getExpenseFormById',
  async (expenseFormId, thunkAPI) => {
    try {
      console.log(expenseFormId)
      const docSnap = await getDoc(doc(db, 'ExpenseForms', expenseFormId))
      console.log(docSnap.data())
      return docSnap.data()
    } catch (error) {
      thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const expenseFormSlice = createSlice({
  name: 'expenseForm',
  initialState,
  reducers: {
    saveExpenseFormData: (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenseFormById.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getExpenseFormById.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getExpenseFormById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.data = {}
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveGroupData } = expenseFormSlice.actions

export default expenseFormSlice.reducer
