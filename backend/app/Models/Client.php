<?php

namespace App\Models;

use App\Casts\Date;
use App\Casts\PascalCase;
use App\Models\Contracts\Addressable;
use App\Models\Contracts\Bankable;
use App\Models\Contracts\Contactable;
use App\Models\Traits\HasAddresses;
use App\Models\Traits\HasBankAccounts;
use App\Models\Traits\HasContacts;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Znck\Eloquent\Traits\BelongsToThrough;

class Client extends Model implements Addressable, Bankable, Contactable
{
    use SoftDeletes, Notifiable, HasAddresses, HasContacts, HasBankAccounts, BelongsToThrough;

    protected $fillable = [
        'old_id',
        'validated',
        'company_name',
        'name',
        'document',
        'document_status',
        'state_registration',
        'code',
        'activity_start',
        'activity_list',
        'legal_representative_list',
        'joint_stock',
        'auge_register',
        'has_ecommerce',
        'corporate_email',
        'website',
        'instagram',
        'facebook',
        'youtube',
        'twitter',
        'newsletter_tags',
        'commercial_status',
        'order_schedule',
        'order_balance',
        'enter_price_on_order',
        'can_migrate_service',
        'blocked_suppliers',
        'auto_observation_order',
        'client_group_id',
        'client_pdv_id',
        'client_origin_id',
        'blocking_rule_id',
        'seller_id',
        'client_profile_id',
        'tax_regime_id',
        'is_available',
    ];

    protected $casts = [
        'activity_start' => Date::class,
        'auge_register' => Date::class,
        'company_name' => PascalCase::class,
        'name' => PascalCase::class,
    ];

    //------------------------------------------------------------------
    // Relationships
    //------------------------------------------------------------------
    public function group(): BelongsTo
    {
        return $this->belongsTo(ClientGroup::class, 'client_group_id');
    }

    public function blockingRule(): BelongsTo
    {
        return $this->belongsTo(BlockingRule::class, 'blocking_rule_id');
    }

    public function pdvType(): BelongsTo
    {
        return $this->belongsTo(ClientPdv::class, 'client_pdv_id');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function phones(): HasMany
    {
        return $this->hasMany(ClientPhone::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function taxRegime(): BelongsTo
    {
        return $this->belongsTo(TaxRegime::class);
    }

    public function origin(): BelongsTo
    {
        return $this->belongsTo(ClientOrigin::class, 'client_origin_id');
    }

    public function blockedSuppliers(): BelongsToMany
    {
        return $this->belongsToMany(
            Supplier::class,
            'client_blocked_suppliers',
            'client_id',
            'supplier_id'
        );
    }

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function couponStatus(): HasMany
    {
        return $this->hasMany(CouponStatus::class);
    }

    public function buyer(): \Znck\Eloquent\Relations\BelongsToThrough
    {
        return $this->belongsToThrough(
            Buyer::class,
            ClientGroup::class
        );
    }

    public function wishlistProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'client_wishlists',
            'client_id',
            'product_id'
        )->with('supplier', 'brand', 'category', 'images');
    }

    //------------------------------------------------------------------
    // Scopes
    //------------------------------------------------------------------
    public function scopeIsAvailable($query)
    {
        return $query->whereIn('document_status', ['Ativo', 'Ativa']);
    }

    public function scopeEmptyStatus($query)
    {
        return $query->whereNull('commercial_status');
    }

    public function scopeIsUnavailable($query)
    {
        return $query->whereNotIn('document_status', ['Ativo', 'Ativa']);
    }

    public function scopeHasOrdersLastDays($query, int $days = null)
    {
        if ($days) {
            $query->whereHas('orders', function ($q) use ($days) {
                $q->whereDate('created_at', '>=', now()->subDays($days));
            });
        } else {
            $query->whereHas('orders');
        }
    }

    public function scopeWithMainAddressInState($query, $stateId)
    {
        $query->whereHas('addresses', function ($q) use ($stateId) {
            $q->where('address_type_id', 1)
                ->whereHas('state', function ($q) use ($stateId) {
                    $q->where('id', $stateId);
                });
        });
    }

    public function scopeWithMainAddressInCity($query, $cityId)
    {
        $query->whereHas('addresses', function ($q) use ($cityId) {
            $q->where('address_type_id', 1)
                ->whereHas('city', function ($q) use ($cityId) {
                    $q->where('id', $cityId);
                });
        });
    }

    public function scopeWithBuyer($query, $buyerId)
    {
        $query->whereHas('group', function ($query) use ($buyerId) {
            $query->where('buyer_id', $buyerId);
        });
    }

    public function scopeBlockedForSuppliers($query, $supplierIds)
    {
        return $query->whereHas('blockedSuppliers', function ($query) use ($supplierIds) {
            $query->whereIn('supplier_id', $supplierIds);
        });
    }

    public function scopeNotBlockedForSuppliers($query, $supplierIds)
    {
        return $query->whereDoesntHave('blockedSuppliers', function ($query) use ($supplierIds) {
            $query->whereIn('supplier_id', $supplierIds);
        });
    }

    //------------------------------------------------------------------
    // Mutators
    //------------------------------------------------------------------
    public function setHasEcommerceAttribute($value)
    {
        $this->attributes['has_ecommerce'] = $value == 'on' ? 1 : 0;
    }

    //------------------------------------------------------------------
    // Accessors
    //------------------------------------------------------------------
    public function getLastOrderDateAttribute()
    {
        $order = $this->orders()->where(
            'current_status',
            '!=',
            'canceled'
        )->latest()->first();

        return $order->created_at ?? null;
    }

    //------------------------------------------------------------------
    // Custom
    //------------------------------------------------------------------
    public function getMainAddressAttribute(): Model|MorphMany|null
    {
        $client = $this;
        return Cache::remember(
            "CLIENT_{$client->id}_MAIN_ADDRESS",
            now()->addminutes(5),
            function () use ($client) {
                return $client->addresses()
                    ->with('type', 'state')
                    ->orderBy('address_type_id')
                    ->first();
            }
        );
    }

    public function canBuyFromSupplier(int|Supplier $supplier): array
    {
        // Se o fornecedor for passado como inteiro, busca o objeto correspondente
        if (is_int($supplier)) {
            $supplier = Supplier::find($supplier);
        }

        // Se o fornecedor não for encontrado, retorna a razão da impossibilidade de compra
        if (!$supplier) {
            return [
                'can' => false,
                'reason_why' => 'Loja não encontrada.',
            ];
        }

        // Obtém o endereço principal do cliente
        $clientAddress = $this->main_address;

        // Verifica as regras e bloqueios para determinar se a compra é possível
        return match (true) {
            $this->blockedSuppliers->contains('id', $supplier->id) => [
                'can' => false,
                'reason_why' => 'Sua loja não está autorizada a comprar desta Indústria.',
            ],
            $supplier->blockedStates->contains('id', $clientAddress?->country_state_id) => [
                'can' => false,
                'reason_why' => 'Este produto não é comercializado em seu Estado.',
            ],
            count($supplier->blockingRules) && $supplier->blockingRules->contains('id', $this->blocking_rule_id) => [
                'can' => false,
                'reason_why' => 'Existe uma regra que bloqueia a compra deste produto.',
            ],
            $supplier->suspend_sales => [
                'can' => false,
                'reason_why' => 'A venda de produtos desta indústria estão suspensas temporariamente',
            ],
            default => ['can' => true],
        };
    }

    public function getMainAddress(): ?Address
    {
        $client = $this;

        return Cache::remember(
            "CLIENT_{$client->id}_MAIN_ADDRESS",
            now()->addminutes(5),
            function () use ($client) {
                $mainAddress = $client->addresses->firstWhere('address_type_id', 1);

                if (!$mainAddress) {
                    $mainAddress = $client->addresses->first();
                }

                return $mainAddress;
            }
        );
    }

    public function getApiContact(): ?Model
    {
        return $this->contacts()->where('role_id', 17)->first();
    }
}
