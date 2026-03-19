import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import VideoInbox from "@/pages/VideoInbox";
import VideoReview from "@/pages/VideoReview";
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
                  <Route path="/inbox" element={<VideoInbox />} />
                  <Route path="/inbox/:id" element={<VideoReview />} />
                  <Route path="/published" element={<PublishedVideos />} />
                  <Route path="/rejected" element={<RejectedVideos />} />
                  <Route path="/categories" element={<PlaceholderPage title="Categories" />} />
                  <Route path="/channels" element={<PlaceholderPage title="Channels" />} />
                  <Route path="/tags" element={<PlaceholderPage title="Tags" />} />
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
