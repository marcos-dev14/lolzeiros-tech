@push('styles')
    <link rel="stylesheet" href="{{ mix('css/register.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/buyer.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="login-register">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Esqueceu sua senha?']])

            <div class="row">
{{--                <div class="col-12">--}}
{{--                    <header class="with-title">--}}
{{--                        <h2 class="color-initial">Bem vindo à Auge App</h2>--}}
{{--                        <p>Onde sua loja vai às compras e você sai economizando.</p>--}}
{{--                    </header>--}}
{{--                </div>--}}

                <div class="col-12 col-md-6 col-md-offset-3">
                    {!! Form::open(['route' => 'password.email', 'method' => 'post', 'data-toggle' => 'validator']) !!}
                        <div class="form-header login-card">
                            <div>
                                <h3>
                                    <x-icons.like></x-icons.like>
                                    <span class="title-login">Esqueceu sua senha?</span>
                                </h3>
                                <p>Não se preocupe, preencha seu email <!--<b>ou</b> CNPJ -->que te ajudaremos a redefiní-la.</p>
                            </div>

                            <div class="expand-icon disabled hidden-md hidden-lg flipped">
                                <span>
                                    <x-icons.down class="rotate"></x-icons.down>
                                </span>
                            </div>
                        </div>

                        <div class="hidden-items">
                            <div class="col-12">
                                <x-form.input
                                    type="email"
                                    name="email"
                                    value="{{ old('email') }}"
                                    onkeyup="this.value = this.value.toLowerCase();"
                                    label="Email"
                                    autofocus
                                    autocomplete="email"
                                    class="gray-input"
                                ></x-form.input>
                            </div>

{{--                            <div class="col-12">--}}
{{--                                <x-form.input--}}
{{--                                    type="text"--}}
{{--                                    value="{{ old('document') }}"--}}
{{--                                    name="document"--}}
{{--                                    class="mask-cnpj gray-input"--}}
{{--                                    label="CNPJ"--}}
{{--                                ></x-form.input>--}}
{{--                            </div>--}}

                            {!! app('captcha')->render('pt-BR') !!}

                            <div class="col-xs-12 col-md-12 text-center">
                                <div class="col-xs-8 col-xs-offset-2">
                                    <x-form.button label="ENVIAR" class="btn btn-block btn-sm button-one"></x-form.button>
                                </div>
                            </div>
                        </div>
                    {!! Form::close() !!}
                </div>
            </div>
        </div>
    </section>

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
