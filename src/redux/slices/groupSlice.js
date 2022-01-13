import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import uniqid from 'uniqid'
const initialState = {
  data: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle'
}

const getIndexById = (id, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i
    }
  }
  return -1
}
export const getAllGroups = createAsyncThunk('groups/getAllGroups', async (arg, thunkAPI) => {
  try {
    const groupIds = thunkAPI.getState().currentUser.data.groupIds
    if (groupIds.length > 0) {
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
    }
    return []
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const updateGroupById = createAsyncThunk(
  'groups/updateGroupById',
  async (groupObj, thunkAPI) => {
    try {
      const groupsData = thunkAPI.getState().groups.data
      const index = getIndexById(groupObj.id, groupsData)
      if (index < 0) {
        return thunkAPI.rejectWithValue(`Can't find group ${groupObj.name}`)
      }
      if (groupsData[index].memberIds.length !== groupObj.memberIds.length) {
        const members = []
        const userQuery = query(collection(db, 'Users'), where('id', 'in', groupObj.memberIds))
        const querySnapshot = await getDocs(userQuery)
        querySnapshot.forEach((doc) => {
          members.push(doc.data())
        })

        return {
          index: index,
          key: 'memberIds',
          members: members,
          memberIds: groupObj.memberIds,
          error: null
        }
      }

      if (groupsData[index].expenses.length !== groupObj.expenses.length) {
        return { index: index, key: 'expenses', expenses: groupObj.expenses, error: null }
      }
    } catch (error) {
      console.error(error)
      return thunkAPI.rejectWithValue({
        index: null,
        key: null,
        expenses: null,
        error: error.message
      })
    }
  }
)

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    saveGroupData: (state, action) => {
      state.data = action.payload
    },
    resetGroup: () => initialState
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
      .addCase(updateGroupById.pending, (state, action) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateGroupById.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded'
        const payload = action.payload
        const { index, key } = payload

        if (key === 'memberIds') {
          state.data[index].memberIds = payload.memberIds
          state.data[index].members = payload.members
        } else if (key === 'expenses') {
          state.data[index].expenses = payload.expenses
        }
        state.error = null
      })
      .addCase(updateGroupById.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.error = action.payload.error
      })
  }
})
// Action creators are generated for each case reducer function
export const { saveGroupData, resetGroup } = groupSlice.actions

export default groupSlice.reducer
