import styled from 'styled-components';
import { theme } from '@natural/ui/styles/theme';

export const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: ${theme.colors.background};
  box-shadow: ${theme.shadows.panel};
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  z-index: 9999;
`;

export const PanelHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md};
`; 