'use client'
import '@repo/sdk'
import { FeedbackSDK } from '@repo/sdk'

export default function DemoPage() {

    FeedbackSDK.init({
      projectId: 'demo-project-id',
      apiKey: process.env.NEXT_PUBLIC_FEEDBACK_API_KEY || 'demo-api-key',
      apiUrl: 'http://localhost:3000',
      debug: true
    })

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
      <h1>Feedback Widget Demo</h1>
      <p>
        Esta página demuestra la integración del Feedback Widget.
        El widget debería aparecer como un botón flotante en la esquina inferior derecha.
      </p>

      <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Instrucciones</h2>
        <ol>
          <li>Haz clic en el icono de chat (💬) abajo a la derecha.</li>
          <li>Selecciona una calificación (estrellas).</li>
          <li>Escribe un comentario opcional.</li>
          <li>Envía el feedback.</li>
        </ol>
      </div>

      <feedback-widget />
    </div>
  )
}

