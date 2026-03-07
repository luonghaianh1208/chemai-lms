/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { LearningPath } from "./pages/LearningPath";
import { Lesson } from "./pages/Lesson";
import { Practice } from "./pages/Practice";
import { Analytics } from "./pages/Analytics";
import { RoleStorage } from "./lib/roleStorage";

export default function App() {
  const role = RoleStorage.getRole();
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard — role-specific */}
          <Route index element={isTeacher ? <TeacherDashboard /> : <Dashboard />} />

          {/* Student-only routes — redirect teachers to their dashboard (U6) */}
          <Route path="learning-path" element={isStudent ? <LearningPath /> : <Navigate to="/" replace />} />
          <Route path="lessons"       element={isStudent ? <Lesson />       : <Navigate to="/" replace />} />
          <Route path="practice"      element={isStudent ? <Practice />      : <Navigate to="/" replace />} />
          <Route path="analytics"     element={isStudent ? <Analytics />     : <Navigate to="/" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
