/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { LearningPath } from "./pages/LearningPath";
import { Lesson } from "./pages/Lesson";
import { Practice } from "./pages/Practice";
import { Analytics } from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="lessons" element={<Lesson />} />
          <Route path="practice" element={<Practice />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
