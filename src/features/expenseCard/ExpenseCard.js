import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory, useLocation, useParams, useRouteMatch, Route, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ExpenseForm from '../expenseForm/ExpenseForm'
import ExpenseTab from '../expenseTab/ExpenseTab'
import { saveAppState } from '../../redux/slices/appSlice'
import GroupMenu from './GroupMenu'
import AddMemberPaper from '../addMember/AddMemberPaper'
import { getUsersByIds } from '../../redux/slices/usersSlice'
import CreateExpense from '../createExpense/CreateExpense'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { updateGroupById } from '../../redux/slices/groupSlice'

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '1px 1px 2px',
  height: '350px',
  [theme.breakpoints.up('largeLaptop')]: {
    flexBasis: 'calc(25% - 10px)' //5px is the gap
  },
  [theme.breakpoints.between('laptop', 'largeLaptop')]: {
    flexBasis: 'calc(33.33% - 10px)'
  },
  [theme.breakpoints.between('sm', 'laptop')]: {
    flexBasis: 'calc(50% - 10px)'
  },
  [theme.breakpoints.down('sm')]: {
    flexBasis: '100%'
  },
  transition: 'width 0.2s',
  '&:hover': {
    opacity: '0.5'
  }
}))

const CardContainer = styled('div')(({ theme }) => ({
  margin: '10px 10px',
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
}))

const ExpenseCard = () => {
  const groups = useSelector((state) => state.groups)
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])

  const history = useHistory()
  const { groupId } = useParams()
  const { url } = useRouteMatch()
  const dispatch = useDispatch()

  useEffect(() => {
    if (groups.status === 'succeeded') {
      const currentGroup = groups.data.filter((elem) => elem.id === groupId)[0]
      setGroup(currentGroup)
      setExpenses(currentGroup.expenses)
    }
  }, [groups, groupId])

  useEffect(() => {
    dispatch(saveAppState({ membersIcon: true }))
    const q = query(collection(db, 'Groups'), where('id', '==', `${groupId}`))
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          console.log('Modified')
          const groupObj = change.doc.data()
          dispatch(updateGroupById(groupObj))
        }
      })
    })
  }, [])

  return (
    <div className="ExpenseCard">
      {group ? (
        <>
          <Typography variant="h3" align="center">
            {group.name}
          </Typography>
          <CardContainer>
            {group.expenses.length > 0 ? (
              group.expenses.map((elem, index) => (
                <StyledCard
                  key={index}
                  onClick={() => history.push(`${url}/expense/${elem.expenseFormId}`)}
                >
                  <CardMedia
                    component="img"
                    sx={{ objectFit: 'contain' }}
                    height="70%"
                    image={elem.image}
                    alt="Expense Img"
                  />
                  <Divider />
                  <CardContent sx={{ textAlign: 'left' }}>
                    {elem.name} <br /> {elem.date}
                  </CardContent>
                </StyledCard>
              ))
            ) : (
              <>Hmm it's empty</>
            )}
          </CardContainer>
          <GroupMenu />
          <AddMemberPaper />
          <CreateExpense />
        </>
      ) : null}
    </div>
  )
}

export default ExpenseCard
