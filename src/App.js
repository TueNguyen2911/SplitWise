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
import ExpenseForm2 from './features/expenseForm2/ExpenseForm2'
import Login from './features/login/Login'
import RouteGuard from './features/routeGuard/RouteGuard'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from './firebase/config'
import { saveUserAuth } from './redux/slices/userAuthSlice'
import { getUserById } from './redux/slices/currentUserSlice'
import { getAllGroups } from './redux/slices/groupSlice'
function App() {
  const [sideBarWidth, setSideBarWidth] = useState(0)
  const { status } = useSelector((state) => state.auth)
  const userStatus = useSelector((state) => state.currentUser.status)
  const dispatch = useDispatch()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(saveUserAuth(user.uid))
        dispatch(getUserById())
      } else {
        dispatch(saveUserAuth(null))
      }
    })
  }, [auth, dispatch])
  useEffect(() => {
    if (userStatus === 'succeeded') {
      dispatch(getAllGroups())
    }
  }, [userStatus])
  return (
    <div className="App">
      {status === 'succeeded' ? (
        <>
          <Router>
            <SidebarContainer setSBWidth={setSideBarWidth} />
            <MainContent SBWidth={sideBarWidth}>
              <TopbarContainer />
              <Route exact path="/">
                <RouteGuard components={[<GroupCard />]} />
              </Route>
              <Route exact path="/expenses">
                <RouteGuard path="/expenses" components={[<ExpenseCard />]} />
              </Route>
              <Route exact path="/expense">
                <RouteGuard components={[<ExpenseTab />]} />
              </Route>
              <Route exact path="/form">
                <RouteGuard components={[<ExpenseForm />]} />
              </Route>
              <Route exact path="/login">
                <RouteGuard path={'/login'} components={[<Login />]} />
              </Route>
              <Route exact path="/expense2">
                <RouteGuard components={[<ExpenseForm2 />]} />
              </Route>
            </MainContent>
          </Router>
        </>
      ) : null}
    </div>
  )
}

export default App
