const mix = require('laravel-mix');
const { browserSync, scripts, copy, styles, copyDirectory } = require("laravel-mix");

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/scss/pages/home.scss', 'public/css').options({
        processCssUrls: false
    })
    .sass('resources/scss/pages/products.scss', 'public/css')
    .sass('resources/scss/pages/product-details.scss', 'public/css')
    .sass('resources/scss/pages/buyer-panel.scss', 'public/css')
    .sass('resources/scss/pages/register.scss', 'public/css')
    .sass('resources/scss/pages/blog-posts.scss', 'public/css')
    .sass('resources/scss/pages/blog-post.scss', 'public/css')
    .sass('resources/scss/pages/pages-industry.scss', 'public/css')
    .sass('resources/scss/pages/cart.scss', 'public/css')
    .sass('resources/scss/pdf/invoice.scss', 'public/css')
    ;

scripts([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap3-sass/assets/javascripts/bootstrap/tooltip.js',
    'node_modules/bootstrap3-sass/assets/javascripts/bootstrap/modal.js',
    'node_modules/slick-carousel/slick/slick.min.js',
    'node_modules/select2/dist/js/select2.full.min.js',
    'node_modules/inputmask/dist/jquery.inputmask.min.js',
    'node_modules/photoswipe/dist/photoswipe.min.js',
    'node_modules/photoswipe/dist/photoswipe-ui-default.min.js',
    'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
    'node_modules/plyr/dist/plyr.min.js',
    'node_modules/ez-plus/src/jquery.ez-plus.js',
    'resources/js/frontend/lazy-loading.js',
    'resources/js/frontend/photoswipe-template.js',
], 'public/js/dependencies.js').version();

// Themes
mix.copy('resources/themes/**/*.js', 'public/themes/js').version();
mix.copy('resources/themes/**/*.png', 'public/themes/images').version();
mix.copy('resources/themes/**/*.jpg', 'public/themes/images').version();
mix.copy('resources/themes/**/*.svg', 'public/themes/images').version();

// Pages
scripts([
    'resources/js/frontend/initialize.js',
    'resources/js/frontend/pages/home.js',
], 'public/js/home.js').version();

scripts([
    'resources/js/frontend/initialize.js',
    'resources/js/frontend/components/product_filter-search.js',
], 'public/js/products.js').version();

scripts([
    'resources/js/frontend/initialize.js',
], 'public/js/product.js').version();

scripts([
    'resources/js/frontend/initialize.js'
], 'public/js/suppliers.js').version();

scripts([
    'resources/js/frontend/initialize.js',
    'resources/js/frontend/pages/cart.js'
], 'public/js/cart.js').version();

scripts([
    'resources/js/frontend/initialize.js',
    'resources/js/frontend/components/form-address.js',
    'resources/js/frontend/receitaws.js',
    'resources/js/frontend/pages/buyer-panel.js',
    'resources/js/frontend/pages/order.js'
], 'public/js/buyer.js').version();

styles([
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/slick-carousel/slick/slick-theme.css',
    'node_modules/photoswipe/dist/photoswipe.css',
    'node_modules/photoswipe/dist/default-skin/default-skin.css',
], 'public/css/plugins.css').version();

copy('node_modules/photoswipe/src/css/default-skin/default-skin.svg', 'public/css/default-skin.svg');
copy('node_modules/slick-carousel/slick/ajax-loader.gif', 'public/css/ajax-loader.gif');
copyDirectory('node_modules/slick-carousel/slick/fonts', 'public/css/fonts');

browserSync({
    proxy: 'auge.test',
    port: '8000'
});
