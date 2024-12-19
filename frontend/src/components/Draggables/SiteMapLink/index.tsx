import React, { useCallback, useEffect, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Component } from '~/types/main'

import { Container } from './styles';

interface Props extends Component {
  id: number;
  key: number;
  dragging: boolean;
}

export function SiteMapLink({ children, id, dragging, ...rest }: Props) {
  const {
    attributes,
    listeners,
    transition,
    transform,
    setNodeRef
  } = useSortable({ id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition
  }), [transform, transition]);

  return dragging ? (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} {...rest}>
      <Container isDragging {...rest}>
        {children}
      </Container>
    </div>
  )
  : (
    <div ref={setNodeRef} style={style} {...rest}>
      <Container isDragging={false} {...rest}>
        {children}
      </Container>
    </div>
  )
}