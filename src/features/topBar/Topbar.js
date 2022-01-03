import React, { useEffect, useRef, useState } from 'react'
import { auth } from '../../firebase/config'
import {
  Menu,
  Badge,
  MenuItem,
  AppBar,
  Toolbar,
  Box,
  Divider,
  Avatar,
  Button,
  Tooltip
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/userAuthSlice'
import GroupIcon from '@mui/icons-material/Group'
import { saveAppState } from '../../redux/slices/appSlice'
const TopbarContainer = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const appState = useSelector((state) => state.app)
  const topBarRef = useRef()
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }
  const logOut = () => {
    dispatch(logout())
    window.location.reload()
  }
  const menuId = 'top-bar-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted={false}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      sx={{ transform: 'translateY(5%)' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{currentUser.data.userName}</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Close</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted={false}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon color="primary" />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{currentUser.data.name}</p>
      </MenuItem>
    </Menu>
  )
  useEffect(() => {
    dispatch(saveAppState({ topBarHeight: topBarRef.current.offsetHeight }))
  }, [])
  return (
    <div className="TopBar" ref={topBarRef}>
      <nav>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: 'white' }}>
            <Toolbar>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button sx={{ margin: '5px' }} onClick={logOut} variant="outlined">
                  <LogoutIcon />
                </Button>
                {appState.data.membersIcon ? (
                  <IconButton
                    onClick={() =>
                      dispatch(saveAppState({ showMembers: !appState.data.showMembers }))
                    }
                    size="large"
                    aria-label="show group members"
                    color="inherit"
                  >
                    <Tooltip title="Show group members" placement="bottom">
                      <GroupIcon
                        style={
                          appState.data.showMembers
                            ? { color: 'black' }
                            : { color: 'rgba(0, 0, 0, 0.54)' }
                        }
                        color="action"
                      />
                    </Tooltip>
                  </IconButton>
                ) : null}

                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                  <Badge badgeContent={4} color="error">
                    <MailIcon color="action" />
                  </Badge>
                </IconButton>
                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon color="action" />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar alt="Remy Sharp" src={currentUser.data.avatar} />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon color="primary" />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </Box>
      </nav>
    </div>
  )
}

export default TopbarContainer
