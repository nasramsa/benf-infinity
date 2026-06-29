<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CommandeResource\Pages;
use App\Models\Commande;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\TextInputColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use BackedEnum;

class CommandeResource extends Resource
{
    protected static ?string $model = Commande::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;
    protected static ?string $navigationLabel = 'Commandes';
    protected static ?string $pluralModelLabel = 'Commandes';
    protected static ?string $modelLabel = 'Commande';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('statut')
                ->options([
                    'en_attente'     => 'En attente',
                    'confirmee'      => 'Confirmée',
                    'en_preparation' => 'En préparation',
                    'expediee'       => 'Expédiée',
                    'livree'         => 'Livrée',
                    'annulee'        => 'Annulée',
                ])
                ->required(),

            Textarea::make('notes')
                ->label('Notes internes')
                ->rows(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('numero')
                    ->label('N° commande')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('client.email')
                    ->label('Client')
                    ->searchable(),

                TextColumn::make('client.nom')
                    ->label('Nom')
                    ->searchable(),

                TextColumn::make('statut')
                    ->label('Statut')
                    ->badge()
                    ->color(fn(string $state): string => match($state) {
                        'en_attente'     => 'warning',
                        'confirmee'      => 'primary',
                        'en_preparation' => 'info',
                        'expediee'       => 'success',
                        'livree'         => 'success',
                        'annulee'        => 'danger',
                        default          => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match($state) {
                        'en_attente'     => 'En attente',
                        'confirmee'      => 'Confirmée',
                        'en_preparation' => 'En préparation',
                        'expediee'       => 'Expédiée',
                        'livree'         => 'Livrée',
                        'annulee'        => 'Annulée',
                        default          => $state,
                    }),

                TextColumn::make('montant_total')
                    ->label('Montant')
                    ->money('CAD')
                    ->sortable(),

                TextColumn::make('paiement.methode')
                    ->label('Paiement')
                    ->badge(),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('statut')
                    ->label('Filtrer par statut')
                    ->options([
                        'en_attente'     => 'En attente',
                        'confirmee'      => 'Confirmée',
                        'en_preparation' => 'En préparation',
                        'expediee'       => 'Expédiée',
                        'livree'         => 'Livrée',
                        'annulee'        => 'Annulée',
                    ]),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelationManagers(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListCommandes::route('/'),
            'create' => Pages\CreateCommande::route('/create'),
            'edit'   => Pages\EditCommande::route('/{record}/edit'),
        ];
    }
}