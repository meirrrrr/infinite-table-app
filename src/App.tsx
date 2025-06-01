import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { RecordsTable } from "./components/RecordsTables";
import { CreateRecordPage } from "./components/CreateRecord";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <BrowserRouter>
      <div className="p-6 font-sans bg-gray-50 min-h-screen">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            infinite loader table
          </h1>
          <nav className="space-x-4">
            <Link to="/">
              <Button variant="outline" className="cursor-pointer">
                Records
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="outline" className="cursor-pointer">
                Create New
              </Button>
            </Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<RecordsTable />} />
            <Route path="/create" element={<CreateRecordPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
