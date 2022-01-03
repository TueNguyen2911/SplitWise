import React from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import SidebarContainer from './features/sideBar/Sidebar'
import TopbarContainer from './features/topBar/Topbar'
import { createTheme } from '@mui/system'
import { MainContent } from './styles/MainContent'
import GroupCard from './features/groupCard/GroupCard'
import { useState, useEffect, useRef } from 'react'
import ExpenseCard from './features/expenseCard/ExpenseCard'
import ExpenseTab from './features/expenseTab/ExpenseTab'
import ExpenseForm from './features/expenseForm/ExpenseForm'
import Login from './features/login/Login'
import RouteGuard from './features/routeGuard/RouteGuard'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from './firebase/config'
import { saveUserAuth } from './redux/slices/userAuthSlice'
import { getUserById } from './redux/slices/currentUserSlice'
import { getAllGroups } from './redux/slices/groupSlice'
import { getUsersByIds } from './redux/slices/usersSlice'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase/config'
import CreateGroup from './features/createGroup/CreateGroup'
import ShowMembers from './features/showMembers/ShowMembers'

function App() {
  const userAuth = useSelector((state) => state.userAuth)
  const currentUser = useSelector((state) => state.currentUser)
  const appState = useSelector((state) => state.app)
  const dispatch = useDispatch()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(saveUserAuth(user.uid))
      } else {
        dispatch(saveUserAuth(null))
      }
    })
  }, [auth, dispatch])

  useEffect(() => {
    if (userAuth.status === 'succeeded' && userAuth.userId) {
      const unsub = onSnapshot(doc(db, 'Users', userAuth.userId), (doc) => {
        console.log(doc.data())
        dispatch(getUserById())
      })
    }
  }, [userAuth.status])

  useEffect(() => {
    if (currentUser.status === 'succeeded') {
      dispatch(getAllGroups())
    }
  }, [currentUser.status])

  return (
    <div className="App">
      {userAuth.status === 'succeeded' ? (
        <>
          <Router>
            <RouteGuard components={[<SidebarContainer />]} />
            <MainContent
              className="main-content"
              createGroup={appState.data.createGroup}
              SBWidth={appState.data.sideBarWidth}
            >
              <RouteGuard components={[<TopbarContainer />]} />

              <Route exact path="/">
                <RouteGuard components={[<GroupCard />]} />
              </Route>
              <Route exact path="/group/:groupId">
                <RouteGuard components={[<ExpenseCard />]} />
                <RouteGuard components={[<ShowMembers />]} />
              </Route>
              <Route exact path="/form">
                <RouteGuard components={[<ExpenseForm />]} />
              </Route>
              <Route exact path="/login">
                <RouteGuard path={'/login'} components={[<Login />]} />
              </Route>
              <Route path="/group/:groupId/expense/:expenseFormId">
                <ExpenseForm />
                <ShowMembers />
              </Route>
              {appState.data.createGroup ? (
                <>
                  <CreateGroup />
                </>
              ) : null}
            </MainContent>
          </Router>
        </>
      ) : userAuth.status === 'failed' ? (
        <>
          <MainContent SBWidth={appState.data.sideBarWidth}>
            <Login />
          </MainContent>
        </>
      ) : null}
    </div>
  )
}

export default App
