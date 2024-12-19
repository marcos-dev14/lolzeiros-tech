import styled from 'styled-components';
import { BoxBadge, BoxInput } from '../../styles/components/box';

export const CopyBoxInput = styled(BoxInput)`
  border-radius: 0;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border-left-width: 1px;
`;

export const CopyContentBadge = styled(BoxBadge)`
  border-radius: 0;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border-left-width: 0;
  cursor: pointer;

  svg {
    transition: fill 0.2s;
    border-radius: 0;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    
    &.viewBg {
      fill: #F3F4F7;

      .viewIcon{
        stroke: #3699CF;
      }

      &:hover {
        fill: #3699CF;        
        
        .viewIcon{
          stroke: #FFF;
        }
      }
    }
  }

  &[disabled] {
    cursor: not-allowed;
    
    svg {
      transition: fill 0.2s;
      border-radius: 0;
      border-top-right-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      
      &.viewBg {
        fill: #F3F4F7;

        .viewIcon{
          stroke: #3699CF;
        }
      }
  }
`;