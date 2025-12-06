# Hooks de Artbook

Documentación de los custom hooks implementados para gestionar estado y lógica de negocio.

---

## 📚 Hooks Disponibles

### 🔐 Autenticación

#### `useAuth`
**Ubicación:** `src/hooks/useAuth.js`

Gestiona autenticación de usuarios (login, logout, recuperación de contraseña).

**Uso:**
```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return user ? <Dashboard /> : <LoginForm onLogin={login} />;
}
```

**API:**
- `user` - Usuario autenticado o null
- `session` - Sesión de Supabase
- `loading` - Estado de carga
- `error` - Error si existe
- `isAuthenticated` - Boolean si hay usuario
- `login(email, password)` - Login
- `logout()` - Logout
- `signup(email, password)` - Registro
- `resetPassword(email)` - Recuperar contraseña
- `updatePassword(newPassword)` - Actualizar contraseña
- `checkSession()` - Verificar sesión actual

---

### 🎨 Artistas

#### `useArtistProfile`
**Ubicación:** `src/hooks/useArtistProfile.js`

Gestiona perfil de artista (fetch, update, upload de imágenes, tracking de visitas).

**Uso:**
```jsx
import { useArtistProfile } from '../hooks/useArtistProfile';

function ArtistProfile({ slug }) {
  const { artist, loading, trackVisit } = useArtistProfile(slug);
  
  useEffect(() => {
    if (artist) trackVisit(artist.id);
  }, [artist]);
  
  if (loading) return <LoadingSpinner />;
  return <ArtistDetails artist={artist} />;
}
```

**API:**
- `artist` - Datos del artista
- `loading` - Cargando datos
- `error` - Error si existe
- `updating` - Actualizando perfil
- `fetchArtist(slugOrId)` - Fetch por slug o ID
- `updateProfile(artistId, updates)` - Actualizar datos
- `uploadAvatar(artistId, file)` - Subir avatar
- `uploadCover(artistId, file)` - Subir portada
- `trackVisit(artistId)` - Trackear visita
- `refresh()` - Recargar datos

---

#### `useArtistDashboard`
**Ubicación:** `src/hooks/useArtistDashboard.js`

Gestiona dashboard del artista con analytics, rankings y bookings.

**Uso:**
```jsx
import { useArtistDashboard } from '../hooks/useArtistDashboard';

function Dashboard() {
  const { artist, analytics, bookings, loading } = useArtistDashboard();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1>{artist.nombre_artistico}</h1>
      <Stats analytics={analytics} />
      <Bookings data={bookings} />
    </div>
  );
}
```

**API:**
- `artist` - Datos del artista autenticado
- `analytics` - Analytics (ranking, visitas)
  - `analytics.ranking` - Posición y percentil
  - `analytics.visits` - Visitas totales y del mes
  - `analytics.bookings` - Total y pendientes
- `bookings` - Array de bookings
- `loading` - Estado de carga inicial
- `analyticsLoading` - Cargando analytics
- `error` - Error si existe
- `refresh()` - Recargar todo
- `refreshAnalytics()` - Solo recargar analytics

---

### 💎 Premium

#### `usePremiumStatus`
**Ubicación:** `src/hooks/usePremiumStatus.js`

Verifica estado premium del artista y gestiona feature flags.

**Uso:**
```jsx
import { usePremiumStatus } from '../hooks/usePremiumStatus';

function AnalyticsSection({ artistId }) {
  const { isPremium, hasFeature, canUseFeature } = usePremiumStatus(artistId);
  
  const { allowed } = canUseFeature('max_tracks', currentTracks);
  
  if (!hasFeature('analytics_advanced')) {
    return <UpgradePrompt feature="analytics_advanced" />;
  }
  
  return <AdvancedAnalytics />;
}
```

**API:**
- `isPremium` - Boolean si es premium
- `tier` - 'free' | 'premium' | 'pro'
- `subscription` - Datos de suscripción
- `features` - Objeto con todas las features
- `loading` - Estado de carga
- `error` - Error si existe
- `expiresAt` - Fecha de expiración
- `status` - Estado de la suscripción
- `hasFeature(featureName)` - Verificar si tiene feature
- `getFeatureLimit(featureName)` - Obtener límite
- `canUseFeature(featureName, currentUsage)` - Verificar uso
- `refresh()` - Recargar estado

---

## 🎨 Componentes UI

### `LoadingSpinner`
**Ubicación:** `src/components/ui/LoadingSpinner.jsx`

```jsx
<LoadingSpinner size="sm" | "md" | "lg" />
```

### `ErrorMessage`
**Ubicación:** `src/components/ui/ErrorMessage.jsx`

```jsx
<ErrorMessage 
  message="Error al cargar datos" 
  onRetry={handleRetry} 
/>
```

### `SuccessMessage`
**Ubicación:** `src/components/ui/SuccessMessage.jsx`

```jsx
<SuccessMessage message="Guardado exitosamente" />
```

---

## 💎 Componentes Premium

### `PremiumBadge`
**Ubicación:** `src/components/premium/PremiumBadge.jsx`

```jsx
<PremiumBadge tier="premium" size="md" />
```

### `UpgradePrompt`
**Ubicación:** `src/components/premium/UpgradePrompt.jsx`

```jsx
<UpgradePrompt 
  feature="analytics_advanced"
  message="Mensaje personalizado" 
/>
```

---

## 🔧 Ejemplo Completo: Refactor de Componente

### Antes (lógica en componente):
```jsx
function ArtistProfile() {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data } = await supabase.from('artists').select('*').eq('slug', slug).single();
      setArtist(data);
      setLoading(false);
    }
    fetch();
  }, [slug]);
  
  return loading ? <div>Cargando...</div> : <div>{artist.nombre}</div>;
}
```

### Después (usando hook):
```jsx
import { useArtistProfile } from '../hooks/useArtistProfile';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function ArtistProfile({ slug }) {
  const { artist, loading } = useArtistProfile(slug);
  
  if (loading) return <LoadingSpinner />;
  return <div>{artist.nombre_artistico}</div>;
}
```

---

## 📝 Buenas Prácticas

1. **Siempre usar hooks para lógica de datos** - No hacer fetch directo en componentes
2. **Manejar estados de loading y error** - UX consistente
3. **Usar componentes UI reutilizables** - Mantener consistencia visual
4. **Verificar premium antes de mostrar features** - `hasFeature()` o `canUseFeature()`

---

## 🚀 Próximos Hooks (Roadmap)

- `useArtists` - Fetch con paginación y filtros
- `useRanking` - Rankings mensuales/históricos
- `useForm` - Gestión de formularios
- `useToast` - Notificaciones toast
- `useModal` - Gestión de modales

---

**Última actualización:** 2025-12-06
