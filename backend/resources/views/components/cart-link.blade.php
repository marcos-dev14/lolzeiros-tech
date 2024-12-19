@props(['route', 'total'])

<a href="{{ $route }}" class="right-side">
    <x-icons.shopping-cart></x-icons.shopping-cart>
    <span>R$ {{ number_format($total, 2, ',', '.') ?? "0,00" }}</span>
</a>
