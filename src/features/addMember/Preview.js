import { addMember, getUserById } from '../../firebase/operations'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersByIds } from '../../redux/slices/usersSlice'

const AvatarLabel = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
`

const Preview = ({ userId, setUserId }) => {
  const groups = useSelector((state) => state.groups)
  const [user, setUser] = useState(null)
  const [inGroup, setInGroup] = useState(false)
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const handleAddClick = () => {
    const add = async () => {
      const { msg, error } = await addMember(user, groupId)
      if (!error) {
        setUserId('')
        const { memberIds } = groups.data.filter((elem) => elem.id === groupId)[0]
        dispatch(getUsersByIds(memberIds))
      }
    }
    add()
  }
  useEffect(() => {
    if (userId.length === 28) {
      const getUser = async () => {
        const { data, error } = await getUserById(userId)
        if (data.groupIds.includes(groupId)) {
          setInGroup(true)
        }
        setUser(data)
      }
      getUser()
    } else if (user !== null) {
      console.log('yo')
      setUser(null)
      setInGroup(false)
    }
  }, [userId])
  return (
    <div>
      {user !== null ? (
        <Paper sx={{ width: '400px' }}>
          <AvatarLabel>
            <Avatar style={{ marginRight: '14px' }} src={user.avatar} />
            <span>{user.userName}</span>
            {inGroup ? (
              <span style={{ marginLeft: 'auto' }}>Already in group!</span>
            ) : (
              <Button onClick={handleAddClick} variant="outlined" sx={{ marginLeft: 'auto' }}>
                Add
              </Button>
            )}
          </AvatarLabel>
        </Paper>
      ) : null}
    </div>
  )
}

export default Preview
