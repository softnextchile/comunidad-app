import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@comunidad.cl' },
    update: {},
    create: {
      email: 'admin@comunidad.cl',
      password: adminPassword,
      nombre: 'Administrador',
      rol: 'ADMIN'
    }
  })
  console.log('✅ Admin user created:', admin.email)

  // Create test user
  const userPassword = await bcrypt.hash('usuario123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'usuario@comunidad.cl' },
    update: {},
    create: {
      email: 'usuario@comunidad.cl',
      password: userPassword,
      nombre: 'Usuario de Prueba',
      rol: 'USUARIO'
    }
  })
  console.log('✅ Test user created:', user.email)

  // Create default sections
  const sections = [
    {
      clave: 'hero',
      titulo: 'Bienvenido a Comunidad Chile',
      subtitulo: 'Conectando personas, compartiendo conocimiento, innovando juntos.',
      contenido: 'Somos una comunidad dedicada a la innovación y tecnología en Chile.',
      orden: 1
    },
    {
      clave: 'quienes_somos',
      titulo: 'Quiénes Somos',
      subtitulo: 'Conoce nuestra historia',
      contenido: 'Somos una comunidad fundada con el objetivo de conectar a personas interesadas en tecnología e innovación en Chile. Desde nuestros inicios, hemos trabajado para crear un espacio donde todos puedan aprender, compartir y crecer juntos.',
      orden: 2
    },
    {
      clave: 'footer',
      titulo: 'Footer',
      contenido: '© 2024 Comunidad Chile. Todos los derechos reservados.',
      orden: 99
    }
  ]

  for (const section of sections) {
    await prisma.seccion.upsert({
      where: { clave: section.clave },
      update: {},
      create: section
    })
  }
  console.log('✅ Sections created')

  // Create sample news
  const news = [
    {
      titulo: 'Primer Meetup de Tecnología 2024',
      resumen: 'Únete a nuestro primer meetup del año donde discutiremos las últimas tendencias en IA.',
      contenido: 'Este mes realizaremos nuestro primer meetup del año. Ven a conocer personas con intereses similares y aprende sobre las últimas tendencias en inteligencia artificial y desarrollo web.',
      published: true,
      autor: 'Admin'
    },
    {
      titulo: 'Nuevo Taller de Programación',
      resumen: ' Estamos lanzando un taller gratuito de programación para principiantes.',
      contenido: '¿Siempre quisiste aprender a programar pero no sabías por dónde empezar? Tenemos la solución perfecta para ti. Nuestro nuevo taller cubre los fundamentos de HTML, CSS y JavaScript.',
      published: true,
      autor: 'Admin'
    }
  ]

  for (const item of news) {
    await prisma.noticia.create({ data: item })
  }
  console.log('✅ Sample news created')

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
