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
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase/config'
import CreateGroup from './features/createGroup/CreateGroup'
import ShowMembers from './features/showMembers/ShowMembers'
import AppMessage from './features/appMessage/AppMessage'
import SignUp from './features/signUp/SignUp'
import Landing from './features/landingPage/Landing'

function App() {
  const userAuth = useSelector((state) => state.userAuth)
  const currentUser = useSelector((state) => state.currentUser)
  const appState = useSelector((state) => state.app)
  const groups = useSelector((state) => state.groups)
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
        dispatch(getUserById())
      })
    }
  }, [userAuth])

  useEffect(() => {
    if (currentUser.status === 'succeeded') {
      dispatch(getAllGroups())
    }
  }, [currentUser])

  return (
    <div className="App">
      <Router>
        {groups.status === 'succeeded' && userAuth.userId ? (
          <>
            <AppMessage />
            <RouteGuard components={[<SidebarContainer />]} />
            <MainContent
              className="main-content"
              appState={appState.data}
              SBWidth={appState.data.sideBarWidth}
            >
              <RouteGuard components={[<TopbarContainer />]} />

              <Route exact path="/">
                <RouteGuard components={[<GroupCard />]} />
              </Route>
              <Route exact path="/group/:groupId">
                <RouteGuard components={[<ExpenseCard />]} />
                {appState.data.showMembers ? <ShowMembers /> : null}
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
          </>
        ) : !userAuth.userId ? (
          <>
            <Route exact path="/">
              <Landing />
            </Route>
          </>
        ) : null}
      </Router>
    </div>
  )
}

export default App
