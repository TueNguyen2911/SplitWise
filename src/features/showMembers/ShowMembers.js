import { Avatar, Button, Divider, Menu, MenuItem, Popover } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUsersByIds } from '../../redux/slices/usersSlice'
import MemberDetails from './MemberDetails'
import MemberItem from './MemberItem'

const ShowMembers = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [poppedId, setPoppedId] = useState('')
  const appState = useSelector((state) => state.app)
  const users = useSelector((state) => state.users)
  const groups = useSelector((state) => state.groups)
  const { groupId } = useParams()

  const dispatch = useDispatch()
  const handleMemberDetailsOpen = (event, id) => {
    setAnchorEl(event.currentTarget)
    setPoppedId(id)
  }
  const handleMemberDetailsClose = () => {
    setAnchorEl(null)
  }
  const showMembersStyle = {
    top: `${appState.data.topBarHeight}px`,
    position: 'fixed',
    minHeight: '94vh',
    width: '220px',
    backgroundColor: '#dedede',
    right: '0px'
  }
  useEffect(() => {
    if (groups.status === 'succeeded' && groupId) {
      console.log('mounted')
      const { memberIds } = groups.data.filter((elem) => elem.id === groupId)[0]
      dispatch(getUsersByIds(memberIds))
    }
  }, [])

  useEffect(() => {
    if (groups.updateStatus === 'succeeded') {
      const { memberIds } = groups.data.filter((elem) => elem.id === groupId)[0]
      console.log('in showmember', memberIds.length)
      dispatch(getUsersByIds(memberIds))
    }
  }, [groups.updateStatus])
  if (appState.data.showMembers && users.status === 'succeeded') {
    return (
      <div className="ShowMembers" style={showMembersStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '5px' }}>
          {users.status === 'succeeded'
            ? users.data.map((elem, index) => (
                <>
                  <MemberItem
                    key={index}
                    userData={elem}
                    handleMemberDetailsOpen={handleMemberDetailsOpen}
                  />
                </>
              ))
            : null}
          {users.status === 'succeeded' ? (
            <MemberDetails
              users={users}
              id={poppedId}
              anchorEl={anchorEl}
              handleMemberDetailsClose={handleMemberDetailsClose}
            />
          ) : null}
        </div>
      </div>
    )
  }
  return null
}

export default ShowMembers
