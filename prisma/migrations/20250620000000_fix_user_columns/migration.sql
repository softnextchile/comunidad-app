-- Fix: add missing columns to User table (migration 20250619000000 was recorded but not applied)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "numeroCasa" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailValidado" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenConfirmacion" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenExpira" TIMESTAMP(3);

-- Also ensure all new tables exist (idempotent)
CREATE TABLE IF NOT EXISTS "Comunicado" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR NOT NULL,
    "resumen" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "esPinned" BOOLEAN NOT NULL DEFAULT false,
    "autorId" INTEGER,
    "fechaPublicacion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Evento" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" VARCHAR,
    "lugar" VARCHAR,
    "categoria" VARCHAR NOT NULL DEFAULT 'REUNION',
    "capMax" INTEGER,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Servicio" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "telefono" VARCHAR NOT NULL,
    "email" TEXT,
    "descripcion" TEXT,
    "categoria" VARCHAR NOT NULL DEFAULT 'COMUN',
    "esActivo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Solicitud" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR NOT NULL DEFAULT 'SOLICITUD',
    "estado" VARCHAR NOT NULL DEFAULT 'ABIERTA',
    "solicitanteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enums (idempotent)
DO $$ BEGIN
    CREATE TYPE "CategoriaEvento" AS ENUM ('REUNION', 'FIESTA', 'MANTENCION', 'EMERGENCIA', 'OTRO');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "CategoriaServicio" AS ENUM ('GASFITER', 'ELECTRICISTA', 'EMERGENCIA', 'COMUN', 'OTRO');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TipoSolicitud" AS ENUM ('RECLAMO', 'SOLICITUD', 'IDEA');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EstadoSolicitud" AS ENUM ('ABIERTA', 'EN_PROCESO', 'CERRADA');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
