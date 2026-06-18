export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message, history } = body
  
  if (!message) {
    throw createError({ statusCode: 400, message: 'Mensaje requerido' })
  }
  
  const config = useRuntimeConfig()
  const apiKey = config.minimaxApiKey
  
  // Si no hay API key, devolver respuesta simulada
  if (!apiKey) {
    return {
      reply: `¡Hola! Soy el asistente de la comunidad. Actualmente estoy en modo demo. ¿En qué puedo ayudarte?\n\nPreguntas frecuentes:\n• Cómo registrarse\n• Horarios de actividades\n• Cómo contactar al equipo\n• Información sobre eventos`
    }
  }
  
  try {
    // Construir contexto del chat
    const systemPrompt = `Eres un asistente amigable de una comunidad chilena llamada "Comunidad Chile". 
Ayudas a los usuarios con información sobre la comunidad, eventos, registro y cualquier consulta relacionada.
Sé amable, conciso y útil. Responde en español.`
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6).map((h: any) => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ]
    
    // Llamar a MiniMax API
    const response = await $fetch<any>('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: {
        model: 'MiniMax-Text-01',
        messages,
        max_tokens: 500
      }
    })
    
    const reply = response.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.'
    
    return { reply }
  } catch (error: any) {
    console.error('Error calling AI:', error)
    return {
      reply: 'Disculpa, tuve un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?'
    }
  }
})
