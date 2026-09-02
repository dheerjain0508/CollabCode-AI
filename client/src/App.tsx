import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import AiAssistant from './pages/AiAssistant';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/create-project" element={<CreateProject />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;