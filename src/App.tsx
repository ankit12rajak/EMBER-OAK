import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import {
  customers,
  galleryImages,
  menuCategories,
  menuItems,
  reviews,
} from './data'
import type { MenuItem, Reservation } from './types'
import { calcTax, calcSubtotal, formatCurrency, generateId } from './utils'
import { useRestaurantState } from './state/useRestaurantState'
import './App.css'

type CartItem = { item: MenuItem; quantity: number }
type Notice = { message: string; id: number }
type Page = 'home' | 'menu'

const restaurantHero =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=90'
const storyImage =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
const chefImage =
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85'
const categoryImages = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85',
]
const categoryImageIndex: Record<MenuItem['category'], number> = {
  Starters: 0,
  Soups: 1,
  Salads: 3,
  'Main Course': 2,
  Pasta: 4,
  Pizza: 5,
  Grills: 6,
  Desserts: 7,
  Beverages: 8,
  'Chef Special': 9,
}
const menuImage = (item: MenuItem) => categoryImages[categoryImageIndex[item.category]]
const times = ['12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']
const galleryFallbacks = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85',
]

function ImageReveal({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <div className={`image-reveal ${loaded ? 'is-loaded' : ''} ${failed ? 'image-failed' : ''} ${className ?? ''}`}>
      {!loaded && <span className="image-shimmer" aria-hidden="true" />}
      <img src={src} alt={failed ? '' : alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => { setLoaded(true); setFailed(true) }} />
      {failed && <span className="image-fallback-label" role="img" aria-label={alt}>{alt}</span>}
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [detailQuantity, setDetailQuantity] = useState(1)
  const [cartOpen, setCartOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [category, setCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [noticeId, setNoticeId] = useState(0)
  const { tables: restaurantTables, orders: restaurantOrders, reservations: reservationsState, setReservations: setReservationsState } = useRestaurantState()
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingConfirmation, setBookingConfirmation] = useState<Reservation | null>(null)
  const [selectedTableId, setSelectedTableId] = useState('')
  const [todayDate] = useState(() => new Date().toLocaleDateString('en-CA'))
  const [bookingDate, setBookingDate] = useState(todayDate)
  const [bookingTime, setBookingTime] = useState('19:00')
  const [guests, setGuests] = useState(2)

  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const subtotal = calcSubtotal(cart.map(({ item, quantity }) => ({
    menuItemId: item.id,
    name: item.name,
    price: item.price,
    quantity,
  })))
  const tax = calcTax(subtotal)
  const total = subtotal + tax

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return menuItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      return matchesCategory && matchesQuery
    })
  }, [category, search])

  const availableTables = useMemo(() => {
    const reservedIds = new Set(
      reservationsState
        .filter(
          (reservation) =>
            reservation.date === bookingDate &&
            reservation.time === bookingTime &&
            ['CONFIRMED', 'SEATED'].includes(reservation.status),
        )
        .map((reservation) => reservation.tableId),
    )
    return restaurantTables.filter(
      (table) =>
        table.capacity >= guests &&
        table.status === 'AVAILABLE' &&
        !restaurantOrders.some((order) => order.tableId === table.id && ['NEW', 'PREPARING', 'READY', 'SERVED'].includes(order.status)) &&
        !reservedIds.has(table.id),
    )
  }, [bookingDate, bookingTime, guests, reservationsState, restaurantOrders, restaurantTables])

  const notify = (message: string) => {
    const nextId = noticeId + 1
    setNoticeId(nextId)
    setNotice({ message, id: nextId })
    window.setTimeout(() => {
      setNotice((current) => (current?.id === nextId ? null : current))
    }, 2800)
  }

  const addToCart = (item: MenuItem, quantity = 1) => {
    if (!item.available) {
      notify(`${item.name} is currently unavailable`)
      return
    }
    setCart((current) => {
      const existing = current.find((entry) => entry.item.id === item.id)
      if (existing) {
        return current.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        )
      }
      return [...current, { item, quantity }]
    })
    setSelectedItem(null)
    setDetailQuantity(1)
    notify(`${item.name} added to your order`)
  }

  const updateCartQuantity = (itemId: string, change: number) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + change }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    )
  }

  const openBooking = () => {
    setBookingConfirmation(null)
    setSelectedTableId('')
    setBookingOpen(true)
    setMobileNavOpen(false)
  }

  const openMenu = () => {
    setPage('menu')
    setSelectedItem(null)
    setMobileNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    setPage('home')
    setMobileNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openFoodDetails = (item: MenuItem) => {
    setDetailQuantity(1)
    setSelectedItem(item)
  }

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const table = availableTables.find((candidate) => candidate.id === selectedTableId)
    if (!table) {
      notify('Please choose one of the available tables')
      return
    }
    setBookingLoading(true)
    window.setTimeout(() => {
      const matchedCustomer = customers.find((customer) => customer.phone === phone)
      const reservation: Reservation = {
        id: generateId('res'),
        customerId: matchedCustomer?.id ?? generateId('guest'),
        customerName: name,
        customerPhone: phone,
        tableId: table.id,
        tableNumber: table.tableNumber,
        guests,
        date: bookingDate,
        time: bookingTime,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        customerEmail: email || undefined,
      }
      setReservationsState((current) => [reservation, ...current])
      setBookingConfirmation(reservation)
      setBookingLoading(false)
      notify('Your table is confirmed. We look forward to welcoming you.')
    }, 650)
  }

  const goToSection = (id: string) => {
    if (page !== 'home') setPage('home')
    setMobileNavOpen(false)
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, page === 'home' ? 0 : 120)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="brand-lockup" onClick={goHome} aria-label="Ember and Oak home">
          <span className="brand-mark" aria-hidden="true">E<span>&</span>O</span>
          <span className="brand-name">EMBER <i>&</i> OAK</span>
        </button>
        <button
          className="mobile-menu-toggle"
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <X size={21} /> : <MenuIcon size={21} />}
        </button>
        <nav className={`main-nav ${mobileNavOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={goHome}>Home</button>
          <button className={page === 'menu' ? 'active' : ''} onClick={openMenu}>Our Menu</button>
          <button onClick={() => goToSection('story')}>Our Story</button>
          <button onClick={() => goToSection('experience')}>The Experience</button>
          <button onClick={() => goToSection('visit')}>Visit Us</button>
          <div className="nav-mobile-actions">
            <button className="button button-outline" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={15} /> Your order {cartCount > 0 && `(${cartCount})`}
            </button>
            <button className="button button-gold" onClick={openBooking}>Reserve a table</button>
          </div>
        </nav>
        <div className="header-actions">
          <button className="cart-trigger" aria-label={`Open your order, ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} />
            <span>Order</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
          <button className="button button-gold header-reserve" onClick={openBooking}>Reserve a table</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {page === 'home' ? (
          <motion.main
            key="home"
            className="page-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <section className="hero" aria-labelledby="hero-title">
              <ImageReveal src={restaurantHero} alt="A warmly lit, intimate restaurant dining room" className="hero-image" />
              <div className="hero-wash" />
              <div className="hero-content">
                <p className="eyebrow"><span /> A dining room for the senses <span /></p>
                <h1 id="hero-title">Rooted in fire.<br /><em>Made to linger.</em></h1>
                <p className="hero-copy">Contemporary European craft, touched by the warmth and wonder of India.</p>
                <div className="hero-actions">
                  <button className="button button-gold" onClick={openBooking}>Reserve a table <ArrowRight size={16} /></button>
                  <button className="button button-glass" onClick={openMenu}>Explore the menu <ArrowDown size={15} /></button>
                </div>
              </div>
              <div className="hero-note">
                <span className="hero-note-line" />
                <span>Thoughtfully gathered.<br />Beautifully served.</span>
              </div>
              <div className="hero-index"><span>01</span><i /> 03</div>
            </section>

            <section className="intro-section section-pad">
              <div className="intro-label"><span className="section-number">01</span><span className="eyebrow">A table with a point of view</span></div>
              <div className="intro-copy">
                <h2>Good food brings us<br /><em>back to ourselves.</em></h2>
                <p>At Ember & Oak, the familiar meets the unexpected. Contemporary European craft and the generous spirit of Indian hospitality come together in a meal worth slowing down for.</p>
                <button className="text-link" onClick={() => goToSection('story')}>A little about us <ArrowRight size={15} /></button>
              </div>
              <div className="intro-aside"><span>EMBER & OAK</span><strong>E&amp;O</strong><i>Gather well</i></div>
            </section>

            <section className="signature-section section-pad" id="signature">
              <div className="section-heading">
                <div><span className="eyebrow">From our kitchen</span><h2>House <em>signatures</em></h2></div>
                <button className="text-link" onClick={openMenu}>Discover the menu <ArrowRight size={15} /></button>
              </div>
              <div className="signature-grid">
                {menuItems.filter((item) => item.bestseller).slice(0, 3).map((item, index) => (
                  <motion.article
                    className="signature-card"
                    key={item.id}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <button className="image-button" onClick={() => openFoodDetails(item)} aria-label={`View ${item.name}`}>
                      <ImageReveal src={menuImage(item)} alt={item.name} />
                      <span className="signature-count">0{index + 1}</span>
                      <span className="quick-view">Discover <ArrowRight size={14} /></span>
                    </button>
                    <div className="signature-info">
                      <div><span className="eyebrow">{item.category}</span><h3>{item.name}</h3></div>
                      <span className="price">{formatCurrency(item.price)}</span>
                    </div>
                    <p>{item.description}</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="story-section" id="story">
              <div className="story-image-wrap">
                <ImageReveal src={storyImage} alt="A thoughtfully plated dinner at Ember and Oak" />
                <div className="image-caption"><span>01 / 04</span><span>The art of gathering</span></div>
              </div>
              <div className="story-copy">
                <span className="eyebrow">The Ember & Oak story</span>
                <h2>Old-world soul.<br /><em>New-world table.</em></h2>
                <p>We believe the best meals are never just about the food. They are about the pause between courses, the second glass, the stories that find their way around a table.</p>
                <p>Our kitchen brings contemporary European presentation into conversation with Indian-inspired flavours—guided by curiosity, fire and the feeling of home.</p>
                <button className="text-link" onClick={() => goToSection('chef')}>Meet the people behind the plate <ArrowRight size={15} /></button>
                <span className="story-scribble" aria-hidden="true">with warmth, always</span>
              </div>
            </section>

            <section className="chef-section section-pad" id="chef">
              <div className="chef-copy">
                <span className="eyebrow">From the kitchen</span>
                <h2>Cook with curiosity.<br /><em>Serve with heart.</em></h2>
                <p>Behind every plate is a team bringing technique, warmth and a little wonder to the table. The best part of the work is knowing you will share it with someone.</p>
                <div className="chef-signature"><span>Made to be shared</span><i>The Ember & Oak kitchen</i></div>
              </div>
              <div className="chef-portrait">
                <ImageReveal src={chefImage} alt="A chef at work in a restaurant kitchen" />
                <span className="portrait-caption">A little craft behind every course</span>
              </div>
            </section>

            <section className="experience-section" id="experience">
              <div className="experience-photo">
                <ImageReveal src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85" alt="Candlelit restaurant table set for an evening meal" />
                <div className="experience-overlay" />
                <div className="experience-content">
                  <span className="eyebrow">More than a meal</span>
                  <h2>Stay for<br /><em>the feeling.</em></h2>
                  <p>Come for a long lunch, a table for two, or a reason to gather everyone you love.</p>
                  <button className="button button-gold" onClick={openBooking}>Find your table <ArrowRight size={16} /></button>
                </div>
                <div className="experience-details">
                  <span><Clock3 size={15} /> Make time for the table</span>
                  <span><MapPin size={15} /> A place to gather</span>
                </div>
              </div>
            </section>

            <section className="gallery-section section-pad" id="gallery">
              <div className="section-heading">
                <div><span className="eyebrow">A glimpse of our world</span><h2>Moments at <em>the table</em></h2></div>
                <span className="gallery-note">Good things are best shared.</span>
              </div>
              <div className="gallery-grid">
                {galleryImages.slice(0, 6).map((image, index) => (
                  <motion.div
                    className={`gallery-tile gallery-tile-${index + 1}`}
                    key={image.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <ImageReveal
                      src={galleryFallbacks[index % galleryFallbacks.length]}
                      alt={image.alt}
                    />
                    <span>{image.category}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="reviews-section section-pad">
              <div className="reviews-heading">
                <span className="eyebrow">Kind words, passed around</span>
                <h2>A table remembered.</h2>
                <div className="review-stars" aria-label="5 out of 5 stars"><Star /><Star /><Star /><Star /><Star /></div>
              </div>
              <div className="review-grid">
                {reviews.slice(0, 3).map((review, index) => (
                  <motion.figure
                    className="review-card"
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="quote-mark">“</span>
                    <blockquote>{review.comment}</blockquote>
                    <figcaption><span className="review-avatar">{review.customerName.charAt(0)}</span><span><strong>{review.customerName}</strong><i>{review.date}</i></span><span className="review-rating">{review.rating}.0 <Star size={12} fill="currentColor" /></span></figcaption>
                  </motion.figure>
                ))}
              </div>
            </section>

            <section className="reservation-banner" id="visit">
              <div className="banner-ornament" aria-hidden="true">E<span>&</span>O</div>
              <span className="eyebrow">Your place is at the table</span>
              <h2>Make an evening<br /><em>of it.</em></h2>
              <p>We would love to have you. Join us for something good.</p>
              <button className="button button-gold" onClick={openBooking}>Reserve your table <ArrowRight size={16} /></button>
            </section>
          </motion.main>
        ) : (
          <motion.main
            key="menu"
            className="menu-page page-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <section className="menu-intro">
              <span className="eyebrow">A thoughtful little menu</span>
              <h1>Made with fire.<br /><em>Meant to be shared.</em></h1>
              <p>A thoughtful mix of ingredients, generous flavours, and a little something unexpected.</p>
            </section>
            <section className="menu-browser section-pad">
              <div className="menu-controls">
                <div className="category-tabs" role="tablist" aria-label="Menu categories">
                  {['All', ...menuCategories].map((name) => (
                    <button
                      key={name}
                      role="tab"
                      aria-selected={category === name}
                      className={category === name ? 'selected' : ''}
                      onClick={() => setCategory(name)}
                    >{name}</button>
                  ))}
                </div>
                <label className="menu-search">
                  <Search size={17} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a favourite..." aria-label="Search menu" />
                  {search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}
                </label>
              </div>
              <p className="menu-results">{filteredItems.length} thoughtful dishes<span> · All prices in INR</span></p>
              {filteredItems.length > 0 ? (
                <div className="menu-grid">
                  {filteredItems.map((item, index) => (
                    <motion.article
                      className={`menu-card ${!item.available ? 'unavailable' : ''}`}
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: Math.min(index % 4, 3) * 0.035 }}
                    >
                      <button className="menu-card-image" onClick={() => openFoodDetails(item)} aria-label={`View details for ${item.name}`}>
                        <ImageReveal src={menuImage(item)} alt={item.name} />
                        {item.bestseller && <span className="bestseller-badge">House favourite</span>}
                        {!item.available && <span className="unavailable-badge">Temporarily unavailable</span>}
                        {item.vegetarian && <span className="veg-badge" title="Vegetarian"><Leaf size={14} /></span>}
                        <span className="card-view">View dish <ArrowRight size={14} /></span>
                      </button>
                      <div className="menu-card-content">
                        <div className="menu-card-title"><div><span className="eyebrow">{item.category}</span><h3>{item.name}</h3></div><span className="price">{formatCurrency(item.price)}</span></div>
                        <p>{item.description}</p>
                        <div className="menu-card-footer">
                          <span className="dish-rating"><Star size={13} fill="currentColor" /> {item.rating} <i>({item.reviewCount})</i></span>
                          <button className="add-button" onClick={() => addToCart(item)} disabled={!item.available}><Plus size={15} /> Add to order</button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="empty-menu"><span>Nothing on the menu by that name.</span><button className="text-link" onClick={() => { setSearch(''); setCategory('All') }}>See everything <ArrowRight size={14} /></button></div>
              )}
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <button className="brand-lockup" onClick={goHome} aria-label="Ember and Oak home"><span className="brand-mark">E<span>&</span>O</span><span className="brand-name">EMBER <i>&</i> OAK</span></button>
            <p>Gather well. Eat slowly.<br />Leave a little room for one more.</p>
          </div>
          <div className="footer-column"><span className="eyebrow">At the table</span><p>Contemporary European craft.<br />Indian-inspired flavours.<br />A little room for everyone.</p></div>
          <div className="footer-column"><span className="eyebrow">A good evening</span><p>Choose a dish.<br />Bring your favourite people.<br />Take your time.</p></div>
          <div className="footer-column footer-links"><span className="eyebrow">A little more</span><button onClick={openMenu}>The menu</button><button onClick={() => goToSection('story')}>Our story</button><button onClick={openBooking}>Reservations</button><a href="mailto:hello@emberandoak.example">Get in touch</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Ember & Oak. Made for good company.</span><span>Good food. Good people. Always.</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div>
      </footer>

      <AnimatePresence>
        {selectedItem && (
          <motion.div className="modal-scrim detail-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedItem(null) }}>
            <motion.section className="food-detail" role="dialog" aria-modal="true" aria-label={`${selectedItem.name} details`} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <button className="modal-close" aria-label="Close food details" onClick={() => setSelectedItem(null)}><X size={19} /></button>
              <div className="detail-photo">
                <ImageReveal src={menuImage(selectedItem)} alt={selectedItem.name} />
                {selectedItem.bestseller && <span className="bestseller-badge">House favourite</span>}
              </div>
              <div className="detail-copy">
                <button className="back-link" onClick={() => setSelectedItem(null)}><ArrowLeft size={14} /> Back to menu</button>
                <span className="eyebrow">{selectedItem.category} · {selectedItem.preparationTime} min</span>
                <h2>{selectedItem.name}</h2>
                <div className="detail-rating"><Star size={14} fill="currentColor" /> {selectedItem.rating} <span>({selectedItem.reviewCount} notes from our guests)</span></div>
                <p className="detail-description">{selectedItem.description}</p>
                <div className="ingredient-block"><span className="eyebrow">Ingredients &amp; preparation</span><p>{selectedItem.description}</p></div>
                <div className="detail-price-row"><span className="price">{formatCurrency(selectedItem.price)}</span><span className="detail-tax-note">Inclusive of all applicable taxes</span></div>
                <div className="detail-actions">
                  <div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setDetailQuantity((quantity) => Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{detailQuantity}</span><button aria-label="Increase quantity" onClick={() => setDetailQuantity((quantity) => quantity + 1)}><Plus size={14} /></button></div>
                  <button className="button button-gold" disabled={!selectedItem.available} onClick={() => addToCart(selectedItem, detailQuantity)}><ShoppingBag size={16} /> Add to order · {formatCurrency(selectedItem.price * detailQuantity)}</button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
            <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your order" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}>
              <div className="drawer-heading"><div><span className="eyebrow">A good choice</span><h2>Your <em>order</em> <span>({cartCount})</span></h2></div><button className="modal-close" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={19} /></button></div>
              {cart.length === 0 ? (
                <div className="empty-cart"><span className="empty-bag"><ShoppingBag size={23} /></span><h3>Your table is waiting.</h3><p>There is nothing in your order just yet. Take a look at the menu and find something lovely.</p><button className="button button-gold" onClick={() => { setCartOpen(false); openMenu() }}>Explore the menu <ArrowRight size={15} /></button></div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(({ item, quantity }) => (
                      <div className="cart-line" key={item.id}>
                        <ImageReveal src={menuImage(item)} alt={item.name} />
                        <div className="cart-line-copy"><span className="eyebrow">{item.category}</span><h3>{item.name}</h3><span className="price">{formatCurrency(item.price)}</span><div className="quantity-control compact"><button aria-label={`Remove one ${item.name}`} onClick={() => updateCartQuantity(item.id, -1)}><Minus size={12} /></button><span>{quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => updateCartQuantity(item.id, 1)}><Plus size={12} /></button></div></div>
                        <button className="remove-line" aria-label={`Remove ${item.name} from order`} onClick={() => setCart((current) => current.filter((entry) => entry.item.id !== item.id))}><X size={15} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-summary">
                    <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
                    <div><span>Taxes (5%)</span><strong>{formatCurrency(tax)}</strong></div>
                    <div className="cart-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
                    <p>Final total may be settled with your server at the restaurant.</p>
                    <button className="button button-gold checkout-button" onClick={() => { setCartOpen(false); openBooking(); notify('Reserve a table to complete your visit') }}>Continue to reservation <ArrowRight size={15} /></button>
                    <button className="continue-menu" onClick={() => { setCartOpen(false); openMenu() }}>Add something else <ArrowRight size={14} /></button>
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingOpen && (
          <motion.div className="modal-scrim booking-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false) }}>
            <motion.section className="booking-modal" role="dialog" aria-modal="true" aria-label="Reserve a table" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.98 }} transition={{ duration: 0.24 }}>
              <button className="modal-close" aria-label="Close reservation" onClick={() => setBookingOpen(false)}><X size={19} /></button>
              {bookingConfirmation ? (
                <div className="booking-confirmation">
                  <span className="confirmation-check"><Check size={26} /></span>
                  <span className="eyebrow">A place is set for you</span>
                  <h2>We'll keep<br /><em>the fire warm.</em></h2>
                  <p>Thank you, {bookingConfirmation.customerName}. Your table for {bookingConfirmation.guests} is confirmed.</p>
                  <div className="confirmation-details"><div><span>Date</span><strong>{new Date(`${bookingConfirmation.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong></div><div><span>Time</span><strong>{bookingConfirmation.time}</strong></div><div><span>Your table</span><strong>Table {bookingConfirmation.tableNumber} · {bookingConfirmation.guests} guests</strong></div></div>
                  <button className="button button-gold" onClick={() => setBookingOpen(false)}>Lovely, thank you <Check size={16} /></button>
                </div>
              ) : (
                <>
                  <div className="booking-heading"><span className="eyebrow">We saved you a seat</span><h2>Gather <em>around.</em></h2><p>Tell us a little about your visit and we will find the right table.</p></div>
                  <form className="booking-form" onSubmit={submitReservation}>
                    <div className="booking-fields">
                      <label>Date<input type="date" required min={todayDate} value={bookingDate} onChange={(event) => { setBookingDate(event.target.value); setSelectedTableId('') }} /></label>
                      <label>Time<span className="select-wrap"><select value={bookingTime} onChange={(event) => { setBookingTime(event.target.value); setSelectedTableId('') }}>{times.map((time) => <option key={time} value={time}>{time}</option>)}</select><ChevronDown size={15} /></span></label>
                      <label className="guest-field">Guests<span className="guest-picker"><button type="button" aria-label="One fewer guest" onClick={() => { setGuests((count) => Math.max(1, count - 1)); setSelectedTableId('') }}><Minus size={14} /></button><Users size={15} /><span>{guests}</span><button type="button" aria-label="One more guest" onClick={() => { setGuests((count) => Math.min(10, count + 1)); setSelectedTableId('') }}><Plus size={14} /></button></span></label>
                    </div>
                    <div className="table-picker">
                      <div className="table-picker-heading"><span className="eyebrow">Choose your table</span><span>{availableTables.length} available</span></div>
                      {availableTables.length > 0 ? (
                        <div className="table-options">
                          {availableTables.map((table) => (
                            <button type="button" key={table.id} className={`table-option ${selectedTableId === table.id ? 'chosen' : ''}`} onClick={() => setSelectedTableId(table.id)}>
                              <span>Table {table.tableNumber}</span><i>{table.capacity} seats · {table.location}</i>{selectedTableId === table.id && <Check size={15} />}
                            </button>
                          ))}
                        </div>
                      ) : <p className="no-tables">No tables fit this party at that time. Try a different time or party size.</p>}
                    </div>
                    <div className="booking-fields customer-fields">
                      <label>Your name<input name="name" type="text" placeholder="The name on your reservation" autoComplete="name" required /></label>
                      <label>Phone number<input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" pattern="[\d\s+\(\)\-]{8,18}" required /></label>
                      <label className="email-field">Email address <span className="optional-label">optional</span><input name="email" type="email" placeholder="For your confirmation" autoComplete="email" /></label>
                    </div>
                    <button className="button button-gold confirm-booking" type="submit" disabled={bookingLoading || !selectedTableId || availableTables.length === 0}>
                      {bookingLoading ? <><span className="button-spinner" /> Setting your table…</> : <>Confirm reservation <ArrowRight size={15} /></>}
                    </button>
                    <p className="booking-footnote">Your details are kept here for this visit only. No payment required.</p>
                  </form>
                </>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><span><Check size={15} /></span>{notice.message}<button aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={14} /></button></motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default App
