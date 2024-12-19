<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Collection;

class InvoiceImportExcelLog implements FromCollection
{
    protected $result;

    public function __construct($result)
    {
        $this->result = $result;
    }

    public function collection()
    {
        $data = [];

        $data[] = [
            'supplierCode',
            'supplierDate',
            'supplier',
            'clientName',
            'clientDoc',
            'dateAuge',
            'nfe',
            'nfeValue',
            'nfeDate',
            'numberAuge',
            'paymentTerm',
            'commissionAugePorcent',
            'commissionAuge',
            'commissionCommercialPorcent',
            'commissionCommercialAuge',
            'obs',
            'message',
        ];

        foreach ($this->result as $result) {
            $row = [
                $result['supplierCode'],
                $result['supplierDate'],
                $result['supplier'],
                $result['clientName'],
                $result['clientDoc'],
                $result['dateAuge'],
                $result['nfe'],
                $result['nfeValue'],
                $result['nfeDate'],
                $result['paymentTerm'],
                $result['commissionAugePorcent'],
                $result['commissionAuge'],
                $result['commissionCommercialPorcent'],
                $result['commissionCommercialAuge'],
                $result['obs'],
                $result['message'],
            ];

            $data[] = $row;
        }

        return new Collection($data);
    }
}

