'use client';

import { useEffect, useState, useRef } from 'react';

const products = {
  burgers: [
    {
      name: "Rush Clásica",
      desc: "Carne de res de 150g, doble queso fundido, tocineta crujiente, lechuga fresca, tomate y nuestra salsa secreta Rush en pan brioche artesanal.",
      price: "$6.50",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "La Newton Smash",
      desc: "Doble carne smash (aplastada y crujiente en los bordes), triple queso cheddar, cebolla caramelizada y aderezo de ajo. ¡Una explosión de sabor!",
      price: "$8.00",
      img: "https://images.unsplash.com/photo-1594212202875-86ac519fe829?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ],
  hotdogs: [
    {
      name: "Perro Callejero VIP",
      desc: "Salchicha polaca ahumada, ensalada rallada fresca, papitas crujientes, queso pecorino, salsa de ajo y un toque de salsa rosada.",
      price: "$4.00",
      img: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "El Mostro Rush",
      desc: "Doble salchicha, coronado con carne molida sazonada, queso fundido, tocineta picada y jalapeños para los valientes.",
      price: "$5.50",
      img: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ]
};

export default function MenuSlider() {
  const [currentCategory, setCurrentCategory] = useState('burgers');
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderContentRef = useRef(null);
  const toggleBgRef = useRef(null);
  const catBtnsRef = useRef([]);

  const renderSlide = () => {
    const item = products[currentCategory][currentIndex];
    if (sliderContentRef.current) {
      sliderContentRef.current.style.opacity = '0';
      setTimeout(() => {
        sliderContentRef.current.innerHTML = `
          <div class="product-slide active">
            <div class="product-image">
              <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="product-info">
              <h3>${item.name}</h3>
              <p>${item.desc}</p>
              <div class="price-row">
                <span class="price">${item.price}</span>
                <button class="btn-order">+ Agregar</button>
              </div>
            </div>
          </div>
        `;
        sliderContentRef.current.style.opacity = '1';
      }, 200);
    }
  };

  const setCategory = (category, btnIndex) => {
    setCurrentCategory(category);
    setCurrentIndex(0);

    // Animación toggle
    if (toggleBgRef.current) {
      toggleBgRef.current.style.transform = `translateX(${btnIndex * 100}%)`;
    }

    // Botones activos
    catBtnsRef.current.forEach((btn, i) => {
      btn.classList.toggle('active', i === btnIndex);
    });

    // Colores por categoría
    if (toggleBgRef.current) {
      toggleBgRef.current.style.backgroundColor = category === 'burgers' ? 'var(--c-pink)' : 'var(--c-green)';
    }

    renderSlide();
  };

  const nextSlide = () => {
    const maxIndex = products[currentCategory].length - 1;
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    const maxIndex = products[currentCategory].length - 1;
    setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  useEffect(() => {
    renderSlide();
  }, [currentCategory, currentIndex]);

  useEffect(() => {
    catBtnsRef.current = catBtnsRef.current || [];
  }, []);

  return (
    <>
      <div className="category-toggle">
        <div className="toggle-bg" ref={toggleBgRef}></div>
        <button 
          className="cat-btn active" 
          ref={el => catBtnsRef.current[0] = el}
          onClick={() => setCategory('burgers', 0)}
        >
          Hamburguesas
        </button>
        <button 
          className="cat-btn" 
          ref={el => catBtnsRef.current[1] = el}
          onClick={() => setCategory('hotdogs', 1)}
        >
          Perros Calientes
        </button>
      </div>

      <div className="slider-container">
        <div ref={sliderContentRef} id="slider-content">
          {/* Contenido dinámico */}
        </div>

        <div className="slider-controls">
          <button className="ctrl-btn" onClick={prevSlide}>&#8592;</button>
          <button className="ctrl-btn" onClick={nextSlide}>&#8594;</button>
        </div>
      </div>
    </>
  );
}
