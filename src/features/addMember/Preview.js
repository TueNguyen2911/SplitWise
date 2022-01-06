import { addMember, getUserById } from '../../firebase/operations'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersByIds } from '../../redux/slices/usersSlice'
import { saveAppState } from '../../redux/slices/appSlice'

const AvatarLabel = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
`

const Preview = ({ userId, setUserId }) => {
  const appState = useSelector((state) => state.app)
  const groups = useSelector((state) => state.groups)
  const [user, setUser] = useState(null) //user data found
  const [inGroup, setInGroup] = useState(false) //check if user is already in group
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const handleAddClick = async () => {
    const { msg, error } = await addMember(user, groupId)
    const { successMsg, errorMsg } = JSON.parse(JSON.stringify(appState.data))
    if (msg) {
      successMsg.push(msg)
      dispatch(saveAppState({ successMsg: successMsg }))
      setUserId('')
    } else {
      errorMsg.push(error)
      dispatch(saveAppState({ errorMsg: errorMsg }))
    }
    if (!error) {
      setUserId('')
      const { memberIds } = groups.data.filter((elem) => elem.id === groupId)[0]
      dispatch(getUsersByIds(memberIds))
    }
  }
  useEffect(() => {
    if (userId.length === 28) {
      const getUser = async () => {
        const { data, error } = await getUserById(userId)
        if (!error && data) {
          //check if user is not found doesn't error
          if (data.groupIds.includes(groupId)) {
            setInGroup(true)
          }
          setUser(data)
        } else if (!error && !data) {
          const { errorMsg } = JSON.parse(JSON.stringify(appState.data))
          errorMsg.push(`Can find user with id ${userId}`)
          dispatch(saveAppState({ errorMsg: errorMsg }))
        } else if (error) {
          const { errorMsg } = JSON.parse(JSON.stringify(appState.data))
          errorMsg.push(errorMsg)
          dispatch(saveAppState({ errorMsg: errorMsg }))
        }
      }
      getUser()
    } else if (user !== null) {
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
