import { BrowserRouter, Switch } from 'react-router-dom';

import { Route } from './route';

import { Login } from '~pages/Store/Login';
import { Profile } from '@/src/pages/Store/Profile';

import { Dashboard } from '~pages/Dashboard';

import { ViewProduct } from '~pages/Store/ViewProduct';

import { Campaign } from '~pages/Newsletter/Campaign';
import { Subscriber } from '~pages/Newsletter/Subscriber';

import { Inbox } from '~pages/Mail/Inbox';
import { Sent } from '~pages/Mail/Sent';
import { NewEmail } from '~pages/Mail/New';
import { Spam } from '~pages/Mail/Spam';

import { Analytics } from '~pages/Report/Analytics';
import { Sales } from '~pages/Report/Sales';

import { Products } from '~pages/Store/Products';
import { ProductsDetails } from '~pages/Store/Products/Details';
import { Product } from '~pages/Store/Product';
import { PriceAndAttributes } from '~/pages/Store/Product/PriceAndAttributes';
import { SEO } from '~pages/Store/Product/SEO';
import { RelatedProducts } from '~pages/Store/Product/RelatedProducts';

import { Import } from '~pages/Store/Import';
import { NewImport } from '~pages/Store/Import/New';
import { Categories } from '~pages/Store/Categories';
import { Brands } from '~pages/Store/Brands';
import { Attributes } from '~pages/Store/Attributes';
import { HighlightImages } from '~pages/Store/HighlightImages';
import { Suppliers } from '~pages/Store/Suppliers';
import { ViewProductByUrl } from '~pages/Store/ViewProductByUrl';
import { Sales as StoreSales } from '~pages/Store/Sales';
import { NewSale as NewStoreSale } from '~pages/Store/Sales/New';

import { Buyer } from '~pages/Register/Buyer';
import { NewBuyer } from '../pages/Register/Buyer/New';
import { EditBuyer } from '~pages/Register/Buyer/Edit';
import { Clients } from '~pages/Register/Clients';
import { NewClient } from '~pages/Register/Clients/New';
import { ClientGroups } from '~pages/Register/ClientGroups';
import { NewClientGroup } from '~pages/Register/ClientGroups/New';
import { Order as ClientOrder } from '~pages/Register/Clients/Order';
import { ClientSupport } from '~pages/Register/Clients/Support';
import { Basket as ClientBasket } from '~pages/Register/Clients/Basket';
import { MostAccessed } from '~pages/Register/Clients/MostAccessed';
import { NewSupplier } from '~pages/Register/Supplier/New';
import { CurrentSuppliers } from '~pages/Register/Supplier';
import { SuppliersRules } from '~pages/Register/Supplier/Rules';
import { Sales as SuppliersSales } from '~pages/Register/Supplier/Sales';

import { Finances } from '@/src/pages/Finances';
import { EditFinances } from '~pages/Finances/Edit';

import { Support } from '~pages/Support';

import { VCard } from '~pages/Register/vCard';
import { EditVCard } from '~pages/Register/vCard/Edit';

import { Banners } from '~pages/Register/Banner';
import { Testimonials } from '~pages/Register/Testimonials';
import { Admin } from '~pages/Register/Admin';
import { BlogPosts } from '@/src/pages/Blog/Posts';
import { BlogAuthor } from '~pages/Blog/Author';
import { Coupon } from '~pages/Store/Coupon';
import { SiteInfo } from '~pages/Settings/Info';
import { Post } from '~pages/Blog/Post';
import { PostSEO } from '~pages/Blog/Post/SEO';
import { PostRelatedProducts } from '~pages/Blog/Post/RelatedProducts';
import { SiteMap } from '~pages/Settings/SiteMap';
import { BlogCategory } from '~pages/Blog/Category';
import { EditTestimonials } from '~pages/Register/Testimonials/Edit';
import { EditAuthor } from '../pages/Blog/Author/Edit';
import { SupportReply } from '../pages/Support/Reply';
import { SuppliersMedia } from '../pages/Register/Supplier/Media';
import { EditBanners } from '../pages/Register/Banner/Edit';
import { EditAdmin } from '../pages/Register/Admin/Edit';
import { EditSupport } from '../pages/Register/Clients/Support/Edit';
import { EditSiteMap } from '../pages/Settings/SiteMap/Edit';
import { Sellers } from '../pages/Register/Sellers';
import { Shipping } from '../pages/Register/Shipping';
import { NewShipping } from '../pages/Register/Shipping/New';
import { NewInvoice } from '../pages/Finances/NewInvoice';
import { Invoices } from '../pages/Finances/Invoices';
import { CupomAuge } from '../pages/Cupom/CupomAuge';
import { EditCupomAuge } from '../pages/Cupom/Edit/EditCupom';
import { ImportXml } from '../pages/Finances/ImportXml';
import { ImportExcelBilling } from '../pages/Finances/ImportExcelBilling';
import { ImportExcelTitles } from '../pages/Finances/ImportExcelTitles';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} isPrivate={false} />
        <Route path="/profile" exact component={Profile} />

        <Route path="/dashboard" exact component={Dashboard} />

        <Route path="/store/products" exact component={Products} />
        <Route path="/store/products/details" component={ProductsDetails} />
        <Route path="/store/cupons" exact component={CupomAuge} />
        <Route path="/store/cupons/edit/:id" component={EditCupomAuge} />

        <Route path="/store/product" exact component={PriceAndAttributes} />
        <Route path="/store/product/view" component={ViewProduct} />
        <Route path="/store/product/attributes" component={Product} />
        <Route path="/store/product/seo" component={SEO} />
        <Route path="/store/product/related" component={RelatedProducts} />

        <Route path="/produtos/:slug" component={ViewProductByUrl} />

        <Route path="/store/import" exact component={Import} />
        <Route path="/store/import/new" exact component={NewImport} />
        <Route path="/store/coupon" exact component={Coupon} />
        <Route path="/store/sales" exact component={StoreSales} />
        <Route path="/store/sales/new" component={NewStoreSale} />

        <Route path="/store/categories" component={Categories} />
        <Route path="/store/brands" component={Brands} />
        <Route path="/store/attributes" component={Attributes} />
        <Route path="/store/highlight_images" component={HighlightImages} />
        <Route path="/store/suppliers" exact component={Suppliers} />

        <Route path="/newsletter/campaign" exact component={Campaign} />
        <Route path="/newsletter/subscriber" component={Subscriber} />

        <Route path="/mail/inbox" exact component={Inbox} />
        <Route path="/mail/sent" exact component={Sent} />
        <Route path="/mail/new" exact component={NewEmail} />
        <Route path="/mail/spam" exact component={Spam} />

        <Route path="/report/analytics" exact component={Analytics} />
        <Route path="/report/sales" exact component={Sales} />

        <Route path="/register/buyers" exact component={Buyer} />
        <Route path="/register/buyers/new" component={NewBuyer} />
        <Route path="/register/buyers/edit" component={EditBuyer} />
        <Route path="/register/clients" exact component={Clients} />
        <Route path="/register/clients/groups" exact component={ClientGroups} />
        <Route path="/register/sellers" exact component={Sellers} />
        <Route path="/register/clients/new" component={NewClient} />
        <Route path="/register/clients/groups/new" component={NewClientGroup} />
        <Route path="/register/clients/order" component={ClientOrder} />
        <Route path="/register/clients/support" exact component={ClientSupport} />
        <Route path="/register/clients/support/edit" exact component={EditSupport} />
        <Route path="/register/clients/basket" component={ClientBasket} />
        <Route path="/register/clients/accessed" component={MostAccessed} />

        <Route path="/register/shipping" exact component={Shipping} />
        <Route path="/register/shipping/new" component={NewShipping} />

        <Route path="/register/suppliers/new" component={NewSupplier} />
        <Route path="/register/suppliers/all" component={CurrentSuppliers} />
        <Route path="/register/suppliers/rules" component={SuppliersRules} />
        <Route path="/register/suppliers/sales" component={SuppliersSales} />
        <Route path="/register/suppliers/media" component={SuppliersMedia} />

        <Route path="/register/vcard" exact component={VCard} />
        <Route path="/register/vcard/edit" component={EditVCard} />
        <Route path="/register/banners" exact component={Banners} />
        <Route path="/register/banners/edit" component={EditBanners} />
        <Route path="/register/testimonials" exact component={Testimonials} />
        <Route path="/register/testimonials/edit" component={EditTestimonials} />
        <Route path="/register/admin" exact component={Admin} />
        <Route path="/register/admin/edit" component={EditAdmin} />

        <Route path="/blog/posts" component={BlogPosts} />
        <Route path="/blog/author" exact component={BlogAuthor} />
        <Route path="/blog/author/edit" component={EditAuthor} />

        <Route path="/blog/category" component={BlogCategory} />
        <Route path="/blog/post/edit" component={Post} />
        <Route path="/blog/post/seo" component={PostSEO} />
        <Route path="/blog/post/related" component={PostRelatedProducts} />

        <Route path="/settings/info" component={SiteInfo} />
        <Route path="/settings/map" exact component={SiteMap} />
        <Route path="/settings/map/edit" component={EditSiteMap} />

        <Route path="/finances" exact component={Finances} />
        <Route path="/finances/edit/:id" component={EditFinances} />
        <Route path="/finances/invoices/:id" component={Invoices} />
        <Route path="/finances/new/:id" component={NewInvoice} />
        <Route path="/finances/import-xml" exact component={ImportXml} />
        <Route path="/finances/import-excel-faturamento" exact component={ImportExcelBilling} />
        <Route path="/finances/import-excel-titulos" exact component={ImportExcelTitles} />

        <Route path="/support" exact component={Support} />
        <Route path="/support/reply" component={SupportReply} />
      </Switch>
    </BrowserRouter>
  );
}

