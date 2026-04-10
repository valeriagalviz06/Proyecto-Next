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
          
          {/* CONTENEDOR DE BOTONES */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              
              {/* Botón Principal: Ir al Menú */}
              <Link href="/menu">
                <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
                  Ver Menú
                </button>
              </Link>

              {/* NUEVO BOTÓN: Ir a Gestión de Pedidos */}
              <Link href="/pedidos">
                <button 
                  className="btn-primary" 
                  style={{ 
                    padding: '15px 40px', 
                    fontSize: '1.2rem', 
                    backgroundColor: 'var(--c-white)', 
                    color: 'var(--c-pink)' 
                  }}
                >
                  Gestión de Pedidos
                </button>
              </Link>
              
            </div>

          </div>

        
        <div className="mascot-container">
          <img src="/img/Newton.png" alt="Mascota Newton Rush" />
        </div>
      </section>

      
    </>
  );
}

