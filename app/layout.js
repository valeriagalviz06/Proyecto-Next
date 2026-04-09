export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* HEADER */}
      <header>
        <div className="logo">Rush</div>
        <button className="nav-btn">Pedir Ahora</button>
      </header>
      {children}
      </body>
    </html>
  );
}

