<?php

namespace App\Filament\Resources\Produits\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProduitForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('categorie_id')
                    ->relationship('categorie', 'id')
                    ->required(),
                TextInput::make('nom')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                TextInput::make('prix_base')
                    ->required()
                    ->numeric(),
                Toggle::make('actif')
                    ->required(),
            ]);
    }
}
