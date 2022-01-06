import { Card, CardContent, CardMedia, Avatar, Divider, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import React, { useEffect } from 'react'

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
              <Box sx={{ display: 'flex', flex: '1 1 0px' }}>
                <CardMedia
                  component="img"
                  sx={{ width: '165px', height: '165px', objectFit: 'contain' }}
                  image={elem.avatar}
                  alt="elem.name"
                />
                <Box sx={{ width: '165px', display: 'flex', flexWrap: 'wrap', paddingLeft: '5px' }}>
                  {elem.members.map((elem, index) => {
                    if (index < 8) {
                      return <Avatar key={index} alt={elem.name} src={elem.avatar} />
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
    </div>
  )
}
