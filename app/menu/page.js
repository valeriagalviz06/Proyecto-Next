'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';
import '../globals.css';
import '../styles/menu.css';

export default function MenuPage() {
  const[menuItems, setMenuItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('burgers');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Nuevos estados para el Checkout y la Factura
  const[isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[factura, setFactura] = useState(null);

  // Cargar datos de Supabase
  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) console.error("Error fetching menu:", error);
      else setMenuItems(data);
    }
    fetchMenu();
  },[]);

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true); 
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const filteredItems = menuItems.filter(item => item.category === currentCategory);

  // --- LÓGICA PARA PROCESAR EL PEDIDO ---
  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Crear el Pedido (Factura Principal)
      // Nota: cliente_id va nulo por ahora hasta que implementemos el login
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([{
          direccion_envio: direccion,
          total: cartTotal,
          estado: 'pendiente'
        }])
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // 2. Insertar los items del carrito en pedido_items
      const itemsToInsert = cart.map(item => ({
        pedido_id: pedidoData.id,
        menu_item_id: item.id,
        cantidad: item.qty,
        precio_unitario: item.price
      }));

      const { error: itemsError } = await supabase
        .from('pedido_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Generar la Factura Visual y Limpiar
      setFactura({
        id: pedidoData.id,
        fecha: new Date().toLocaleString(),
        direccion: direccion,
        items: [...cart],
        total: cartTotal
      });
      
      setCart([]); // Vaciamos el carrito
      setIsCartOpen(false); // Cerramos el sidebar
      setIsCheckoutOpen(false); // Cerramos el formulario
      setDireccion(''); // Limpiamos el input

    } catch (error) {
      console.error("Error procesando pedido:", error);
      alert("Hubo un error al procesar tu pedido. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* ... (Todo tu código del Header, Menu Section y Grid se mantiene igual) ... */}
      
      <div className="checkered-border"></div>

      <div style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/">
          <button className="btn-primary" style={{ padding: '10px 20px' }}>← Volver al Inicio</button>
        </Link>
        <h2 className="title-retro" style={{ color: 'var(--c-pink)', fontSize: '2.5rem', margin: 0 }}>RUSH</h2>
      </div>

      <section className="menu-section" style={{ paddingTop: '20px' }}>
        <h1 className="menu-title title-retro">NUESTRO MENÚ</h1>
        <div className="category-toggle">
          <button className={`cat-btn title-retro ${currentCategory === 'burgers' ? 'active' : ''}`} onClick={() => setCurrentCategory('burgers')}>BURGERS</button>
          <button className={`cat-btn title-retro ${currentCategory === 'hotdogs' ? 'active' : ''}`} onClick={() => setCurrentCategory('hotdogs')}>HOT DOGS</button>
        </div>

        <div className="menu-grid">
          {filteredItems.map(item => {
            // Convertir rutas de Supabase Storage a URLs públicas
            let imageUrl = '';
            if (item.image) {
              // Si es una URL completa (empieza con http), úsala directamente
              if (item.image.startsWith('http')) {
                imageUrl = item.image;
              } else {
                // Si es una ruta relativa, convertirla a URL pública
                const { data } = supabase.storage.from('productos').getPublicUrl(item.image);
                imageUrl = data.publicUrl;
              }
            } else if (item.img) {
              if (item.img.startsWith('http')) {
                imageUrl = item.img;
              } else {
                const { data } = supabase.storage.from('productos').getPublicUrl(item.img);
                imageUrl = data.publicUrl;
              }
            } else if (item.image_url) {
              imageUrl = item.image_url;
            } else if (item.photo) {
              imageUrl = item.photo;
            }

            return (
              <div key={item.id} className="menu-card">
                {imageUrl && <img src={imageUrl} alt={item.name} className="menu-card-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                <h3 className="title-retro">{item.name}</h3>
                <p>{item.description}</p>
                <div className="card-footer">
                  <span className="price title-retro">${item.price.toFixed(2)}</span>
                  <button className="btn-primary" onClick={() => addToCart(item)}>+ Agregar</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FLOATING CART BUTTON */}
      <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
        🛒 {cart.length > 0 && <span className="cart-badge">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>}
      </button>

      {/* CART SIDEBAR */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3 className="title-retro" style={{fontSize: '2rem'}}>Tu Pedido</h3>
          <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}}>✖</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
             <p style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div>
                  <h4 style={{color: 'var(--c-pink)'}}>{item.name} <small>x{item.qty}</small></h4>
                  <p>${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer'}}>🗑️</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: 'var(--c-dark)'}}>
            <span>Total:</span>
            <span style={{color: 'var(--c-green)'}}>${cartTotal.toFixed(2)}</span>
          </div>
          {/* BOTÓN IR A PAGAR MODIFICADO */}
          <button 
            className="btn-primary" 
            style={{width: '100%', padding: '15px', fontSize: '1.2rem'}} 
            disabled={cart.length === 0}
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          >
            Ir a Pagar
          </button>
        </div>
      </div>

      {/* MODAL DE CHECKOUT (DIRECCIÓN) */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="title-retro" style={{ color: 'var(--c-pink)', marginBottom: '20px' }}>Completar Pedido</h2>
            <form onSubmit={handleCheckout}>
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Dirección de Envío:</label>
                <textarea 
                  required
                  rows="3"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Av. Principal, Edificio Los Pinos, Apto 4B..."
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid var(--c-green)', resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsCheckoutOpen(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE FACTURA (ÉXITO) */}
      {factura && (
        <div className="modal-overlay">
          <div className="modal-content ticket-bg">
            <h2 className="title-retro" style={{ color: 'var(--c-green)', fontSize: '2.5rem', textShadow: '2px 2px 0px #000' }}>¡PEDIDO EXITOSO!</h2>
            <div style={{ textAlign: 'left', margin: '20px 0', borderTop: '2px dashed var(--c-gray)', borderBottom: '2px dashed var(--c-gray)', padding: '20px 0' }}>
              <p><strong>Orden #:</strong> {factura.id.split('-')[0].toUpperCase()}</p>
              <p><strong>Fecha:</strong> {factura.fecha}</p>
              <p><strong>Dirección:</strong> {factura.direccion}</p>
              <br/>
              <h4 style={{ color: 'var(--c-pink)' }}>Detalle:</h4>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {factura.items.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>{item.qty}x {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--c-dark)' }}>TOTAL: <span style={{ color: 'var(--c-pink)' }}>${factura.total.toFixed(2)}</span></h3>
            <button onClick={() => setFactura(null)} className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Fondo oscuro general */}
      {isCartOpen && <div onClick={() => setIsCartOpen(false)} className="overlay-bg" />}
    </div>
  );
}