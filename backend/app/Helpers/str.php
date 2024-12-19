<?php

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;


if (!function_exists('countWords')) {
    function countWords($text): int {
        $text = preg_replace('![^ \pL\pN\s]+!u', '', strtolower($text));
        $text = trim(preg_replace('![ \s]+!u', ' ', $text));

        return count(explode(' ', $text));
    }
}

if (!function_exists('makeUniqueHashFromModel')) {
    function makeUniqueHashFromModel(Model $model, $fieldName = 'hash', $limit = 5, $isInt = false): string {
        do {
            $characters = $isInt ? '123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $seed = str_split($characters);
            shuffle($seed);

            $hash = '';

            foreach (array_rand($seed, $limit) as $k) {
                $hash .= $seed[$k];
            }
        } while (count($model::where($fieldName, $hash)->get()));

        return $hash;
    }
}

if (!function_exists('camelCaseToUnderscore')) {
    function camelCaseToUnderscore($string): string {
        return strtolower(preg_replace('/(?<=\\w)(?=[A-Z])/', "_$1", $string));
    }
}

if (!function_exists('formatMoney')) {
    function formatMoney($value, int $dot = 2, string $decimalSeparator = ',', string $thousandSeparator = '.'): string {
        return number_format($value, $dot, $decimalSeparator, $thousandSeparator);
    }
}

if (!function_exists('toFloat')) {
    function toFloat(string $string): float {
        return (float)str_replace(',', '', $string);
    }
}

if (!function_exists('stringToFloat')) {
    function stringToFloat(string $string): float {
        $string = str_replace('.', '', $string);
        $string = str_replace(',', '.', $string);
        return (float)$string;
    }
}

if (!function_exists('getDiffPercentage')) {
    function getDiffPercentage(float $x, float $y): float {
        if ($x == 0 || $y == 0) {
            return 0;
        }

        $diff = ($y - $x) / $x * 100;

        return floatval(number_format($diff < 0 ? ($diff * -1) : $diff, 2));
    }
}

if (!function_exists('onlyNumbers')) {
    function onlyNumbers($value): array|string|null {
        return preg_replace('#[^0-9]#', '', $value);
    }
}

if (!function_exists('reformatDateString')) {
    function reformatDateString($date, $format = 'Y/m/d'): string {
        return Carbon::parse($date)->format($format);
    }
}

if (!function_exists('frontendUrl')) {
    function frontendUrl($url = null): string {
        return config('custom.frontend_url') . $url;
    }
}

if (!function_exists('sanitizeHtmlText')) {
    function sanitizeHtmlText($text): string|null {
        $text = preg_replace('/(<[^>]+) style=".*?"/i', '$1', $text); // Remove Styles
        $text = preg_replace('/(<[^>]+) id=".*?"/i', '$1', $text); // Remove Ids
        $text = preg_replace('/(<[^>]+) class=".*?"/i', '$1', $text); // Remove classes
        $text = preg_replace('/(<[^>]+) dir=".*?"/i', '$1', $text); // Remove Dir
        $text = preg_replace("/<strong[^>]*><br><\\/strong[^>]*>/", '$1', $text); // Remove Strongs with br
        //$text = preg_replace("/<strong[^>]*><\\/strong[^>]*>/", '$1', $text); // Remove empty Strongs
        $text = preg_replace("/<p[^>]*><\\/p[^>]*>/", '$1', $text); // Remove empty Paragraphs
        $text = preg_replace("/<p[^>]*><br><\\/p[^>]*>/", '<br>', $text); // Replace Paragraphs with br

        $text = preg_replace("/<a[^>]*><img[^>]*><\\/a[^>]*>/", '<br>', $text); // Replace Paragraphs with br

        // Remove span tags
        $text = preg_replace('/<span[^>]+>|<\/span>/i', '', $text);
        $text = preg_replace('#</?span[^>]*>#is', '', $text);
        $text = preg_replace('/<span[^>]+?[^>]+>|<\/span>/i', '', $text);

        return preg_replace("/<p[^>]*><\\/p[^>]*>/", '$1', $text);
    }
}

if (!function_exists('changeToWebp')) {
    function changeToWebp($imagePath): string {
        return str_replace('.jpg', '.webp', str_replace('.png', '.webp', $imagePath));
    }
}
