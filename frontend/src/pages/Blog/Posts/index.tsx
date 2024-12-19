import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as ViewXIcon } from '~assets/viewx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_gray.svg'

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';

import { Container, Table, TableHeader, Button, DropdownRowContent, DropdownRowContentInfo, TagContainer, Tag } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { MainClient, MainBlogPost, DefaultValuePropsWithId } from '~types/main';

import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { useRegister } from '@/src/context/register';
import { Modal } from '@/src/components/Modal';
import { TitleInput } from '~components/TitleInput';
import { CustomSelect as Select } from '~components/Select';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { CheckBox } from '~components/CheckBox';
import { sortByField, sortNumberFields } from '@/src/utils/sorting';

export function BlogPosts() {
  const { push } = useHistory();
  
  const { setBlogPost } = useRegister();
  
  const formRef = useRef<FormHandles>(null)
  
  const [posts, setPosts] = useState<MainBlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<MainBlogPost[]>([]);
  const [postCategories, setPostCategories] = useState<DefaultValuePropsWithId[]>([]);

  const [contentTitle, setContentTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [filterPostCategory, setFilterPostCategory] = useState('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);

  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);
  
  const [isOpen, setIsOpen] = useState(-1);

  const [with_image, setWithImage] = useState(false);
  const [with_embed, setWithEmbed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const [
        postsResponse,
        categoriesResponse
      ] = await Promise.all([
        api.get(`blogs/posts?paginated=true&per_page=${perPage}`),
        api.get('blogs/categories')
      ])

      const {
        data: {
          data: {
            data, meta: { current_page, last_page }
          }
        }
      } = postsResponse;

      const {
        data: {
          data: categories
        }
      } = categoriesResponse;

      console.log('a', data);
      
      setPosts(data);
      setFilteredPosts(data);
      setPosts(data);

      setCurrentPage(current_page)
      setLastPage(last_page)

      // @ts-ignore
      setPostCategories(categories.map(e => ({ id: e.id, value: e.name, label: e.name })));

    } catch (error) {
      console.log('error', error)
    }
  }, [perPage]);

  const [search, setSearch] = useState('');

  const handleSearch = useCallback(async (search: string) => {
    try {
      setLoading(true);

      const {
        data: {
          data: {
            data, meta: { current_page, last_page }
          }
        }
      } =  await api.get('/blogs/posts', {
        params: {
          title: search.toLowerCase(),
          // by_supplier: supplier.id
        }
      });


      const formattedData = !!sortingField ? sortByField(data, sortingField) : data;

      setFilteredPosts(formattedData);

      setSearchCurrentPage(current_page);
      setSearchLastPage(last_page);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [sortingField]);

  const handleNewPost = useCallback(async () => {
    try {
      setLoading(true);

      const request = {
        title: contentTitle,
        blog_category_id: postCategory
      }

      const {
        data: { data }
      } = await api.post('/blogs/posts', request);
      
      console.log('aa', data);
      
      const formattedPost = { // @ts-ignore
        ...data,
        category_name: data.category.name
      }
      
      setFilteredPosts(prev => [formattedPost, ...prev]);
      setPosts(prev => [data, ...prev]);
      setIsNewPostModalOpen(false);
    } catch (error) {
      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, [contentTitle, postCategory]);

  const handlePagination = useCallback(async (page: number, search: string) => {
    try {
      setLoading(true);

      const request = isNotEmpty(search) ? 
        { 
          params: {
            title: search.toLowerCase()
          }
        } :
        {};

      const {
        data: {
          data: { data: results, meta: { current_page, last_page } }
        }
      } = await api.get(`blogs/posts?paginated=true&per_page=${perPage}&page=${page}`, request);

      const formattedResults = !!sortingField ? sortByField(results, sortingField) : results;

      setFilteredPosts(formattedResults);
      
      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);  
      }
      else {
        setPosts(formattedResults)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [sortingField, perPage])

  const handleFilterStatus = useCallback(async () => {
    if(!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }
        
    await handlePagination(1, '');
    
    setHasFiltered(false);
  }, [handlePagination, hasFiltered])

  const handleFilterPosts = useCallback(async () => {
    try {
      setLoading(true);

      let params = {
        by_blog_category: filterPostCategory
      };

      if(with_image) // @ts-ignore
        params['with_image'] = !with_image;

      if(with_embed) // @ts-ignore
        params['with_embed'] = !with_embed;

      if(isNotEmpty(search)) { // @ts-ignore
        params['title'] = search.toLowerCase()
      }

      const {
        data: {
          data: { data: posts, meta: { current_page, last_page } }
        }
      } = await api.get(`/blogs/posts?paginated=true&per_page=${perPage}`, {
        params
      });

      console.log('posts', posts);

      const formattedPosts = !!sortingField ? sortByField(posts, sortingField) : posts;


      setFilteredPosts(formattedPosts);
      setHasFiltered(true);
      setIsFilterModalOpen(false)

      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);  
      }
      else {
        setPosts(formattedPosts)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }

    } catch (error) {
      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
      setFilterPostCategory('');
    }
  }, [sortingField, perPage, search, filterPostCategory, with_image, with_embed]);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredPosts(posts.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string') 
      setFilteredPosts(prev => sortByField(prev, value));
    else 
      setFilteredPosts(prev => sortNumberFields(prev, value));
    
    setSortingField(value);
  }, [posts, sortingField]);

  const handleEditPost = useCallback(async (post: MainBlogPost) => {
    try {
      const {
        data: { data }
      } = await api.get(`/blogs/posts/${post.id}`);
      
      setBlogPost(data);
      push('/blog/post/edit');
    } catch (e) {
      console.log('e', e);
    }
  }, [setBlogPost, push]);

  const usingSafari = useMemo(() => isOnSafari, []);

  useEffect(() => {
    setBlogPost(null as unknown as MainBlogPost);
  }, []);

  useEffect(() => {
    fetchPosts();
  } ,[]);

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: isNotEmpty(search) ? searchLastPage : lastPage,
  }), [search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  return (
    <>
      <Header route={['Blog', 'Postagem']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                setSearch('');
                setFilteredPosts(posts)
              }}
            />
            <div>
              <Input
                name="Total de Resultados"
                width="10rem"
                style={{ marginRight: '1.25rem' }}
                value={perPage}
                // @ts-ignore
                onChange={(e)=> setPerPage(e.target.value)}
                // @ts-ignore
                onBlur={(e)=> (e.target.value <= 0 || isNaN(e.target.value)) && setPerPage(50)}
              />
              <Button
                onClick={handleFilterStatus}
                disabled={loading}
              >
                {hasFiltered ? 'Limpar Filtro' : 'Filtro'}
              </Button>
              <Button
                className="newProduct"
                onClick={() => setIsNewPostModalOpen(true)}
                disabled={loading}
              >
                Nova Postagem
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="as postagens"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '38%' }} />
              <col span={1} style={{ width: '24%' }} />
              <col span={1} style={{ width: '15%' }} />
              <col span={1} style={{ width: '15%' }} />
              <col span={1} style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('title') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'title' })}
                >
                  Título do Conteúdo
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('category_name') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'category_name' })}
                >
                  Categoria da Postagem
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('category') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'category' })}
                >
                  Publicação
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Atualização
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>                
                Ação
              </th>
            </thead>
            <tbody>
              {filteredPosts.map(p => (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor:
                      isOpen === p.id ? '#F4F5F8' : '#fff'
                  }}
                >
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {p.title}
                    </TableTitle>
                  </td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {/* @ts-ignore */}
                      {p.category_name}
                    </TableTitle>
                  </td>
                  <td
                    style={{ padding: '0 0.625rem' }}
                  >
                    <StaticDateBox
                      name=""
                      title=""
                      width="7.5rem"
                      // @ts-ignore
                      date={p.published_at}
                      onDateSelect={() => {}}
                      disabled
                      validated={false}
                      noTitle
                    />
                  </td>
                  <td
                    style={{ padding: '0 0.625rem' }}
                  >
                    <StaticDateBox
                      name=""
                      title=""
                      width="7.5rem"
                      // @ts-ignore
                      date={p.updated_at}
                      onDateSelect={() => {}}
                      disabled
                      validated={false}
                      noTitle
                    />
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleEditPost(p)}
                      >
                        <EditIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => {}}
                      >
                        <ViewXIcon />
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearProducts}>Excluir</button> */}
            <p>{(isNotEmpty(search) || hasFiltered) ? filteredPosts.length : posts.length} Postagens</p>
            {!hasFiltered &&
              <Pagination
                currentPage={currentPageValue}
                lastPage={lastPageValue}
                setCurrentPage={(page: number) => handlePagination(page, search)}
              />
            }
          </TableFooter>
          </>
          }
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Nova Postagem"
        isModalOpen={isNewPostModalOpen}
        setIsModalOpen={setIsNewPostModalOpen}
        style={{
          width: '31.25rem'
        }}
      >
        <Form ref={formRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <TitleInput
              name="title"
              title="Título do Conteúdo (Ideal entre 15 e 65 caracteres)"
              width="26.25rem"
              validated={false}
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
            />
          </InputContainer>
          <InputContainer>
            <Select
              title="Categoria da Postagem"
              data={postCategories}
              customWidth="26.25rem"
              setValue={(value: string, id: string) => setPostCategory(id)}
            />
          </InputContainer>
          <Button
            onClick={handleNewPost}
            type="button"
            style={{ marginTop: '1.375rem', width: '100%' }}
            disabled={!contentTitle && !postCategory}
          >
            {loading ? <LoadingIcon className="load" /> : 'Adicionar'}
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Filtro de Postagens"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        style={{
          width: '31.25rem'
        }}
      >
        <InputContainer style={{ marginTop: '1.875rem' }}>
          <Select
            title="Categoria da Postagem"
            customWidth="26.25rem"
            // @ts-ignore
            setValue={(value, id) => {
              console.log('v', value);
              console.log('id', id);
              setFilterPostCategory(id);
            }}
            data={postCategories}
          />
        </InputContainer>
        <InputContainer>
          <CheckBox
            content="Sem foto"
            value={with_image}
            setValue={setWithImage}
          />
          <CheckBox
            content="Sem Looping"
            value={with_embed}
            setValue={setWithEmbed}
          />
        </InputContainer>
        <Button
          onClick={handleFilterPosts}
          type="button"
          style={{ marginTop: '1.875rem', width: '100%' }}
        >
          {loading ? <LoadingIcon className="load" /> : 'Filtrar Postagens'}
        </Button>
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
