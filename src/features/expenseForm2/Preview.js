import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
const Preview = ({ file, removeBillImg }) => {
  const [preview, setPreview] = React.useState(null)
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setPreview(reader.result)
    }
  }
  const handleClose = () => {
    removeBillImg()
    setPreview(null)
  }
  const imgstyle = {
    width: '300px'
  }
  return (
    <div>
      {preview ? (
        <div className="img-wrap">
          <img style={imgstyle} src={preview} alt="preview" />
          <CloseIcon className="close" onClick={handleClose} />
        </div>
      ) : null}
    </div>
  )
}

export default Preview
