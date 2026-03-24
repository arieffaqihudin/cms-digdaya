import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/video" element={<VideoPage />} />
                  <Route path="/video/:id" element={<ContentEditor />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/panduan" element={<PanduanPage />} />
                  <Route path="/panduan/new" element={<PanduanFormPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/content/:id" element={<ContentEditor />} />
                  <Route path="/published" element={<PublishedContent />} />
                  <Route path="/archived" element={<ArchivedContent />} />
                  <Route path="/drafts" element={<DraftsPage />} />
                  <Route path="/scheduled" element={<ScheduledPage />} />
                  <Route path="/categories" element={<TaxonomyPage defaultTab="categories" />} />
                  <Route path="/tags" element={<TaxonomyPage defaultTab="tags" />} />
                  <Route path="/products" element={<TaxonomyPage defaultTab="products" />} />
                  <Route path="/channels" element={<TaxonomyPage defaultTab="channels" />} />
                  <Route path="/media" element={<MediaLibrary />} />
                  <Route path="/settings" element={<PlaceholderPage title="Pengaturan" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
