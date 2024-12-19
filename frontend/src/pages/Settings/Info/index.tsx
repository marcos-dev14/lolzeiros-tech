import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { getUrl } from '~utils/validation';


import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

import { ReactComponent as InstagramIcon } from '~assets/instagram-ico.svg';
import { ReactComponent as FacebookIcon } from '~assets/facebook-ico.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';
import { ReactComponent as TwitterIcon } from '~assets/twitter-ico.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import {
  Container,
  Button,
  ColumnInputContainer,
  CustomSectionTitle,
  CodeContainer
} from './styles';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import { api } from '~api';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { capitalizeContent, isNotEmpty, isOnSafari, landlineIsValid, phoneIsValid } from '~utils/validation';
import { ErrorModal } from '~components/ErrorModal';
import { FormInput } from '~components/FormInput';
import { FormSelect } from '@/src/components/FormSelect';
import { SiteBox } from '@/src/components/SiteBox';
import { FormTitleInput } from '@/src/components/FormTitleInput';
import { ITag } from '@/src/types/main';
import { TagInput } from '@/src/components/TagInput';
import { FormPhoneBox } from '@/src/components/FormPhoneBox';
import { SocialBox } from '@/src/components/SocialBox';
import { RadioBox } from '@/src/components/RadioBox';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { SuccessModal } from '@/src/components/SuccessModal';
import ColorInputx from '@/src/components/ColorInput/ColorInput';
import { Image } from '@/src/components/ImagesCarousel/styles';
import { DragPicture } from '@/src/components/DragPicture';

interface Theme {
  value: string;
  label: string;
}

export function SiteInfo() {
  const { push } = useHistory();
  const formRef = useRef<FormHandles>(null)

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cor1, setCor1] = useState("");
  const [cor2, setCor2] = useState("");
  const [cor3, setCor3] = useState("");
  const [cor4, setCor4] = useState("");
  const [thems, setThemes] = useState<Theme[]>()
  const [defaultTheme, setDefaultTheme] = useState();



  const [initialData, setInitialData] = useState({});

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [sortingField, setSortingField] = useState('');
  const [domain, setDomain] = useState('');
  const [tags, setTags] = useState<ITag[]>([]);
  const [freeDelivery, setFreeDelivery] = useState<ITag[]>([]);
  const [file, setFile] = useState('');
  const [fileFav, setFileFav] = useState('');

  const [withdrawSellPoint, setWithdrawSellPoint] = useState("Sim");

  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );

  const [phone, setPhone] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [hasSearch, setHasSearch] = useState(false);

  const usingSafari = useMemo(() => isOnSafari, []);

  const handleSubmit = useCallback(async () => {
    try {
      setUpdating(true);
      // @ts-ignore
      const data = formRef.current?.getData();

      // // @ts-ignore
      // if (!phoneIsValid(data.cellphone)) {
      //   setError('Preencha um número de celular válido');
      //   return;
      // }

      // // @ts-ignore
      // if (!landlineIsValid(data.phone)) {
      //   setError('Preencha um telefone fixo válido');
      //   return;
      // }

      // // @ts-ignore
      // if (!phoneIsValid(data.whatsapp)) {
      //   setError('Preencha um número de WhatsApp válido');
      //   return;
      // }

      const seo_keywords =
        tags
          .reduce((init, value) => `${init},${value.value}`, '')
          .replace(',', '');

      const mainImageData = new FormData();
      const favImageData = new FormData();

      if (file?.includes('blob:')) {

        const formattedFile = await getUrl(file);
        mainImageData.append('logos', formattedFile);
        console.log(formattedFile);
      }

      if (fileFav?.includes('blob:')) {

        const formattedFileFav = await getUrl(fileFav);
        favImageData.append('favicons', formattedFileFav);
      }



      const request = {
        ...data,
        domain,
        seo_keywords,
        scripts_general: code,
        color_primary: cor1,
        color_highlight: cor2,
        color_highlight2: cor3,
        color_highlight3: cor4,
      };


      console.log(data);



      await api.put('/seo_configurations', request);

      if (!!file) {
        await api.post('/seo_configurations/images/favicons', favImageData)
      }

      if (!!fileFav) {
        await api.post('/seo_configurations/images/logos', mainImageData)
      }

      setMessage('Salvo com sucesso');

    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar as configurações.';

      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [tags, file, fileFav, domain, code, cor1, cor2, cor3, cor4])

  const fetchData = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.get('/seo_configurations');

      setInitialData(data ?? {});
      setCor1(!!data ? !!data.color_primary ? data.color_primary : "" : "")
      setCor2(!!data ? !!data.color_highlight ? data.color_highlight : "" : "")
      setCor3(!!data ? !!data.color_highlight2 ? data.color_highlight2 : "" : "")
      setCor4(!!data ? !!data.color_highlight3 ? data.color_highlight3 : "" : "")
      setDefaultTheme(data?.theme)
      setFile(!!data ?? !!data.logos ? data.logos : '' )
      setFileFav(!!data ?? !!data.favicons ? data.favicons : '')
      setThemes(!!data ?? data?.avaiable_themes ? data?.available_themes : [])

      setDomain(!!data ? !!data.domain ? data.domain : '' : '');
      setTags(!!data ?
        !!data.seo_keywords ?
          data.seo_keywords.split(',').map((s: string) => ({ id: s, value: s })) :
          [] :
        []);
      setCode(!!data ? !!data.scripts_general ? data.scripts_general : '' : '')
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [])


  const handleDeleteMainPicture = useCallback(async (file: string) => {
    try {
      // setIsDeletingPicture(id);

      if (!file.includes('blob:'))
        await api.delete(`/seo_configurations/images/${file}`)

    } catch (e) {
      console.log("e", e);
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, [])

  const handleUpdate = useCallback((field: string, value: string) => {
    const updatedValue = capitalizeContent(value);
    formRef.current?.setFieldValue(field, updatedValue)
  }, []);

  return (
    <>
      <Header route={['Configuração', 'Info do Site']} />
      <MenuAndTableContainer>
        <Menu />

        {loading ?
          <Container>
            <LoadingContainer
              content="as configurações"
            />
          </Container> :
          <Form ref={formRef} onSubmit={() => { }} initialData={initialData}>
            <Container>
              <SectionTitle>
                Info do Site
              </SectionTitle>
              <InputContainer>
                <DragPicture
                  action='Arraste a Logo, ou clique aqui'
                  style={{ border: '1px solid rgb(143, 231, 208)', width: '25rem', height: '14rem' }}
                  file={file}
                  noCrop={true}
                  setFile={(f) => {
                    setFile(f);
                    // @ts-ignore
                    setHighlightImage(f);
                  }}
                  deletePicture={() => { handleDeleteMainPicture('logos') }}
                />
                <DragPicture
                  action='Arraste o Favicon, ou clique aqui'
                  style={{ border: '1px solid rgb(143, 231, 208)', width: '10rem', height: '10rem' }}
                  file={fileFav}
                  noCrop={true}
                  setFile={(f) => {
                    setFileFav(f);
                    // @ts-ignore
                    setHighlightImage(f);
                  }}
                  deletePicture={() => { handleDeleteMainPicture('favicons') }}
                />
              </InputContainer>
              <InputContainer>
                <FormInput
                  name="site_name"
                  title="Nome do Site"
                  width="15.625rem"
                  validated={false}
                  onBlur={e => handleUpdate('site_name', e.target.value)}
                />
                <FormInput
                  name="page_title"
                  title="Título da Página"
                  width="15.625rem"
                  validated={false}
                  onBlur={e => handleUpdate('page_title', e.target.value)}
                />
                {/* <FormSelect
                name="location"
                title="Localização"
                placeholder="Selecione..."
                customWidth="12.5rem"
              /> */}
                <SiteBox
                  name="Site"
                  validated={false}
                  width="18.625rem"
                  // @ts-ignore
                  value={domain}
                  // @ts-ignore
                  onChange={(e) => setDomain(e.target.value)}
                  // @ts-ignore
                  onBlur={e => setDomain(capitalizeContent(e.target.value))}
                />
              </InputContainer>
              <InputContainer>
                <FormTitleInput
                  name="seo_description"
                  title="Descrição da Postagem para o Google (até 166 caracteres)"
                  width="100%"
                  validated={false}
                  maxLength={166}
                  fullW
                />
              </InputContainer>
              <InputContainer>
                <TagInput
                  title="Keywords para o Google"
                  tags={tags}
                  setTags={setTags}
                  fullW
                  validated={false}
                />
              </InputContainer>
              <CustomSectionTitle>
                Códigos do Site
              </CustomSectionTitle>
              <InputContainer>
                <FormInput
                  name="script_facebook_pixel"
                  title="Facebook Pixel"
                  width="22.5rem"
                  validated={false}
                />
                <FormInput
                  name="script_google_ads"
                  title="Rastreio de conversões do Google Ads"
                  width="22.5rem"
                  validated={false}
                />
                <FormInput
                  name="script_google_analytics"
                  title="Google Analytics"
                  width="22.5rem"
                  validated={false}
                />
              </InputContainer>
              <CustomSectionTitle>
                Temas
              </CustomSectionTitle>
              <InputContainer>
                <FormSelect
                  name="theme"
                  title="Escolhe seu tema:"
                  placeholder="Selecione..."
                  customWidth="15rem"
                  customValue={thems?.find(theme => theme.value === defaultTheme)}
                  data={thems}
                />
              </InputContainer>
              <CustomSectionTitle>
                Cores do Site {cor1}
              </CustomSectionTitle>
              <InputContainer style={{ display: 'flex', justifyContent: 'space-around' }}>

                <ColorInputx title='Cor Principal' cor={cor1} setCor={setCor1} />
                <ColorInputx title='Destaque 1' cor={cor2} setCor={setCor2} />
                <ColorInputx title='Destaque 2' cor={cor3} setCor={setCor3} />
                <ColorInputx title='Destaque 3' cor={cor4} setCor={setCor4} />

              </InputContainer>
              <CodeContainer>
                <label htmlFor="">
                  Códigos Adicionais (JavaScript)&nbsp;<b>altere o conteúdo abaixo somente se souber o que está fazendo</b>
                </label>
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    color: "#fff"
                  }}
                />
              </CodeContainer>

              <CustomSectionTitle>
                Contatos e Redes Sociais
              </CustomSectionTitle>
              <InputContainer style={{ alignItems: 'flex-start' }}>
                <ColumnInputContainer>

                  <FormPhoneBox
                    name="cellphone"
                    title="Celular"
                    // disabled={!client}
                    // value={cellphone}
                    // onChange={(e) => setCellphone(e.target.value)}
                    // onBlur={({ target: { value } }) =>
                    // phoneIsValid(value) && handleAddPhone('cellphone', value)}
                    width="10.5rem"
                  />
                </ColumnInputContainer>
                <ColumnInputContainer>

                  <FormPhoneBox
                    name="phone"
                    title="Telefone Fixo"
                    mask="(99) 9999-9999"
                    placeholder="(00) 0000-0000"

                    width="10.5rem"
                  />
                </ColumnInputContainer>
                <ColumnInputContainer>

                  <FormPhoneBox
                    name="whatsapp"
                    title="WhatsApp"

                    width="10.5rem"
                  />
                </ColumnInputContainer>
              </InputContainer>
              <InputContainer>

                <SocialBox
                  name="social_instagram"
                  title="Instagram"
                  type="social"
                  validated
                  badge={InstagramIcon}
                  width="18.125rem"
                />
              </InputContainer>
              <InputContainer>
                <SocialBox
                  name="social_facebook"
                  title="Facebook"
                  type="social"
                  validated
                  badge={FacebookIcon}
                  width="18.125rem"
                />
                <SocialBox
                  name="social_youtube"
                  title="YouTube"
                  type="social"
                  validated
                  badge={YoutubeIcon}
                  width="18.125rem"
                />
                <SocialBox
                  name="social_twitter"
                  title="Twitter"
                  type="social"
                  validated
                  badge={TwitterIcon}
                  width="18.125rem"
                />
              </InputContainer>

              <Button
                onClick={handleSubmit}
                className="save"
                disabled={updating}
              >
                {updating ? 'Salvando...' : 'Salvar Info do Site'}
              </Button>
            </Container>
          </Form>}
      </MenuAndTableContainer >
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
