# Lead Management System - Frontend

A modern, responsive Vue.js 3 frontend application for managing leads, contacts, notes, reminders, and correspondence tracking. Built with Vuetify 3 for a professional, accessible user interfac

### Project Structure
```
frontend/
├── src/
│   ├── api/               # API client configuration
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Generic components (DataTable, FormActions)
│   │   ├── contacts/      # Contact-specific components
│   │   ├── leads/         # Lead-specific components
│   │   ├── notes/         # Note management components
│   │   ├── reminders/     # Reminder components
│   │   └── correspondence/# Correspondence components
│   ├── router/            # Application routing
│   ├── services/          # API service layer
│   ├── store/             # Pinia state management
│   ├── views/             # Page components
│   └── plugins/           # Vue plugins (Vuetify)
├── public/                # Static assets
├── Dockerfile.dev         # Development container
├── Dockerfile.prod        # Production container
└── package.json           # Dependencies and scripts
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for containerized setup)
- Modern web browser with ES6+ support

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aduda-Shem/crm-frontend
   cd frontend
   ```

2. **Start the development environment**
   ```bash
   # From the root directory
   docker-compose up -d frontend
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file
   VITE_API_BASE=http://localhost:8000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## State Management

### Pinia Stores

#### Auth Store
```typescript
// Manages authentication state
- user: User information and role
- accessToken: JWT access token
- refreshToken: JWT refresh token
- login/logout actions
- token refresh logic
```

#### Leads Store
```typescript
// Manages lead data and operations
- leads: Array of lead objects
- currentLead: Currently selected lead
- loading states
- CRUD operations
```

#### Contacts Store
```typescript
// Manages contact data and operations
- contacts: Array of contact objects
- loading states
- CRUD operations
```

### State Persistence
- **Local Storage**: User preferences and settings
- **Session Storage**: Temporary data during session
- **Memory**: Reactive state for current session

## API Integration

### Service Layer Architecture
```typescript
// Centralized API communication
- api.ts: Base API client with interceptors
- endpoints.ts: API endpoint definitions
- services/: Domain-specific service functions
```

### Error Handling
- **Network Errors**: Automatic retry and user notification
- **Validation Errors**: Field-specific error display
- **Authentication Errors**: Automatic logout and redirect

### Request/Response Interceptors
- **Authentication**: Automatic token inclusion
- **Error Handling**: Global error processing
- **Loading States**: Automatic loading indicator management


