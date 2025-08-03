# Trello Clone with Next.js and ShadCN UI

Este proyecto es un clon simplificado de Trello, construido con [Next.js](https://nextjs.org), [ShadCN UI](https://ui.shadcn.com/) y [dnd-kit](https://dndkit.com/). Permite a los usuarios organizar tareas en un tablero con múltiples listas y tarjetas, con funcionalidad de arrastrar y soltar, edición y eliminación de tarjetas, y persistencia de datos local.

## Características Implementadas

-   **Tablero Interactivo:** Visualización de listas y tarjetas.
-   **Listas (Columnas):** Organización de tareas en diferentes categorías.
    -   **Edición de Títulos de Listas:** Permite cambiar el nombre de las columnas.
    -   **Eliminación de Listas:** Funcionalidad para eliminar columnas completas.
    -   **Creación Dinámica de Listas:** Permite al usuario añadir nuevas columnas al tablero.
    -   **Arrastrar y Soltar Listas:** Reordenamiento de columnas en el tablero.
-   **Tarjetas:** Representación de tareas individuales con contenido.
    -   **Arrastrar y Soltar:** Reordenamiento de tarjetas dentro de la misma lista y movimiento entre listas.
    -   **Creación y Edición de Tarjetas:** Modal intuitivo para añadir y modificar el contenido de las tareas.
    -   **Eliminación de Tarjetas:** Funcionalidad para eliminar tareas.
-   **Persistencia Local de Datos:** Los cambios en el tablero se guardan en el `localStorage` del navegador.

## Roadmap Futuro

Nuestro plan para mejorar este clon de Trello incluye las siguientes funcionalidades:

1.  **Diseño Responsivo:** Adaptar la interfaz para que sea completamente funcional y visualmente atractiva en diferentes tamaños de pantalla (móviles, tabletas).
2.  **Funcionalidades de Usuario:** Integrar autenticación y permitir a los usuarios crear y gestionar sus propios tableros.
3.  **Backend Real:** Migrar la persistencia de datos de `localStorage` a una base de datos real con una API REST o GraphQL.
4.  **Mejoras Visuales:** Añadir animaciones sutiles, transiciones y posiblemente un tema de modo oscuro.
5.  **Detalles Extendidos de la Tarjeta:** Implementar campos adicionales en las tarjetas como descripciones detalladas, fechas de vencimiento, etiquetas y asignados.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
