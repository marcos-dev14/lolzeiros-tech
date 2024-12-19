import { useCallback, useMemo, useRef } from 'react';
import JoditEditor from "jodit-react";

import { Container } from './styles';
import { CSSProperties } from 'styled-components';

type Props = {
  content: string;
  setContent: (value: string) => void;
  style?: CSSProperties;
}

export function Editor({
  content,
  setContent,
  style = {},
  ...rest
}: Props) {
  const editor = useRef(null)

	const config = useMemo(() => ({
    readonly: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    showPlaceholder: false,
    toolbarInlineForSelection: true,
    language: "pt_br",
    defaultMode: "1",
    height: 575,
    allowResizeX: false,
    allowResizeY: false,
    style: {fontFamily: 'Arial'},
    buttons: "paragraph,bold,italic,underline,eraser,brush,ul,ol,indent,outdent,left,hr,video,table,link,undo,redo,find,source",
    ...rest
  }), [rest]);

  return (
    <Container
      style={style}
    >
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
		    onBlur={(ct) => setContent(ct)}
        onChange={() => {}}
      />
    </Container>
  );
}
