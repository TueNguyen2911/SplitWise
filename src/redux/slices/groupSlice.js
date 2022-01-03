import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import { db } from '../../firebase/config'
const initialState = { data: [], status: 'idle', error: null, createStatus: 'idle' }

export const getAllGroups = createAsyncThunk('groups/getAllGroups', async (arg, thunkAPI) => {
  try {
    const groupIds = thunkAPI.getState().currentUser.data.groupIds
    let groupData = []
    const q = query(collection(db, 'Groups'), where('id', 'in', groupIds))
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
export const createGroup = createAsyncThunk('groups/createGroup', async (arg, thunkAPI) => {
  try {
    const currentUser = thunkAPI.getState().currentUser.data
    const groupObj = { ...arg, members: [], expenses: [] }
    groupObj.memberIds.unshift(currentUser.id)
    if (groupObj.avatar.length === 0) {
      groupObj.avatar =
        'https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/Screenshot%202022-01-01%20212759.png?alt=media&token=e5175b8f-a207-4ae3-a514-66491d7e9a00'
    }
    const groupIds = JSON.parse(JSON.stringify(currentUser.groupIds))
    groupIds.push(groupObj.id)

    await setDoc(doc(db, 'Groups', groupObj.id), groupObj)
    await updateDoc(doc(db, 'Users', currentUser.id), { groupIds })
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
      .addCase(createGroup.pending, (state, action) => {
        state.createStatus = 'loading'
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.payload
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveGroupData } = groupSlice.actions

export default groupSlice.reducer
