<?php

namespace App\Services\Utils;

final class QueryCriteriaCollection
{
    const OPERATOR_OR = 'or';

    const OPERATOR_AND = 'and';

    const OPERATOR_IN = 'in';

    private array $_rules;

    public function __construct(
        private string|null $_operator = self::OPERATOR_OR,
        QueryCriteria ...$rules)
    {
        $this->_rules = $rules;
    }

    public function getRules(): array
    {
        return $this->_rules;
    }

    public function getOperator(): ?string
    {
        return $this->_operator;
    }
}
