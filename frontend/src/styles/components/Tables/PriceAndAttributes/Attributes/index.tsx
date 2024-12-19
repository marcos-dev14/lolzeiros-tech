import { ReactComponent as MoveIcon } from '~assets/move.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { TagInput } from '~components/TagInput';
import { Input } from '~components/Input';
import { MaxCharacters, TableActionButton } from '~styles/components/tables';

import { Container } from './styles';
import { useState } from 'react';

export function PriceAndAttributesTable() {
  const [tags, setTags] = useState([]);

  return (
    <Container>
       <colgroup>
        <col span={1} style={{ width: '5%' }} />
        <col span={1} style={{ width: '25%' }} />
        <col span={1} style={{ width: '62%' }} />
        <col span={1} style={{ width: '8%' }} />
      </colgroup>
      <thead>
        <th>Mover</th>
        <th>Nerf Atributo</th>
        <th>Descrição do Atributo</th>
        <th>Ação</th>
      </thead>
      <tbody>
        <tr>
          <td>
            <MoveIcon />
          </td>
          <td>
            <MaxCharacters>
              <Input
                name="Atributo"
                noTitle
                validated
                disabled
                width="12.5rem"
                value="Teste"
              />
              <p>5/30 Caracteres</p>
            </MaxCharacters>
          </td>
          <td>
            <MaxCharacters>
              <TagInput
                tags={tags}
                setTags={setTags}
              />
              <p>Máximo de 30 Caracteres</p>
            </MaxCharacters>
          </td>
          <td>
            <div>
              <TableActionButton type="button">
                <PlusIcon />
              </TableActionButton>
              <TableActionButton type="button">
                <TrashIcon />
              </TableActionButton>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <MoveIcon />
          </td>
          <td>
            <MaxCharacters>
              <Input
                name="Atributo"
                noTitle
                validated
                disabled
                width="12.5rem"
                value="Teste"
              />
              <p>5/30 Caracteres</p>
            </MaxCharacters>
          </td>
          <td>
            <MaxCharacters>
              <TagInput
                tags={tags}
                setTags={setTags}
                />
              <p>Máximo de 30 Caracteres</p>
            </MaxCharacters>
          </td>
          <td>
            <div>
              <TableActionButton type="button">
                <PlusIcon />
              </TableActionButton>
              <TableActionButton type="button">
                <TrashIcon />
              </TableActionButton>
            </div>
          </td>
        </tr>
      </tbody>
    </Container>
  );
}
