import React, { useCallback, useEffect, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { ReactComponent as MoveIcon } from '~assets/move_white.svg';

import { Component } from '~/types/main'

import { Container, DraggingBadge } from './styles';

interface Props extends Component {
  id: string;
  key: string;
  image: string;
  disabled: boolean;
  dragging: boolean;
  sorting: boolean;
  setIsDragging: (value: boolean) => void;
}

export function GalleryImage({ children, id, image, dragging, sorting, setIsDragging, disabled, ...rest }: Props) {
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
      <Container
        isDragging
        isSorting={sorting}
        image={image}
        disabled={disabled}
        {...rest}
      >
        <DraggingBadge onClick={() => setIsDragging(false)}>
          <MoveIcon />
        </DraggingBadge>
        {children}
      </Container>
    </div>
  ) :
  (
    <div ref={setNodeRef} style={style} {...rest}>
      <Container
        isDragging={false}
        isSorting={false}
        image={image}
        disabled={disabled}
        {...rest}
      >
        <DraggingBadge
          onClick={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
        >
          <MoveIcon />
        </DraggingBadge>
        {children}
      </Container>
    </div>
  )
}