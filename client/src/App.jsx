import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Planner from './pages/Planner';
import RecipeCreate from './pages/RecipeCreate';
import RecipeDetail from './pages/RecipeDetail';
import RecipeEdit from './pages/RecipeEdit';
import Recipes from './pages/Recipes';
import Register from './pages/Register';
import ShoppingList from './pages/ShoppingList';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Recipe &amp; Meal Planner · MERN capstone
      </footer>
    </div>
  );
}

export default function App() {
  return (
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
  );
}
