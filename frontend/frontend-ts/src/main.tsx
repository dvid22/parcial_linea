// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Función para inicializar la aplicación
function initializeApp() {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    console.error('Elemento #root no encontrado en el DOM')
    
    // Crear el elemento root si no existe
    const newRoot = document.createElement('div')
    newRoot.id = 'root'
    document.body.appendChild(newRoot)
    
    // Intentar renderizar nuevamente
    renderApp(newRoot)
    return
  }
  
  renderApp(rootElement)
}

function renderApp(container: HTMLElement) {
  try {
    const root = ReactDOM.createRoot(container)
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    console.log('✅ Aplicación React montada correctamente')
    
  } catch (error) {
    console.error('❌ Error al montar la aplicación React:', error)
    
    // Mostrar mensaje de error en la UI
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #ef4444;">
        <h2>Error de aplicación</h2>
        <p>No se pudo cargar la interfaz. Por favor, recarga la página.</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #22c55e; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Reintentar
        </button>
      </div>
    `
  }
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}