import { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

/* ─────────────────────────── DESIGN TOKENS ──────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:   #faf7f2;
    --warm:    #f2ede4;
    --ink:     #1a1208;
    --muted:   #7a6d5e;
    --accent:  #c8501a;
    --accent2: #d4a85c;
    --border:  #e2d9cc;
    --white:   #ffffff;
    --ff-head: 'Playfair Display', Georgia, serif;
    --ff-body: 'Jost', sans-serif;
    --nav-h:   64px;
    --radius:  6px;
    --shadow:  0 4px 24px rgba(26,18,8,.10);
  }

  body { background: var(--cream); color: var(--ink); font-family: var(--ff-body); font-size: 15px; line-height: 1.7; }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; border-radius: var(--radius); }

  /* ── HEADER ── */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    height: var(--nav-h);
    display: flex; align-items: center;
    box-shadow: 0 2px 12px rgba(26,18,8,.06);
  }
  .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%; display: flex; align-items: center; gap: 32px; }
  .nav-logo { font-family: var(--ff-head); font-size: 1.55rem; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; flex-shrink: 0; }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 6px; list-style: none; margin-left: auto; }
  .nav-links a { font-size: .82rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 6px 12px; border-radius: 4px; color: var(--muted); transition: color .2s, background .2s; }
  .nav-links a:hover, .nav-links a.active { color: var(--accent); background: #f9ede8; }
  .nav-sub { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 0; min-width: 180px; box-shadow: var(--shadow); opacity: 0; pointer-events: none; transition: opacity .2s; }
  .nav-has-sub { position: relative; }
  .nav-has-sub:hover .nav-sub { opacity: 1; pointer-events: all; }
  .nav-sub a { display: block; padding: 8px 18px; font-size: .82rem; text-transform: none; letter-spacing: 0; }
  .nav-btn { margin-left: 12px; background: var(--accent); color: #fff !important; border-radius: 4px; padding: 8px 18px !important; }
  .nav-btn:hover { background: #a8400f !important; color: #fff !important; }

  /* ── HERO ── */
  .hero { background: var(--warm); padding: 80px 24px; text-align: center; }
  .hero-tag { font-size: .72rem; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin-bottom: 12px; }
  .hero h1 { font-family: var(--ff-head); font-size: clamp(2.2rem,5vw,3.6rem); font-weight: 700; line-height: 1.15; margin-bottom: 18px; }
  .hero p { color: var(--muted); max-width: 520px; margin: 0 auto 28px; }
  .hero-cta { display: inline-block; background: var(--accent); color: #fff; padding: 13px 32px; border-radius: 4px; font-weight: 600; font-size: .9rem; letter-spacing: .04em; transition: background .2s; }
  .hero-cta:hover { background: #a8400f; }

  /* ── LAYOUT ── */
  .page { max-width: 1200px; margin: 0 auto; padding: 56px 24px; display: grid; grid-template-columns: 1fr 320px; gap: 48px; }
  .page.full { grid-template-columns: 1fr; }

  /* ── SECTION TITLE ── */
  .section-title { font-family: var(--ff-head); font-size: 1.5rem; font-weight: 700; margin-bottom: 28px; padding-bottom: 14px; border-bottom: 2px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .section-title::before { content: ''; display: block; width: 4px; height: 24px; background: var(--accent); border-radius: 2px; }

  /* ── POST CARD ── */
  .post-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  .card { background: var(--white); border-radius: 10px; overflow: hidden; box-shadow: var(--shadow); transition: transform .25s, box-shadow .25s; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(26,18,8,.14); }
  .card-img { width: 100%; height: 200px; object-fit: cover; border-radius: 0; }
  .card-body { padding: 20px; }
  .card-cat { font-size: .72rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .card h3 { font-family: var(--ff-head); font-size: 1.1rem; line-height: 1.35; margin-bottom: 10px; }
  .card h3 a:hover { color: var(--accent); }
  .card-meta { font-size: .78rem; color: var(--muted); display: flex; gap: 14px; margin-top: 12px; }
  .card-excerpt { font-size: .88rem; color: var(--muted); line-height: 1.65; }

  /* ── SIDEBAR ── */
  .sidebar { display: flex; flex-direction: column; gap: 32px; }
  .sb-box { background: var(--white); border-radius: 10px; padding: 22px; box-shadow: var(--shadow); }
  .sb-title { font-family: var(--ff-head); font-size: 1rem; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 16px; }
  .sb-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .sb-tag { background: var(--warm); border-radius: 4px; padding: 5px 12px; font-size: .8rem; cursor: pointer; transition: background .2s, color .2s; }
  .sb-tag:hover { background: var(--accent); color: #fff; }
  .sb-popular li { padding: 11px 0; border-bottom: 1px solid var(--border); display: flex; gap: 12px; list-style: none; }
  .sb-popular li:last-child { border-bottom: none; }
  .sb-popular img { width: 64px; height: 64px; object-fit: cover; border-radius: var(--radius); flex-shrink: 0; }
  .sb-popular h5 { font-family: var(--ff-head); font-size: .88rem; line-height: 1.35; }
  .sb-popular small { color: var(--muted); font-size: .75rem; }

  /* ── CATEGORIES ── */
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
  .cat-card { border-radius: 10px; overflow: hidden; position: relative; cursor: pointer; }
  .cat-card img { width: 100%; height: 200px; object-fit: cover; transition: transform .4s; border-radius: 0; }
  .cat-card:hover img { transform: scale(1.06); }
  .cat-overlay { position: absolute; inset: 0; background: linear-gradient(0deg,rgba(26,18,8,.7) 0,transparent 60%); display: flex; align-items: flex-end; padding: 18px; border-radius: 10px; }
  .cat-overlay h4 { font-family: var(--ff-head); color: #fff; font-size: 1.05rem; }
  .cat-list { display: flex; flex-direction: column; gap: 16px; }
  .cat-list-item { background: var(--white); border-radius: 10px; padding: 18px; display: flex; gap: 18px; align-items: center; box-shadow: var(--shadow); transition: transform .2s; }
  .cat-list-item:hover { transform: translateX(4px); }
  .cat-list-item img { width: 90px; height: 72px; object-fit: cover; border-radius: var(--radius); flex-shrink: 0; }
  .cat-list-item h4 { font-family: var(--ff-head); font-size: 1rem; margin-bottom: 4px; }
  .cat-list-item p { font-size: .84rem; color: var(--muted); }

  /* ── SINGLE POST ── */
  .post-hero { width: 100%; max-height: 420px; object-fit: cover; border-radius: 12px; margin-bottom: 32px; }
  .post-header { margin-bottom: 28px; }
  .post-header h1 { font-family: var(--ff-head); font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.25; margin-bottom: 12px; }
  .post-meta { display: flex; gap: 18px; font-size: .82rem; color: var(--muted); flex-wrap: wrap; }
  .post-body { font-size: .96rem; line-height: 1.85; color: #2d2418; }
  .post-body p { margin-bottom: 18px; }
  .post-body h2 { font-family: var(--ff-head); font-size: 1.4rem; margin: 28px 0 14px; }
  .post-body blockquote { border-left: 4px solid var(--accent); padding: 14px 20px; margin: 24px 0; background: var(--warm); border-radius: 0 8px 8px 0; font-style: italic; color: var(--muted); }

  /* ── ABOUT ── */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; margin-bottom: 56px; }
  .about-imgs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .about-main-img { grid-column: 1 / -1; }
  .about-text h2 { font-family: var(--ff-head); font-size: 2rem; margin-bottom: 18px; }
  .about-text p { color: var(--muted); margin-bottom: 14px; }
  .about-socials { display: flex; gap: 10px; margin-top: 20px; }
  .social-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--warm); display: flex; align-items: center; justify-content: center; font-size: .82rem; transition: background .2s, color .2s; }
  .social-icon:hover { background: var(--accent); color: #fff; }

  /* ── CONTACT ── */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .contact-form { display: flex; flex-direction: column; gap: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-input { width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--ff-body); font-size: .9rem; background: var(--white); color: var(--ink); outline: none; transition: border-color .2s; }
  .form-input:focus { border-color: var(--accent); }
  textarea.form-input { min-height: 120px; resize: vertical; }
  .form-btn { background: var(--accent); color: #fff; border: none; border-radius: var(--radius); padding: 13px 28px; font-family: var(--ff-body); font-weight: 600; font-size: .9rem; cursor: pointer; transition: background .2s; align-self: flex-start; }
  .form-btn:hover { background: #a8400f; }
  .contact-map { border-radius: 10px; overflow: hidden; height: 100%; min-height: 300px; background: var(--warm); display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: .9rem; }
  .contact-info { margin-top: 32px; display: flex; flex-direction: column; gap: 14px; }
  .info-row { display: flex; gap: 12px; align-items: flex-start; }
  .info-icon { width: 36px; height: 36px; background: var(--warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: .85rem; }

  /* ── SIGN IN ── */
  .auth-wrap { min-height: calc(100vh - var(--nav-h)); display: flex; align-items: center; justify-content: center; background: var(--warm); padding: 40px 24px; }
  .auth-box { background: var(--white); padding: 44px 40px; border-radius: 14px; box-shadow: var(--shadow); width: 100%; max-width: 400px; }
  .auth-box h2 { font-family: var(--ff-head); font-size: 1.8rem; margin-bottom: 6px; }
  .auth-box p { color: var(--muted); font-size: .9rem; margin-bottom: 28px; }
  .auth-divider { display: flex; align-items: center; gap: 14px; margin: 18px 0; color: var(--muted); font-size: .82rem; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .auth-switch { text-align: center; margin-top: 22px; font-size: .88rem; color: var(--muted); }
  .auth-switch a { color: var(--accent); font-weight: 600; }

  /* ── 404 ── */
  .not-found { text-align: center; padding: 100px 24px; }
  .not-found h1 { font-family: var(--ff-head); font-size: clamp(5rem, 15vw, 10rem); color: var(--warm); font-weight: 700; line-height: 1; margin-bottom: 8px; }
  .not-found h2 { font-family: var(--ff-head); font-size: 1.8rem; margin-bottom: 14px; }
  .not-found p { color: var(--muted); margin-bottom: 28px; }

  /* ── BREADCRUMB ── */
  .breadcrumb { background: var(--warm); padding: 28px 24px; text-align: center; }
  .breadcrumb h2 { font-family: var(--ff-head); font-size: 1.8rem; margin-bottom: 8px; }
  .breadcrumb nav { font-size: .82rem; color: var(--muted); }
  .breadcrumb nav a { color: var(--accent); }

  /* ── FOOTER ── */
  .footer { background: var(--ink); color: rgba(255,255,255,.75); padding: 56px 24px 28px; }
  .footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px; }
  .footer-logo { font-family: var(--ff-head); font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 12px; }
  .footer-logo span { color: var(--accent2); }
  .footer h5 { color: #fff; font-size: .82rem; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 16px; }
  .footer ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .footer ul li a { font-size: .88rem; transition: color .2s; }
  .footer ul li a:hover { color: var(--accent2); }
  .footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.12); text-align: center; font-size: .8rem; }

  /* ── BADGE ── */
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .badge-accent { background: #fdeee8; color: var(--accent); }

  /* ── UTILS ── */
  .btn { display: inline-block; padding: 11px 26px; border-radius: var(--radius); font-weight: 600; font-size: .88rem; letter-spacing: .04em; cursor: pointer; border: none; transition: all .2s; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #a8400f; }
  .btn-outline { border: 1.5px solid var(--accent); color: var(--accent); background: transparent; }
  .btn-outline:hover { background: var(--accent); color: #fff; }
  .mt-2 { margin-top: 8px; } .mt-4 { margin-top: 16px; } .mb-6 { margin-bottom: 24px; }

  @media (max-width: 900px) {
    .page { grid-template-columns: 1fr; }
    .about-grid, .contact-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .nav-links { display: none; }
  }
`;

/* ─────────────────────────── MOCK DATA ──────────────────────────── */
const posts = [
  { id: 1, slug: "perfect-pasta", title: "The Perfect Pasta Carbonara", cat: "Dinner", date: "Apr 20, 2024", author: "Lena M.", excerpt: "Silky, rich and indulgent — master the authentic Roman classic in under 25 minutes.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80" },
  { id: 2, slug: "vegan-bowl", title: "Rainbow Vegan Buddha Bowl", cat: "Vegan", date: "Apr 15, 2024", author: "Lena M.", excerpt: "Vibrant, nutritious and incredibly satisfying. Meal-prep friendly and endlessly customizable.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
  { id: 3, slug: "chocolate-cake", title: "Decadent Chocolate Fudge Cake", cat: "Desserts", date: "Apr 10, 2024", author: "Lena M.", excerpt: "Three layers of intense chocolate heaven with ganache so glossy it looks like a mirror.", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80" },
  { id: 4, slug: "avocado-toast", title: "Gourmet Avocado Toast 5 Ways", cat: "Breakfast", date: "Apr 5, 2024", author: "Lena M.", excerpt: "Elevate your morning ritual with these creative toppings and next-level technique.", img: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&q=80" },
  { id: 5, slug: "summer-salad", title: "Summer Stone Fruit Salad", cat: "Salads", date: "Mar 28, 2024", author: "Lena M.", excerpt: "Peaches, nectarines and burrata drizzled with a honey-thyme vinaigrette.", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80" },
  { id: 6, slug: "ramen", title: "Tonkotsu Ramen From Scratch", cat: "Asian", date: "Mar 20, 2024", author: "Lena M.", excerpt: "A 12-hour broth that is absolutely worth every minute. Rich, milky, soul-warming.", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80" },
];

const categories = [
  { id: 1, name: "Breakfast", count: 12, img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80" },
  { id: 2, name: "Dinner", count: 24, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
  { id: 3, name: "Desserts", count: 18, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80" },
  { id: 4, name: "Vegan", count: 9, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" },
  { id: 5, name: "Salads", count: 7, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 6, name: "Asian", count: 15, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80" },
];

/* ─────────────────────────── COMPONENTS ──────────────────────────── */

function Navbar() {
  const pages = [
    { to: "/categories-grid", label: "Categories Grid" },
    { to: "/categories-list", label: "Categories List" },
    { to: "/single-post/perfect-pasta", label: "Single Post" },
    { to: "/signin", label: "Sign In" },
    { to: "/typography", label: "Typography" },
    { to: "/404-demo", label: "404 Page" },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">Foodei<span>.</span></Link>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/categories-grid">Recipes</NavLink></li>
          <li><NavLink to="/categories-grid">Dinner</NavLink></li>
          <li><NavLink to="/categories-grid">Desserts</NavLink></li>
          <li className="nav-has-sub">
            <a href="#pages">Pages ▾</a>
            <div className="nav-sub">
              {pages.map(p => <Link key={p.to} to={p.to}>{p.label}</Link>)}
            </div>
          </li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          <li><NavLink to="/signin" className="nav-btn">Subscribe</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">Foodei<span>.</span></div>
          <p style={{ fontSize: ".88rem", marginTop: 8 }}>A food blog celebrating the joy of cooking, one recipe at a time.</p>
        </div>
        <div>
          <h5>Quick Links</h5>
          <ul>
            {[["Home","/"],["About","/about"],["Contact","/contact"],["Categories","/categories-grid"]].map(([l,h])=>
              <li key={h}><Link to={h}>{l}</Link></li>
            )}
          </ul>
        </div>
        <div>
          <h5>Categories</h5>
          <ul>
            {categories.slice(0,5).map(c => <li key={c.id}><Link to="/categories-grid">{c.name} ({c.count})</Link></li>)}
          </ul>
        </div>
        <div>
          <h5>Newsletter</h5>
          <p style={{ fontSize: ".88rem", marginBottom: 12 }}>Get fresh recipes every week straight to your inbox.</p>
          <input className="form-input" placeholder="Your email address" style={{ marginBottom: 10 }} />
          <button className="btn btn-primary" style={{ width: "100%" }}>Subscribe</button>
        </div>
      </div>
      <div className="footer-bottom">© 2024 Foodei Blog. All rights reserved.</div>
    </footer>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-box">
        <div className="sb-title">Search</div>
        <input className="form-input" placeholder="Search recipes…" />
      </div>
      <div className="sb-box">
        <div className="sb-title">Popular Posts</div>
        <ul className="sb-popular">
          {posts.slice(0, 4).map(p => (
            <li key={p.id}>
              <img src={p.img} alt={p.title} />
              <div>
                <h5><Link to={`/single-post/${p.slug}`}>{p.title}</Link></h5>
                <small>{p.date}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="sb-box">
        <div className="sb-title">Categories</div>
        <div className="sb-tags">
          {categories.map(c => <span key={c.id} className="sb-tag">{c.name}</span>)}
        </div>
      </div>
      <div className="sb-box" style={{ background: "var(--accent)", color: "#fff", textAlign: "center" }}>
        <h4 style={{ fontFamily: "var(--ff-head)", fontSize: "1.1rem", marginBottom: 8 }}>Follow Along</h4>
        <p style={{ fontSize: ".88rem", opacity: .9, marginBottom: 16 }}>Join 12k+ food lovers on Instagram</p>
        <a href="#ig" className="btn" style={{ background: "#fff", color: "var(--accent)", width: "100%", display: "block" }}>@FodeiBlog</a>
      </div>
    </aside>
  );
}

function Breadcrumb({ title, path }) {
  return (
    <div className="breadcrumb">
      <h2>{title}</h2>
      <nav><Link to="/">Home</Link> / {path}</nav>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="card">
      <img className="card-img" src={post.img} alt={post.title} />
      <div className="card-body">
        <div className="card-cat">{post.cat}</div>
        <h3><Link to={`/single-post/${post.slug}`}>{post.title}</Link></h3>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-meta">
          <span>✍ {post.author}</span>
          <span>📅 {post.date}</span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────── PAGES ──────────────────────────── */

/** HOME — index.html */
function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-tag">Welcome to Foodei Blog</div>
        <h1>Recipes Worth<br /><em>Remembering</em></h1>
        <p>Seasonal ingredients, timeless techniques and stories from a passionate home cook.</p>
        <Link to="/categories-grid" className="hero-cta">Browse All Recipes →</Link>
      </section>

      {/* Main content + sidebar */}
      <div className="page">
        <main>
          <div className="section-title">Latest Recipes</div>
          <div className="post-grid">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </main>
        <Sidebar />
      </div>
    </>
  );
}

/** CATEGORIES GRID — categories-grid.html */
function CategoriesGrid() {
  return (
    <>
      <Breadcrumb title="Categories" path="Categories Grid" />
      <div className="page">
        <main>
          <div className="section-title">All Categories</div>
          <div className="cat-grid">
            {categories.map(c => (
              <Link to="/categories-list" key={c.id} className="cat-card">
                <img src={c.img} alt={c.name} />
                <div className="cat-overlay">
                  <h4>{c.name} <small style={{ fontWeight: 400, fontSize: ".8rem" }}>({c.count})</small></h4>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-title" style={{ marginTop: 48 }}>Latest in All Categories</div>
          <div className="post-grid">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </main>
        <Sidebar />
      </div>
    </>
  );
}

/** CATEGORIES LIST — categories-list.html */
function CategoriesList() {
  return (
    <>
      <Breadcrumb title="Categories" path="Categories List" />
      <div className="page">
        <main>
          <div className="section-title">Browse by Category</div>
          <div className="cat-list">
            {categories.map(c => (
              <div key={c.id} className="cat-list-item">
                <img src={c.img} alt={c.name} />
                <div>
                  <h4>{c.name}</h4>
                  <p>{c.count} recipes • Fresh ingredients, easy steps</p>
                  <Link to="/categories-grid" className="btn btn-outline" style={{ marginTop: 10, padding: "6px 16px", fontSize: ".8rem" }}>View All →</Link>
                </div>
              </div>
            ))}
          </div>
        </main>
        <Sidebar />
      </div>
    </>
  );
}

/** SINGLE POST — single-post.html with dynamic :slug */
function SinglePost() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug) || posts[0];

  return (
    <>
      <Breadcrumb title={post.cat} path={<><Link to="/categories-grid">{post.cat}</Link> / {post.title.slice(0, 30)}…</>} />
      <div className="page">
        <main>
          <img className="post-hero" src={post.img} alt={post.title} />
          <div className="post-header">
            <span className="badge badge-accent">{post.cat}</span>
            <h1 style={{ marginTop: 12 }}>{post.title}</h1>
            <div className="post-meta">
              <span>✍ {post.author}</span>
              <span>📅 {post.date}</span>
              <span>⏱ 25 min</span>
              <span>🍽 Serves 4</span>
            </div>
          </div>
          <div className="post-body">
            <p>{post.excerpt} Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.</p>
            <h2>Ingredients</h2>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            <blockquote>"The secret ingredient is always love — and a little extra butter never hurt either."</blockquote>
            <h2>Instructions</h2>
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>
            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
          </div>

          <div style={{ marginTop: 40, padding: "24px", background: "var(--warm)", borderRadius: 10 }}>
            <div className="section-title">More Recipes</div>
            <div className="post-grid">
              {posts.filter(p => p.slug !== slug).slice(0, 3).map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </main>
        <Sidebar />
      </div>
    </>
  );
}

/** ABOUT — about.html */
function About() {
  return (
    <>
      <Breadcrumb title="About Me" path="About" />
      <div className="page full">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="about-grid">
            <div className="about-imgs">
              <div className="about-main-img">
                <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" alt="Cooking" style={{ width: "100%", height: 300, objectFit: "cover" }} />
              </div>
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" alt="Kitchen" style={{ height: 180, objectFit: "cover", width: "100%" }} />
              <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80" alt="Plating" style={{ height: 180, objectFit: "cover", width: "100%" }} />
            </div>
            <div className="about-text">
              <h2>Hi, I'm Lena — a passionate home cook.</h2>
              <p>I started Foodei Blog to share the recipes that make my kitchen smell amazing and my family come running. Every dish here is tested, tasted and loved.</p>
              <p>My philosophy is simple: good ingredients, honest technique, zero pretension. Whether you're a beginner or a seasoned cook, there's something here for you.</p>
              <p>Based in New York, inspired by the world.</p>
              <div className="about-socials">
                {["f","t","ig","yt"].map(s => (
                  <a href="#social" key={s} className="social-icon">
                    {s === "f" ? "fb" : s === "t" ? "tw" : s === "ig" ? "ig" : "yt"}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "48px 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, maxWidth: 600, margin: "0 auto" }}>
              {[["250+","Recipes Published"],["12k","Instagram Followers"],["5yrs","Blogging"]].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--ff-head)", fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)" }}>{n}</div>
                  <div style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** CONTACT — contact.html */
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // handle input change
  const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

  // send data to backend
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/contact",  // your backend route
        form
      );

      if (res.data.status === "success") {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  return (
    <>
      <Breadcrumb title="Contact" path="Contact" />
      <div className="page full">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="contact-grid">
            <div>
              <h2 style={{ fontFamily: "var(--ff-head)", fontSize: "1.8rem", marginBottom: 8 }}>Get in Touch</h2>
              <p style={{ color: "var(--muted)", marginBottom: 24 }}>Have a recipe question or collaboration idea? I'd love to hear from you!</p>
              {sent ? (
                <div style={{ background: "#edfaf3", border: "1px solid #6fcfa0", borderRadius: 8, padding: 20, color: "#1a6640" }}>
                  ✅ Thanks! Message sent. I'll reply within 48 hours.
                </div>
              ) : (
                <div className="contact-form">
  <div className="form-row">
    <input
      className="form-input"
      name="name"
      placeholder="Your Name"
      value={form.name}
      onChange={handleChange}
    />

    <input
      className="form-input"
      name="email"
      placeholder="Email Address"
      value={form.email}
      onChange={handleChange}
    />
  </div>

  <input
    className="form-input"
    name="subject"
    placeholder="Subject"
    value={form.subject}
    onChange={handleChange}
  />

  <textarea
    className="form-input"
    name="message"
    placeholder="Your message…"
    value={form.message}
    onChange={handleChange}
  ></textarea>

  <button type="button" className="form-btn" onClick={handleSubmit}>
  Send Message
</button>
</div>
              )}
              <div className="contact-info">
                {[["📍","New York, NY, USA"],["📧","hello@foodeiblog.com"],["📞","+1 (555) 012-3456"]].map(([icon,val]) => (
                  <div className="info-row" key={val}>
                    <div className="info-icon">{icon}</div>
                    <span style={{ fontSize: ".9rem", paddingTop: 6 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="contact-map">
              🗺 Map placeholder<br /><small style={{ marginTop: 6, display: "block" }}>Google Maps would embed here</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


/** SIGN IN — signin.html */
function SignIn() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.placeholder.toLowerCase().includes("name") ? "name" : e.target.placeholder.toLowerCase().includes("email") ? "email" : "password"]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (tab === "signup") {
        await axios.post("http://localhost:5000/register", form);
        

        if (res.data.status === "success") {
          alert("Registered successfully");
          setTab("signin");
        }

      } else {
        await axios.post("http://localhost:5000/login", form);

        if (res.data.status === "success") {
          alert("Login success");
          navigate("/");
        } else {
          alert(res.data.status);
        }
      }

    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>{tab === "signin" ? "Welcome back" : "Create account"}</h2>
        <p>{tab === "signin" ? "Sign in to your Foodei account" : "Join the Foodei community today"}</p>
        {tab === "signup" && (
          <input
            className="form-input"
            name = "name"
            placeholder="Full Name"
            onChange={handleChange}
          />
        )}

        <input
          className="form-input"
          name = "email"
          placeholder="Email address"
          onChange={handleChange}
        />

        <input
          className="form-input"
          name = "password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {tab === "signin" ? "Sign In" : "Create Account"}
        </button>

        <div className="auth-divider">or</div>
        <div className="auth-switch">
          {tab === "signin" ? (
            <>Don't have an account? <a href="#signup" onClick={e => { e.preventDefault(); setTab("signup"); }}>Sign up</a></>
          ) : (
            <>Already have an account? <a href="#signin" onClick={e => { e.preventDefault(); setTab("signin"); }}>Sign in</a></>
          )}
        </div>
      </div>
    </div>
  );
}

/** TYPOGRAPHY — typography.html */
function Typography() {
  return (
    <>
      <Breadcrumb title="Typography" path="Typography" />
      <div className="page full">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {[["h1","The Art of Good Food"],["h2","Seasonal Ingredients"],["h3","Technique Matters"],["h4","Simple is Elegant"],["h5","Fresh Every Day"]].map(([tag, text]) => (
            <div key={tag} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 24 }}>
              <span style={{ fontSize: ".75rem", color: "var(--muted)", letterSpacing: ".1em" }}>{`<${tag}>`}</span>
              {tag === "h1" && <h1 style={{ fontFamily: "var(--ff-head)" }}>{text}</h1>}
              {tag === "h2" && <h2 style={{ fontFamily: "var(--ff-head)", fontSize: "2rem" }}>{text}</h2>}
              {tag === "h3" && <h3 style={{ fontFamily: "var(--ff-head)", fontSize: "1.5rem" }}>{text}</h3>}
              {tag === "h4" && <h4 style={{ fontFamily: "var(--ff-head)", fontSize: "1.2rem" }}>{text}</h4>}
              {tag === "h5" && <h5 style={{ fontSize: "1rem", fontWeight: 600 }}>{text}</h5>}
            </div>
          ))}
          <p style={{ marginBottom: 14 }}>Body text — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p><em>Italic</em> — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-outline">Outline Button</button>
            <span className="badge badge-accent">Badge</span>
          </div>
        </div>
      </div>
    </>
  );
}

/** 404 — 404.html */
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Looks like this recipe got lost in the kitchen. Let's get you back home.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>← Back to Home</button>
    </div>
  );
}

/* ─────────────────────── ROUTER SETUP ──────────────────────────── */
/*
  📌 HOW ROUTING WORKS — React Router v6

  <BrowserRouter>          wraps the whole app; gives access to URL
  <Routes>                 container that picks ONE matching route
  <Route path="/" …>       matches the URL and renders a component
  <Link to="/about">       client-side navigation (no page reload)
  <NavLink …>              like Link but adds `active` class when current
  useParams()              reads :slug, :id from the URL
  useNavigate()            navigate("path") programmatically

  Route params → /single-post/:slug
    In the component:  const { slug } = useParams();

  Nested routes → wrap child routes inside a parent <Route>

  404 → path="*" catches everything that didn't match above
*/

export default function App() {
  return (
    <>
      <style>{style}</style>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ── Core pages ── */}
          <Route path="/"                      element={<Home />} />
          <Route path="/about"                 element={<About />} />
          <Route path="/contact"               element={<Contact />} />
          <Route path="/signin"                element={<SignIn />} />
          <Route path="/typography"            element={<Typography />} />

          {/* ── Category pages ── */}
          <Route path="/categories-grid"       element={<CategoriesGrid />} />
          <Route path="/categories-list"       element={<CategoriesList />} />

          {/* ── Dynamic route: single post with :slug param ── */}
          <Route path="/single-post/:slug"     element={<SinglePost />} />

          {/* ── Redirect old /index.html to / ── */}
          <Route path="/index.html"            element={<Navigate to="/" replace />} />

          {/* ── 404 catch-all (must be last!) ── */}
          <Route path="*"                      element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

