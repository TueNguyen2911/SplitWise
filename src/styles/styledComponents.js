import styled from 'styled-components'

export const MainContent = styled.div`
  margin-left: ${({ SBWidth }) => SBWidth}px;
  background-image: linear-gradient(to bottom right, #b5fefe, #ffffff);
  min-height: 100vh;
  pointer-events: ${({ appState }) =>
    appState.addMember || appState.createGroup || appState.createExpense || appState.avatarPreview
      ? 'none'
      : 'auto'};
`
export const ErrorText = styled.div`
  color: #ff0000;
`
