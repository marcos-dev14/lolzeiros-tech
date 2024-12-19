import React from 'react';

import { ReactComponent as ZoomIcon } from '~assets/zoomin.svg';

import {
  Container,
  MessageInfo,
  Content,
  Attachment
} from './styles';

type IMessage = {
  id: number;
  content: string;
  user: {
    avatar: string;
    name: string;
  };
  sent: string;
  attachments: {
    id: number;
    name: string;
    file: string;
  }[];
  sender: boolean;
}

type Props = {
  message: IMessage;
}

export function Message({ message }: Props) {
  return (
    <Container sender={message.sender}>
      <img
        src={message.user.avatar}
        alt={message.user.name}
      />
      <MessageInfo sender={message.sender}>
        <strong
          title={message.user.name}
          style={{ fontFamily: "Roboto" }}
        >
          {message.user.name}
        </strong>
        <small>
          {message.sent}
        </small>
      </MessageInfo>
      <Content
        id="message1" 
        // @ts-ignore
        onClick={(e) => handleInputFocus(e)}
      >
        <textarea
          defaultValue={message.content}
        />
        {!!message.attachments.length &&
          <div>
            {message.attachments.map(a => 
              <Attachment key={a.id}>
                <img
                  src={a.file}
                  alt={a.name}
                />
                <ZoomIcon />
              </Attachment>
            )}
          </div>
        }
      </Content>
    </Container>
  );
}
