import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ReactComponent as DashboardIcon } from '~assets/menu/dashboard.svg';

import { ReactComponent as EmailIcon } from '~assets/menu/email.svg';
import { ReactComponent as InboxIcon } from '~assets/menu/inbox.svg';
import { ReactComponent as SentIcon } from '~assets/menu/sent.svg';
import { ReactComponent as SpamIcon } from '~assets/menu/spam.svg';

import { ReactComponent as RegisterIcon } from '~assets/menu/register.svg';
import { ReactComponent as TruckIcon } from '~assets/menu/truck-ico.svg';
import { ReactComponent as ClientIcon } from '~assets/menu/cliente-ico.svg';
import { ReactComponent as SupplierIcon } from '~assets/menu/supplier.svg';
import { ReactComponent as VcardIcon } from '~assets/menu/vcard.svg';
import { ReactComponent as BannerIcon } from '~assets/menu/banner.svg';
import { ReactComponent as ReviewIcon } from '~assets/menu/review.svg';
import { ReactComponent as StoresIcon } from '~assets/menu/stores.svg';
import { ReactComponent as AdminIcon } from '~assets/menu/admin.svg';

import { ReactComponent as BlogIcon } from '~assets/menu/blog.svg';
import { ReactComponent as PostIcon } from '~assets/menu/post.svg';
import { ReactComponent as AuthorIcon } from '~assets/menu/author.svg';
import { ReactComponent as PostCategoryIcon } from '~assets/menu/post_category.svg';

import { ReactComponent as EcommerceIcon } from '~assets/menu/ecommerce.svg';
import { ReactComponent as SalesIcon } from '~assets/menu/sales.svg';
import { ReactComponent as CbackIcon } from '~assets/menu/cback.svg';
import { ReactComponent as CouponIcon } from '~assets/menu/coupon.svg';

import { ReactComponent as NewsletterIcon } from '~assets/menu/newsletter.svg';
import { ReactComponent as CampaignIcon } from '~assets/menu/campaign.svg';
import { ReactComponent as SubscribedIcon } from '~assets/menu/subscribed.svg';

import { ReactComponent as GoogleAnalyticsIcon } from '~assets/menu/google_analytics.svg';
import { ReactComponent as SalesReportIcon } from '~assets/menu/sales_report.svg';

import { ReactComponent as FinancialIcon } from '~assets/menu/financial.svg';
import { ReactComponent as SupportIcon } from '~assets/menu/support.svg';

// import { ReactComponent as SettingsIcon } from '~assets/menu/settings.svg';
import { ReactComponent as WebsiteInfoIcon } from '~assets/menu/website_info.svg';

import { ReactComponent as PlusIcon } from '~assets/menu/plus_ico.svg';
import { ReactComponent as RegisterSupplierIcon } from '~assets/menu/representada.svg';
import { ReactComponent as StoreIcon } from '~assets/menu/store.svg';
import { ReactComponent as ProductIcon } from '~assets/menu/product.svg';
import { ReactComponent as ImportingIcon } from '~assets/menu/importing.svg';
import { ReactComponent as CategoriesIcon } from '~assets/menu/categories.svg';
import { ReactComponent as BrandIcon } from '~assets/menu/brand.svg';
import { ReactComponent as HighlightIcon } from '~assets/menu/highlight.svg';

import { ReactComponent as TGOOIcon } from '~assets/menu/tgooworldwide.svg';

// import { ReactComponent as Brand } from '../../assets/Brand.svg';

import { Container, MenuItem, SectionMenuItem, ShouldSave } from './styles';

interface Props {
  minimal?: boolean;
}

export function Menu({ minimal = false }: Props) {
  const { pathname } = useLocation();

  const isOnMailRoute = useMemo(() =>
    pathname.includes('mail')
    , [pathname])

  const isOnRegisterRoute = useMemo(() =>
    pathname.includes('register')
    , [pathname])

  const isOnBlogRoute = useMemo(() =>
    pathname.includes('blog')
    , [pathname])

  const isOnStoreRoute = useMemo(() =>
    pathname.includes('store')
    , [pathname])

  const isOnNewsletterRoute = useMemo(() =>
    pathname.includes('newsletter')
    , [pathname])

  const isOnReportRoute = useMemo(() =>
    pathname.includes('report')
    , [pathname])

  const isOnFinancesRoute = useMemo(() =>
    pathname.includes('finances')
    , [pathname])

  const isOnSupportRoute = useMemo(() =>
    pathname.includes('support')
    , [pathname])

  const isOnSettingsRoute = useMemo(() =>
    pathname.includes('settings')
    , [pathname])

  // const isOnImportXml = useMemo(() =>
  //   pathname.includes('import-xml')
  //   , [pathname])

  // const isOnImportExcel = useMemo(() =>
  //   pathname.includes('import-excel')
  //   , [pathname])
  

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Container minimal={minimal}>
        {/* <ShouldSave title="Salve as alterações!" /> */}
        <SectionMenuItem
          to="/dashboard"
          minimal={minimal}
          selected={pathname === "/dashboard"}
          orange
          style={{
            borderRadius: '0.5rem 0.5rem 0 0'
          }}
        >
          <DashboardIcon />
          {!minimal && <p>Dashboard</p>}
        </SectionMenuItem>
        <SectionMenuItem
          to="/mail/inbox"
          minimal={minimal}
          selected={isOnMailRoute}
        >
          <EmailIcon />
          {!minimal && <p>Email</p>}
        </SectionMenuItem>
        {isOnMailRoute &&
          <>
            <MenuItem
              to="/mail/inbox"
              minimal={minimal}
              selected={pathname === "/mail/inbox"}
            >
              <InboxIcon />
              {!minimal && <p>Caixa de Entrada</p>}
            </MenuItem>
            <MenuItem
              to="/mail/sent"
              minimal={minimal}
              selected={pathname === "/mail/sent"}
            >
              <SentIcon />
              {!minimal && <p>Enviados</p>}
            </MenuItem>
            <MenuItem
              to="/mail/spam"
              minimal={minimal}
              selected={pathname === "/mail/spam"}
            >
              <SpamIcon />
              {!minimal && <p>Spam</p>}
            </MenuItem>
          </>
        }
        <SectionMenuItem
          to="/register/clients"
          minimal={minimal}
          selected={isOnRegisterRoute}
        >
          <RegisterIcon />
          {!minimal && <p>Cadastro</p>}
        </SectionMenuItem>
        {isOnRegisterRoute &&
          <>
            <MenuItem
              to="/register/buyers"
              minimal={minimal}
              selected={pathname.includes("/register/buyers")}
            >
              <EcommerceIcon />
              {!minimal && <p>Comprador</p>}
            </MenuItem>
            <MenuItem
              to="/register/sellers"
              minimal={minimal}
              selected={pathname === "/register/sellers"}
            >
              <ClientIcon />
              {!minimal && <p>Comercial</p>}
            </MenuItem>
            <MenuItem
              to="/register/clients"
              minimal={minimal}
              selected={pathname === "/register/clients"}
            >
              <ClientIcon />
              {!minimal && <p>Cliente</p>}
            </MenuItem>
            <MenuItem
              to="/register/clients/groups"
              minimal={minimal}
              selected={pathname === "/register/clients/groups"}
            >
              <ClientIcon />
              {!minimal && <p>Grupos de Cliente</p>}
            </MenuItem>
            <MenuItem
              to="/register/shipping"
              minimal={minimal}
              selected={pathname.includes("/register/shipping")}
            >
              <TruckIcon />
              {!minimal && <p>Transportadora</p>}
            </MenuItem>
            <MenuItem
              to="/register/suppliers/all"
              minimal={minimal}
              selected={pathname === "/register/suppliers/all"}
            >
              <RegisterSupplierIcon />
              {!minimal && <p>Representada</p>}
            </MenuItem>
            <MenuItem
              to="/register/vcard"
              minimal={minimal}
              selected={pathname === "/register/vcard"}
            >
              <VcardIcon />
              {!minimal && <p>vCard</p>}
            </MenuItem>
            <MenuItem
              to="/register/banners"
              minimal={minimal}
              selected={pathname === "/register/banners"}
            >
              <BannerIcon />
              {!minimal && <p>Banner (Publicidade)</p>}
            </MenuItem>
            <MenuItem
              to="/register/testimonials"
              minimal={minimal}
              selected={pathname === "/register/testimonials"}
            >
              <ReviewIcon />
              {!minimal && <p>Testemunhos</p>}
            </MenuItem>
            <MenuItem
              to="/register/admin"
              minimal={minimal}
              selected={pathname === "/register/admin"}
            >
              <AdminIcon />
              {!minimal && <p>Administrador</p>}
            </MenuItem>
          </>
        }
        <SectionMenuItem
          to="/blog/posts"
          minimal={minimal}
          selected={isOnBlogRoute}
        >
          <BlogIcon />
          {!minimal && <p>Blog</p>}
        </SectionMenuItem>
        {isOnBlogRoute &&
          <>
            <MenuItem
              to="/blog/posts"
              minimal={minimal}
              selected={pathname === "/blog/posts"}
            >
              <PostIcon />
              {!minimal && <p>Postagem</p>}
            </MenuItem>
            <MenuItem
              to="/blog/author"
              minimal={minimal}
              selected={pathname === "/blog/author"}
            >
              <AuthorIcon />
              {!minimal && <p>Autor da Postagem</p>}
            </MenuItem>
            <MenuItem
              to="/blog/category"
              minimal={minimal}
              selected={pathname === "/blog/category"}
            >
              <PostCategoryIcon />
              {!minimal && <p>Categoria da Postagem</p>}
            </MenuItem>
          </>
        }
        <SectionMenuItem
          to="/store/products"
          minimal={minimal}
          selected={pathname.includes('store')}
        >
          <EcommerceIcon />
          {!minimal && <p>Loja Online</p>}
        </SectionMenuItem>
        {isOnStoreRoute &&
          <>
            <MenuItem
              to="/store/cupons"
              minimal={minimal}
              selected={pathname.includes('/store/cupo ns')}
            >
              <CouponIcon />
              {!minimal && <p>Cupons</p>}
            </MenuItem>
            <MenuItem
              to="/store/sales"
              minimal={minimal}
              selected={pathname.includes('/store/sales')}
            >
              <SalesIcon />
              {!minimal && <p>Vendas</p>}
            </MenuItem>
            <MenuItem
              to="/store/products"
              minimal={minimal}
              selected={pathname === "/store/products" || pathname === "/store/products/details"}
            >
              <ProductIcon />
              {!minimal && <p>Produtos</p>}
            </MenuItem>
            <MenuItem
              to="/store/import"
              minimal={minimal}
              selected={pathname === '/store/import' || pathname === '/store/import/new'}
            >
              <ImportingIcon />
              {!minimal && <p>Importação dos Produtos</p>}
            </MenuItem>
            <MenuItem
              to="/store/categories"
              minimal={minimal}
              selected={pathname === '/store/categories'}
            >
              <CategoriesIcon />
              {!minimal && <p>Categoria do Produto</p>}
            </MenuItem>
            <MenuItem
              to="/store/brands"
              minimal={minimal}
              selected={pathname === '/store/brands'}
            >
              <BrandIcon />
              {!minimal && <p>Marca do Produto</p>}
            </MenuItem>
            <MenuItem
              to="/store/highlight_images"
              minimal={minimal}
              selected={pathname === '/store/highlight_images'}
            >
              <HighlightIcon />
              {!minimal && <p>Imagens de Destaque</p>}
            </MenuItem>
            <MenuItem
              to="/store/suppliers"
              minimal={minimal}
              selected={pathname === '/store/suppliers'}
            >
              <SupplierIcon />
              {!minimal && <p>Representadas</p>}
            </MenuItem>
            <MenuItem
              to="/store/attributes"
              minimal={minimal}
              selected={pathname === '/store/attributes'}
            >
              <CategoriesIcon />
              {!minimal && <p>Atributo</p>}
            </MenuItem>

          </>
        }
        <SectionMenuItem
          to="/newsletter/campaign"
          minimal={minimal}
          selected={isOnNewsletterRoute}
        >
          <NewsletterIcon />
          {!minimal && <p>Newsletter</p>}
        </SectionMenuItem>
        {isOnNewsletterRoute &&
          <>
            <MenuItem
              to="/newsletter/campaign"
              minimal={minimal}
              selected={pathname === "/newsletter/campaign"}
            >
              <CampaignIcon />
              {!minimal && <p>Campanha</p>}
            </MenuItem>
            <MenuItem
              to="/newsletter/subscriber"
              minimal={minimal}
              selected={pathname === "/newsletter/subscriber"}
            >
              <SubscribedIcon />
              {!minimal && <p>Subscrito</p>}
            </MenuItem>
          </>
        }
        <SectionMenuItem
          to="/report/analytics"
          minimal={minimal}
          selected={isOnReportRoute}
        >
          <DashboardIcon />
          {!minimal && <p>Relatório</p>}
        </SectionMenuItem>
        {isOnReportRoute &&
          <>
            <MenuItem
              to="/report/analytics"
              minimal={minimal}
              selected={pathname === "/report/analytics"}
            >
              <GoogleAnalyticsIcon />
              {!minimal && <p>Analytics</p>}
            </MenuItem>
            <MenuItem
              to="/report/sales"
              minimal={minimal}
              selected={pathname === "/report/sales"}
            >
              <SalesReportIcon />
              {!minimal && <p>Vendas</p>}
            </MenuItem>
          </>
        }
        <SectionMenuItem
          to="/finances"
          minimal={minimal}
          selected={isOnFinancesRoute}
        >
          <FinancialIcon />
          {!minimal && <p>Financeiro</p>}
        </SectionMenuItem>
        {isOnFinancesRoute &&
          <>
            <MenuItem
              to="/finances/import-xml"
              minimal={minimal}
              selected={pathname === "/finances/import-xml"}
            >
              <ImportingIcon />
              {!minimal && <p>Importar XML</p>}
            </MenuItem>
            <MenuItem
              to="/finances/import-excel-faturamento"
              minimal={minimal}
              selected={pathname === "/finances/import-excel-faturamento"}
            >
              <ImportingIcon />
              {!minimal && <p>Importar Faturamentos</p>}
            </MenuItem>
            <MenuItem
              to="/finances/import-excel-titulos"
              minimal={minimal}
              selected={pathname === "/finances/import-excel-titulos"}
            >
              <ImportingIcon />
              {!minimal && <p>Importar Títulos</p>}
            </MenuItem>
          </>
        }
        <SectionMenuItem
          to="/support"
          minimal={minimal}
          selected={isOnSupportRoute}
        >
          <SupportIcon />
          {!minimal && <p>Suporte</p>}
        </SectionMenuItem>
        <SectionMenuItem
          to="/settings/info"
          minimal={minimal}
          selected={pathname === "/settings/info" || pathname.includes("/settings/map")}
        >
          {/* <SettingsIcon /> */}
          {!minimal && <p>Configuração</p>}
        </SectionMenuItem>
        {isOnSettingsRoute &&
          <>
            <MenuItem
              to="/settings/info"
              minimal={minimal}
              selected={pathname === "/settings/info"}
            >
              <WebsiteInfoIcon />
              {!minimal && <p>Info do Site</p>}
            </MenuItem>
            <MenuItem
              to="/settings/map"
              minimal={minimal}
              selected={pathname.includes("/settings/map")}
            >
              <PostCategoryIcon />
              {!minimal && <p>Mapa do Site</p>}
            </MenuItem>
          </>
        }
      </Container>
      {!minimal &&
        <TGOOIcon
          style={{
            marginTop: '1rem',
            marginLeft: '1rem'
          }}
        />
      }
    </div>
  );
}
