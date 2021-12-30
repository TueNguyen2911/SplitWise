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
import { getUsersByIds } from './redux/slices/usersSlice'
function App() {
  const [sideBarWidth, setSideBarWidth] = useState(0)
  const userAuth = useSelector((state) => state.userAuth)
  const currentUser = useSelector((state) => state.currentUser)
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
      dispatch(getUserById())
    }
  }, [userAuth.status])
  useEffect(() => {
    if (currentUser.status === 'succeeded') {
      dispatch(getAllGroups())
    }
  }, [currentUser.status])
  useEffect(() => {
    if (groups.status === 'succeeded') {
      console.log(groups.memberId)
      dispatch(getUsersByIds(groups.memberId))
    }
  }, [groups.status])
  return (
    <div className="App">
      {userAuth.status === 'succeeded' ? (
        <>
          <Router>
            <RouteGuard
              path="/expenses"
              components={[<SidebarContainer setSBWidth={setSideBarWidth} />]}
            />
            <MainContent SBWidth={sideBarWidth}>
              <RouteGuard path="/expenses" components={[<TopbarContainer />]} />

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
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
  )
}

export default App
