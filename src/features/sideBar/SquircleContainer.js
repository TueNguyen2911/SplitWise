import { Toolbar, Tooltip, tooltipClasses } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
const PopperDiv = styled.div`
  background-color: black;
  position: absolute;
  padding: 0.68rem 1rem;
  width: max-content;
  top: 50%;
  left: 155%;
  transform-origin: left;
  transform: translateY(-50%) scale(0.8);
  border-radius: 4px;
  opacity: 0;
  transition: opacity 200ms, transform 200ms;

  &::before {
    content: '';
    position: absolute;
    background: black;
    left: -2px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 24px;
    height: 24px;
    z-index: -100;
  }
`
const SideBarNav = styled.nav`
  color: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`
const SquirclesUl = styled.ul`
  margin: 0;
  padding: 1rem;
  background: rgb(71, 71, 71);
  list-style-type: none;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  z-index: 0;
`
const SquircleLi = styled.li`
  background: rgb(122, 122, 122);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: border-radius 200ms, background 128ms;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 20px black;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background: white;
    position: absolute;
    border-radius: 4px;
    top: 50%;
    transform: translate(-100%, -50%) scale(0);
    transition: transform 200ms;
  }
  &:hover {
    border-radius: 35%;
  }
  &:hover ${PopperDiv} {
    opacity: 0.8;
    transform: translateY(-50%) scale(0.8);
  }
  &:hover::before {
    transform: translate(-100%, -50%) scale(0.5);
  }
`
const DividerLi = styled.li`
  width: 100%;
  background: white;
  height: 2px;
  border-radius: 1px;
  opacity: 0.4;
  transform: scale(0.75);
`

const GroupIconImg = styled.img`
  height: inherit;
  width: inherit;
  object-fit: cover;
  border-radius: inherit;
`

const DiscordTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'black'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'black',
    fontSize: '1rem',
    padding: '10px'
  }
}))

const SquircleContainer = ({ setCreateGroup, setSBWidth, groups }) => {
  const componentRef = useRef()
  const history = useHistory()
  useEffect(() => {
    setSBWidth(componentRef.current.offsetWidth)
  }, [])

  return (
    <>
      <SideBarNav>
        <SquirclesUl ref={componentRef}>
          <DiscordTooltip title="Home" placement="right">
            <SquircleLi onClick={() => history.push('/')}>
              <GroupIconImg
                src={
                  'https://firebasestorage.googleapis.com/v0/b/splitwise-83ca0.appspot.com/o/Screenshot%202022-01-01%20212759.png?alt=media&token=e5175b8f-a207-4ae3-a514-66491d7e9a00'
                }
              />
            </SquircleLi>
          </DiscordTooltip>

          <DividerLi></DividerLi>
          {groups.map((elem) => (
            <DiscordTooltip title={elem.name} placement="right">
              <SquircleLi onClick={() => history.push(`/group/${elem.id}`)}>
                <GroupIconImg src={elem.avatar} />
              </SquircleLi>
            </DiscordTooltip>
          ))}

          <DiscordTooltip title="Create group" placement="right">
            <SquircleLi className="green-squircle" onClick={() => setCreateGroup(true)}>
              <AddIcon className="add-icon" fontSize="large" sx={{ color: '#4fc96f' }} />
            </SquircleLi>
          </DiscordTooltip>
        </SquirclesUl>
      </SideBarNav>
    </>
  )
}

export default SquircleContainer
