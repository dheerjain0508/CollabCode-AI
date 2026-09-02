import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string | null;
  status: string;
  teamSize: number;
}

function Dashboard() {
  const [userId, setUserId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError('');

        // Get the currently logged-in user
        const sessionResponse = await fetch(
          'http://localhost:3000/api/auth/get-session',
          {
            credentials: 'include',
          },
        );

        const sessionData = await sessionResponse.json();

        if (!sessionResponse.ok || !sessionData.user) {
          throw new Error('You are not logged in');
        }

        const currentUserId = sessionData.user.id;

        setUserId(currentUserId);

        // Get all projects
        const projectsResponse = await fetch(
          'http://localhost:3000/projects',
          {
            credentials: 'include',
          },
        );

        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }

        const projectsData = await projectsResponse.json();

        // Keep only projects created by the logged-in user
        console.log('Current User ID:', currentUserId);
            console.log('All Projects:', projectsData);

            const myProjects = projectsData.filter(
                (project: any) => project.ownerId === currentUserId,
                );

console.log('My Projects:', myProjects);

setProjects(myProjects);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading dashboard...</p>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div>
      <h1>My Dashboard</h1>

      <p>
        Logged in as: <strong>{userId}</strong>
      </p>

      <Link to="/create-project">
        <button>Create New Project</button>
      </Link>

      <h2>My Projects</h2>

      {projects.length === 0 ? (
        <p>You have not created any projects yet.</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                border: '1px solid black',
                padding: '15px',
                marginTop: '10px',
              }}
            >
              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <p>
                <strong>Category:</strong>{' '}
                {project.category || 'Not specified'}
              </p>

              <p>
                <strong>Status:</strong> {project.status}
              </p>

              <p>
                <strong>Team Size:</strong> {project.teamSize}
              </p>

              <Link to={`/projects/${project.id}`}>
                View Project
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;