import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import uniqid from 'uniqid'
const initialState = { data: [], status: 'idle', error: null, createStatus: 'idle' }

export const getAllGroups = createAsyncThunk('groups/getAllGroups', async (arg, thunkAPI) => {
  try {
    const groupIds = thunkAPI.getState().currentUser.data.groupIds
    if (groupIds.length > 0) {
      let groupData = []
      const q = query(collection(db, 'Groups'), where('id', 'in', groupIds))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
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
    }
    return []
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
    },
    reset: () => initialState
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
    // .addCase(createGroup.pending, (state, action) => {
    //   state.createStatus = 'loading'
    // })
    // .addCase(createGroup.fulfilled, (state, action) => {
    //   state.createStatus = 'succeeded'
    // })
    // .addCase(createGroup.rejected, (state, action) => {
    //   state.createStatus = 'failed'
    //   state.error = action.payload
    // })
  }
})
// Action creators are generated for each case reducer function
export const { saveGroupData } = groupSlice.actions

export default groupSlice.reducer
