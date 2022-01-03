import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from './config'

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
