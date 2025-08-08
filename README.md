# Course Platform

A full-stack web application for displaying and managing online courses, built with Vue.js frontend and Node.js/Express backend using functional programming principles.

## Features

### Frontend (Vue.js + Tailwind CSS)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Course Listing**: Grid layout with lazy loading support
- **Course Details**: Detailed view with back navigation
- **Modern UI**: Clean, Udemy-inspired design
- **TypeScript**: Full type safety
- **Unit Tests**: Jest testing framework

### Backend (Node.js + Express + fp-ts)
- **Functional Programming**: Built with fp-ts library
- **TypeScript**: Full type safety throughout
- **RESTful API**: Clean API design
- **SQLite Database**: Lightweight database
- **Error Handling**: Comprehensive error management
- **Unit Tests**: Jest testing framework

### Database
- **SQLite**: File-based database
- **Pre-populated Data**: Sample courses included
- **Schema**: Optimized for course management

## Tech Stack

### Frontend
- Vue.js 3 (Composition API)
- TypeScript
- Tailwind CSS
- Vue Router
- Axios
- Jest (Testing)

### Backend
- Node.js
- Express.js
- TypeScript
- fp-ts (Functional Programming)
- io-ts (Runtime Validation)
- SQLite3
- Jest (Testing)

### Infrastructure
- Docker Compose
- Multi-stage builds
- Development and production ready

## Quick Start

### Prerequisites
- Docker and Docker Compose (for containerized deployment)
- Node.js 18+ (for local development)

### Option 1: Docker Compose (Recommended)

1. **Start Docker**
   - **Docker Desktop**: Open Docker Desktop application
   - **OrbStack**: Open OrbStack application
   - Wait for Docker to be running

2. **Start all services**
   ```bash
   # Use the provided startup script
   ./start.sh
   
   # Or manually
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Health Check: http://localhost:8000/health

### Option 2: Local Development (Recommended)

1. **Start development servers**
   ```bash
   # Use the simple startup script (recommended)
   ./start-simple.sh
   
   # Or use the original development script
   ./start-dev.sh
   ```

2. **Manual setup**
   ```bash
   # Create database first
   mkdir -p data
   touch data/courses.db
   chmod 666 data/courses.db
   
   # Create schema and sample data
   sqlite3 data/courses.db "CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, image_url TEXT, instructor TEXT, price REAL, category TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
   
   # Backend
   cd backend
   npm install
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm install
   npm run dev
   ```

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Setup**
   ```bash
   # The database will be automatically created with sample data
   # when you start the backend service
   ```

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Health Check
- `GET /health` - Service health status

## Project Structure

```
├── docker-compose.yml          # Docker orchestration
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── database/          # Database connection
│   │   ├── types/             # TypeScript types
│   │   └── routes/            # API routes
│   ├── __tests__/             # Backend tests
│   └── package.json
├── frontend/                   # Vue.js frontend
│   ├── src/
│   │   ├── components/        # Vue components
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   └── style.css          # Tailwind CSS
│   ├── __tests__/             # Frontend tests
│   └── package.json
└── data/                      # SQLite database files
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Functional Programming Features

The backend is built using functional programming principles with the `fp-ts` library:

- **Either**: Error handling with `Either<Error, Success>`
- **Option**: Nullable value handling with `Option<T>`
- **TaskEither**: Async operations with error handling
- **Pipe**: Function composition
- **Validation**: Runtime type checking with `io-ts`

## Sample Data

The application comes with pre-populated sample courses:
- **Functional Programming Fundamentals** - Learn core FP concepts with lambda calculus and pure functions
- **Object-Oriented Programming Mastery** - Master OOP principles including encapsulation, inheritance, and polymorphism  
- **DevOps with Kubernetes** - Learn containerization, orchestration, and deployment strategies

Each course includes:
- Custom SVG course images with relevant visual elements
- Detailed descriptions and learning objectives
- Professional instructor information
- Realistic pricing

## Development

### Adding New Features
1. Create feature branch
2. Implement backend API endpoints
3. Add frontend components
4. Write tests
5. Update documentation

### Code Style
- TypeScript strict mode enabled
- ESLint configuration
- Prettier formatting
- Functional programming patterns

## Deployment

The application is containerized and ready for deployment:

```bash
# Build and run in production
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Troubleshooting

### Docker Issues

**Error: "Cannot connect to the Docker daemon"**
- Make sure Docker Desktop or OrbStack is running
- Check if Docker is installed: `docker --version`
- Restart Docker application if needed

**Error: "Port already in use"**
- Stop other services using ports 3000 or 8000
- Or change ports in `docker-compose.yml`

### Development Issues

**Backend won't start**
- Check if Node.js 18+ is installed: `node --version`
- Run `npm install` in the backend directory
- Check logs for specific errors

**Frontend won't start**
- Check if Node.js 18+ is installed: `node --version`
- Run `npm install` in the frontend directory
- Check if port 3000 is available

**Database issues**
- Delete the `data/` directory and restart
- Check if SQLite is working: `sqlite3 --version`

### Common Commands

```bash
# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f

# Clean up
docker-compose down -v
docker system prune -f
```

## License

MIT License - see LICENSE file for details
