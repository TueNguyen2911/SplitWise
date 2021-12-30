import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
/**
 *
 * @param {Array} components an array of components to render/return
 * @returns component for App to render
 */
const RouteGuard = ({ path, components }) => {
  const userAuth = useSelector((state) => state.userAuth)
  if (userAuth.status == 'succeeded') {
    if (path === '/login') {
      return (
        <>
          {userAuth.userId ? (
            <Redirect to="/" />
          ) : (
            components.map((component) => <> {component} </>)
          )}
        </>
      )
    }

    return (
      <>
        {userAuth.userId ? (
          components.map((component) => <> {component} </>)
        ) : (
          <Redirect to="/login" />
        )}
      </>
    )
  }
}

export default RouteGuard
