import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import CategoryPage from '@/pages/CategoryPage';
import StorePage from '@/pages/StorePage';
import StoresPage from '@/pages/StoresPage';

import DashboardLayout from '@/pages/DashboardLayout';
import DashboardHome from '@/pages/DashboardHome';
import SavedCoupons from '@/pages/SavedCoupons';
import FavoriteStores from '@/pages/FavoriteStores';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

import AdminLayout from '@/pages/AdminLayout';
import AdminHome from '@/pages/AdminHome';
import AdminCoupons from '@/pages/AdminCoupons';
import AdminCategories from '@/pages/AdminCategories';
import AdminStores from '@/pages/AdminStores';
import AdminUsers from '@/pages/AdminUsers';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminSettings from '@/pages/AdminSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/store/:slug" element={<StorePage />} />
                <Route path="/stores" element={<StoresPage />} />

                {/* User Dashboard */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="saved" element={<SavedCoupons />} />
                  <Route path="favorites" element={<FavoriteStores />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Admin Panel */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminHome />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="stores" element={<AdminStores />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="reports" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
