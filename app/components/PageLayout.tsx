import {useParams, Form, Await, useRouteLoaderData} from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
import {CartForm} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {Text, Heading, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Input} from '~/components/Input';
import {Drawer, useDrawer} from '~/components/Drawer';
import {CountrySelector} from '~/components/CountrySelector';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Panier" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-6 p-8">
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              `font-body text-xs tracking-[0.2em] uppercase ${
                isActive
                  ? 'border-b border-black pb-1'
                  : 'pb-1 hover:opacity-60 transition-opacity'
              }`
            }
          >
            {item.title}
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  const params = useParams();

  return (
    <header
      role="banner"
      className="bg-[#F9F7F4] border-b border-[#E8E0D5] flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8"
    >
      {/* Gauche — logo */}
      <Link
        className="flex items-center justify-start flex-grow gap-3"
        to="/"
      >
        <img
          src="/images/logo.jpg"
          alt="Benf-Infinity"
          className="h-8 w-auto object-contain mix-blend-multiply"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="font-serif text-lg tracking-[0.2em] uppercase font-light text-[#0A0A0A]">
          {title}
        </span>
      </Link>

      {/* Droite — compte + panier + menu burger */}
      <div className="flex items-center justify-end gap-3 flex-none">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const {y} = useWindowScroll();

  return (
    <header
      role="banner"
      className={`
        bg-[#F9F7F4] border-b border-[#E8E0D5]
        hidden h-nav lg:flex items-center sticky
        transition-all duration-300 backdrop-blur-lg z-40 top-0
        justify-between w-full leading-none
        px-12 py-6
        ${!isHome && y > 50 ? 'shadow-sm' : ''}
      `}
    >
      {/* Gauche — logo */}
      <Link
        to="/"
        prefetch="intent"
        className="flex items-center justify-start w-1/3 transition-transform hover:scale-105 duration-300 gap-4"
      >
        <img
          src="/images/logo.jpg"
          alt="Benf-Infinity"
          className="h-10 w-auto object-contain mix-blend-multiply"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="font-serif text-2xl tracking-[0.25em] uppercase font-light text-[#0A0A0A]">
          {title}
        </span>
      </Link>

      {/* Centre — navigation */}
      <nav className="flex justify-center gap-10 flex-1">
        {(menu?.items || []).slice(0, 3).map((item) => (
          <Link
            key={item.id}
            to={item.to}
            target={item.target}
            prefetch="intent"
            className={({isActive}) =>
              `text-xs tracking-[0.15em] uppercase font-body transition-opacity hover:opacity-60 ${
                isActive ? 'border-b border-black pb-1' : ''
              }`
            }
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Droite — recherche + compte + panier */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            type="search"
            variant="minisearch"
            placeholder="Rechercher"
            name="q"
            className="focus:border-black/20 text-xs"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={false} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={false}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        {count > 0 && (
          <div className="absolute bottom-1 right-1 bg-black text-white text-[0.55rem] font-medium h-3 min-w-[0.75rem] flex items-center justify-center rounded-full px-[0.125rem]">
            <span>{count}</span>
          </div>
        )}
      </>
    ),
    [count],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  return (
    <footer className="bg-[#0A0A0A] text-[#F9F7F4] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Logo + tagline */}
        <div className="text-center mb-16">
          <img
            src="/images/logo.jpg"
            alt="Benf-Infinity"
            className="h-16 w-auto object-contain mx-auto mb-4 opacity-90 invert"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <p className="text-xs tracking-[0.3em] uppercase text-white/40">
            Mode Premium — Canada
          </p>
        </div>

        {/* Liens footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <FooterMenu menu={menu} />
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-6 text-white/60">
              Service client
            </h3>
            <nav className="grid gap-3">
              <Link
                to="/policies/shipping-policy"
                className="text-xs text-white/50 hover:text-white transition-colors tracking-wide"
              >
                Livraison
              </Link>
              <Link
                to="/policies/refund-policy"
                className="text-xs text-white/50 hover:text-white transition-colors tracking-wide"
              >
                Retours & échanges
              </Link>
              <Link
                to="/policies/privacy-policy"
                className="text-xs text-white/50 hover:text-white transition-colors tracking-wide"
              >
                Confidentialité
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase mb-6 text-white/60">
              Contact
            </h3>
            <p className="text-xs text-white/50 tracking-wide leading-relaxed">
              benfinfinity@gmail.com
            </p>
            <div className="mt-6">
              <CountrySelector />
            </div>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 tracking-wide">
            © {new Date().getFullYear()} Benf-Infinity. Tous droits réservés.
          </p>
          <p className="text-xs text-white/20 tracking-wide">
            Fait avec soin au Canada
          </p>
        </div>

      </div>
    </footer>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      
        <a href={item.to} target={item.target} rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white transition-colors tracking-wide">
        {item.title}
      </a>
    );
  }

  return (
    <Link
      to={item.to}
      target={item.target}
      prefetch="intent"
      className="text-xs text-white/50 hover:text-white transition-colors tracking-wide"
    >
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className="grid gap-4">
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-white/60 flex justify-between items-center">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </h3>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? 'max-h-48 h-fit' : 'max-h-0 md:max-h-fit'
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense>
                      <Disclosure.Panel static>
                        <nav className="grid gap-3">
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}