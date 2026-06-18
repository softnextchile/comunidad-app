<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <h4 class="footer-title">{{ config.public.siteName }}</h4>
          <p class="text-small">
            Una comunidad dedicada a la innovación y tecnología en Chile.
          </p>
        </div>
        
        <div>
          <h4 class="footer-title">Enlaces</h4>
          <NuxtLink to="/" class="footer-link">Inicio</NuxtLink>
          <NuxtLink to="/noticias" class="footer-link">Noticias</NuxtLink>
          <NuxtLink to="/quienes-somos" class="footer-link">Quiénes Somos</NuxtLink>
          <NuxtLink to="/contacto" class="footer-link">Contacto</NuxtLink>
        </div>
        
        <div>
          <h4 class="footer-title">Contacto</h4>
          <p class="footer-link">contacto@softnext.cl</p>
          <p class="footer-link">Santiago, Chile</p>
        </div>
        
        <div>
          <h4 class="footer-title">Síguenos</h4>
          <a href="#" class="footer-link">Instagram</a>
          <a href="#" class="footer-link">Twitter</a>
          <a href="#" class="footer-link">LinkedIn</a>
        </div>
      </div>
      
      <div class="text-center mt-lg" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
        <p class="text-small">
          © {{ new Date().getFullYear() }} {{ config.public.siteName }}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>
