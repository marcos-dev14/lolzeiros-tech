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
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Login']])

            <div class="row">
                <div class="col-12">
                    <header class="with-title">
                        <h2 class="color-initial">Bem vindo à Auge App</h2>
                        <p>Onde sua loja vai às compras e você sai economizando.</p>
                    </header>
                </div>

                <div class="col-12 col-md-6 login-div">
                    {!! Form::open(['route' => 'buyer.login', 'method' => 'post', 'data-toggle' => 'validator']) !!}
                        <div class="form-header login-card">
                            <div>
                                <h3>
                                    <x-icons.like></x-icons.like>
                                    <span class="title-login">Entrar</span>
                                </h3>

                                <p>Bem vindo de volta e boas compras.</p>

                                @if(Session::has('message'))
                                    <p class="alerts">{!! Session::get('message') !!}</p>
                                @endif
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
                                    required
                                    autofocus
                                    class="gray-input"
                                ></x-form.input>
                            </div>

                            <div class="col-12">
                                <x-form.input type="password" name="password" label="Senha" class="gray-input" required></x-form.input>
                            </div>

                            {!! app('captcha')->render('pt-BR') !!}

                            <div class="col-xs-12 col-md-12 text-center">
                                <div class="col-xs-8 col-xs-offset-2" style="margin-bottom: 6px;">
                                    <x-form.button label="ENTRAR" class="btn btn-block btn-sm button-one"></x-form.button>
                                </div>
                            </div>

{{--                            <div class="col-xs-6">--}}
{{--                                <x-form.input type="checkbox" name="remember" label="Permanecer logado"></x-form.input>--}}
{{--                            </div>--}}

                            <div class="col-xs-12 text-right">
                                <a href="{{ route('password.email') }}">Esqueceu sua senha?</a>
                            </div>
                        </div>
                    {!! Form::close() !!}
                </div>

                <div class="col-12 col-md-6 register-div">
                    {!! Form::open(['route' => 'buyer.register', 'method' => 'post', 'data-toggle' => 'validator']) !!}
                        <x-loader id="register-loader"></x-loader>

                        {!! Form::hidden('receita_api', old('receita_api') ?? null, ['id' => 'receitaws']) !!}

                        <div class="register-card">
                            <div class="form-header">
                                <h3>
                                    <x-icons.store-register></x-icons.store-register>
                                    <span class="title-register"> Criar uma nova conta </span>
                                </h3>
                                <p>Cadastre sua loja em 30 segundos e já faça seu pedido.</p>
                            </div>

                            <div class="expand-register-icon disabled hidden-md hidden-lg">
                                    <span>
                                        <x-icons.down class="rotate"></x-icons.down>
                                    </span>
                            </div>
                        </div>
                        <div class="hidden-register-items">
                            <div class="row">
                                <div class="col-xs-12 col-md-6">
                                    <x-form.input
                                        type="text"
                                        value="{{ old('client.document') }}"
                                        name="client[document]"
                                        class="mask-cnpj gray-input"
                                        label="CNPJ"
                                        id="document"
                                        required
                                    ></x-form.input>
                                </div>

                                <div class="col-xs-12 col-md-6">
                                    <x-form.select
                                        name="client[client_pdv_id]"
                                        :values="$clientPdvs"
                                        selected="{{ old('client.client_pdv_id') ?? null }}"
                                        label="Área de Atuação da Empresa"
                                        autofocus
                                        required
                                        class="gray-input gray-select"
                                    ></x-form.select>
                                </div>

                                <div class="col-xs-12">
                                    <x-form.input
                                        type="text"
                                        value="{{ old('client.name') }}"
                                        name="client[name]"
                                        class="w-bg, gray-input"
                                        label="Razão Social"
                                        id="name"
                                        isDisabled="true"
                                        data-format="Pascal"
                                    ></x-form.input>
                                </div>

                                <div class="col-xs-7">
                                    <x-form.input
                                        type="text"
                                        value="{{ old('buyer.name') }}"
                                        name="buyer[name]"
                                        label="Seu nome"
                                        required
                                        data-format="Pascal"
                                        class="gray-input"
                                    ></x-form.input>
                                </div>

                                <div class="col-xs-5">
                                    <x-form.input
                                        type="text"
                                        value="{{ old('buyer.cellphone') }}"
                                        name="buyer[cellphone]"
                                        class="mask-cellphone gray-input"
                                        label="Celular"
                                        required
                                    ></x-form.input>
                                </div>

                                <div class="col-xs-12">
                                    <x-form.input
                                        type="email"
                                        value="{{ old('buyer.email') }}"
                                        name="buyer[email]"
                                        label="Email"
                                        required
                                        onkeyup="this.value = this.value.toLowerCase();"
                                        class="gray-input"
                                    ></x-form.input>
                                </div>

                                <div class="col-xs-12 col-md-6">
                                    <x-form.input
                                        type="password"
                                        name="buyer[password]"
                                        label="Senha"
                                        required
                                        class="gray-input"
                                    ></x-form.input>
                                </div>

                                <div class="col-xs-12 col-md-6">
                                    <x-form.input
                                        type="password"
                                        name="buyer[password_confirmation]"
                                        label="Confirmação de Senha"
                                        class="gray-input"
                                        required
                                    ></x-form.input>
                                </div>
                                <div class="col-xs-12">
                                    <div class="col-xs-10 col-xs-offset-1">
                                        <x-form.button label="CRIAR CONTA JURÍDICA" class="btn btn-block btn-sm button-one"></x-form.button>
                                    </div>
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
