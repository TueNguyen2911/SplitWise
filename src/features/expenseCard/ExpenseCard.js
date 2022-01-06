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

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '10px 10px',
  width: '330px',
  boxShadow: '1px 1px 2px',
  [theme.breakpoints.down('md')]: {
    width: '280px'
  },
  transition: 'width 0.2s',
  '&:hover': {
    opacity: '0.8'
  }
}))

const CardContainer = styled('div')({
  margin: '20px 20px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

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
                  <Box>
                    <CardMedia
                      component="img"
                      sx={{ objectFit: 'contain', height: '150px' }}
                      image={elem.image}
                      alt="Expense Img"
                    />
                  </Box>
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
