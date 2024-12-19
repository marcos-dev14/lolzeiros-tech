import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { subHours } from 'date-fns';
import * as Yup from 'yup';

import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { ReactComponent as PdfIcon } from '~assets/pdf-ico.svg';
import { ReactComponent as SeeIcon } from '~assets/see.svg';
import { ReactComponent as ReadingIcon } from '~assets/reading.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { TitleInput } from '~components/TitleInput';
import { FormTitleInput } from '~components/FormTitleInput';
import { FormInput } from '~components/FormInput';
import { FormSelect } from '~components/FormSelect';
import { GalleryPhoto } from '~components/GalleryPhoto';
// import { MeasureBox } from '~components/MeasureBox';
import { DateBox } from '~components/DateBox';
import { PostHeader } from '~components/PostHeader';
import { RadioBox } from '~components/RadioBox';
import { SocialBox } from '~components/SocialBox';
import { TagInput } from '~components/TagInput';
// import { Editor } from '~components/Editor';
import { ContentEditor as Editor } from '@/src/components/CKEditor';

import { Modal } from '~components/Modal';
import { DragPicture } from '~components/DragPicture';
import { ImportPdf } from '~components/ImportPdf';
import { CustomSelect as Select } from '~components/Select';
import { ErrorModal } from '~components/ErrorModal';
import { SuccessModal } from '~components/SuccessModal';
import { Input } from '@/src/components/Input';
import { TableActionButton } from '@/src/styles/components/tables';

import {
  PDFFile,
  DefaultValueProps,
  ITag,
  Image,
  MainBlogPost,
  MainProduct
} from '~types/main';
import { api } from '~api';

import { capitalizeContent, emptyFieldRegex, getUrl, isNotEmpty } from '~utils/validation';

import {
  Button,
  Container,
  CustomSectionTitle,
  MainImageContainer,
  MaxFilesizeText,
  GalleryContainer,
  GalleryImage,
  PostActionsButton,
  ColumnContainer,
  DimensionsContainer,
  Attachment,
  AddingOptionalProduct,
  ProductsContainer,
  ViewPost,
} from './styles';
import { useRegister } from '@/src/context/register';
import { calculateReadingTime } from '@/src/utils/calculateReadingTime';
import { fetchBlogData } from '@/src/services/requests';
import { useQuery } from 'react-query';

export function Post() {
  const { blogPost, setBlogPost, updateBlogPost } = useRegister();

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [useYoutubeLink, setUseYoutubeLink] = useState<'Sim' | 'Não'>('Não');
  const [importPdfModalOpen, setImportPdfPostModalOpen] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [isDeletingPicture, setIsDeletingPicture] = useState(-1);

  const [addingEmbed, setAddingEmbed] = useState(false);
  const [cleaningEmbed, setCleaningEmbed] = useState(false);

  const [pictures, setPictures] = useState<Image[]>(() =>
    !!blogPost ?
      'pictures' in blogPost ? blogPost.pictures :
        !!blogPost.images ? blogPost.images : [] :
      []
  );
  const [primaryContent, setPrimaryContent] = useState<string>(() =>
    !!blogPost.primary_text ? blogPost.primary_text : ''
  );

  const [secondaryContent, setSecondaryContent] = useState<string>(() =>
    !!blogPost.secondary_text ? blogPost.secondary_text : ''
  );

  const [readingTime, setReadingTime] = useState('0');
  const [embedId, setEmbedId] = useState('');

  const [tags, setTags] = useState<ITag[]>(() =>
    !!blogPost ?
      'tags' in blogPost ? blogPost.tags :
        !!blogPost.searcheable ? blogPost.searcheable.split(',').map(s => ({ id: s, value: s })) : []
      : []
  );

  const [file, setFile] = useState(() =>
    !!blogPost ?
      'file' in blogPost ? blogPost.file :
        !!blogPost.main_image ? blogPost.main_image.image.JPG :
          '' :
      ''
  );

  const [pdf, setPdf] = useState<PDFFile>({} as PDFFile);
  // !!post ? 'pdf' in post ? post.pdf : {} as PDFFile :

  const [pdfName, setPdfName] = useState('');

  const [categoriesOptions, setCategoriesOptions] = useState<DefaultValueProps[]>([]);
  const [authorsOptions, setAuthorsOptions] = useState<DefaultValueProps[]>([]);
  const [blogPostsOptions, setBlogPostsOptions] = useState<DefaultValueProps[]>([]);

  const [savingPost, setSavingPost] = useState(false);
  const [loopingPlaceholder, setLoopingPlaceholder] = useState('');

  const formRef = useRef<FormHandles>(null);
  const newFormNow = formRef?.current?.getData();

  const { push } = useHistory();

  const { data: blogData, isLoading } = useQuery('blogData', fetchBlogData, {
    staleTime: 1000 * 60 * 5,
  });

  const schema = useMemo(() =>
    Yup.object().shape({
      title: Yup.string().matches(emptyFieldRegex),
      category_id: Yup.string().matches(emptyFieldRegex),
    }), []);

  const handleAddPictures = useCallback((pics: Image[]) => {
    setPictures(prev => [...prev, ...pics]);
  }, []);

  const handleDeleteMainPicture = useCallback(async () => {
    try {
      // setIsDeletingPicture(id);

      if (file.includes('augeapp.com.br'))
        await api.delete(`/blogs/posts/${blogPost.id}/main-images/${blogPost.main_image.id}`)

      setBlogPost({
        ...blogPost,
        // @ts-ignore
        main_image: undefined,
        file: ''
      });
      setFile('');
    } catch (e) {
      console.log("e", e);
    } finally {
      setIsDeletingPicture(-1);
    }
  }, [setBlogPost, blogPost, file]);

  const handleDeletePicture = useCallback(async (id: number, order: number) => {
    try {
      setIsDeletingPicture(id);

      if (order !== -1)
        await api.delete(`/blogs/posts/${blogPost.id}/images/${id}`)

      setPictures(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.log("e", e);
    } finally {
      setIsDeletingPicture(-1);
    }
  }, [blogPost]);

  const handleDeletePost = useCallback(async () => {
    try {
      const { id } = blogPost;
      await api.delete(`/blogs/posts/${id}`);
      push('/blog/posts');
    } catch (e) {
      setError("Erro ao deletar o produto.")
      console.log('e', e);
    }
  }, [push, blogPost]);

  const formattedData = useMemo(() => {
    if (!blogPost) {
      return {
        published_at: new Date().toISOString(),
        featured_until: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const {
      author,
      author_id,
      category,
      category_id,
      // @ts-ignore
      embed_title,
      // @ts-ignore
      embed_type
    } = blogPost;

    const currentEmbedType =
      !!embed_type ?
        embed_type.toLowerCase().includes('post') ?
          'Postagem'
          : 'Link Externo'
        : '';

    const currentEmbedProduct = !!embed_title ? embed_title : '';

    if (!!embed_type) {
      setLoopingPlaceholder('Carregando');
      setLoopingPlaceholder(
        currentEmbedType === 'Postagem' ?
          'Digite parte do título da postagem' :
          'Digite o link externo'
      );
    }

    const formattedBlogPost = {
      ...blogPost,
      embed_type: currentEmbedType,
      embed_title: currentEmbedProduct,
      category_id:
        !!category_id ? category_id :
          !!category ? category.name : null,
      author_id:
        !!author_id ? author_id :
          !!author ? author.name : null
    };

    return formattedBlogPost;
  }, [blogPost]);

  // const fetchPostData = useCallback(async () => {
  //   try {
  //     const [
  //       categoriesResponse,
  //       authorsResponse,
  //     ] = await Promise.all([
  //       api.get('blogs/categories'),
  //       api.get('blogs/authors')
  //     ]);

  //     const {
  //       data: {
  //         data: categories
  //       }
  //     } = categoriesResponse;

  //     const {
  //       data: {
  //         data: authors
  //       }
  //     } = authorsResponse;

  //     // @ts-ignore
  //     setCategoriesOptions(categories.map(e => ({ id: e.id, value: e.name, label: e.name })));

  //     // @ts-ignore
  //     setAuthorsOptions(authors.map(e => ({ id: e.id, value: e.name, label: e.name })));
  //   } catch (e) {
  //     console.log('e', e)
  //   }
  // }, []);

  const handleRegisterPost = useCallback(async () => {
    try {
      setSavingPost(true);
      // @ts-ignore
      const formData = formRef?.current?.getData();
      const selectedCategory = formRef?.current?.getFieldValue('category_id');
      const selectedAuthor = formRef?.current?.getFieldValue('author_id');
      const published_at = formRef?.current?.getFieldValue('published_at');
      const featured_until = formRef?.current?.getFieldValue('featured_until');

      const category = categoriesOptions.find(c => c.value === selectedCategory);
      const author = authorsOptions.find(a => a.value === selectedAuthor);

      console.log(category)

      let basePostData = { // @ts-ignore
        use_video: useYoutubeLink === 'Sim' ? 1 : 0,
      };

      if (!!author) { // @ts-ignore
        basePostData = { ...basePostData, blog_author_id: author!.id }
      }

      if (!!category) { // @ts-ignore
        basePostData = { ...basePostData, blog_category_id: category!.id }
      }

      await schema.validate(basePostData);

      const { seoTags } = blogPost;

      const searcheable = tags.reduce((init, value) => `${init},${value.value}`, '').replace(',', '');
      const seo_tags =
        !!seoTags ? seoTags.reduce((init, value) => `${init},${value.value}`, '').replace(',', '') : [];

      let hasMainImage = false;
      let hasImages = false;
      const mainImageData = new FormData();
      const imagesData = new FormData();

      if (file.includes('blob:')) {
        // @ts-ignore
        const formattedFile = await getUrl(file);
        hasMainImage = true;
        mainImageData.append('images', formattedFile);
      }

      if (!!pictures.length) {
        await Promise.all(
          pictures.map(
            async (p, index) => {
              const url = p.image.JPG;
              if (!url.includes('blob:')) return '';
              hasImages = true;
              return imagesData.append(`images[${index + 1}]`, await getUrl(url));
            })
        );
      }

      if (hasMainImage) await api.post(`/blogs/posts/${blogPost.id}/main-images`, mainImageData);
      if (hasImages) await api.post(`/blogs/posts/${blogPost.id}/images`, imagesData);

      const formattedData = {
        ...blogPost,
        ...formData,
        ...basePostData,
        primary_text: primaryContent,
        secondary_text: secondaryContent,
        searcheable,
        seo_tags,
        published_at: subHours(published_at, 3),
        featured_until: subHours(featured_until, 3),
      };

      console.log(formattedData);


      const postWithoutNullValues = Object.fromEntries(Object.entries(formattedData).filter(e => !!e[1]));

      const {
        data: {
          data
        }
      } = await api.put(`/blogs/posts/${blogPost.id}`, postWithoutNullValues);
      setBlogPost({
        ...blogPost,
        main_image: !!data.main_image ? data.main_image : blogPost.main_image,
        file: !!data.main_image ? data.main_image.image.JPG : blogPost.main_image
      });
      setFile('');
      setFile(!!data.main_image ? data.main_image.image.JPG : blogPost.main_image);
      setMessage('Salvo com sucesso')
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a postagem.';
      // @ts-ignore
      setError(errorMessage);
    } finally {
      setSavingPost(false);
    }
  }, [
    file,
    pictures,
    setBlogPost,
    updateBlogPost,
    blogPost,
    primaryContent,
    secondaryContent,
    useYoutubeLink,
    schema,
    tags,
    categoriesOptions,
    authorsOptions
  ]);

  const handleLoopingContent = useCallback(async () => {
    try {
      let embed_title = '';
      let embed_id = '';
      const embed_type = formRef.current?.getFieldValue('embed_type');
      const externalEmbedTitle = formRef.current?.getFieldValue('embed_title');

      if (embed_type === 'Postagem') {
        const {
          data: { data: embed }
        } = await api.get(`/blogs/posts/${embedId}`);

        embed_title = embed.title;
        embed_id = embed.id;
      } else {
        embed_title = externalEmbedTitle;
      }

      await api.put(`/blogs/posts/${blogPost.id}`, {
        embed_type,
        embed_title,
        embed_id
      });

      const currentEmbedType = embed_type === 'Postagem' ? 'blog_post' : 'external';

      formRef.current?.setFieldValue('embed_title', embed_title)

      // @ts-ignore
      updateBlogPost({ ...blogPost, embed_title, embed_id, embed_type: currentEmbedType })
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingEmbed(false);
    }
  }, [blogPost, updateBlogPost, embedId]);

  useEffect(() => {
    setReadingTime(calculateReadingTime(`${primaryContent}${secondaryContent}`));
  }, [primaryContent, secondaryContent])

  // useEffect(() => {
  //   fetchPostData();
  // }, [])

  useEffect(() => {
    if (!isLoading && !!blogData) {
      setCategoriesOptions(blogData.categoriesOptions)
      setAuthorsOptions(blogData.authorsOptions)
      setBlogPostsOptions(blogData.blogPostsOptions)
    }
  }, [isLoading, blogData]);

  const handleUpdate = useCallback((field: string, value: string) => {
    const updatedValue = capitalizeContent(value);
    formRef.current?.setFieldValue(field, updatedValue)
  }, []);

  return (
    <>
      <Header minimal route={['Blog', 'Postagem', 'Editar Postagem']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => { }} initialData={formattedData}>
          <Container>
            <PostHeader
              ref={formRef}
              data={{
                primary_text: primaryContent,
                secondary_text: secondaryContent,
                tags,
                file,
                pictures
              }}
            >
              <div
                style={{
                  margin: '0 0 0 auto',
                  borderLeft: '2px solid #eee'
                }}
              >
                <PostActionsButton
                  className="viewing"
                  style={{ width: '12rem', marginLeft: '1rem' }}
                  onClick={handleRegisterPost}
                  type="button"
                  disabled={savingPost}
                >
                  {savingPost ? 'Salvando...' : 'Salvar Postagem'}
                </PostActionsButton>
              </div>
            </PostHeader>
            <CustomSectionTitle>
              Informação da Postagem
            </CustomSectionTitle>
            <InputContainer>
              <FormTitleInput
                name="title"
                title="Título do Conteúdo (Ideal entre 15 e 65 caracteres)"
                width="26.25rem"
                validated={false}
                onBlur={e => handleUpdate('title', e.target.value)}
              />
              <FormSelect
                name="author_id"
                title="Autor"
                placeholder="Selecione..."
                customWidth="15rem"
                data={authorsOptions}
                customValue={{
                  value: newFormNow?.author_id ?? blogPost?.author?.name,
                  label: newFormNow?.author_id ?? blogPost?.author?.name
                }}
              />
              <FormSelect
                name="category_id"
                title="Categoria"
                placeholder="Selecione..."
                customWidth="37.875rem"
                data={categoriesOptions}
                customValue={{
                  value: newFormNow?.category_id ?? blogPost?.category.name,
                  label: newFormNow?.category_id ?? blogPost?.category.name
                }}
              />
            </InputContainer>
            <InputContainer>
              <TagInput
                title="Título Invisível para Busca no Site (IA)"
                tags={tags}
                setTags={setTags}
                fullW
                validated={false}
              />
            </InputContainer>
            <CustomSectionTitle>
              Imagem Principal da Postagem
            </CustomSectionTitle>
            <InputContainer>
              <ColumnContainer style={{ width: '794px' }}>
                <MainImageContainer>
                  <DragPicture
                    noCrop
                    file={file}
                    setFile={setFile}
                    style={{
                      width: '49.6875rem',
                      height: '27.375rem'
                    }}
                    action="Arraste a imagem principal da Postagem ou clique aqui"
                    format="JPG ou PNG"
                    deletePicture={handleDeleteMainPicture}
                  />
                </MainImageContainer>
              </ColumnContainer>
              <ColumnContainer style={{ width: '492px' }}>
                <ColumnContainer>
                  <DimensionsContainer>
                    <FormInput
                      name="imageWidth"
                      title="Largura"
                      width="3.75rem"
                      validated={false}
                      value="780"
                      disabled
                    />
                    <p>X</p>
                    <FormInput
                      name="imageHeight"
                      title="Altura"
                      width="3.75rem"
                      validated={false}
                      value="348"
                      disabled
                    />
                  </DimensionsContainer>
                </ColumnContainer>
                <CustomSectionTitle>
                  Data e Hora da Publicação
                </CustomSectionTitle>
                <InputContainer>
                  <DateBox
                    name="published_at"
                    title="Data da Publicação"
                    width="10rem"
                    validated={false}
                  />
                  <DateBox
                    name="featured_until"
                    title="Destacar até"
                    width="10rem"
                    validated={false}
                  />
                </InputContainer>
                <InputContainer>
                  <DateBox
                    name="created_at"
                    title="Data da Criação"
                    width="10rem"
                    validated={false}
                    disabled
                  />
                  <DateBox
                    name="updated_at"
                    title="Data da Atualização"
                    width="10rem"
                    validated={false}
                    disabled
                  />
                </InputContainer>
                <CustomSectionTitle>
                  YouTube
                </CustomSectionTitle>
                <InputContainer>
                  <RadioBox
                    title="Usar link do YouTube"
                    value={useYoutubeLink}
                    // @ts-ignore
                    setValue={(value: string) => {
                      // @ts-ignore
                      setUseYoutubeLink(value);
                      updateBlogPost({ ...blogPost, use_video: Number(value === 'Sim') })
                    }}
                  />
                  <SocialBox
                    name="youtube_link"
                    title="YouTube"
                    type="social"
                    validated
                    disabled={useYoutubeLink === 'Não'}
                    badge={YoutubeIcon}
                    style={{ marginLeft: 'auto' }}
                  />
                </InputContainer>
                <CustomSectionTitle>
                  Tempo de Leitura e Visualização da Postagem
                </CustomSectionTitle>
                <InputContainer style={{ marginTop: '1.75rem' }}>
                  <PostActionsButton className="reading">
                    <ReadingIcon />
                    Leitura {readingTime}
                  </PostActionsButton>
                  <ViewPost
                    href={
                      !!blogPost ? //@ts-ignore
                        !!blogPost.full_url ? blogPost.full_url
                          : ''
                        : ''
                    }
                    target="_blank"
                  >
                    <SeeIcon />
                    Visualizar
                  </ViewPost>
                </InputContainer>
              </ColumnContainer>
            </InputContainer>
            <InputContainer style={{ alignItems: 'flex-start' }}>
              <ColumnContainer style={{ width: '794px' }}>
                <CustomSectionTitle>
                  Editor da Postagem Principal
                </CustomSectionTitle>
                <Editor
                  content={primaryContent}
                  setContent={setPrimaryContent}
                />
                <InputContainer>
                  <FormSelect
                    name="embed_type"
                    title="Adicionar um looping no conteúdo"
                    placeholder="Selecione..."
                    customWidth="15rem"
                    // @ts-ignore
                    onChange={(value) => {
                      setLoopingPlaceholder('Carregando');
                      setLoopingPlaceholder(
                        value === 'Postagem' ?
                          'Digite parte do título da postagem' :
                          'Digite a referência do produto'
                      );
                    }}
                    data={[
                      { value: 'Postagem', label: 'Postagem' },
                      { value: 'Link Externo', label: 'Link Externo' },
                    ]}
                  />
                  <InputContainer
                    style={{ marginTop: 0, alignItems: 'flex-end' }}
                  >
                    {loopingPlaceholder !== 'Carregando' ?
                      loopingPlaceholder.includes('postagem') ?
                        <Select
                          title="Tipo"
                          data={blogPostsOptions}
                          customWidth="30.4375rem"
                          // @ts-ignore
                          setValue={(v, id) => setEmbedId(id)}
                        />
                        :
                        <FormInput
                          name="embed_title"
                          title="Tipo"
                          placeholder={loopingPlaceholder}
                          disabled={addingEmbed || cleaningEmbed}
                          width="30.4375rem"
                        /> :
                      <></>
                    }
                    <AddingOptionalProduct
                      onClick={handleLoopingContent}
                      disabled={addingEmbed || cleaningEmbed}
                      style={{
                        marginLeft: "1rem"
                      }}
                    >
                      {addingEmbed || cleaningEmbed ? <LoadingIcon /> : <PlusIcon />}
                    </AddingOptionalProduct>
                  </InputContainer>
                </InputContainer>
                <CustomSectionTitle>
                  Editor da Postagem Secundária
                </CustomSectionTitle>
                <Editor
                  content={secondaryContent}
                  setContent={setSecondaryContent}
                />
              </ColumnContainer>
              <ColumnContainer style={{ width: '492px' }}>
                <CustomSectionTitle>
                  Galeria de Imagens&nbsp;<b>(clique na imagem para copiar)</b>
                </CustomSectionTitle>
                <GalleryContainer>
                  {pictures.map(({ id, order, image: { JPG }, name }) =>
                    <GalleryImage key={id} disabled={isDeletingPicture === id}>
                      <img src={JPG} alt={name} />
                      <button
                        onClick={() => handleDeletePicture(id, order)}
                        disabled={isDeletingPicture === id}
                      >
                        <CloseIcon />
                      </button>
                    </GalleryImage>
                  )}
                  <GalleryPhoto
                    addPictures={
                      (newPicture) => handleAddPictures(newPicture)
                    }
                  />
                </GalleryContainer>
                {/* <PostActionsButton
                  className="viewing"
                  style={{ width: '100%', marginTop: '1.25rem' }}
                  onClick={handleRegisterPost}
                  type="button"
                  disabled={loading}
                >
                  {savingPost ? 'Salvando...' : 'Salvar Postagem'}
                </PostActionsButton> */}
                <PostActionsButton
                  className="reading"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={handleDeletePost}
                >
                  Excluir Postagem
                </PostActionsButton>
              </ColumnContainer>
            </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Importar PDF"
        isModalOpen={importPdfModalOpen}
        setIsModalOpen={setImportPdfPostModalOpen}
      >
        <InputContainer style={{ marginTop: '2.25rem' }}>
          <ImportPdf
            file={pdf}
            setFile={(value) => {
              setPdf(value);
              setPdfName(value.name.replace('.pdf', ''));
            }}
            style={{ width: '21.375rem' }}
          />
        </InputContainer>
        <MaxFilesizeText>
          Máximo de 3MB
        </MaxFilesizeText>
        <InputContainer>
          {!!Object.values(pdf).length &&
            <Attachment href={pdf.fileUrl} target="_blank">
              <PdfIcon />
              <p>{pdfName}.pdf</p>
            </Attachment>
          }
        </InputContainer>
        <CustomSectionTitle>
          Alterar nome do arquivo
        </CustomSectionTitle>
        <InputContainer>
          <TitleInput
            name="pdfName"
            title="Nome do PDF"
            width="100%"
            max={30}
            fullW
            value={pdfName}
            onChange={(e) => setPdfName(e.target.value)}
            validated={false}
          />
        </InputContainer>
        <Button
          type="button"
          style={{ marginTop: '1.25rem' }}
          // onClick={handleUploadPdf}
          onClick={() => { }}
        >
          {
            uploadingPdf ? <LoadingIcon className="revert" /> :
              'Salvar'
          }
        </Button>
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
    </>
  );
}
