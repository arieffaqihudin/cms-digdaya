import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import VideoPage from "@/pages/VideoPage";
import BlogPage from "@/pages/BlogPage";
import ScheduledPage from "@/pages/ScheduledPage";
import PanduanPage from "@/pages/PanduanPage";
import FAQPage from "@/pages/FAQPage";
import ContentEditor from "@/pages/ContentEditor";
import PublishedContent from "@/pages/PublishedContent";
import ArchivedContent from "@/pages/ArchivedContent";
import DraftsPage from "@/pages/DraftsPage";
import TaxonomyPage from "@/pages/TaxonomyPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import MediaLibrary from "@/pages/MediaLibrary";
import PanduanFormPage from "@/pages/PanduanFormPage";
import ProductFormPage from "@/pages/ProductFormPage";
import FAQFormPage from "@/pages/FAQFormPage";
import FAQCategoryFormPage from "@/pages/FAQCategoryFormPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/video" element={<VideoPage />} />
                <Route path="/video/:id" element={<ContentEditor />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/panduan" element={<PanduanPage />} />
                <Route path="/panduan/new" element={<PanduanFormPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/faq/new" element={<FAQFormPage />} />
                <Route path="/content/:id" element={<ContentEditor />} />
                <Route path="/published" element={<PublishedContent />} />
                <Route path="/archived" element={<ArchivedContent />} />
                <Route path="/drafts" element={<DraftsPage />} />
                <Route path="/scheduled" element={<ScheduledPage />} />
                <Route path="/categories" element={<TaxonomyPage defaultTab="categories" />} />
                <Route path="/categories/faq/new" element={<FAQCategoryFormPage />} />
                <Route path="/tags" element={<TaxonomyPage defaultTab="tags" />} />
                <Route path="/products" element={<TaxonomyPage defaultTab="products" />} />
                <Route path="/products/new" element={<ProductFormPage />} />
                <Route path="/channels" element={<TaxonomyPage defaultTab="channels" />} />
                <Route path="/media" element={<MediaLibrary />} />
                <Route path="/settings" element={<PlaceholderPage title="Pengaturan" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
