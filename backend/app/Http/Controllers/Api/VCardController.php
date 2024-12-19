<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class VCardController extends Controller
{
    public function index($name): BinaryFileResponse
    {
        $path = public_path("vcard/$name.vcf");

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->download($path);
    }
}
