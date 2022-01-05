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
  const handleMemberDetailsOpen = (event, id) => {
    setAnchorEl(event.currentTarget)
    setPoppedId(id)
  }
  const handleMemberDetailsClose = () => {
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
