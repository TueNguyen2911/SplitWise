import { Card, CardContent, CardMedia, Avatar, Divider, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import React, { useEffect } from 'react'

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

export default function GroupCard() {
  const { data, status } = useSelector((state) => state.groups)
  const dispatch = useDispatch()
  const history = useHistory()
  const { groupId } = useParams()
  useEffect(() => {
    dispatch(saveAppState({ membersIcon: false }))
  }, [])
  return (
    <div className="GroupCard">
      <CardContainer>
        {status === 'succeeded' ? (
          data.map((elem, index) => (
            <StyledCard key={index} onClick={() => history.push(`/group/${elem.id}`)}>
              <CardMedia
                sx={{ objectFit: 'contain' }}
                component="img"
                height="70%"
                image={elem.avatar}
                alt={elem.name}
              />
              <Divider />
              <CardContent sx={{ textAlign: 'left' }}>
                {elem.name} <br /> {elem.memberIds.length} members
              </CardContent>
            </StyledCard>
          ))
        ) : (
          <>loading</>
        )}
      </CardContainer>
    </div>
  )
}
