<?php

namespace App\Filament\Resources\Commandes\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CommandeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('client_id')
                    ->relationship('client', 'id')
                    ->required(),
                Select::make('statut')
                    ->options([
            'en_attente' => 'En attente',
            'confirmee' => 'Confirmee',
            'en_preparation' => 'En preparation',
            'expediee' => 'Expediee',
            'livree' => 'Livree',
            'annulee' => 'Annulee',
        ])
                    ->default('en_attente')
                    ->required(),
                TextInput::make('montant_total')
                    ->required()
                    ->numeric(),
                TextInput::make('numero')
                    ->required(),
                Textarea::make('notes')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
