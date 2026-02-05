#!/bin/bash

# RapidClick Project Setup Script

echo "Creating RapidClick project structure..."

# Initialize npm project
echo "Initializing npm project..."
npm init -y

# Install Express.js
echo "Installing Express.js..."
npm install express

# Create folder structure
echo "Creating folder structure..."
mkdir -p data
mkdir -p public/assets/sounds
mkdir -p public/assets/images

# Create empty files
echo "Creating project files..."
touch server.js
touch public/index.html
touch public/styles.css
touch public/game.js

# Create data/scores.json with initial content
echo "Creating scores.json..."
cat > data/scores.json << 'EOF'
{
  "score": 0,
  "date": null
}
EOF

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
EOF

echo ""
echo "✅ Project setup complete!"
echo ""
echo "Project structure created at: $(pwd)"
echo ""
echo "Next steps:"
echo "1. cd rapidclick"
echo "2. Add your code to the files (server.js, index.html, styles.css, game.js)"
echo "3. Run: node server.js"
echo "4. Open: http://localhost:3000"
echo ""
