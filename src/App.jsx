import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import DocumentLibrary from "./pages/DocumentLibrary";
import ContentCalendar from "./pages/ContentCalendar";
import FollowUpCRM from "./pages/FollowUpCRM";
import TeamWorkspace from "./pages/TeamWorkspace";
import KPIDashboard from "./pages/KPIDashboard";
import CityCampaign from "./pages/CityCampaign";
import Donations from "./pages/Donations";
import RequestBibleStudy from "./pages/RequestBibleStudy";
import Profile from "./pages/Profile";
import AdminConsole from "./pages/AdminConsole";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/give" element={<Donations />} />
              <Route path="/request-study" element={<RequestBibleStudy />} />
              <Route path="/documents" element={<DocumentLibrary />} />
              <Route path="/content" element={<ProtectedRoute allowRoles={["admin", "director", "team"]}><ContentCalendar /></ProtectedRoute>} />
              <Route path="/followup" element={<ProtectedRoute allowRoles={["admin", "director", "bible_worker", "digital_missionary"]}><FollowUpCRM /></ProtectedRoute>} />
              <Route path="/workspace" element={<ProtectedRoute><TeamWorkspace /></ProtectedRoute>} />
              <Route path="/kpi" element={<ProtectedRoute allowRoles={["admin", "director", "team"]}><KPIDashboard /></ProtectedRoute>} />
              <Route path="/campaign" element={<ProtectedRoute allowRoles={["admin", "director"]}><CityCampaign /></ProtectedRoute>} />
              <Route path="/donations" element={<ProtectedRoute allowRoles={["admin", "director"]}><Donations /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowRoles={["admin", "director"]}><AdminConsole /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
