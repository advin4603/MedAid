import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DefaultLayout from "@/layouts/default.tsx";
import AddPage from "@/pages/add.tsx";
import ViewPage from "@/pages/view.tsx";
import TalkPage from "@/pages/talk.tsx";

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />} path="/">
        <Route index element={<IndexPage />} />
        <Route element={<AddPage />} path="add" />
        <Route element={<ViewPage />} path="view" />
        <Route element={<TalkPage />} path="talk" />
      </Route>
    </Routes>
  );
}

export default App;
