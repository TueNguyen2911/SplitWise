import { getUserById } from '../../firebase/operations'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Paper } from '@mui/material'

const AvatarLabel = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
`

const Preview = ({ userId }) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    if (userId.length === 28) {
      const getUser = async () => {
        const { data, error } = await getUserById(userId)
        console.log(data)
        setUser(data)
      }
      getUser()
    } else if (user !== null) {
      console.log('yo')
      setUser(null)
    }
  }, [userId])
  return (
    <div>
      {user !== null ? (
        <Paper sx={{ width: '400px' }}>
          <AvatarLabel>
            <Avatar style={{ marginRight: '14px' }} src={user.avatar} />
            <span>{user.userName}</span>
            <Button variant="outlined" sx={{ marginLeft: 'auto' }}>
              Add
            </Button>
          </AvatarLabel>
        </Paper>
      ) : null}
    </div>
  )
}

export default Preview
