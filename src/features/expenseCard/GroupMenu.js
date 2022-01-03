import { IconButton, Menu, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { styled } from '@mui/system'
import React, { useState } from 'react'

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#1976d2',
  '&:hover': {
    opacity: '0.8 !important'
  }
}))

const GroupMenu = () => {
  const [close, setClose] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      keepMounted={false}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <EditIcon /> Edit Group Avatar
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <EditIcon /> Edit Group Name
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <NoteAddIcon /> Create new expense
      </MenuItem>
    </Menu>
  )
  return (
    <span className="GroupMenu" style={{ position: 'absolute', bottom: '25px', right: '25px' }}>
      <IconButton
        sx={{
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#6faeed'
          }
        }}
        size="large"
        onClick={(e) => {
          setClose(!close)
          handleProfileMenuOpen(e)
        }}
      >
        {isMenuOpen ? (
          <CloseIcon sx={{ color: 'white' }} fontSize="large" />
        ) : (
          <AddIcon sx={{ color: 'white' }} fontSize="large" />
        )}
      </IconButton>
      {renderMenu}
    </span>
  )
}

export default GroupMenu
