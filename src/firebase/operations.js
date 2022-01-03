import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from './config'
import { store } from '../redux/store'

const { currentUser, users, groups, expenseForm } = store.getState()

export const getUserById = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'Users', userId))
    console.log(docSnap.data())
    return { data: docSnap.data(), error: null }
  } catch (error) {
    console.error(error.message)
    return { data: null, error: error.message }
  }
}

export const addMember = async (userId, groupId) => {
  try {
    const user = users.data.filter((elem) => elem.id === userId)[0]
    let groupIds = JSON.parse(JSON.stringify(user.groupIds))
    groupIds.push(groupId)
    await updateDoc(doc(db, 'Users', userId), { groupIds: groupIds })
  } catch (error) {
    console.error(error.message)
    return { data: null, error: error.message }
  }
}
