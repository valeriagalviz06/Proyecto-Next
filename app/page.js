import Link from 'next/link';
import './globals.css';
import './styles/home.css';

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Burgers & Hot Dogs de <span>Otro Nivel</span> 🔥</h1>
          <p>Ven por el Rush y quédate por el sabor. Street Food Gourmet & Fusión con la mejor actitud.</p>
          
          <Link href="/menu">
            <button className="nav-btn" style={{padding: '15px 40px', fontSize: '1.2rem'}}>
              Ver Menú
            </button>
          </Link>

        </div>
        <div className="mascot-container">
          <img src="/img/Newton.png" alt="Mascota Newton Rush" />
        </div>
      </section>

      
    </>
  );
}

