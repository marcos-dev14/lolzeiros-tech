import { useCallback, useMemo, useRef } from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';

// @ts-ignore
import Editor from '@ckeditor/ckeditor5-build-classic';

// @ts-ignore
// import Editor from 'ckeditor5-custom-build/build/ckeditor';

import { Container } from './styles';
import { CSSProperties } from 'styled-components';

type Props = {
  content: string;
  setContent: (value: string) => void;
  style?: CSSProperties;
}

export function ContentEditor({
  content,
  setContent,
  style = {},
  ...rest
}: Props) {
  const toolbar = useMemo(() => [
    'fontSize',
    'undo', 'redo',
    '|',
    'heading',
    '|',
    'bold', 'italic',
    '|',
    'bulletedList', 'numberedList', 'todoList',
    '|',
    'mediaEmbed', 'link',
  ], []);

  const heading = useMemo(() => ({
    options: Array(6).fill(1).map((e, index) => ({
      model: `heading${index+1}`,
      view: `h${index+1}`,
      title: `Heading ${index+1}`,
      class: `ck-heading_heading${index+1}`,
    }))
  }), [])

  return (
    <Container style={style}>
      <CKEditor
        editor={ Editor }
        config={{
          toolbar,
          heading,
          fontSize: {
            options: [
                9,
                11,
                13,
                'default',
                17,
                19,
                21
            ]
          },
        }}
        data={content}
        // @ts-ignore
        // onChange={ ( event, editor ) => {
        //     const data = editor.getData();
        // } }
        // @ts-ignore
        onBlur={(_, editor) => {
          const data = editor.getData();
          setContent(data)
        }
        }
        style={{
          paddingLeft: '2rem'
        }}
      />
    </Container>
  );
}
