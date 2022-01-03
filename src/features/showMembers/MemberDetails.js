import { Button, Divider, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'

const MemberDetails = ({ userData }) => {
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
        horizontal: 'right'
      }}
      keepMounted={false}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      sx={{ transform: 'translateY(5%)' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{userData.userName}</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Close</MenuItem>
    </Menu>
  )
  return (
    <div
      style={{
        backgroundColor: 'white',
        position: 'absolute',
        right: '225px'
      }}
    >
      {renderMenu}
    </div>
  )
}

export default MemberDetails
