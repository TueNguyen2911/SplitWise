import {
  IconButton,
  Menu,
  MenuItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ImageIcon from '@mui/icons-material/Image'
import PersonAdd from '@mui/icons-material/PersonAdd'
import { styled } from '@mui/system'
import React, { useState } from 'react'

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#1976d2',
  '&:hover': {
    opacity: '0.8 !important'
  }
}))

const GroupMenu = () => {
  const renderMenu = (
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      sx={{ position: 'absolute', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction icon={<EditIcon />} tooltipTitle={'Change group name'} />
      <SpeedDialAction icon={<ImageIcon />} tooltipTitle={'Change group avatar'} />
      <SpeedDialAction icon={<NoteAddIcon />} tooltipTitle={'Create new expense '} />
      <SpeedDialAction icon={<PersonAddIcon />} tooltipTitle={'Add new member'} />
    </SpeedDial>
  )
  return (
    <span className="GroupMenu" style={{ position: 'absolute', bottom: '25px', right: '25px' }}>
      {renderMenu}
    </span>
  )
}

export default GroupMenu
