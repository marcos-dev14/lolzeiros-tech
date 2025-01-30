<div class="menu">
    <ul>
        <li><a href="{{ route('seller.opportunities.index') }}" class="{{ request()->routeIs('seller.opportunities.index') ? 'active' : '' }}">Fornecedores</a></li>
        <li><a href="{{ route('seller.withoutOrders') }}" class="{{ request()->routeIs('seller.withoutOrders') ? 'active' : '' }}">Novas</a></li>
        <li><a href="{{ route('seller.frozenClients') }}" class="{{ request()->routeIs('seller.frozenClients') ? 'active' : '' }}">Congelados</a></li>    
    </ul>
</div>


<style>
    .menu {
        display: flex;
        justify-content: center;
        background: #f8f9fa;
        margin-bottom: 4rem;
        padding: 10px 0;
    }
    .menu ul {
        list-style: none;
        display: flex;
        gap: 20px;
    }
    .menu li a {
        text-decoration: none;
        color: #333;
        padding: 8px 16px;
        border-radius: 5px;
        transition: 0.3s
    }
    .menu li a.active,
    .menu li a:hover {
        background: #007bff;
        color: #fff;
    }
</style>
