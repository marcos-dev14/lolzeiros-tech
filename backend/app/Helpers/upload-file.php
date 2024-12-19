<?php

namespace App\Helpers;

use Exception;
use Illuminate\Http\UploadedFile;

if (!function_exists('uploadedFileFromUrl')) {
    /**
     * @throws Exception
     */
    function uploadedFileFromUrl(
        string $url,
        string $originalName = '',
        string $mimeType = null,
        int    $error = null,
        bool   $test = false): UploadedFile
    {
        if (!$stream = @fopen($url, 'r')) {
            throw new Exception("Can't open file from url $url");
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'url-file-');

        file_put_contents($tempFile, $stream);

        return new UploadedFile($tempFile, $originalName, $mimeType, $error, $test);
    }
}

if (!function_exists('uploadedFileFromBase64')) {
    function uploadedFileFromBase64(
        string $base64Image,
        string $originalName = '',
        string $mimeType = 'image/jpeg',
        int    $error = null,
        bool   $test = false
    ): UploadedFile
    {
        $fileData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

        $tempFile = tempnam(sys_get_temp_dir(), 'url-file-') . '.jpg';

        file_put_contents($tempFile, $fileData);

        return new UploadedFile($tempFile, $originalName, $mimeType, $error, $test);
    }
}
