import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from './config'
import { store } from '../redux/store'

export const getUserById = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'Users', userId))
    return { data: docSnap.data(), error: null }
  } catch (error) {
    console.error(error.message)
    return { data: null, error: error.message }
  }
}

export const addMember = async (user, groupId) => {
  try {
    const { currentUser, users, groups, expenseForm } = store.getState()
    //update groupIds of the user
    const { groupIds } = JSON.parse(JSON.stringify(user))
    groupIds.push(groupId)
    await updateDoc(doc(db, 'Users', user.id), { groupIds: groupIds })

    //update memberIds of the group
    const targetGroup = groups.data.filter((elem) => elem.id === groupId)[0]
    console.log(groups.data)
    const { memberIds } = JSON.parse(JSON.stringify(targetGroup))
    memberIds.push(user.id)
    console.log(memberIds)
    await updateDoc(doc(db, 'Groups', groupId), { memberIds: memberIds })

    //update members of expenseForm
    const expenseFormIds = targetGroup.expenses.map((elem) => elem.expenseFormId)
    const EFPromises = expenseFormIds.map((id) => {
      return getDoc(doc(db, 'ExpenseForms', id))
    })
    const expenseForms = []
    for (let i = 0; i < EFPromises.length; i++) {
      const EFSnap = await EFPromises[i]
      expenseForms.push(EFSnap.data())
    }

    for (let i = 0; i < expenseForms.length; i++) {
      expenseForms[i].members.push({
        fixed: false,
        id: user.id,
        note: '',
        owned: 0
      })
    }
    console.log(expenseForms)
    for (let i = 0; i < expenseForms.length; i++) {
      await updateDoc(doc(db, 'ExpenseForms', expenseForms[i].id), {
        members: expenseForms[i].members
      })
    }
    return { msg: `Added ${user.userName} successfully`, error: null }
  } catch (error) {
    console.error(error)
    return { msg: null, error: error.message }
  }
}
