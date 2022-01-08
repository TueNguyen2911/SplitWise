import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { auth, db, storage } from './config'
import { store } from '../redux/store'
import { uploadBytes, getDownloadURL, deleteObject, ref } from 'firebase/storage'
import uniqid from 'uniqid'
import { createUserWithEmailAndPassword } from 'firebase/auth'
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
    const { memberIds } = JSON.parse(JSON.stringify(targetGroup))
    memberIds.push(user.id)
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
    const { memberIds } = JSON.parse(JSON.stringify(targetGroup))
    memberIds.splice(memberIds.indexOf(user.id), 1)
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
export const changeUserAvatar = async (imageFile) => {
  try {
    const { currentUser } = store.getState()
    const { url, error } = await uploadImgToStorage(imageFile)
    if (url) {
      await updateDoc(doc(db, 'Users', currentUser.data.id), { avatar: url })
      return { msg: `Changed avatar`, error: null }
    }
  } catch (error) {
    console.log(error)
    return { msg: null, error: error.message }
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

export const createGroup = async (groupValue) => {
  try {
    const { currentUser } = store.getState()
    const groupObj = { ...groupValue, members: [], expenses: [], id: uniqid() }
    groupObj.memberIds.unshift(currentUser.data.id) //add the owner of the group
    if (groupObj.avatar.length === 0) {
      groupObj.avatar =
        'https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/Screenshot%202022-01-01%20212759.png?alt=media&token=e5175b8f-a207-4ae3-a514-66491d7e9a00'
    }

    const groupIds = JSON.parse(JSON.stringify(currentUser.data.groupIds))
    groupIds.push(groupObj.id)

    await setDoc(doc(db, 'Groups', groupObj.id), groupObj)
    await updateDoc(doc(db, 'Users', currentUser.data.id), { groupIds })
    return { msg: `Created ${groupObj.name} successfully`, error: null }
  } catch (error) {
    return { msg: null, error: error.message }
  }
}

export const getMemeImages = async (limit = 8) => {
  try {
    const urls = []
    let name = ''
    for (let i = 1; i <= limit; i++) {
      name = `gs://splitwise-83ca0.appspot.com/meme${i}.jpg`
      const url = await getDownloadURL(ref(storage, name))
      urls.push(url)
    }
    return { urls: urls, error: null }
  } catch (error) {
    return { urls: [], error: error.message }
  }
}
export const createUser = async (userValues) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      userValues.email,
      userValues.password
    )
    const { msg, error } = await addUserToFireStore(userValues, user.uid)
    return { msg: msg, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}
const addUserToFireStore = async (userValues, userId) => {
  try {
    const user = {
      id: userId,
      avatar: userValues.avatar,
      email: userValues.email,
      groupIds: [],
      name: userValues.name,
      userName: userValues.userName
    }
    await setDoc(doc(db, 'Users', user.id), user)
    return { msg: `Created user ${user.userName}`, error: null }
  } catch (error) {
    return { msg: null, error: error.message }
  }
}
