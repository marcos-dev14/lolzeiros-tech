import styled from 'styled-components';

interface StatusBadgeProps {
  status: boolean;
}

export const StatusBadge = styled.p<StatusBadgeProps>`
  font-size: 0.5rem;
  text-transform: uppercase;
  font-family: "Roboto";
  font-weight: bold;

  color: ${({ theme: { colors }, status }) =>
    status ? colors.validatedBorder : colors.invalidatedBadge};
`;