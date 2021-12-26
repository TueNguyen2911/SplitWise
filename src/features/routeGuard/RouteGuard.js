import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
/**
 *
 * @param {Array} components an array of components to render/return
 * @returns component for App to render
 */
const RouteGuard = ({ path, components }) => {
  const userId = useSelector((state) => state.auth.userId)
  console.log(userId, path)
  if (path === '/login') {
    return <>{userId ? <Redirect to="/" /> : components.map((component) => <> {component} </>)}</>
  }

  return (
    <>{userId ? components.map((component) => <> {component} </>) : <Redirect to="/login" />}</>
  )
}

export default RouteGuard
