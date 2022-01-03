import { Avatar } from '@mui/material'
import styled from 'styled-components'
import React from 'react'
import MemberDetails from './MemberDetails'
const AvatarContainer = styled.div`
  display: flex;
  & > * {
    margin: 4px;
  }
  &:hover {
    background-color: white;
  }
`
const AvatarLabel = styled.div`
  display: flex;
  align-items: center;
`
const MemberItem = ({ userData, handleMemberDetailsOpen }) => {
  return (
    <div className="MemberItem" style={{ padding: '5px', pointerEvents: 'cursor' }}>
      <AvatarContainer onClick={(e) => handleMemberDetailsOpen(e, userData.id)}>
        <AvatarLabel>
          <Avatar style={{ marginRight: '14px' }} src={userData.avatar} />
          <span>{userData.userName}</span>
        </AvatarLabel>
      </AvatarContainer>
    </div>
  )
}

export default MemberItem
