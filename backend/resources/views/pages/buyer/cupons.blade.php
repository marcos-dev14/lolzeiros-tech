<head>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/cupom-card.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

@push('styles')
    <link rel="stylesheet" href="{{ mix('css/home.css') }}">
@endpush

<x-layouts.buyer-panel title="Meus Cupons"
    subtitle="Gerenciar todos cupons. Em caso de dúvidas, contate o seu comercial Auge APP {{ $client->seller?->name }} {{ $client->seller?->cellphone }}"
    icon="icons.bag">
    <div class="filter">
        <label for="couponFilter">Filtrar cupons:</label>
        <select id="couponFilter" onchange="filterCoupons()">
            <option value="all">Todos</option>
            <option value="valid">Válidos</option>
            <option value="used">Usados</option>
        </select>
    </div>
    <div class="table-responsive">
        <div class="cupons-container">
            @foreach ($availableCoupons as $availableCoupon)
                <div class="cupom-card {{ $availableCoupon['already_used'] ? 'used' : 'valid' }}">
                    <div class="cupom-top">
                        <div class="content">
                            <h1>
                                <img src='{{ asset('images/cupom/cupom-icon.svg') }}' alt="" />
                                {{ $availableCoupon['discount'] }}
                                <span>
                                    de desconto
                                    @if($availableCoupon['client_profile'])
                                        {{ $availableCoupon['client_profile'] }}
                                    @elseif($availableCoupon['client_group'])
                                      no grupo  {{ $availableCoupon['client_group'] }}
                                    @elseif($availableCoupon['product'])
                                      em {{ $availableCoupon['product'] }}
                                    @elseif($availableCoupon['category'])
                                      na categoria  {{ $availableCoupon['category'] }}
                                    @elseif($availableCoupon['seller'])
                                        {{ $availableCoupon['seller'] }}
                                    @elseif($availableCoupon['shipping_company'])
                                      em {{ $availableCoupon['shipping_company'] }}
                                    @elseif($availableCoupon['supplier'])
                                      em  {{ $availableCoupon['supplier'] }}
                                    @endif
                                </span>
                            </h1>
                            <h2>{{ $availableCoupon['description'] }}</h2>
                        </div>
                    </div>
                    <div class="cupom-middle">
                        <div class="cupom-title">
                            <p>
                                @if ($availableCoupon['buyer'])
                                    {{ $availableCoupon['buyer'] }},
                                @elseif($availableCoupon['client_profile'])
                                    {{ $availableCoupon['client_profile'] }},
                                @elseif($availableCoupon['client_group'])
                                    {{ $availableCoupon['client_group'] }},
                                @elseif($availableCoupon['product'])
                                     {{ $availableCoupon['product'] }},
                                @elseif($availableCoupon['category'])
                                    {{ $availableCoupon['category'] }},
                                @elseif($availableCoupon['seller'])
                                    {{ $availableCoupon['seller'] }},
                                @elseif($availableCoupon['shipping_company'])
                                     {{ $availableCoupon['shipping_company'] }},
                                @elseif($availableCoupon['supplier']),
                                    {{ $availableCoupon['supplier'] }}
                                @elseif($availableCoupon['type'])
                                    {{ $availableCoupon['type'] }}
                                @endif
                            </p>
                        </div>

                        <div class="time-share">
                           @if($availableCoupon['already_used'])
                                <p class="validate">
                                    <i class="fas fa-check"></i>
                                    Utilizado
                                </p>
                                
                            @else
                                <p class="validate">
                                    <img src='{{ asset('images/cupom/hour.svg') }}' alt="" />
                                    {{ $availableCoupon['validate'] }}
                                </p>
                            @endif
                            <button class="shared" onclick="openShareModal({{ $loop->index }})">
                                <img src='{{ asset('images/cupom/share.svg') }}' alt="" />
                                Compartilhe
                            </button>
                        </div>
                    </div>
                    <div class="botton-box">

                        <div class="copy-button">
                            <div class="copybtn">CUPOM:</div>
                            <input id="copyvalue-{{ $loop->index }}" type="text" readonly value="{{ $availableCoupon['code'] }}" />
                            <button onclick="copyIt({{ $loop->index }})">
                                <img src='{{ asset('images/cupom/copy.svg') }}' alt="" />
                            </button>
                        </div>
                        <a href="{{ route('getProductsWithCoupon', ['coupon' => $availableCoupon['id']]) }}" class="button-products {{ $availableCoupon['already_used'] ? 'disabled' : '' }}">
                           ver Produtos
                        </a>
                    </div>

                </div>
            @endforeach
        </div>
    </div>
</x-layouts.buyer-panel>

<script>
    function copyIt(index) {
        var copyText = document.getElementById("copyvalue-" + index);
        copyText.select();
        document.execCommand("copy");
    }

    function filterCoupons() {
        var filter = document.getElementById("couponFilter").value;
        var coupons = document.querySelectorAll(".cupom-card");
        
        coupons.forEach(function(coupon) {
            if (filter === "all") {
                coupon.style.display = "block";
            } else if (filter === "valid" && coupon.classList.contains("valid")) {
                coupon.style.display = "block";
            } else if (filter === "used" && coupon.classList.contains("used")) {
                coupon.style.display = "block";
            } else {
                coupon.style.display = "none";
            }
        });
    }

    function openShareModal(index) {
        var couponCard = document.querySelectorAll(".cupom-card")[index];
        var discount = couponCard.querySelector("h1").innerText;
        var description = couponCard.querySelector("h2").innerText;
        var code = couponCard.querySelector("input").value;
        var message = `Confira este cupom: ${discount} - ${description}. Use o código: ${code}`;
console.log('cu');

        Swal.fire({
            title: 'Compartilhar Cupom',
            html: `
                <p>${message}</p>
                <div class="share-buttons">
                    <button id="shareWhatsapp" class="swal2-confirm swal2-styled"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                    <button id="shareEmail" class="swal2-confirm swal2-styled"><i class="fas fa-envelope"></i> Email</button>
                </div>
            `,
            showConfirmButton: false,
        });

        document.getElementById('shareWhatsapp').onclick = function() {
            var whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        };

        document.getElementById('shareEmail').onclick = function() {
            var emailSubject = 'Confira este cupom!';
            var emailBody = `${message}`;
            var mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.open(mailtoUrl, '_blank');
        };
    }
</script>
