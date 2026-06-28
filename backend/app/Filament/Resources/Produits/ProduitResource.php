<?php

namespace App\Filament\Resources\Produits;

use App\Filament\Resources\Produits\Pages\CreateProduit;
use App\Filament\Resources\Produits\Pages\EditProduit;
use App\Filament\Resources\Produits\Pages\ListProduits;
use App\Filament\Resources\Produits\Pages\ViewProduit;
use App\Filament\Resources\Produits\Schemas\ProduitForm;
use App\Filament\Resources\Produits\Schemas\ProduitInfolist;
use App\Filament\Resources\Produits\Tables\ProduitsTable;
use App\Models\Produit;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ProduitResource extends Resource
{
    protected static ?string $model = Produit::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'nom';

    public static function form(Schema $schema): Schema
    {
        return ProduitForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ProduitInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProduitsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProduits::route('/'),
            'create' => CreateProduit::route('/create'),
            'view' => ViewProduit::route('/{record}'),
            'edit' => EditProduit::route('/{record}/edit'),
        ];
    }
}
