<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'O campo :attribute deve ser aceito.',
    'accepted_if' => 'O campo :attribute deve ser aceito quando :other é :value.',
    'active_url' => 'O campo :attribute não é uma URL válida.',
    'after' => 'O campo :attribute deve ser uma data posterior a :date.',
    'after_or_equal' => 'O campo :attribute deve ser uma data posterior ou igual a :date.',
    'alpha' => 'O campo :attribute só pode conter letras.',
    'alpha_dash' => 'O campo :attribute só pode conter letras, números e traços.',
    'alpha_num' => 'O campo :attribute só pode conter letras e números.',
    'array' => 'O campo :attribute deve ser uma matriz.',
    'before' => 'O campo :attribute deve ser uma data anterior :date.',
    'before_or_equal' => 'O campo :attribute deve ser uma data anterior ou igual a :date.',
    'between' => [
        'numeric' => 'O campo :attribute deve ser entre :min e :max.',
        'file' => 'O campo :attribute deve ser entre :min e :max kilobytes.',
        'string' => 'O campo :attribute deve ser entre :min e :max caracteres.',
        'array' => 'O campo :attribute deve ter entre :min e :max itens.',
    ],
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',
    'confirmed' => 'O campo :attribute de confirmação não confere.',
    'current_password' => 'A senha está incorreta.',
    'date' => 'O campo :attribute não é uma data válida.',
    'date_equals' => 'O campo :attribute deve ser uma data igual a :date.',
    'date_format' => 'O campo :attribute não corresponde ao formato :format.',
    'declined' => 'O campo :attribute deve ser recusado.',
    'declined_if' => 'O campo :attribute deve ser recusado quando :other é :value.',
    'different' => 'Os campos :attribute e :other devem ser diferentes.',
    'digits' => 'O campo :attribute deve ter :digits dígitos.',
    'digits_between' => 'O campo :attribute deve ter entre :min e :max dígitos.',
    'dimensions' => 'O campo :attribute tem dimensões de imagem inválidas.',
    'distinct' => 'O campo :attribute campo tem um valor duplicado.',
    'email' => 'O campo :attribute deve ser um endereço de e-mail válido.',
    'ends_with' => 'O campo :attribute deve terminar com um dos seguintes: :values',
    'enum' => 'O campo :attribute selecionado é inválido.',
    'exists' => 'O campo :attribute selecionado é inválido.',
    'file' => 'O campo :attribute deve ser um arquivo.',
    'filled' => 'O campo :attribute deve ter um valor.',
    'gt' => [
        'numeric' => 'O campo :attribute deve ser maior que :value.',
        'file' => 'O campo :attribute deve ser maior que :value kilobytes.',
        'string' => 'O campo :attribute deve ser maior que :value caracteres.',
        'array' => 'O campo :attribute deve conter mais de :value itens.',
    ],
    'gte' => [
        'numeric' => 'O campo :attribute deve ser maior ou igual a :value.',
        'file' => 'O campo :attribute deve ser maior ou igual a :value kilobytes.',
        'string' => 'O campo :attribute deve ser maior ou igual a :value caracteres.',
        'array' => 'O campo :attribute deve conter :value itens ou mais.',
    ],
    'image' => 'O campo :attribute deve ser uma imagem.',
    'in' => 'O campo :attribute selecionado é inválido.',
    'in_array' => 'O campo :attribute não existe em :other.',
    'integer' => 'O campo :attribute deve ser um número inteiro.',
    'ip' => 'O campo :attribute deve ser um endereço de IP válido.',
    'ipv4' => 'O campo :attribute deve ser um endereço IPv4 válido.',
    'ipv6' => 'O campo :attribute deve ser um endereço IPv6 válido.',
    'mac_address' => 'O campo :attribute deve ser um endereço MAC válido.',
    'json' => 'O campo :attribute deve ser uma palavra ou texto JSON válida.',
    'lt' => [
        'numeric' => 'O campo :attribute deve ser menor que :value.',
        'file' => 'O campo :attribute deve ser menor que :value kilobytes.',
        'string' => 'O campo :attribute deve ser menor que :value caracteres.',
        'array' => 'O campo :attribute deve conter menos de :value itens.',
    ],
    'lte' => [
        'numeric' => 'O campo :attribute deve ser menor ou igual a :value.',
        'file' => 'O campo :attribute deve ser menor ou igual a :value kilobytes.',
        'string' => 'O campo :attribute deve ser menor ou igual a :value caracteres.',
        'array' => 'O campo :attribute não deve conter mais que :value itens.',
    ],
    'max' => [
        'numeric' => 'O campo :attribute não pode ser superior a :max.',
        'file' => 'O campo :attribute não pode ser superior a :max kilobytes.',
        'string' => 'O campo :attribute não pode ser superior a :max caracteres.',
        'array' => 'O campo :attribute não pode ter mais do que :max itens.',
    ],
    'mimes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'mimetypes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'min' => [
        'numeric' => 'O campo :attribute deve ser pelo menos :min.',
        'file' => 'O campo :attribute deve ter pelo menos :min kilobytes.',
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
        'array' => 'O campo :attribute deve ter pelo menos :min itens.',
    ],
    'multiple_of' => 'O campo :attribute deve ser um múltiplo de :value.',
    'not_in' => 'O campo :attribute selecionado é inválido.',
    'not_regex' => 'O campo :attribute possui um formato inválido.',
    'numeric' => 'O campo :attribute deve ser um número.',
    'password' => 'A senha está incorreta.',
    'present' => 'O campo :attribute deve estar presente.',
    'prohibited' => 'O campo :attribute é proibido.',
    'prohibited_if' => 'O campo :attribute é proibido quando :other for :value.',
    'prohibited_unless' => 'O campo :attribute é proibido exceto quando :other for :values.',
    'prohibits' => 'O campo :attribute proíbe o campo :other de estar presente.',
    'regex' => 'O campo :attribute tem um formato inválido.',
    'required' => 'O campo :attribute é obrigatório.',
    'required_if' => 'O campo :attribute é obrigatório quando :other for :value.',
    'required_unless' => 'O campo :attribute é obrigatório exceto quando :other for :values.',
    'required_with' => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_with_all' => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_without' => 'O campo :attribute é obrigatório quando :values não está presente.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum dos :values estão presentes.',
    'same' => 'Os campos :attribute e :other devem corresponder.',
    'size' => [
        'numeric' => 'O campo :attribute deve ser :size.',
        'file' => 'O campo :attribute deve ser :size kilobytes.',
        'string' => 'O campo :attribute deve ser :size caracteres.',
        'array' => 'O campo :attribute deve conter :size itens.',
    ],
    'starts_with' => 'O campo :attribute deve começar com um dos seguintes valores: :values',
    'string' => 'O campo :attribute deve ser uma palavra ou texto.',
    'timezone' => 'O campo :attribute deve ser uma zona válida.',
    'unique' => 'O campo :attribute já está sendo utilizado.',
    'uploaded' => 'Ocorreu uma falha no upload do campo :attribute.',
    'url' => 'O campo :attribute tem um formato inválido.',
    'uuid' => 'O campo :attribute deve ser um UUID válido.',
    'cnpj' => 'O CNPJ informado é inválido',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'document' => [
            'unique' => 'O CNPJ informado já está sendo utilizado.',
        ],
        'captcha' => [
            'captcha' => 'Falha ao validar CAPTCHA! Tente novamente.'
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'address' => 'endereço',
        'age' => 'idade',
        'body' => 'conteúdo',
        'cell' => 'celular',
        'city' => 'cidade',
        'country' => 'país',
        'date' => 'data',
        'day' => 'dia',
        'excerpt' => 'resumo',
        'first_name' => 'primeiro nome',
        'hour' => 'hora',
        'last_name' => 'sobrenome',
        'message' => 'mensagem',
        'minute' => 'minuto',
        'mobile' => 'celular',
        'month' => 'mês',
        'name' => 'nome',
        'neighborhood' => 'bairro',
        'number' => 'número',
        'password' => 'senha',
        'phone' => 'telefone',
        'second' => 'segundo',
        'sex' => 'sexo',
        'state' => 'estado',
        'street' => 'rua',
        'subject' => 'assunto',
        'text' => 'texto',
        'time' => 'hora',
        'username' => 'usuário',
        'year' => 'ano',
        'description' => 'descrição',
        'password_confirmation' => 'confirmação da senha',
        'current_password' => 'senha atual',
        'new_password' => 'nova senha',
        'new_password_confirmation' => 'confirmação da nova senha',
        'title' => 'título',
        'primary_text' => 'postagem principal',
        'secondary_text' => 'postagem secundária',
        'reference' => 'referência',
        'ean13' => 'ean13',
        'display_code' => 'código do display',
        'dun14' => 'dun14',
        'expiration_date' => 'data de validade',
        'origin' => 'origem',
        'release_year' => 'lançamento',
        'catalog_name' => 'nome do catálogo',
        'catalog_page' => 'página no catálogo',
        'gender' => 'gênero',
        'size_height' => 'produto altura',
        'size_width' => 'produto largura',
        'size_length' => 'produto comprimento',
        'size_cubic' => 'produto cubagem',
        'size_weight' => 'produto peso',
        'packing_type' => 'tipo de embalagem do produto',
        'box_height' => 'caixa altura',
        'box_width' => 'caixa largura',
        'box_length' => 'caixa comprimento',
        'box_cubic' => 'caixa cubagem',
        'box_weight' => 'caixa peso',
        'box_packing_type' => 'tipo de embalagem da caixa',
        'unit_price' => 'preço fracionada',
        'unit_price_promotional' => 'preço promocional fracionada',
        'unit_minimal' => 'quantidade mínima fracionada',
        'availability' => 'disponibilidade',
        'expected_arrival' => 'previsão de chegada da representada',
        'box_price' => 'preço caixa fechada',
        'box_price_promotional' => 'preço promocional caixa fechada',
        'box_minimal' => 'quantidade mínima caixa',
        'ipi' => 'ipi',
        'ncm' => 'ncm',
        'cst' => 'cst',
        'icms' => 'icms',
        'certification' => 'certificação',
        'age_group' => 'faixa etária',
        'category' => 'categoria',
        'brand' => 'marca',
        'attribute_category_id' => 'ID da categoria de atributos',
        'company_name' => 'Razão Social',
        'document' => 'CNPJ',
        'address_type_id' => 'Tipo de Endereço',
        'country_state_id' => 'Estado',
        'country_city_id' => 'Cidade',
        'client_pdv_id' => 'Área de Atuação da Empresa',
        'role_id' => 'Cargo na Empresa',
        'bank_id' => 'Banco',
        'group_name' => 'Grupo',
        'valid_until' => 'Validade',
        'discount_value' => 'Desconto',
        'min_quantity' => 'Quantidade Mínima',
        'shipping_company.name' => 'Nome da Transportadora',
        'shipping_company.document' => 'CNPJ da Transportadora',
        'shipping_company.phone' => 'Telefone da Transportadora',
        'supplier_id' => 'ID da Representada',
        'current_status' => 'Status atual',
        'cellphone' => 'Celular',
        'installment_rule_id' => 'Condição de pagamento'
    ],


];
