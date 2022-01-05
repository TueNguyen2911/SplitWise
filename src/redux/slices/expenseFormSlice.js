import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
const initialState = { data: {}, status: 'idle', error: null }

export const getExpenseFormById = createAsyncThunk(
  'expenseForm/getExpenseFormById',
  async (expenseFormId, thunkAPI) => {
    try {
      const docSnap = await getDoc(doc(db, 'ExpenseForms', expenseFormId))
      return docSnap.data()
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const updateExpenseForm = createAsyncThunk(
  'expenseForm/updateExpenseForm',
  async (updateObj, thunkAPI) => {
    try {
      console.log(updateObj)
      const id = thunkAPI.getState().expenseForm.data.id
      await updateDoc(doc(db, 'ExpenseForms', id), updateObj)
      thunkAPI.dispatch(getExpenseFormById(id))
      return 'updated'
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
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
    },
    reset: () => initialState
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
      .addCase(updateExpenseForm.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateExpenseForm.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
      .addCase(updateExpenseForm.rejected, (state, action) => {
        state.status = 'failed'
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveGroupData } = expenseFormSlice.actions

export default expenseFormSlice.reducer
