import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersByIds } from '../../redux/slices/usersSlice'

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

export default function GroupCard() {
  const { data, status } = useSelector((state) => state.groups)
  const dispatch = useDispatch()
  const history = useHistory()
  return (
    <CardContainer>
      {status === 'succeeded' ? (
        data.map((elem, index) => (
          <StyledCard onClick={() => history.push(`/group/${elem.id}`)}>
            <Box sx={{ display: 'flex', flex: '1 1 0px' }}>
              <CardMedia
                component="img"
                sx={{ width: '165px', height: '165px', objectFit: 'contain' }}
                image={elem.avatar}
                alt="Live from space album cover"
              />
              <Box sx={{ width: '165px', display: 'flex', flexWrap: 'wrap', paddingLeft: '5px' }}>
                {elem.members.map((elem, index) => {
                  if (index < 8) {
                    return <Avatar alt={elem.name} src={elem.avatar} />
                  }
                  return null
                })}
              </Box>
            </Box>
            <Divider />
            <CardContent sx={{ textAlign: 'left' }}>{elem.name}</CardContent>
          </StyledCard>
        ))
      ) : (
        <>loading</>
      )}
    </CardContainer>
  )
}
