-- Add new columns to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "numeroCasa" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailValidado" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenConfirmacion" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenExpira" TIMESTAMP(3);

-- Rename Noticia to Comunicado
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comunicado_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "Comunicado" ("id", "titulo", "resumen", "contenido", "imagenUrl", "publicado", "autorId", "createdAt", "updatedAt")
SELECT "id", "titulo", "resumen", "contenido", "imagenUrl", "published", NULL, "createdAt", "updatedAt" FROM "Noticia";

-- Create Evento table
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

-- Create Servicio table
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

-- Create Solicitud table
CREATE TABLE IF NOT EXISTS "Solicitud" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR NOT NULL DEFAULT 'SOLICITUD',
    "estado" VARCHAR NOT NULL DEFAULT 'ABIERTA',
    "solicitanteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Solicitud_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Enums
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

-- Drop old tables
DROP TABLE IF EXISTS "Noticia" CASCADE;
