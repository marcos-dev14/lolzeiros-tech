@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Opportunities</h1>
        <table class="table">
            <thead>
                @dd($opportunities)
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Client Group</th>
                    <th>Supplier</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($opportunities as $opportunity)
                    <tr>
                        <td>{{ $opportunity->id }}</td>
                        <td>{{ $opportunity->name }}</td>
                        <td>{{ $opportunity->description }}</td>
                        <td>{{ $opportunity->clientGroup->name ?? 'N/A' }}</td>
                        <td>{{ $opportunity->supplier->name ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
