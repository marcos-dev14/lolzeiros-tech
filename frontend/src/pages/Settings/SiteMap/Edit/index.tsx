import { useCallback, useEffect, useMemo, useState } from 'react';

import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as MoveIcon } from '~assets/move.svg'

import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container, ListHeader } from './styles';
import { MenuAndTableContainer } from '~styles/components';

import { api } from '~api';
import { TableActionButton } from '@/src/styles/components/tables';
import { useLocation } from 'react-router';
import { Input } from '@/src/components/Input';
import { StaticUrlBox } from '@/src/components/StaticUrlBox';
import { capitalizeContent, isNotEmpty } from '@/src/utils/validation';
import { DefaultValueProps, DefaultValuePropsWithId } from '@/src/types/main';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SiteMapLink } from '@/src/components/Draggables/SiteMapLink';

export type Link = {
  id: number;
  label: string;
  url: string;
  type: string;
  linkable_id: number;
  order: number;
}

type Params = {
  title: string;
  id: number;
}

export function EditSiteMap() {
  const { state } = useLocation<Params>();
  const [links, setLinks] = useState<Link[]>([]);
  const [blogPostsOptions, setBlogPostsOptions] = useState<DefaultValuePropsWithId[]>([]);
  const [blogPostsById, setBlogPostsById] = useState({});
  const [blogCategoriesOptions, setBlogCategoriesOptions] = useState<DefaultValuePropsWithId[]>([]);
  const [blogCategoriesById, setBlogCategoriesById] = useState({});
  // const [types, setTypes] = useState<DefaultValuePropsWithId[]>([]);
  const types = useMemo<DefaultValueProps[]>(() => [
    { value: 'blog_post', label: 'Postagem' },
    { value: 'external', label: 'Link Externo' }
  ], []);
  // const [typeNames, setTypeNames] = useState({});
  
  const [addingLink, setAddingLink] = useState(false);
  const [updatingLink, setUpdatingLink] = useState(-1);
  const [deletingLink, setDeletingLink] = useState(-1); 
  
  const [sorting, setSorting] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  const [menuLabel, setMenuLabel] = useState('');
  const [menuType, setMenuType] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [menuTypeId, setMenuTypeId] = useState<string | number>('');

  const [error, setError] = useState('');

  const [id, setId] = useState(() => !!state ? state.id : '');
  const [title, setTitle] = useState(() => !!state ? state.title : '');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const customTypes = useMemo(() =>
    ['blog_post']
  , []);

  const customTypesByName = useMemo(() => ({
    'blog_post': 'Postagem',
    'external': 'Link Externo'
  }), []);

  const fetchNavigations = useCallback(async () => {
    try {
      if (!id) return;

      // const [linksResponse] = await Promise.all([
      const [
        linksResponse,
        // typesResponse,
        postsResponse,
        categoriesResponse
      ] = await Promise.all([
        api.get(`navigations/${id}/links`),
        // api.get('navigations/links/types'),
        api.get('blogs/posts?paginated=false'),
        api.get('blogs/categories')
      ])
      
      const {
        data: {
          data
        }
      } = linksResponse;

      const {
        data: {
          data: blogPosts 
        }
      } = postsResponse;

      const {
        data: {
          data: categories
        }
      } = categoriesResponse;

      // const {
      //   data: {
      //     data: typesData
      //   }
      // } = typesResponse;

      setLinks(data);
      let blogPostsById = {};
      let blogCategoriesById = {};
      
      // @ts-ignore
      blogPosts.forEach(b => blogPostsById[b.title] = b.id)
      setBlogPostsById(blogPostsById);
      
      // @ts-ignore
      categories.forEach(b => blogCategoriesById[b.name] = b.id)
      setBlogCategoriesById(blogCategoriesById);
      
      // @ts-ignore
      setBlogPostsOptions(blogPosts.map(b => ({ id: b.id, value: b.title, label: b.title })))
      // @ts-ignore
      setBlogCategoriesOptions(categories.map(b => ({ id: b.id, value: b.name, label: b.name })))
      // @ts-ignore
      // setTypeNames(typesData);
      // setTypes( // @ts-ignore
      //   Object.entries(typesData).map(e => ({ value: e[0], label: e[1], id: e[0] }))
      // );
    } catch (error) {
      console.log('error', error)
    }
  }, [id]);

  const handleUpdateMenuTitle = useCallback(async (title: string) => {
    try {
      await api.put(`/navigations/${id}`, { title })

      setTitle(title);
    } catch (e) {
      console.log('e', e);
    } finally {
      setUpdatingLink(-1);
    }
  }, [id]);

  const handleAddLink = useCallback(async () => {
    try {
      setAddingLink(true);
      let request = {
        label: menuLabel,
        type: menuType,
      }

      if(customTypes.includes(menuType)) {
        // @ts-ignore
        request['linkable_id'] = menuTypeId;
      }

      if(menuType === 'external') {
        // @ts-ignore
        request['url'] = menuUrl;
      }

      const {
        data: { data }
      } = await api.post(`/navigations/${id}/links`, request);
      
      setMenuLabel('');
      setMenuUrl('');
      setMenuType('Carregando');
      setMenuType('');
      setLinks(prev => [...prev, data]);

    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingLink(false);
    }
  }, [customTypes, menuLabel, menuType, menuTypeId, menuUrl, id]);

  const handleDeleteLink = useCallback(async (id: number) => {
    try {
      setDeletingLink(id)
      await api.delete(`/navigations/${state.id}/links/${id}`)
      setLinks(prev => prev.filter(l => l.id !== id));

    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingLink(-1)
    }
  }, [state]);

  const handleLinkUrl = useCallback(async (link: Link) => {
    try {
      // @ts-ignore
      setUpdatingLink(link.id);

      let request = {
        label: link.label,
        type: link.type,
      }

      if(customTypes.includes(link.type)) {
        // const id = link.type! === 'blog_post' ? blogPostsById[]
        // @ts-ignore
        request['linkable_id'] = link.linkable_id;
      }

      if(link.type === 'external') {
        // @ts-ignore
        request['url'] = link.url;
      }
     
      const {
        data: {
          data
        }
      } = await api.put(`/navigations/${state.id}/links/${link.id}`, link);

      setCleaning(true);
      let tempLinks = links.map(l => l.id !== link.id ? l : data)
      setLinks([]);
      setLinks(tempLinks);
    } catch (e) {
       // @ts-ignore
       const errorMessage = !!e.response ? e.response.data.message :
       'Houve um erro ao salvar o produto.';

     setError(errorMessage);
    } finally {
      setUpdatingLink(-1);
      setCleaning(false);
    }
  }, [links, state, customTypes]);

  useEffect(() => {
    fetchNavigations();
  }, [])

  const handleDragEnd = useCallback(async e => {
    try {
      const { active, over } = e;

      if(active.id !== over.id) {
        const activeIndex = links.findIndex(e => e.id === active.id);
        const overIndex = links.findIndex(e => e.id === over.id);
        const sortedLinks = arrayMove(links, activeIndex, overIndex);
        const request = {
          fields: sortedLinks.map((e, i) => ({ id: e.id, order: i + 1 }))
        } 

        setSorting(true);
        await api.put(`/navigations/${state.id}/links/sort`, request);
        
        setLinks(sortedLinks);
      }
    } catch(e) {
      console.log('e', e);
    } finally {
      setSorting(false);
    }
  }, [links, state])

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Header route={['Configuração', 'Mapa do Site']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <ListHeader>
            <div>
              <strong>Mover</strong>
            </div>
            <div>
              <strong>Nome do Bloco de Menu</strong>
            </div>
            <div>
              <strong>Tipo</strong>
            </div>
            <div>
              <Input
                name=""
                noTitle
                defaultValue={capitalizeContent(title)}
                noValueInput
                width="13.75rem"
                onBlur={(e) =>
                  e.target.value !== title &&
                  handleUpdateMenuTitle(capitalizeContent(e.target.value))
                }
              />
            </div>
            <div>
              <strong>Ação</strong>
            </div>
          </ListHeader>
          <SortableContext
            disabled={sorting}
            items={links}
            strategy={verticalListSortingStrategy}
          >
            {links.map((a, idx) =>
              <SiteMapLink key={a.id} id={a.id} dragging={dragging}>
                <div onClick={() => setDragging(p => !p)}>
                  <MoveIcon opacity={sorting ? 0.2 : 1}/>
                </div>
                <div>
                  <Input
                    name=""
                    noTitle
                    defaultValue={capitalizeContent(a.label)}
                    noValueInput
                    width="10.25rem"
                    onBlur={(e) =>
                      e.target.value !== a.label &&
                      handleLinkUrl({ ...a, label: capitalizeContent(e.target.value)})
                    }
                    disabled={updatingLink === a.id || dragging}
                  />
                </div>
                <div>
                  <NoTitleSelect
                    placeholder="Selecione..."
                    data={types}
                    setValue={() => {}}
                    defaultValue={{
                      // @ts-ignore
                      value: customTypesByName[a.type],
                      // @ts-ignore
                      label: customTypesByName[a.type]
                    }}
                    customWidth="10.25rem"
                    onChange={(type: string) => 
                      // handleLinkTypes(value, String(a.id))
                      type !== a.type &&
                      handleLinkUrl({ ...a, type })
                    }
                    disabled={updatingLink === a.id || dragging}
                  />
                </div>
                <div>
                  {cleaning ? <></> :
                    customTypes.includes(a.type) ? 
                      <NoTitleSelect
                        placeholder="Selecione..."
                        customWidth="38.5rem"
                        setValue={() => {}}
                        data={a.type === 'blog_post' ? blogPostsOptions : blogCategoriesOptions}
                        // @ts-ignore
                        onChange={(value, id) => 
                          // handleLinkTypes(value, String(a.id))
                          handleLinkUrl({ ...a, linkable_id: id })
                        }
                        defaultValue={{
                          value: a.url,
                          label: a.url
                        }}
                        disabled={updatingLink === a.id || dragging}
                      />
                      :
                      <StaticUrlBox
                        name={`categories[${idx}].slug`}
                        defaultValue={a.url}
                        width="38.5rem" 
                        hasIcon={false}
                        disabled={updatingLink === a.id || (!!a.type && a.type !== 'external') || dragging}
                        validated
                        onBlur={({ target: { value: url } }) =>
                          isNotEmpty(url) &&
                          handleLinkUrl({...a, url})
                      }
                      />  
                  }
                </div>
                <div>
                  <TableActionButton
                    onClick={() => handleDeleteLink(a.id)}
                    disabled={deletingLink === a.id || dragging}
                  >
                    <TrashIcon />
                  </TableActionButton>
                </div>
              </SiteMapLink>
            )}
            <SiteMapLink key={-1} id={-1} dragging={false}>
              <div>
                <MoveIcon />
              </div>
              <div>
                <Input
                  name=""
                  noTitle
                  noValueInput
                  width="10.25rem"
                  disabled={addingLink}
                  value={menuLabel}
                  onChange={(e) => setMenuLabel(e.target.value)}
                  onBlur={(e) => setMenuLabel(capitalizeContent(e.target.value))}
                  // disabled={updatingLink === a.id || dragging}
                />
              </div>
              <div>
                {menuType !== 'Carregando' ?
                  <NoTitleSelect
                    placeholder="Selecione..."
                    data={types}
                    setValue={() => {}}
                    disabled={addingLink}
                    customWidth="10.25rem"
                    onChange={(value: string) => setMenuType(value)}
                    // disabled={updatingLink === a.id || dragging}
                  /> :
                  <></>
                  }
              </div>
              <div>
                {menuUrl === 'Carregando' ? <></> :
                customTypes.includes(menuType) ? 
                  <NoTitleSelect
                    placeholder="Selecione..."
                    customWidth="38.5rem"
                    data={menuType === 'blog_post' ? blogPostsOptions : blogCategoriesOptions}
                    // @ts-ignore
                    setValue={(value, id, label) => {
                      setMenuTypeId(id);
                    }}
                    disabled={addingLink}
                  />
                  :
                  <StaticUrlBox
                    name={`categories[a].slug`}
                    defaultValue={menuUrl}
                    width="38.5rem" 
                    hasIcon={false}
                    value={menuUrl}
                    onChange={(e) => setMenuUrl(e.target.value)}
                    validated
                    disabled={addingLink}
                  />  
                }
              </div>
              <div>
                <TableActionButton
                  onClick={handleAddLink}
                  disabled={addingLink}
                  loading={addingLink}
                >
                  {addingLink ? <LoadingIcon /> : <PlusIcon />}
                </TableActionButton>
              </div>
            </SiteMapLink>
          </SortableContext>
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </DndContext>
  );
}
