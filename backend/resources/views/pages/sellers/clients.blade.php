@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Opportunities</h1>
        <table class="table">
            <thead>
                @dd($clients)
                <tr>
                    <th>#</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($clients as $client)
                    <tr>
                        <td>{{ $client->name }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
