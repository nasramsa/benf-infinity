@component('mail::message')
# Merci pour votre commande, {{ $commande->client->prenom }} !

Votre commande **{{ $commande->numero }}** a bien été reçue et confirmée.

## Récapitulatif

@component('mail::table')
| Produit | Taille | Couleur | Qté | Prix |
|:--------|:-------|:--------|:----|-----:|
@foreach ($commande->lignes as $ligne)
| {{ $ligne->variante->produit->nom }} | {{ $ligne->variante->taille }} | {{ $ligne->variante->couleur }} | {{ $ligne->quantite }} | {{ number_format($ligne->sous_total, 2) }} $ |
@endforeach
@endcomponent

**Total : {{ number_format($commande->montant_total, 2) }} $ CAD**

Vous recevrez un email dès que votre commande est expédiée.

@component('mail::button', ['url' => config('app.frontend_url') . '/commandes/' . $commande->id])
Suivre ma commande
@endcomponent

L'équipe Benf-Infinity
@endcomponent