import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db, storage } from './config'
import { store } from '../redux/store'
import { uploadBytes, getDownloadURL, deleteObject, ref } from 'firebase/storage'
import uniqid from 'uniqid'
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

export const kickMember = async (user, groupId) => {
  try {
    const { currentUser, users, groups } = store.getState()
    //update groupIds of the user
    const { groupIds } = JSON.parse(JSON.stringify(user))
    groupIds.splice(groupIds.indexOf(groupId), 1)
    await updateDoc(doc(db, 'Users', user.id), { groupIds: groupIds })

    //update memberIds of the group
    const targetGroup = groups.data.filter((elem) => elem.id === groupId)[0]
    console.log(groups.data)
    const { memberIds } = JSON.parse(JSON.stringify(targetGroup))
    memberIds.splice(memberIds.indexOf(user.id), 1)
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
      const index = expenseForms[i].members.reduce((prev, elem, index) => {
        if (elem.id === user.id) {
          return index
        }
      })
      expenseForms[i].members.splice(index, 1)
    }

    for (let i = 0; i < expenseForms.length; i++) {
      await updateDoc(doc(db, 'ExpenseForms', expenseForms[i].id), {
        members: expenseForms[i].members
      })
    }
    console.log(expenseForms)
    return { msg: `Kicked ${user.userName} successfully from ${targetGroup.name}`, error: null }
  } catch (error) {
    console.error(error)
    return { msg: null, error: error.message }
  }
}

export const createExpense = async (groupId, expense) => {
  try {
    const modExpense = { ...expense }
    const groupSnap = await getDoc(doc(db, 'Groups', groupId))
    const groupData = groupSnap.data()
    const expenseForm = {
      id: uniqid(),
      name: modExpense.name,
      billDesc: [''],
      billPrice: [0],
      total: 0,
      billImg: '',
      billImgTotal: 0,
      isBillForm: false,
      members: []
    }
    groupData.memberIds.forEach((memberId, index) => {
      expenseForm.members.push({
        id: memberId,
        owned: 0,
        note: '',
        fixed: false
      })
    })
    await setDoc(doc(db, 'ExpenseForms', expenseForm.id), expenseForm)

    modExpense.date = modExpense.date.toLocaleDateString()
    modExpense.from = modExpense.from.toLocaleDateString()
    modExpense.to = modExpense.to.toLocaleDateString()
    modExpense.image =
      'https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/EF.png?alt=media&token=76e7dc30-a362-4539-b57a-5c9dc8a777f7'
    modExpense.expenseFormId = expenseForm.id
    groupData.expenses.push(modExpense)
    console.log(groupData)
    await updateDoc(doc(db, 'Groups', groupData.id), groupData)
    return { msg: `Created ${modExpense.name} successfully`, error: null }
  } catch (error) {
    console.error(error.message)
    return { data: null, error: error.message }
  }
}

export const uploadImgToStorage = async (imageFile) => {
  try {
    const name = uniqid('image-')
    const storageRef = ref(storage, name)

    const snapshot = await uploadBytes(storageRef, imageFile)
    const url = await getDownloadURL(ref(storage, name))
    return { url: url, name: name, error: null }
  } catch (error) {
    return { url: null, name: null, error: error.message }
  }
}

export const deleteImgToStorage = async (name) => {
  try {
    await deleteObject(ref(storage, name))
    return { msg: `Deleted ${name} successfully`, error: null }
  } catch (error) {
    return { url: null, error: error.message }
  }
}
