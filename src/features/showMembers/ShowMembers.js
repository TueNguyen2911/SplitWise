import { Avatar, Button, Divider, Menu, MenuItem, Popover } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUsersByIds } from '../../redux/slices/usersSlice'
import MemberDetails from './MemberDetails'
import MemberItem from './MemberItem'

const ShowMembers = () => {
  const appState = useSelector((state) => state.app)
  const users = useSelector((state) => state.users)
  const groups = useSelector((state) => state.groups)
  const { groupId } = useParams()

  const [anchorEl, setAnchorEl] = useState(null)
  const [poppedId, setPoppedId] = useState('')
  const isMenuOpen = Boolean(anchorEl)
  const handleProfileMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget)
    setPoppedId(id)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(groupId)
    if (groups.status === 'succeeded' && groupId) {
      const { memberIds } = groups.data.filter((elem) => elem.id === groupId)[0]
      dispatch(getUsersByIds(memberIds))
    }
  }, [groups.status, groupId])

  const RenderMenu = ({ users, id }) => {
    const poppedUser = users.data.filter((elem) => elem.id === id)[0]
    if (id.length === 0 || !poppedUser) return null
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
        onClose={handleMenuClose}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '5px', gap: '10px' }}>
          <Avatar src={poppedUser.avatar} sx={{ width: 56, height: 56 }} />
          <span>{poppedUser.userName}</span>
          <span>#{poppedUser.id}</span>
          <span>Name: {poppedUser.name}</span>
          <Button fullwidth variant="outlined" color="error">
            Kick {poppedUser.userName}
          </Button>
        </Box>
      </Popover>
    )
  }

  if (appState.data.showMembers && appState.data.membersIcon) {
    return (
      <div
        className="ShowMembers"
        style={{
          top: `${appState.data.topBarHeight}px`,
          position: 'fixed',
          minHeight: '94vh',
          width: '220px',
          backgroundColor: '#dedede',
          right: '0'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '5px' }}>
          {users.status === 'succeeded'
            ? users.data.map((elem) => (
                <>
                  <MemberItem userData={elem} handleProfileMenuOpen={handleProfileMenuOpen} />
                </>
              ))
            : null}
          {users.status === 'succeeded' ? <RenderMenu users={users} id={poppedId} /> : null}
        </div>
      </div>
    )
  }
  return null
}

export default ShowMembers
