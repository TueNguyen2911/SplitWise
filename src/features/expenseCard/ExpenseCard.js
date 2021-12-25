import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory } from 'react-router-dom'

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
  const [groups, setGroups] = React.useState([
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    },
    {
      name: 'Trip #1',
      data: '20-10-2021',
      screenshot: 'https://thedatalabs.org/wp-content/uploads/2018/05/Spreadsheet_New.png'
    }
  ])
  const history = useHistory()
  return (
    <CardContainer onClick={() => history.push('expense')}>
      {groups.map((elem) => (
        <StyledCard>
          <Box>
            <CardMedia
              component="img"
              sx={{ objectFit: 'cover' }}
              image={elem.screenshot}
              alt="Live from space album cover"
            />
          </Box>
          <Divider />
          <CardContent sx={{ textAlign: 'left' }}>
            {elem.name} <br /> {elem.data}{' '}
          </CardContent>
        </StyledCard>
      ))}
    </CardContainer>
  )
}

export default ExpenseCard
