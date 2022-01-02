import styled from 'styled-components'

export const MainContent = styled.div`
  margin-left: ${({ SBWidth }) => SBWidth}px;
  background-image: linear-gradient(to bottom right, #b5fefe, #ffffff);
  min-height: 100vh;
  pointer-events: ${({ createGroup }) => (createGroup ? 'none' : 'auto')};
`
