import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import SidebarContainer from './features/sideBar/Sidebar'
import TopbarContainer from './features/topBar/Topbar'
import { MainContent } from './styles/styledComponents'
import GroupCard from './features/groupCard/GroupCard'
import React, { useEffect } from 'react'
import ExpenseCard from './features/expenseCard/ExpenseCard'
import ExpenseForm from './features/expenseForm/ExpenseForm'
import Login from './features/login/Login'
import RouteGuard from './features/routeGuard/RouteGuard'
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from './firebase/config'
import { saveUserAuth } from './redux/slices/userAuthSlice'
import { getUserById } from './redux/slices/currentUserSlice'
import { getAllGroups } from './redux/slices/groupSlice'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase/config'
import CreateGroup from './features/createGroup/CreateGroup'
import ShowMembers from './features/showMembers/ShowMembers'
import AppMessage from './features/appMessage/AppMessage'
import Landing from './features/landingPage/Landing'
import { HashRouter } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles'

function App() {
  const userAuth = useSelector((state) => state.userAuth)
  const currentUser = useSelector((state) => state.currentUser)
  const appState = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const theme = createTheme({
    breakpoints: {
      values: {
        mobileS: 320,
        mobile: 425,
        tablet: 768,
        laptop: 1024,
        largeLaptop: 1440,
        desktop: 2560,
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
      }
    }
  })
  //check user's auth state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(saveUserAuth(user.uid))
      } else {
        dispatch(saveUserAuth(null))
      }
    })
  }, [auth, dispatch])
  //listen to changes to current user
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

  useEffect(() => {
    if (currentUser.status === 'succeeded') {
      dispatch(getAllGroups())
    }
  }, [currentUser])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HashRouter>
          {userAuth.status === 'succeeded' && userAuth.userId ? (
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
          ) : (userAuth.status === 'succeeded' && !userAuth.userId) ||
            userAuth.status === 'failed' ? (
            <>
              <Route exact path="/">
                <Landing />
              </Route>
            </>
          ) : (
            <>
              <CircularProgress />
            </>
          )}
        </HashRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
