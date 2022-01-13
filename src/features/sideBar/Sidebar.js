import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SquircleContainer from './SquircleContainer'

const SidebarContainer = ({ setCreateGroup, setSBWidth }) => {
  const { status, data } = useSelector((state) => state.groups)
  return (
    <div>
      {status === 'succeeded' ? (
        <>
          <SquircleContainer
            setCreateGroup={setCreateGroup}
            setSBWidth={setSBWidth}
            groups={data}
          />
        </>
      ) : null}
    </div>
  )
}

export default SidebarContainer
