# SCOPE Web Application - Important Information

## Project Overview
- **Organization**: SCOPE (Society of Core Oriented Projects)
- **Project Type**: Next.js 15.2.0 Web Application
- **Purpose**: Official website for SCOPE club showcasing events, teams, about us, and FAQ sections
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS

## Key Features Implemented

### 1. Navigation System
- **Scroll-responsive navigation**: Hides when scrolling down, shows when scrolling up
- **Dual view modes**: Traditional multi-page vs unified scroll view
- **Dynamic routing**: Navigation between different sections
- **Location**: `app/components/Navigation.tsx`

### 2. Interactive SCOPE Logo/Title
- **Hover effect**: "SCOPE" elevates and reveals "Society of Core Oriented Projects"
- **Gradient text**: Pink to blue gradient (`from-[#F24DC2] to-[#2C97FF]`)
- **Font**: Orbitron (imported from Google Fonts)
- **Animation**: 300ms smooth transitions
- **Location**: `app/page.tsx` and `app/components/OriginalHomePage.tsx`

### 3. Footer Component
- **Scroll-based visibility**: Appears when scrolling up, hides when scrolling down
- **Social media links**: Instagram, LinkedIn, Discord with hover effects
- **Translucent background**: Matches navbar styling
- **Location**: `app/components/FooterComponent.tsx`

### 4. Page Sections
- **Home**: Main landing with SCOPE branding
- **Events**: Event listings and upcoming events poster
- **About Us**: Information about the organization
- **Teams**: Team member profiles and information
- **FAQ**: Frequently asked questions with contact form

### 5. Scroll Animation System
- **Unified scroll container**: Smooth scrolling between sections
- **Scroll snap**: Each section snaps to viewport
- **Cross-browser compatibility**: Unified scroll detection
- **Location**: `app/components/ScrollAnimationFixed.tsx`

## Technical Stack

### Frontend Framework
- **Next.js**: 15.2.0 (App Router)
- **React**: Latest version with hooks
- **TypeScript**: Full type safety

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Additional styling in `app/globals.css`
- **Fonts**: 
  - Orbitron (headings)
  - DM Sans (body text)
  - Inter (additional text)

### Key Dependencies
```json
{
  "next": "15.2.0",
  "react": "^19.0.0",
  "tailwindcss": "latest",
  "@next/font": "google fonts integration"
}
```

## File Structure

### Core Application Files
```
app/
├── layout.tsx              # Root layout with fonts and providers
├── page.tsx                # Main homepage with SCOPE interaction
├── globals.css             # Global styles and CSS variables
├── components/
│   ├── Navigation.tsx      # Main navigation component
│   ├── FooterComponent.tsx # Footer with scroll behavior
│   ├── OriginalHomePage.tsx # Home page component
│   ├── ScrollAnimationFixed.tsx # Scroll animations
│   ├── ViewModeContext.tsx # Context for view mode switching
│   └── CustomCursor.tsx    # Custom cursor component
├── aboutus/
│   └── page.tsx           # About us page
├── teams/
│   └── page.tsx           # Teams page
├── eventss/
│   └── page.tsx           # Events page
└── faq/
    └── page.tsx           # FAQ page
```

### Configuration Files
- `tailwind.config.ts`: Tailwind configuration with custom fonts
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Dependencies and scripts

## Color Scheme & Design
- **Primary Colors**: 
  - Purple: `#F24DC2`
  - Blue: `#2C97FF`
  - Dark Background: `#0C112B` to `#1a1f3a`
- **Text Colors**:
  - Light text: `#ffffff`
  - Secondary text: `#gray-300`
  - Muted text: `#gray-400`

## Interactive Features

### SCOPE Title Hover Effect
- **Default State**: Shows "SCOPE" with gradient text
- **Hover State**: 
  - "SCOPE" moves up by 8px (`-translate-y-2`)
  - "Society of Core Oriented Projects" fades in below
  - Smooth 300ms transitions
  - Maintains proper spacing with content below

### Navigation Behavior
- **Scroll Down**: Navigation hides with smooth transition
- **Scroll Up**: Navigation shows with smooth transition
- **Unified Scroll**: Works with both traditional and scroll modes

### Footer Behavior
- **Scroll Up**: Footer appears from bottom
- **Scroll Down**: Footer hides
- **Social Icons**: Hover effects with color transitions

## Development Commands

### Start Development Server
```bash
pnpm dev
# or
npm run dev
```

### Build for Production
```bash
pnpm build
# or
npm run build
```

### Run Production Build
```bash
pnpm start
# or
npm start
```

## System Requirements

### Prerequisites for Running This Project

#### 1. Node.js Environment
- **Required Version**: Node.js 18.17.0 or higher (LTS recommended)
- **Check Version**: `node --version`
- **Download**: [nodejs.org](https://nodejs.org/)
- **Why**: Next.js 15.2.0 requires Node.js 18.17+

#### 2. Package Manager
- **Recommended**: pnpm (faster, more efficient)
  ```bash
  npm install -g pnpm
  ```
- **Alternative**: npm (comes with Node.js)
- **Alternative**: yarn
  ```bash
  npm install -g yarn
  ```

#### 3. Development Environment
- **Code Editor**: VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
- **Browser**: Chrome/Firefox/Safari (latest versions)
- **Terminal**: PowerShell/Command Prompt/Git Bash (Windows) or Terminal (Mac/Linux)

#### 4. Git Version Control
- **Git**: Latest version for cloning and version control
- **Check Version**: `git --version`
- **Download**: [git-scm.com](https://git-scm.com/)

### Project Setup Instructions

#### Step 1: Clone the Repository
```bash
git clone [repository-url]
cd scope_official_web_app
```

#### Step 2: Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using yarn
yarn install
```

#### Step 3: Environment Setup
- No environment variables required for basic setup
- All configurations are in the codebase

#### Step 4: Start Development Server
```bash
pnpm dev
# Server will start on http://localhost:3000
```

### Required Dependencies (Auto-installed)

#### Core Framework
```json
{
  "next": "15.2.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0"
}
```

#### Styling & UI
```json
{
  "tailwindcss": "^3.0.0",
  "postcss": "^8.0.0",
  "autoprefixer": "^10.0.0"
}
```

#### Development Tools
```json
{
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "@types/node": "^20.0.0",
  "eslint": "^8.0.0",
  "eslint-config-next": "15.2.0"
}
```

### Hardware Requirements

#### Minimum System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for node_modules and dependencies
- **CPU**: Any modern processor (Intel/AMD/ARM)
- **Operating System**: 
  - Windows 10/11
  - macOS 10.15+
  - Linux (Ubuntu 18.04+, other distributions)

#### Recommended for Optimal Performance
- **RAM**: 16GB or more
- **Storage**: SSD with 5GB+ free space
- **CPU**: Multi-core processor
- **Internet**: Stable connection for dependency downloads

### Browser Support
- **Chrome**: 90+
- **Firefox**: 90+
- **Safari**: 14+
- **Edge**: 90+

### Common Setup Issues & Solutions

#### Issue 1: Node.js Version Too Old
```bash
Error: Node.js version 16.x.x is not supported
```
**Solution**: Update to Node.js 18.17.0 or higher

#### Issue 2: Package Installation Fails
```bash
npm ERR! code ERESOLVE
```
**Solution**: 
```bash
# Clear cache and retry
npm cache clean --force
pnpm install --force
```

#### Issue 3: Port 3000 Already in Use
```bash
Error: Port 3000 is already in use
```
**Solution**: 
```bash
# Use different port
pnpm dev -p 3001
# OR kill process using port 3000
```

#### Issue 4: TypeScript Errors
```bash
Type errors found
```
**Solution**: Ensure TypeScript is properly installed and configured

### Development Workflow

#### For New Developers

1. **Initial Setup** (One-time)
   ```bash
   # Install Node.js 18.17+
   # Install pnpm globally
   npm install -g pnpm
   # Clone repository
   git clone [repo-url]
   cd scope_official_web_app
   # Install dependencies
   pnpm install
   ```

2. **Daily Development**
   ```bash
   # Start development server
   pnpm dev
   # Open http://localhost:3000
   # Make changes and see live updates
   ```

3. **Before Pushing Code**
   ```bash
   # Build to check for errors
   pnpm build
   # Run linting
   pnpm lint
   ```

### IDE Configuration

#### VS Code Settings (Recommended)
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### Performance Optimization

#### During Development
- Use `pnpm` instead of `npm` for faster installs
- Enable VS Code auto-save for live reloading
- Close unnecessary browser tabs while developing
- Use Chrome DevTools for debugging

#### For Production Build
```bash
# Create optimized production build
pnpm build

# Test production build locally
pnpm start
```

### Troubleshooting Network Issues

#### Corporate Firewalls
```bash
# Configure npm registry if behind firewall
npm config set registry https://registry.npmjs.org/
```

#### Proxy Settings
```bash
# If using corporate proxy
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port
```

## Important Notes

### Scroll Detection
- Uses unified scroll container detection
- Fallback to window scroll events
- Cross-browser compatible implementation

### Font Loading
- Google Fonts loaded via Next.js font optimization
- CSS variables used for font family references
- Proper fallbacks defined

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Responsive text sizing (`text-5xl md:text-6xl`)
- Flexible layouts with proper spacing

### Performance Optimizations
- Next.js automatic code splitting
- Optimized font loading
- CSS-in-JS with Tailwind for minimal bundle size

## Custom CSS Variables
```css
:root {
  --background-dark: #040a28;
  --text-light: #ffffff;
  --accent-blue: #ffffff;
  --primary-purple: #8a40ff;
  --secondary-pink: #ff40a8;
  --tertiary-blue: #00bfff;
}
```

## Recent Updates
- Enhanced SCOPE hover interaction with proper spacing
- Fixed text overlapping issues with absolute positioning
- Optimized scroll-based navigation and footer behavior
- Improved responsive design for all screen sizes
- Added smooth transitions and animations throughout

## Troubleshooting

### Common Issues
1. **Text Overlapping**: Fixed with proper absolute positioning and z-index
2. **Scroll Detection**: Implemented unified container detection
3. **Font Loading**: Using Next.js optimized font loading
4. **Layout Shifts**: Prevented with proper container sizing

### Development Setup
1. Ensure Node.js 18+ is installed
2. Use `pnpm` for package management (preferred)
3. Run `pnpm install` to install dependencies
4. Start development with `pnpm dev`

## Contact & Collaboration
- **Organization**: SCOPE (Society of Core Oriented Projects)
- **Tagline**: "Wired for Innovation, Powered by Passion"
- **Focus**: Electronics and circuit design
- **Website**: Comprehensive platform for club activities and information

---
*Last Updated: August 25, 2025*
*Version: Production Ready*
