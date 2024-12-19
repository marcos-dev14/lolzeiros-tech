<?php

namespace App\Services\Utils;

final class QueryCriteria
{
    public function __construct(
        private string $_field,
        private string|null|array $_value,
        private string|null $_operator = '='
    ) {}

    public function getField(): string
    {
        return $this->_field;
    }

    public function getValue(): null|string|array
    {
        return $this->_value;
    }

    public function getOperator(): string
    {
        return $this->_operator;
    }
}
