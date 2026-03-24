import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import VideoPage from "@/pages/VideoPage";
import BlogPage from "@/pages/BlogPage";
import PanduanPage from "@/pages/PanduanPage";
import FAQPage from "@/pages/FAQPage";
import ContentEditor from "@/pages/ContentEditor";
import PublishedVideos from "@/pages/PublishedVideos";
import RejectedVideos from "@/pages/RejectedVideos";
import PlaceholderPage from "@/pages/PlaceholderPage";
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
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/content/:id" element={<ContentEditor />} />
                  <Route path="/published" element={<PublishedVideos />} />
                  <Route path="/archived" element={<RejectedVideos />} />
                  <Route path="/categories" element={<PlaceholderPage title="Categories" />} />
                  <Route path="/channels" element={<PlaceholderPage title="Channels" />} />
                  <Route path="/tags" element={<PlaceholderPage title="Tags" />} />
                  <Route path="/products" element={<PlaceholderPage title="Products" />} />
                  <Route path="/media" element={<PlaceholderPage title="Media Library" />} />
                  <Route path="/drafts" element={<PlaceholderPage title="Drafts" />} />
                  <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
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
