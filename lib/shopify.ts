const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Indique si la configuration Shopify est active
export const isShopifyEnabled = () => {
  return !!(domain && storefrontAccessToken);
};

async function shopifyFetch<T>({ query, variables = {} }: { query: string; variables?: any }): Promise<{ data: T } | null> {
  if (!isShopifyEnabled()) {
    return null;
  }

  const URL = `https://${domain}/api/2023-10/graphql.json`;

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Shopify Fetch Error: HTTP ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return null;
  }
}

// Interface uniforme pour le catalogue frontend
export interface UnifiedProduct {
  id: string | number;
  nom: string;
  slug: string;
  description: string;
  prix_base: string;
  medias: Array<{ url: string; principale: boolean; ordre: number }>;
  variantes: Array<{
    id: string | number;
    sku: string;
    taille: string;
    couleur: string;
    prix: string;
    stock?: {
      quantite: number;
      disponible: boolean;
    } | null;
  }>;
}

// Formate un produit Shopify GraphQL vers notre format unifié
function mapShopifyProduct(node: any): UnifiedProduct {
  const price = node.priceRange?.minVariantPrice?.amount || '0.00';
  
  const medias = node.images?.edges.map((edge: any, index: number) => ({
    url: edge.node.url,
    principale: index === 0,
    ordre: index,
  })) || [];

  const variantes = node.variants?.edges.map((edge: any) => {
    const v = edge.node;
    
    // Trouver la taille et la couleur dans les options sélectionnées
    let taille = 'Unique';
    let couleur = 'Unique';
    
    v.selectedOptions?.forEach((opt: any) => {
      const nameLower = opt.name.toLowerCase();
      if (nameLower.includes('taille') || nameLower.includes('size')) {
        taille = opt.value;
      }
      if (nameLower.includes('couleur') || nameLower.includes('color')) {
        couleur = opt.value;
      }
    });

    return {
      id: v.id, // ID global Shopify (ex: gid://shopify/ProductVariant/...)
      sku: v.sku || '',
      taille,
      couleur,
      prix: v.price?.amount || price,
      stock: {
        quantite: v.quantityAvailable || 99,
        disponible: v.availableForSale ?? true,
      },
    };
  }) || [];

  return {
    id: node.id,
    nom: node.title,
    slug: node.handle,
    description: node.description || '',
    prix_base: price,
    medias,
    variantes,
  };
}

// 1. Récupérer tous les produits
export async function getShopifyProducts(): Promise<UnifiedProduct[] | null> {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  sku
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await shopifyFetch<any>({ query });
  if (!res || !res.data?.products?.edges) return null;

  return res.data.products.edges.map((edge: any) => mapShopifyProduct(edge.node));
}

// 2. Récupérer un produit par son handle (slug)
export async function getShopifyProductBySlug(handle: string): Promise<UnifiedProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              sku
              title
              availableForSale
              quantityAvailable
              price {
                amount
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const res = await shopifyFetch<any>({ query, variables: { handle } });
  if (!res || !res.data?.product) return null;

  return mapShopifyProduct(res.data.product);
}

// 3. Créer un Checkout Shopify à partir du panier
export async function createShopifyCheckout(
  lineItems: Array<{ variantId: string | number; quantity: number }>
): Promise<string | null> {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const formattedLineItems = lineItems.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  const variables = {
    input: {
      lineItems: formattedLineItems,
    },
  };

  const res = await shopifyFetch<any>({ query, variables });
  if (res?.data?.checkoutCreate?.checkout?.webUrl) {
    return res.data.checkoutCreate.checkout.webUrl;
  }
  
  if (res?.data?.checkoutCreate?.checkoutUserErrors) {
    console.error('Shopify Checkout Errors:', res.data.checkoutCreate.checkoutUserErrors);
  }
  return null;
}
