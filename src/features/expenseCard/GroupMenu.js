import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ImageIcon from '@mui/icons-material/Image'
import { useDispatch } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import React from 'react'

const GroupMenu = () => {
  const dispatch = useDispatch()

  return (
    <div className="GroupMenu" style={{ position: 'absolute', bottom: '25px', right: '25px' }}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction icon={<EditIcon />} tooltipTitle={'Change group name'} />
        <SpeedDialAction icon={<ImageIcon />} tooltipTitle={'Change group avatar'} />
        <SpeedDialAction
          onClick={() => dispatch(saveAppState({ createExpense: true }))}
          icon={<NoteAddIcon />}
          tooltipTitle={'Create new expense '}
        />
        <SpeedDialAction
          onClick={() => dispatch(saveAppState({ addMember: true }))}
          icon={<PersonAddIcon />}
          tooltipTitle={'Add new member'}
        />
      </SpeedDial>
    </div>
  )
}

export default GroupMenu
