import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/config'
const initialState = { data: [{}], status: 'idle', error: null }

export const getAllGroups = createAsyncThunk('groups/getAllGroups', async (arg, thunkAPI) => {
  try {
    const groupId = thunkAPI.getState().currentUser.data.groupId
    let groupData = []
    const q = query(collection(db, 'Groups'), where('id', 'in', groupId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      groupData.push(Object(doc.data()))
    })
    //fetching members based on memberIds to add to state
    for (const data of groupData) {
      const userQuery = query(collection(db, 'Users'), where('id', 'in', data.memberIds))
      const querySnapshot = await getDocs(userQuery)
      querySnapshot.forEach((doc) => {
        data.members.push(doc.data())
      })
    }
    return groupData
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    saveGroupData: (state, action) => {
      state.data = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroups.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getAllGroups.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.data = {}
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveGroupData } = groupSlice.actions

export default groupSlice.reducer
