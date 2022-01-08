import React from 'react'
const Preview = ({ url }) => {
  const imgstyle = {
    width: '300px'
  }
  return (
    <div className="Preview">
      {url ? (
        <div className="img-wrap">
          <img style={imgstyle} src={url} alt="preview" />
        </div>
      ) : null}
    </div>
  )
}

export default Preview
