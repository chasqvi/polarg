import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'

const rootRoute = createRootRoute()

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
  validateSearch: (search: Record<string, unknown>) => ({
    articulo:
      typeof search.articulo === 'string' && search.articulo.length > 0
        ? search.articulo
        : undefined,
    pagina:
      typeof search.pagina === 'string'
        ? Math.max(1, parseInt(search.pagina, 10) || 1)
        : 1,
  }),
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

// Register router type globally so useNavigate / useSearch are fully typed
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
