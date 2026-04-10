'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase'; // Ajusta la ruta si es necesario
import '../globals.css';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const[loading, setLoading] = useState(true);
  
  // Estados para el Modal de Edición
  const[editingPedido, setEditingPedido] = useState(null);
  const [editDireccion, setEditDireccion] = useState('');
  const [editEstado, setEditEstado] = useState('');

  // 1. READ: Cargar solo los pedidos ACTIVOS
  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        pedido_items (
          cantidad,
          precio_unitario,
          menu_items ( name )
        )
      `)
      .eq('activo', true)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error("Error al cargar pedidos:", error);
    } else {
      setPedidos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPedidos();
  },[]);

  // 2. SOFT DELETE: Borrado lógico
  const handleSoftDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas ocultar este pedido?");
    if (!confirmar) return;

    const { error } = await supabase
      .from('pedidos')
      .update({ activo: false })
      .eq('id', id);

    if (error) {
      alert("Error al eliminar el pedido");
      console.error(error);
    } else {
      setPedidos(pedidos.filter(p => p.id !== id));
    }
  };

  // 3. UPDATE: Abrir modal y guardar cambios
  const openEditModal = (pedido) => {
    setEditingPedido(pedido);
    setEditDireccion(pedido.direccion_envio);
    setEditEstado(pedido.estado);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('pedidos')
      .update({ 
        direccion_envio: editDireccion,
        estado: editEstado 
      })
      .eq('id', editingPedido.id);

    if (error) {
      alert("Error al actualizar");
      console.error(error);
    } else {
      alert("Pedido actualizado correctamente");
      setEditingPedido(null);
      fetchPedidos();
    }
  };

  return (
    /* FONDO OSCURO PRINCIPAL */
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-dark)', color: 'var(--c-white)', paddingBottom: '50px' }}>
      <div className="checkered-border"></div>

      {/* HEADER */}
      <div style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <Link href="/menu">
          <button className="btn-secondary" style={{ color: 'var(--c-pink)', borderColor: 'var(--c-pink)' }}>← Volver al Menú</button>
        </Link>
        <h2 className="title-retro" style={{ color: 'var(--c-pink)', fontSize: '2.8rem', margin: 0, textShadow: '0 0 15px rgba(220, 47, 137, 0.5)' }}>
          GESTIÓN DE PEDIDOS
        </h2>
      </div>

      {/* CONTENEDOR DE TARJETAS */}
      <div style={{ padding: '0 5%', maxWidth: '1200px', margin: '0 auto', marginTop: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--c-green)' }}>Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.5rem', color: '#888' }}>No hay pedidos activos.</p>
        ) : (
          <div style={{ display: 'grid', gap: '25px' }}>
            {pedidos.map(pedido => (
              /* TARJETA DE PEDIDO OSCURA */
              <div key={pedido.id} style={{ 
                background: '#1a1a1a', /* Gris muy oscuro */
                border: '2px solid var(--c-green)', 
                borderRadius: '15px', 
                padding: '25px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: '20px', 
                boxShadow: '0 8px 25px rgba(0,0,0,0.6)' /* Sombra más profunda */
              }}>
                
                {/* Info del Pedido */}
                <div style={{ flex: '1 1 300px' }}>
                  <h3 className="title-retro" style={{ color: 'var(--c-white)', letterSpacing: '2px', fontSize: '1.8rem' }}>
                    ORDEN: <span style={{ color: 'var(--c-white)' }}>{pedido.id.split('-')[0].toUpperCase()}</span>
                  </h3>
                  <p style={{ color: '#aaa', margin: '8px 0' }}><strong style={{color: '#fff'}}>Fecha:</strong> {new Date(pedido.creado_en).toLocaleString()}</p>
                  <p style={{ color: '#aaa', margin: '8px 0' }}><strong style={{color: '#fff'}}>Dirección:</strong> {pedido.direccion_envio}</p>
                  <p style={{ marginTop: '15px' }}>
                    <span style={{ 
                      background: pedido.estado === 'entregado' ? 'var(--c-green)' : 'transparent', 
                      color: pedido.estado === 'entregado' ? 'var(--c-dark)' : 'var(--c-pink)', 
                      border: pedido.estado === 'entregado' ? 'none' : '2px solid var(--c-pink)',
                      padding: '5px 15px', 
                      borderRadius: '20px', 
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}>
                      {pedido.estado.toUpperCase()}
                    </span>
                  </p>
                </div>

                {/* Items del Pedido */}
                <div style={{ flex: '1 1 200px', borderLeft: '2px dashed var(--c-pink)', paddingLeft: '25px' }}>
                  <h4 style={{ color: 'var(--c-pink)', marginBottom: '15px', fontSize: '1.2rem' }}>Productos:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, fontSize: '1rem', color: '#ddd' }}>
                    {pedido.pedido_items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        <span style={{ color: 'var(--c-green)', fontWeight: 'bold' }}>{item.cantidad}x</span> {item.menu_items?.name}
                      </li>
                    ))}
                  </ul>
                  <h3 style={{ marginTop: '20px', color: 'var(--c-green)', fontSize: '1.5rem', textShadow: '0 0 10px rgba(183, 206, 30, 0.3)' }}>
                    Total: ${pedido.total.toFixed(2)}
                  </h3>
                </div>

                {/* Controles (Update & Delete) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                  <button onClick={() => openEditModal(pedido)} className="btn-primary" style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleSoftDelete(pedido.id)} className="btn-secondary" style={{ padding: '12px 25px', borderColor: '#ff4d4f', color: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
                    🗑️ Ocultar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN (UPDATE) MODO OSCURO */}
      {editingPedido && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ background: '#1a1a1a', borderColor: 'var(--c-green)', boxShadow: '0 0 30px rgba(183, 206, 30, 0.2)' }}>
            <h2 className="title-retro" style={{ color: 'var(--c-green)', marginBottom: '25px', textShadow: '0 0 10px rgba(183, 206, 30, 0.4)' }}>
              Editar Pedido
            </h2>
            <form onSubmit={handleUpdate} style={{ textAlign: 'left', color: 'var(--c-white)' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#ccc' }}>Estado del Pedido:</label>
                <select 
                  value={editEstado} 
                  onChange={(e) => setEditEstado(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid var(--c-green)', background: '#2a2a2a', color: 'white', fontSize: '1rem', outline: 'none' }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="en_preparacion">En Preparación</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#ccc' }}>Dirección de Envío:</label>
                <textarea 
                  required
                  rows="3"
                  value={editDireccion}
                  onChange={(e) => setEditDireccion(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid var(--c-green)', background: '#2a2a2a', color: 'white', resize: 'none', fontSize: '1rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingPedido(null)} className="btn-secondary" style={{ color: '#aaa', borderColor: '#aaa' }}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}