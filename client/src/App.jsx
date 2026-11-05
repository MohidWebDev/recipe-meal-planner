import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import BackToTop from './components/common/BackToTop';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Planner from './pages/Planner';
import RecipeCreate from './pages/RecipeCreate';
import RecipeDetail from './pages/RecipeDetail';
import RecipeEdit from './pages/RecipeEdit';
import Recipes from './pages/Recipes';
import Register from './pages/Register';
import ShoppingList from './pages/ShoppingList';
import { initSmoothScroll } from './utils/smoothScroll';

function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Keyed by path so each page fades in when you navigate */}
        <div key={pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-line py-6 text-center text-xs text-subtle">
        Recipe <span className="text-accent">&amp;</span> Meal Planner · MERN capstone
      </footer>
      <BackToTop />
    </div>
  );
}

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Everything below requires a logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/new" element={<RecipeCreate />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/recipes/:id/edit" element={<RecipeEdit />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
