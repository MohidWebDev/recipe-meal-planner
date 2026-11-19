import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import BackToTop from "./components/common/BackToTop";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import Footer from "./components/common/Footer";
import BottomNav from "./components/common/BottomNav";
import useAuth from "./hooks/useAuth";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Planner from "./pages/Planner";
import RecipeCreate from "./pages/RecipeCreate";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeEdit from "./pages/RecipeEdit";
import Recipes from "./pages/Recipes";
import Register from "./pages/Register";
import ShoppingList from "./pages/ShoppingList";
import { initSmoothScroll } from "./utils/smoothScroll";

function Layout() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className={`flex min-h-screen flex-col ${isAuthenticated ? "pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0" : ""}`}
    >
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Keyed by path so each page fades in when you navigate */}
        <div key={pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      {isAuthenticated && <BottomNav />}
      <BackToTop raised={isAuthenticated} />
    </div>
  );
}

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public landing page: has its own nav and footer, so it sits outside Layout */}
        <Route path="/" element={<Landing />} />

        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* Everything below requires a logged-in user */}
          <Route element={<ProtectedRoute />}>
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
