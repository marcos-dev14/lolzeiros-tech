import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MainContainer, Container, Tag, DeleteTag, Input } from './styles';

import { isNotEmpty } from '~utils/validation';
import { InputProps, ITag } from '~types/main';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

interface Props extends InputProps {
  tags: string;
  width?: string;
  title?: string;
  validated?: boolean;
  fullW?: boolean;
  noTitle?: boolean;
  orange?: boolean;
  isOnTable?: boolean;
}

export function TableTagInput({
  tags,
  title = '',
  noTitle = false,
  validated = false,
  width = '40.25rem',
  fullW = false,
  orange = false,
  style = {},
  isOnTable = false,
  ...rest
}: Props) {
  const formattedTags = useMemo(() =>
    tags.split(',').map((e, index) => ({ id: `${index}-${e}`, value: e }))
  , [tags]);

  const mainContainerStyle = useMemo(() => (isOnTable ?
    {
      height: '2.75rem',
      width: '100%',
      marginTop: 0,
      justifyContent: 'center',
      ...style
    } : {})
  , [style, isOnTable])

  const containerStyle = useMemo(() => (isOnTable ? {
    border: 'none',
  } : {}), [isOnTable])

  return (
    <MainContainer hasTitle={!!title} fullW={fullW} style={mainContainerStyle}>
      {!!noTitle && <label htmlFor={title}>{title}</label>}
      <Container
        width={fullW ? '100%' : width}
        validated={validated || !!tags.length}
        style={containerStyle}
      >
        {formattedTags.map(({ id, value }) => 
          <Tag key={id} orange={orange}>
            <p>{value}</p>
            {!isOnTable &&
              <DeleteTag
                onClick={() => {}}
                orange={orange}
                type="button"
              >
                <CloseIcon />
              </DeleteTag>
            }
          </Tag>
        )}
      </Container>
    </MainContainer>
  );
}
