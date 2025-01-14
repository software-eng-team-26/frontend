# 308-Frontend - EduMart Platform

## Overview

The frontend of the EduMart platform is a React application designed to provide a user-friendly interface for an online learning platform. It allows users to browse courses, manage their cart, and access their profile.

## Features

- User authentication
- Course browsing and search
- Cart and wishlist management
- Order tracking
- Admin dashboard for managing courses and sales

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Zustand for state management
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js
- npm or Yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/edumart-frontend.git
   cd edumart-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Run the application:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   This will start the development server and open the application in your default browser.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:
VITE_API_URL=http://localhost:9191/api/v1

## Screenshots

- **Home Page:**
  ![alt text](image-1.png)

- **Course Browsing:**
  ![Course Browsing](docs/course-browsing.png)

- **Cart Management:**
  ![Cart Management](docs/cart-management.png)

- **Admin Dashboard:**
  ![Admin Dashboard](docs/admin-dashboard.png)

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License.