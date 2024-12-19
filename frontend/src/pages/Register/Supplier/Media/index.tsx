import React, { useState } from 'react';

import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as MoveBlueIcon } from '~assets/move_blue.svg';
import { ReactComponent as MoveIcon } from '~assets/move.svg';
import { ReactComponent as TagIcon } from '~assets/tag_icon.svg';
import { ReactComponent as DownloadIcon } from '~assets/download.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Button, Container, CustomSectionTitle, MediaTag, MediaTagActions, MediaTagContainer, TableContent, TableHeader } from './styles';
import { DragPicture } from '@/src/components/DragPicture';
import { SupplierHeader } from '@/src/components/SupplierHeader';
import { TableActionButton } from '@/src/styles/components/tables';
import { Input } from '@/src/components/Input';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';

export function SuppliersMedia() {
  const [file, setFile] = useState('');

  return (
    <>
      <Header minimal route={['Cadastro', 'Representada', 'Fotos, PDF e Vídeos']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <SupplierHeader
            ref={null}
            disabled={false}
          />
          <DragPicture
            file={file}
            setFile={setFile}
            style={{
              width: '100%',
              height: '10rem',
              marginTop: '1.25rem'
            }}
            action="Arraste a imagem principal da Postagem ou clique aqui"
            format="JPG | GIF | PNG"
          />
          <MediaTagContainer>
            <MediaTag>
              <MediaTagActions>
                <TableActionButton onClick={() => {}}>
                  <MoveBlueIcon />
                </TableActionButton>
                <div>
                  <TableActionButton onClick={() => {}}>
                    <TagIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <ViewIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <TrashIcon />
                  </TableActionButton>
                </div>
              </MediaTagActions>
              <img
                src="https://cdn1.epicgames.com/offer/fn/21BR_KeyArt_EGS_Launcher_Blade_2560x1440_2560x1440-5335449297e75a6cc7c72ad01609b8e1"
                alt="attachment"
              />
            </MediaTag>
            <MediaTag>
              <MediaTagActions>
                <TableActionButton onClick={() => {}}>
                  <MoveBlueIcon />
                </TableActionButton>
                <div>
                  <TableActionButton onClick={() => {}}>
                    <TagIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <ViewIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <TrashIcon />
                  </TableActionButton>
                </div>
              </MediaTagActions>
              <img
                src="https://cdn1.epicgames.com/offer/fn/21BR_KeyArt_EGS_Launcher_Blade_2560x1440_2560x1440-5335449297e75a6cc7c72ad01609b8e1"
                alt="attachment"
              />
            </MediaTag>
            <MediaTag>
              <MediaTagActions>
                <TableActionButton onClick={() => {}}>
                  <MoveBlueIcon />
                </TableActionButton>
                <div>
                  <TableActionButton onClick={() => {}}>
                    <TagIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <ViewIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <TrashIcon />
                  </TableActionButton>
                </div>
              </MediaTagActions>
              <img
                src="https://cdn1.epicgames.com/offer/fn/21BR_KeyArt_EGS_Launcher_Blade_2560x1440_2560x1440-5335449297e75a6cc7c72ad01609b8e1"
                alt="attachment"
              />
            </MediaTag>
          </MediaTagContainer>
          <DragPicture
            file={file}
            setFile={setFile}
            style={{
              width: '100%',
              height: '10rem',
              marginTop: '1.25rem'
            }}
            action="Arraste o arquivo ou clique aqui"
            format="PDF | DOC | XLS"
          />
          <TableHeader>
            <div>
              <strong>Ordem</strong>
            </div>
            <div>
              <strong>Nome do Arquivo</strong>
            </div>
            <div>
              <strong>Formato</strong>
            </div>
            <div>
              <strong>Data</strong>
            </div>
            <div>
              <strong>Ação</strong>
            </div>
          </TableHeader>
          <TableContent>
            <div>
              <MoveIcon />
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="51.75rem"
                validated={false}
              />
            </div>
            <div>
              <NoTitleSelect
                placeholder="Selecione..."
                setValue={() => {}}
                customWidth="6.25rem"
              />
            </div>
            <div>
              <StaticDateBox
                name=""
                title=""
                width="7.5rem"
                // @ts-ignore
                date={new Date()}
                onDateSelect={() => {}}
                validated={false}
                noTitle
              />
            </div>
            <div>
              <TableActionButton
                onClick={() => {}}
              >
                <DownloadIcon />
              </TableActionButton>
              <TableActionButton
                onClick={() => {}}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          </TableContent>
          <CustomSectionTitle>
            YouTube
          </CustomSectionTitle>
          <InputContainer>
            <StaticSocialBox
              name="youtube"
              title="YouTube"
              type="social"
              validated
              badge={YoutubeIcon}
              width="18.125rem"
            />
            <Button
              onClick={() => {}}
            >
              Adicionar
            </Button>
          </InputContainer>
          <MediaTagContainer>
            <MediaTag>
              <MediaTagActions>
                <TableActionButton onClick={() => {}}>
                  <MoveBlueIcon />
                </TableActionButton>
                <div>
                  <TableActionButton onClick={() => {}}>
                    <TagIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <ViewIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <TrashIcon />
                  </TableActionButton>
                </div>
              </MediaTagActions>
              <img
                src="https://cdn1.epicgames.com/offer/fn/21BR_KeyArt_EGS_Launcher_Blade_2560x1440_2560x1440-5335449297e75a6cc7c72ad01609b8e1"
                alt="attachment"
              />
            </MediaTag>
            <MediaTag>
              <MediaTagActions>
                <TableActionButton onClick={() => {}}>
                  <MoveBlueIcon />
                </TableActionButton>
                <div>
                  <TableActionButton onClick={() => {}}>
                    <TagIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <ViewIcon />
                  </TableActionButton>
                  <TableActionButton onClick={() => {}}>
                    <TrashIcon />
                  </TableActionButton>
                </div>
              </MediaTagActions>
              <img
                src="https://cdn1.epicgames.com/offer/fn/21BR_KeyArt_EGS_Launcher_Blade_2560x1440_2560x1440-5335449297e75a6cc7c72ad01609b8e1"
                alt="attachment"
              />
            </MediaTag>
          </MediaTagContainer>
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
