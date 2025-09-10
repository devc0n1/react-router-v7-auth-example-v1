# React Router v7 Authentication Example

A complete React authentication system built with React Router v7 and TypeScript, featuring protected routes, HTTP API integration, and professional sidebar navigation. This project demonstrates modern React patterns with context-based state management, comprehensive API services, and a production-ready architecture.

![Login Page](https://github.com/user-attachments/assets/9ce4c146-55a5-4d4d-bd41-a7b970ff7135)

## 🏗️ Architecture

The application follows a clean component architecture with authentication-first design:

- **AuthContext**: Centralized authentication state management using React Context API with token-based persistence
- **ProtectedLayout**: Higher-order component that wraps protected routes and automatically redirects unauthenticated users
- **Route Protection**: Seamless integration between React Router v7 and authentication guards  
- **API Service Layer**: Complete HTTP client with authentication, retry logic, and error handling

## ✨ Features

### 🔐 Authentication System
- **JWT Token Management**: Secure token-based authentication with localStorage persistence
- **Automatic Redirects**: Unauthenticated users are redirected to login page
- **Session Persistence**: Authentication state survives page refreshes
- **Secure Logout**: Complete session cleanup with API call and redirect

### 🌐 HTTP API Integration
- **RESTful API Services**: Dedicated services for authentication, agents, and dashboard
- **Token Management**: Automatic JWT token injection in HTTP headers
- **Error Handling**: Global error handling with user-friendly messages and retry logic
- **Loading States**: Proper loading indicators throughout the application
- **Custom Hooks**: Reusable API hooks with loading states and error handling

### 🧭 Professional Navigation
- **Left Sidebar Navigation**: Clean sidebar with branded header and navigation icons
- **Active Page Indicators**: Visual highlighting of current page with blue accent and bold text
- **User Context Display**: Sidebar shows user information, role badges, and logout functionality
- **Dynamic Page Headers**: Page titles and descriptions that update based on current route
- **Responsive Design**: Layout adapts to different screen sizes while maintaining usability

## 📱 Pages

### Login Page
Clean, responsive login form with validation, loading states, and demo credentials display.

**Demo Credentials**: 
- Username: `admin` or `testuser`
- Password: `password`

### Dashboard
![Dashboard with Left Navigation](https://github.com/user-attachments/assets/2d442f7d-f681-4376-a502-5e5ac792c336)

Comprehensive dashboard featuring:
- **Real-time Statistics**: System stats loaded via API calls with proper loading states
- **User Activity Tracking**: Personal metrics and session information
- **System Metrics**: Server uptime, response times, and performance indicators
- **Recent Activity Feed**: Timeline of user actions and system events

### AI Agents Management
![Agents Page](https://github.com/user-attachments/assets/42efccdf-74e8-4cdc-aa4e-26282e2d76f0)

Feature-rich agent management interface with:
- **Full CRUD Operations**: Create, read, update, and delete AI agents
- **Modal-based Forms**: Clean interfaces for creating and editing agents
- **Status Management**: Start, stop, and configure agent operational status
- **Agent Capabilities**: Display and manage agent skills and capabilities
- **Performance Metrics**: Request counts, success rates, and operational statistics
- **Summary Dashboard**: Overview of total, active, inactive, and maintenance agents

## 🛠️ Technical Stack

- **React 19.1.1**: Latest React with functional components and hooks
- **React Router v7.8.2**: Modern routing with protected route patterns
- **TypeScript**: Full type safety with comprehensive interface definitions
- **Vite**: Fast development server and optimized production builds
- **Context API**: State management for authentication and user data
- **HTTP Services**: Complete API layer with error handling and retries
- **Modern CSS**: Responsive design with professional styling

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthContext.tsx      # Authentication context provider
│   └── ProtectedLayout.tsx  # Protected route wrapper with sidebar
├── pages/
│   ├── Login.tsx           # Authentication page
│   ├── Dashboard.tsx       # Main dashboard with stats
│   └── Agents.tsx          # AI agents management
├── services/
│   ├── api.ts             # HTTP client configuration
│   ├── authService.ts     # Authentication API calls
│   ├── dashboardService.ts # Dashboard data services
│   └── agentsService.ts   # Agent CRUD operations
├── hooks/
│   └── useApi.ts          # Custom API hooks with loading states
├── types/
│   └── index.ts           # TypeScript type definitions
└── utils/
    └── storage.ts         # LocalStorage utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devc0n1/react-router-v7-auth-example-v1.git
   cd react-router-v7-auth-example-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔧 Configuration

### Authentication
The application uses mock authentication with the following demo credentials:
- **Admin User**: `admin` / `password`
- **Test User**: `testuser` / `password`

### API Services
All API calls are mocked with realistic delays and responses. The service layer includes:
- Token management and refresh logic
- Error handling and retry mechanisms
- Loading state management
- TypeScript interfaces for all API responses

## 🎯 Key Concepts Demonstrated

### Protected Routes
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedLayout>
      <Dashboard />
    </ProtectedLayout>
  }
/>
```

### Authentication Context
```typescript
const { user, login, logout, loading } = useAuth();
```

### API Integration
```typescript
const { data, loading, error } = useApi(dashboardService.getStats);
```

### Type Safety
Complete TypeScript coverage with interfaces for:
- User authentication state
- API request/response objects
- Component props and state
- Service method signatures

## 🌟 Modern React Patterns

- **Functional Components**: All components use modern React hooks
- **Custom Hooks**: Reusable logic for API calls and state management
- **Context API**: Global state management without external dependencies
- **Error Boundaries**: Graceful error handling throughout the application
- **Loading States**: Proper UX with loading indicators and skeleton screens
- **Optimistic Updates**: Immediate UI feedback with API synchronization

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React Router v7, TypeScript, and modern React patterns**
