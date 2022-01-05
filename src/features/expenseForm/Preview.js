import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
const Preview = ({ url, removeBillImg }) => {
  const handleClose = () => {
    removeBillImg()
  }
  const imgstyle = {
    width: '300px'
  }
  return (
    <div>
      {url.length > 0 ? (
        <div className="img-wrap">
          <img style={imgstyle} src={url} alt="preview" />
          <CloseIcon className="close" onClick={handleClose} />
        </div>
      ) : null}
    </div>
  )
}

export default Preview
