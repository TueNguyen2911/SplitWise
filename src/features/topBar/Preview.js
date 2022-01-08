import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Avatar, Button, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { saveAppState } from '../../redux/slices/appSlice'
import { changeUserAvatar } from '../../firebase/operations'
const Preview = ({ file, setImgFile, closeMenu }) => {
  const dispatch = useDispatch()
  const [preview, setPreview] = useState(null)
  const appState = useSelector((state) => state.app.data)
  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setPreview(reader.result)
      }
    } else {
      setPreview(null)
    }
  }, [file])

  const handleClose = () => {
    setPreview(null)
  }
  const avatarStyle = {
    width: '200px',
    height: '200px',
    border: 'solid 1px',
    padding: '10px'
  }
  useEffect(() => {
    console.log(preview)
    if (preview) {
      dispatch(saveAppState({ avavtarPreview: true }))
    }
  }, [preview, dispatch])
  return (
    <Paper
      className="Preview"
      elevation={24}
      style={{
        position: 'absolute',
        top: '50px',
        left: '40%',
        border: 'solid 1px',
        pointerEvents: 'auto',
        zIndex: 9999
      }}
    >
      {preview && appState.avavtarPreview ? (
        <div style={{ padding: '50px' }}>
          <Avatar sx={avatarStyle} src={preview} alt="preview" />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              size="small"
              onClick={(e) => {
                dispatch(saveAppState({ avavtarPreview: false }))
                setImgFile(null)
                setPreview(null)
                closeMenu()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={async () => {
                const { msg, error } = await changeUserAvatar(file)
                const { successMsg, errorMsg } = JSON.parse(JSON.stringify(appState))
                if (msg) {
                  successMsg.push(msg)
                  dispatch(saveAppState({ successMsg: successMsg }))
                  dispatch(saveAppState({ createGroup: false }))
                } else {
                  errorMsg.push(error)
                  dispatch(saveAppState({ errorMsg: errorMsg }))
                }
                dispatch(saveAppState({ avavtarPreview: false }))
                setImgFile(null)
                setPreview(null)
                closeMenu()
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      ) : null}
    </Paper>
  )
}

export default Preview
