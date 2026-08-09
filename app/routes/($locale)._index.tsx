import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {getSeoMeta, Image, Money} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'frontpage'},
  });
  return {
    shop,
    seo: seoPayload.home({url: request.url}),
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  const featuredProducts = context.storefront
    .query(HOMEPAGE_FEATURED_PRODUCTS_QUERY, {
      variables: {country, language},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const featuredCollections = context.storefront
    .query(FEATURED_COLLECTIONS_QUERY, {
      variables: {country, language},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const backcountry = Promise.resolve(null);
  const winter2022 = Promise.resolve(null);

  return {featuredProducts, featuredCollections, backcountry, winter2022};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {featuredProducts, featuredCollections} =
    useLoaderData<typeof loader>();

  return (
    <div className="bg-[#F9F7F4]">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Fond beige avec texture subtile */}
        <div className="absolute inset-0 bg-[#F9F7F4]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E8E0D5_0%,_transparent_70%)] opacity-60" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase text-black/40 mb-8 slideUp">
            Nouvelle Collection
          </p>
          <h1
            className="font-display text-6xl md:text-8xl font-light tracking-wider text-black mb-8 leading-none slideUp"
            style={{animationDelay: '100ms'}}
          >
            Benf
            <span className="italic">∞</span>
            Infinity
          </h1>
          <div className="w-12 h-px bg-black mx-auto mb-8 fadeIn" style={{animationDelay: '200ms'}} />
          <p
            className="text-sm text-black/50 max-w-md mx-auto mb-12 leading-relaxed tracking-wide slideUp"
            style={{animationDelay: '200ms'}}
          >
            Des pièces pensées pour durer. T-shirts premium,
            coupe moderne, fabriqués avec soin au Canada.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center slideUp"
            style={{animationDelay: '300ms'}}
          >
            <Link
              to="/collections/all"
              className="benf-btn-primary"
            >
              Découvrir la collection
            </Link>
            <Link
              to="/collections/all"
              className="benf-btn-secondary"
            >
              Voir les nouveautés
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-black animate-pulse" />
        </div>
      </section>

      {/* ── PRODUITS VEDETTES ── */}
      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {(response) => {
              if (!response?.products?.nodes?.length) return null;
              return (
                <section className="py-24 px-4 md:px-12 bg-white">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <p className="text-xs tracking-[0.4em] uppercase text-black/40 mb-4">
                        Sélection
                      </p>
                      <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide">
                        Pièces vedettes
                      </h2>
                      <div className="w-8 h-px bg-black mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {response.products.nodes.slice(0, 4).map((product: any) => {
                        const image = product.featuredImage ?? product.variants?.nodes?.[0]?.image;
                        const price = product.priceRange?.minVariantPrice;
                        return (
                          <Link
                            key={product.id}
                            to={`/products/${product.handle}`}
                            className="group benf-product-card"
                          >
                            <div className="card-image aspect-[3/4] bg-[#E8E0D5] mb-4">
                              {image && (
                                <Image
                                  data={image}
                                  aspectRatio="3/4"
                                  sizes="(min-width: 768px) 25vw, 50vw"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              )}
                            </div>
                            <div className="px-1">
                              <h3 className="text-xs tracking-wide font-body font-light mb-1">
                                {product.title}
                              </h3>
                              {price && (
                                <Money
                                  data={price}
                                  className="text-xs text-black/50"
                                />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="text-center mt-12">
                      <Link to="/collections/all" className="benf-btn-secondary">
                        Voir tous les produits
                      </Link>
                    </div>
                  </div>
                </section>
              );
            }}
          </Await>
        </Suspense>
      )}

      {/* ── SECTION MARQUE ── */}
      <section className="py-24 px-4 bg-[#F9F7F4]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-black/40 mb-6">
            Notre philosophie
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide mb-8 leading-snug">
            La qualité avant tout
          </h2>
          <div className="w-8 h-px bg-black mx-auto mb-8" />
          <p className="text-sm text-black/50 leading-relaxed tracking-wide max-w-xl mx-auto mb-12">
            Chaque pièce Benf-Infinity est conçue avec une attention particulière
            aux détails. Des matières sélectionnées, des coupes pensées pour
            s'adapter à tous les styles, une durabilité qui traverse le temps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {[
              {label: 'Matière', value: 'Coton bio 200g'},
              {label: 'Origine', value: 'Fabriqué au Canada'},
              {label: 'Livraison', value: 'Mondiale & rapide'},
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-6 h-px bg-black mx-auto mb-4" />
                <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-2">
                  {item.label}
                </p>
                <p className="font-display text-xl font-light">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      {featuredCollections && (
        <Suspense>
          <Await resolve={featuredCollections}>
            {(response) => {
              if (!response?.collections?.nodes?.length) return null;
              return (
                <section className="py-24 px-4 md:px-12 bg-white">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <p className="text-xs tracking-[0.4em] uppercase text-black/40 mb-4">
                        Explorer
                      </p>
                      <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide">
                        Collections
                      </h2>
                      <div className="w-8 h-px bg-black mx-auto mt-6" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {response.collections.nodes.slice(0, 3).map((collection: any) => (
                        <Link
                          key={collection.id}
                          to={`/collections/${collection.handle}`}
                          className="group relative aspect-[4/5] overflow-hidden bg-[#E8E0D5] block"
                        >
                          {collection.image && (
                            <img
                              src={collection.image.url}
                              alt={collection.image.altText ?? collection.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <p className="text-xs tracking-[0.3em] uppercase text-white/70 mb-2">
                              Collection
                            </p>
                            <h3 className="font-display text-2xl text-white font-light tracking-wide">
                              {collection.title}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }}
          </Await>
        </Suspense>
      )}

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-4 bg-[#0A0A0A] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">
            Benf-Infinity
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide text-white mb-8">
            Rejoignez l'univers
          </h2>
          <div className="w-8 h-px bg-white mx-auto mb-8" />
          <p className="text-sm text-white/40 leading-relaxed mb-12 tracking-wide">
            Soyez les premiers informés des nouvelles collections,
            éditions limitées et offres exclusives.
          </p>
          <Link to="/collections/all" className="inline-block border border-white text-white px-10 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Explorer la boutique
          </Link>
        </div>
      </section>

    </div>
  );
}

const HOMEPAGE_SEO_QUERY = `#graphql
  query homepageSeo {
    shop {
      name
      description
    }
  }
` as const;

export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;