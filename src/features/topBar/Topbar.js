import React, { useEffect, useRef, useState } from 'react'
import { auth } from '../../firebase/config'
import { Menu, Badge, MenuItem, AppBar, Toolbar, Box, Avatar, Button, Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { logout, resetUserAuth } from '../../redux/slices/userAuthSlice'
import GroupIcon from '@mui/icons-material/Group'
import { saveAppState, resetAppState } from '../../redux/slices/appSlice'
import { resetCurrentUser } from '../../redux/slices/currentUserSlice'
import { resetGroup } from '../../redux/slices/groupSlice'
import { resetUsers } from '../../redux/slices/usersSlice'
import { resetExpenseForm } from '../../redux/slices/expenseFormSlice'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Preview from './Preview'
const TopbarContainer = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const appState = useSelector((state) => state.app)
  const userAuth = useSelector((state) => state.app)
  const topBarRef = useRef()
  const editImgRef = useRef()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isIdCopied, setIsIdCopied] = useState(false)
  const [imgFile, setImgFile] = useState(null)

  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const setAvatar = (file) => {}
  const logOut = () => {
    dispatch(resetAppState())
    dispatch(resetCurrentUser())
    dispatch(resetExpenseForm())
    dispatch(resetGroup())
    dispatch(resetUsers())

    dispatch(logout())
    dispatch(resetUserAuth()) //reset UserAuth after
  }
  const copyId = (e) => {
    navigator.clipboard.writeText(e.target.innerText.substring(1)) //remove the hashtag symbol
    setIsIdCopied(true)
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
      <MenuItem
        onClick={(e) => {
          editImgRef.current.click()
        }}
      >
        <AddPhotoAlternateIcon />
        Edit user avatar
        <input
          ref={editImgRef}
          name="avatar"
          id="avatar"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            setImgFile(e.target.files[0])
          }}
        />
      </MenuItem>
      <Tooltip title={isIdCopied ? `Copied ${currentUser.data.id}` : 'Copy id'}>
        <MenuItem onClick={(e) => copyId(e)}>#{currentUser.data.id}</MenuItem>
      </Tooltip>
    </Menu>
  )

  useEffect(() => {
    dispatch(saveAppState({ topBarHeight: topBarRef.current.offsetHeight }))
  }, [])

  useEffect(() => {
    if (isIdCopied) {
      setTimeout(() => {
        setIsIdCopied(false)
      }, 3000)
    }
  }, [isIdCopied])

  return (
    <div className="TopBar" ref={topBarRef}>
      <nav>
        <Preview file={imgFile} setImgFile={setImgFile} closeMenu={handleMenuClose} />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: 'white' }}>
            <Toolbar>
              <Box sx={{ flexGrow: 1 }} />
              <Box>
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

                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                  <Badge badgeContent={0} color="error">
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
            </Toolbar>
          </AppBar>
          {renderMenu}
        </Box>
      </nav>
    </div>
  )
}

export default TopbarContainer
