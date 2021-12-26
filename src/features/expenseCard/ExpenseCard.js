import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import queryString from 'query-string'

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '10px 10px',
  width: '330px',
  boxShadow: '1px 1px 2px',
  [theme.breakpoints.down('md')]: {
    width: '280px'
  },
  transition: 'width 0.2s',
  '&:hover': {
    opacity: '0.5'
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
  const index = Number(queryString.parse(search).index)
  const expense = useSelector((state) => state.groups.data[index].expense)
  return (
    <CardContainer onClick={() => history.push('expense')}>
      {expense.map((elem) => (
        <StyledCard>
          <Box>
            <CardMedia
              component="img"
              sx={{ objectFit: 'cover' }}
              image={elem.image}
              alt="Live from space album cover"
            />
          </Box>
          <Divider />
          <CardContent sx={{ textAlign: 'left' }}>
            {elem.name} <br /> {elem.date}
          </CardContent>
        </StyledCard>
      ))}
    </CardContainer>
  )
}

export default ExpenseCard
