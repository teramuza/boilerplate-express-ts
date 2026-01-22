#!/bin/bash

echo "🚀 Setting up TypeScript Express Boilerplate..."
echo ""

# Create .env.development
echo "📝 Creating .env.development..."
cat > .env.development << 'EOF'
NODE_ENV=development
APP_PORT=3000
DEV_MODE=true

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-this-in-production

# Database (if needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=your_database
# DB_USER=your_user
# DB_PASSWORD=your_password
EOF

# Create .env.production
echo "📝 Creating .env.production..."
cat > .env.production << 'EOF'
NODE_ENV=production
APP_PORT=3000
DEV_MODE=false

# JWT Configuration
JWT_SECRET_KEY=your-production-secret-key-CHANGE-THIS

# Database (if needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=your_database
# DB_USER=your_user
# DB_PASSWORD=your_password
EOF

# Copy .env.development to .env for local development
echo "📝 Creating .env from .env.development..."
cp .env.development .env

echo "✅ Environment files created!"
echo ""

# Check Node version
echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Current version: $NODE_VERSION"
echo "   Required: >= v20.0.0"
echo ""

# Detect and use package manager
echo "📦 Detecting package manager..."
echo ""

# Check if user has a preference (existing lock file)
HAS_YARN_LOCK=false
HAS_NPM_LOCK=false

if [ -f "yarn.lock" ]; then
    HAS_YARN_LOCK=true
fi

if [ -f "package-lock.json" ]; then
    HAS_NPM_LOCK=true
fi

# Determine which package manager to use
USE_YARN=false
USE_NPM=false

if [ "$HAS_YARN_LOCK" = true ] && [ "$HAS_NPM_LOCK" = false ]; then
    USE_YARN=true
    echo "   Detected yarn.lock → Using Yarn"
elif [ "$HAS_NPM_LOCK" = true ] && [ "$HAS_YARN_LOCK" = false ]; then
    USE_NPM=true
    echo "   Detected package-lock.json → Using npm"
else
    # No lock file or both exist, check what's installed
    if command -v yarn &> /dev/null; then
        echo "   Yarn is available"
        USE_YARN=true
    fi
    
    if command -v npm &> /dev/null; then
        echo "   npm is available"
        USE_NPM=true
    fi
    
    # If both are available, ask user
    if [ "$USE_YARN" = true ] && [ "$USE_NPM" = true ]; then
        echo ""
        echo "Both Yarn and npm are available. Which would you like to use?"
        echo "1) npm (default)"
        echo "2) Yarn"
        read -p "Enter choice [1-2]: " choice
        
        case $choice in
            2)
                USE_YARN=true
                USE_NPM=false
                echo "   → Using Yarn"
                # Clean up npm lock if exists
                [ -f "package-lock.json" ] && rm package-lock.json
                ;;
            *)
                USE_YARN=false
                USE_NPM=true
                echo "   → Using npm"
                # Clean up yarn lock if exists
                [ -f "yarn.lock" ] && rm yarn.lock
                ;;
        esac
    elif [ "$USE_NPM" = true ]; then
        echo "   → Using npm"
        [ -f "yarn.lock" ] && rm yarn.lock
    elif [ "$USE_YARN" = true ]; then
        echo "   → Using Yarn"
        [ -f "package-lock.json" ] && rm package-lock.json
    else
        echo "   ❌ Neither npm nor Yarn is installed!"
        echo "   Please install Node.js (includes npm) or Yarn first."
        exit 1
    fi
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install dependencies
if [ "$USE_YARN" = true ]; then
    yarn install
    INSTALL_STATUS=$?
else
    npm install
    INSTALL_STATUS=$?
fi

if [ $INSTALL_STATUS -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "⚠️  IMPORTANT: Update JWT_SECRET_KEY in your .env file!"
    echo ""
    
    if [ "$USE_YARN" = true ]; then
        echo "🎉 Run 'yarn dev' to start the development server"
    else
        echo "🎉 Run 'npm run dev' to start the development server"
    fi
    
    echo "📚 Read README.md or QUICK_START.md to get started"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi
