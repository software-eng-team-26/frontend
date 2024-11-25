import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { CartPage } from './pages/CartPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { FeaturedPage } from './pages/FeaturedPage';
import { CoursesPage } from './pages/CoursesPage';
import { ProgrammingPage } from './pages/ProgrammingPage';
import { DesignPage } from './pages/DesignPage';
import { MarketingPage } from './pages/MarketingPage';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/categories/programming" element={<ProgrammingPage />} />
          <Route path="/categories/design" element={<DesignPage />} />
          <Route path="/categories/marketing" element={<MarketingPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;