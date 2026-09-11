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

        const myProjects = projectsData.filter(
          (project: Project & { ownerId: string }) =>
            project.ownerId === currentUserId,
        );

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
    return (
      <main className="dashboard-page">
        <p className="loading-text">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-message">
            Error: {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              COLLABCODE • DASHBOARD
            </p>

            <h1>My Dashboard</h1>

            <p className="dashboard-subtitle">
              Keep track of the projects you are building.
            </p>
          </div>

          <Link
            to="/create-project"
            className="dashboard-create-button"
          >
            Create New Project
          </Link>
        </header>

        <section className="dashboard-account">
          <span>ACCOUNT</span>
          <p>{userId}</p>
        </section>

        <section className="dashboard-project-section">
          <div className="dashboard-section-heading">
            <div>
              <span>01</span>
              <h2>My Projects</h2>
            </div>

            <p>{projects.length} project(s)</p>
          </div>

          {projects.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No projects yet.</h3>
              <p>
                Create your first project and start building
                with other developers.
              </p>

              <Link to="/create-project">
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="dashboard-projects">
              {projects.map((project) => (
                <article
                  className="dashboard-project-card"
                  key={project.id}
                >
                  <div className="project-card-top">
                    <span className="project-status">
                      {project.status}
                    </span>

                    <span className="project-team">
                      Team · {project.teamSize}
                    </span>
                  </div>

                  <h3>{project.title}</h3>

                  <p className="project-description">
                    {project.description}
                  </p>

                  <div className="project-meta">
                    <span>
                      Category:{' '}
                      {project.category || 'Not specified'}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="project-link"
                  >
                    View Project →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Dashboard;