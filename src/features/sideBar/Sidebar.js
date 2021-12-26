import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SquircleContainer from './SquircleContainer'

const SidebarContainer = ({ setSBWidth }) => {
  const groups = useSelector((state) => state.groups.data)
  return (
    <>
      <SquircleContainer setSBWidth={setSBWidth} groups={groups} />
    </>
  )
}

export default SidebarContainer
