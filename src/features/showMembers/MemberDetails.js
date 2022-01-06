import { Avatar, Button, Divider, Menu, MenuItem, Popover, Box } from '@mui/material'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { kickMember } from '../../firebase/operations'
import { saveAppState } from '../../redux/slices/appSlice'

const MemberDetails = ({ users, id, anchorEl, handleMemberDetailsClose }) => {
  const isMenuOpen = Boolean(anchorEl)
  const poppedUser = users.data.filter((elem) => elem.id === id)[0]
  const appState = useSelector((state) => state.app)
  const { groupId } = useParams()
  const dispatch = useDispatch()
  const handleKick = () => {
    const kick = async () => {
      const { successMsg, errorMsg } = JSON.parse(JSON.stringify(appState.data))
      const { msg, error } = await kickMember(poppedUser, groupId)
      if (msg) {
        successMsg.push(msg)
        dispatch(saveAppState({ successMsg: successMsg }))
      } else {
        errorMsg.push(error)
        dispatch(saveAppState({ errorMsg: errorMsg }))
      }
    }
    kick()
  }
  if (id.length === 0 || !poppedUser) {
    return null
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      id={poppedUser.id}
      keepMounted={false}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMemberDetailsClose}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px', gap: '10px' }}>
        <Avatar src={poppedUser.avatar} sx={{ width: 56, height: 56 }} />
        <span>{poppedUser.userName}</span>
        <span>#{poppedUser.id}</span>
        <span>Name: {poppedUser.name}</span>
        <Button onClick={handleKick} fullWidth variant="outlined" color="error">
          Kick {poppedUser.userName}
        </Button>
      </Box>
    </Popover>
  )
}

export default MemberDetails
