import { Avatar, Button, Divider, Menu, MenuItem, Popover, Box } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { kickMember } from '../../firebase/operations'

const MemberDetails = ({ users, id, anchorEl, handleMemberDetailsClose }) => {
  const isMenuOpen = Boolean(anchorEl)
  const poppedUser = users.data.filter((elem) => elem.id === id)[0]
  const { groupId } = useParams()
  const handleKick = () => {
    console.log('Hi')
    const kick = async () => {
      const { msg, error } = await kickMember(poppedUser, groupId)
      console.log(msg)
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
