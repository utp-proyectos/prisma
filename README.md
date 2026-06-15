# Prisma

## 1. Instalar `pnpm` usando `corepack`

1. Habilita `corepack`:

```powershell
corepack enable
```

2. Instala y activa `pnpm`:

```powershell
corepack use pnpm@latest-11
```

3. Verifica la instalación:

```powershell
pnpm --version
```

## 2. Instalar Angular CLI

```powershell
pnpm install -g @angular/cli
```

Verificar version

```powershell
ng version
```

Si ya lo tenias instalado con npm

```powershell
npm uninstall -g @angular/cli
```

Borra la caché para evitar problemas:

```powershell
npm cache clean --force
```

## 3. Instalar dependencias del proyecto

Desde la raíz del repositorio:

```powershell
pnpm install
```

Esto instalará todas las dependencias declaradas en `package.json`.

## 4. Ejecutar el proyecto

### Servir en modo de desarrollo

```powershell
ng serve
```

### Compilar la aplicación

```powershell
ng build
```

### Ejecutar pruebas

```powershell
ng test
```

## 5. Estructura de carpetas basada en Feature Driven

La arquitectura del proyecto está organizada para favorecer el desarrollo por características.
