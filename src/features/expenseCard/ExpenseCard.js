import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory, useLocation, useParams, useRouteMatch, Route, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import queryString from 'query-string'
import ExpenseForm from '../expenseForm/ExpenseForm'
import ExpenseTab from '../expenseTab/ExpenseTab'

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
  const history = useHistory()
  const { search } = useLocation()
  const { groupId } = useParams()
  const { path, url } = useRouteMatch()
  const groups = useSelector((state) => state.groups.data)
  const [expenses, setExpenses] = useState([])
  useEffect(() => {
    if (groupId && groups.length > 0) {
      const locExpenses = groups.map((elem, idx) => {
        if (elem.id === groupId) {
          return elem.expenses
        }
      })
      setExpenses(locExpenses[0])
    }
  }, [groups, groupId])
  return (
    <div className="ExpenseCard">
      <CardContainer>
        {expenses ? (
          expenses.map((elem, index) => (
            <StyledCard
              key={index}
              onClick={() => history.push(`${url}/expense/${elem.expenseFormId}`)}
            >
              <Box>
                <CardMedia
                  component="img"
                  sx={{ objectFit: 'cover' }}
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
    </div>
  )
}

export default ExpenseCard
