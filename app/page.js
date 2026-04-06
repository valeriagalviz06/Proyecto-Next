'use client';

import { useEffect, useState, useRef } from 'react';
import MenuSlider from '@/components/MenuSlider';
import './globals.css';

export default function Home() {
  return (
    <>
      {/* HEADER */}
      <header>
        <div className="logo">Rush</div>
        <button className="nav-btn">Pedir Ahora</button>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Burgers & Hot Dogs de <span>Otro Nivel</span> 🔥</h1>
          <p>Ven por el Rush y quédate por el sabor. Street Food Gourmet & Fusión con la mejor actitud.</p>
          <button className="nav-btn" style={{padding: '15px 40px', fontSize: '1.2rem'}}>
            Ver Menú
          </button>
        </div>
        <div className="mascot-container">
          <img src="/img/Newton.png" alt="Mascota Newton Rush" />
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="menu-section">
        <h2 className="menu-title">Nuestro Menú</h2>
        <MenuSlider />
      </section>
    </>
  );
}

