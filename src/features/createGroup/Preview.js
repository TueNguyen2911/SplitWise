import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
const Preview = ({ url }) => {
  const imgstyle = {
    width: '300px'
  }
  return (
    <div>
      {url ? (
        <div className="img-wrap">
          <img style={imgstyle} src={url} alt="preview" />
        </div>
      ) : null}
    </div>
  )
}

export default Preview
