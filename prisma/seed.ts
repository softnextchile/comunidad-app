import { PrismaClient, CategoriaEvento, CategoriaServicio } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed: Villa Arrayán...')

  // Admin user
  const adminPassword = await bcrypt.hash('junta2024', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@villaarrayan.cl' },
    update: {},
    create: {
      email: 'admin@villaarrayan.cl',
      password: adminPassword,
      nombre: 'Directorio Junta de Vecinos',
      rol: 'ADMIN',
      numeroCasa: '--',
      emailValidado: true,
    },
  })
  console.log('Admin creado:', admin.email)

  // Secciones editables
  const secciones = [
    {
      clave: 'hero',
      titulo: 'Tu barrio conectado, siempre informados',
      subtitulo: 'Bienvenido a Villa Arrayán. Aquí encontrarás comunicados oficiales, eventos vecinales, servicios y toda la información de tu junta de vecinos.',
      contenido: '',
      imagenUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80',
    },
    {
      clave: 'footer_info',
      titulo: 'Junta de Vecinos Villa Arrayán',
      subtitulo: null,
      contenido: 'Junta de Vecinos Villa Arrayán\nDirección: Av. Villa Arrayán 1234, Santiago\nHorarios: Lunes a Viernes 9:00 - 18:00 hrs\nContacto: junta@villaarrayan.cl',
    },
  ]

  for (const sec of secciones) {
    await prisma.seccion.upsert({
      where: { clave: sec.clave },
      update: sec,
      create: sec,
    })
  }
  console.log('Secciones creadas')

  // Comunicados de ejemplo
  const comunicados = [
    {
      titulo: 'Programación de газоснабжение для жильцов',
      resumen: 'Se informa a los vecinos que debido amantención programada del sistema de газоснабжение, el suministro presentará cortes intermitentes el día viernes 27 de junio entre 9:00 y 14:00 hrs.',
      contenido: 'Estimados vecinos:\n\nPor instrucciones de la compañía de газоснабжение, se realizará una mantención programada del sistema de distribución. Durante este período podrán experimentar cortes intermitentes.\n\nRecomendamos:\n- Tener precaución con artefactos a gas\n- No dejar burner encendidos sin supervisión\n- Preparar agua potable por si el газовая колонка no funcione\n\nSolicitamos su comprensión.',
      publicado: true,
      esPinned: true,
      autorId: admin.id,
      fechaPublicacion: new Date('2026-06-20'),
    },
    {
      titulo: 'Nueva temporada de vigilancia nocturno',
      resumen: 'A partir del 1 de julio, el sistema de vigilancia nocturna del barrio aumentará su cobertura. Conozca los nuevos horarios y puntos de control.',
      contenido: 'Informamos a todos los vecinos que a partir del 1 de julio, el programa de vigilancia vecinal tendrá nuevos horarios y rutas de patrolaje.\n\nHorarios:\n- Ronda 1: 22:00 - 00:00 hrs\n- Ronda 2: 00:00 - 04:00 hrs\n\nPuntos de control: Portón principal, Pasaje 3, Fundo los Aromos.\n\nSi detecta alguna emergencia, llamar al:+56 2 2345 6789.',
      publicado: true,
      esPinned: false,
      autorId: admin.id,
      fechaPublicacion: new Date('2026-06-18'),
    },
    {
      titulo: 'Cuota extraordinaria para reparar veredas',
      resumen: 'Se convoca a asamblea extraordinaria para aprobar la cuota extraordinaria destinada a la reparación de veredas dañadas por las últimas lluvias.',
      contenido: 'Estimados vecinos:\n\nAnte los daños causados por las lluvias intensas en nuestras veredas, el directorio convoca a asamblea extraordinaria.\n\nFecha: 30 de junio de 2026\nHora: 19:00 hrs\nLugar: Sede Social Villa Arrayán\n\nOrden del día:\n1. Aprobación de cuota extraordinaria de $15.000 por unidad habitacional\n2. Calendario de trabajos\n3. Selección de empresa contratista\n\nLa asistencia es obligatoria según el reglamento interno.',
      publicado: true,
      esPinned: false,
      autorId: admin.id,
      fechaPublicacion: new Date('2026-06-15'),
    },
  ]

  for (const com of comunicados) {
    await prisma.comunicado.create({ data: com })
  }
  console.log('Comunicados creados')

  // Eventos
  const eventos = [
    {
      titulo: 'Copa Inter-vecindario de baby fútbol',
      descripcion: ' cuadrangular de baby fútbol entre las juntas de vecinos del sector. ¡Anímate a participar!',
      fecha: new Date('2026-07-05T15:00:00'),
      hora: '15:00',
      lugar: 'Cancha Villa Arrayán',
      categoria: CategoriaEvento.FIESTA,
      capMax: 40,
      publicado: true,
    },
    {
      titulo: 'Taller de huertos urbanos',
      descripcion: 'Aprende a cultivar tus propias verduras en espacios pequeños. Cupos limitados.',
      fecha: new Date('2026-07-12T10:00:00'),
      hora: '10:00',
      lugar: 'Sede Social',
      categoria: CategoriaEvento.OTRO,
      capMax: 20,
      publicado: true,
    },
    {
      titulo: 'Asamblea ordinaria mensual',
      descripcion: 'Sesión mensual del directorio. Balance de gastos, estado de cuentas y cuenta pública.',
      fecha: new Date('2026-07-01T19:00:00'),
      hora: '19:00',
      lugar: 'Sede Social',
      categoria: CategoriaEvento.REUNION,
      publicado: true,
    },
  ]

  for (const evt of eventos) {
    await prisma.evento.create({ data: evt })
  }
  console.log('Eventos creados')

  // Servicios
  const servicios = [
    {
      nombre: 'Roberto González - Gasfiter',
      telefono: '+56 9 1234 5678',
      email: 'roberto.gasfiter@gmail.com',
      descripcion: 'Gasfitería general, emergency las 24 horas.',
      categoria: CategoriaServicio.GASFITER,
      esActivo: true,
      orden: 1,
    },
    {
      nombre: 'Carlos Mendoza - Electricista',
      telefono: '+56 9 8765 4321',
      email: 'cmendoza.electricista@gmail.com',
      descripcion: 'Instalaciones eléctricas, repairs y certificaciones SEC.',
      categoria: CategoriaServicio.ELECTRICISTA,
      esActivo: true,
      orden: 2,
    },
    {
      nombre: 'Emergencias Generales',
      telefono: '132 (GAS) / 133 (Bomberos)',
      descripcion: 'Números de emergencia oficiales.',
      categoria: CategoriaServicio.EMERGENCIA,
      esActivo: true,
      orden: 0,
    },
    {
      nombre: 'Retiro de muebles y cachureos',
      telefono: '800 123 456',
      email: null,
      descripcion: 'Servicio municipal de retiro de enseres. Solicitar día anterior.',
      categoria: CategoriaServicio.COMUN,
      esActivo: true,
      orden: 3,
    },
    {
      nombre: 'Juan Pérez - Jardinería',
      telefono: '+56 9 5555 4444',
      email: 'juan.jardin@gmail.com',
      descripcion: 'Mantención de jardines y áreas verdes comunes.',
      categoria: CategoriaServicio.COMUN,
      esActivo: true,
      orden: 4,
    },
  ]

  for (const svc of servicios) {
    await prisma.servicio.create({ data: svc })
  }
  console.log('Servicios creados')

  console.log('Seed completo!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
