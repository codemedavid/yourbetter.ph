import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Terms from './pages/Terms';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import BookMD from './pages/BookMD';
import ThankYou from './pages/ThankYou';
import Verify from './pages/Verify';
import Store from './pages/Store';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/book-md" element={<BookMD />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/store" element={<Store />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </AssessmentProvider>
    </BrowserRouter>
  );
}
