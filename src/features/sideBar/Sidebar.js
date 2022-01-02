import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SquircleContainer from './SquircleContainer'

const SidebarContainer = ({ setCreateGroup, setSBWidth }) => {
  const groups = useSelector((state) => state.groups.data)
  return (
    <>
      <SquircleContainer setCreateGroup={setCreateGroup} setSBWidth={setSBWidth} groups={groups} />
    </>
  )
}

export default SidebarContainer
