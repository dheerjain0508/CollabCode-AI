import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  teamSize: number;
  status: string;
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Real-time project updates
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('projectUpdated', (data) => {
      console.log('Real-time project update:', data);

      setProjects((currentProjects) => {
        if (data.type !== 'PROJECT_CREATED') {
          return currentProjects;
        }

        const newProject = data.project;

        const alreadyExists = currentProjects.some(
          (project) => project.id === newProject.id,
        );

        if (alreadyExists) {
          return currentProjects;
        }

        return [newProject, ...currentProjects];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Initial project fetch
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          'http://localhost:3000/projects',
        );

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
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

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <main className="projects-page">
        <div className="projects-container">
          <p className="projects-eyebrow">
            COLLABCODE • PROJECTS
          </p>

          <h1>Projects</h1>

          <p className="projects-subtitle">
            Discover projects and find your next team.
          </p>

          <p className="loading-text">
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="projects-page">
        <div className="projects-container">
          <p className="projects-eyebrow">
            COLLABCODE • PROJECTS
          </p>

          <h1>Projects</h1>

          <div className="projects-error">
            Error: {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="projects-page">
      <div className="projects-container">

        <header className="projects-header">
          <p className="projects-eyebrow">
            COLLABCODE • PROJECTS
          </p>

          <h1>Find something worth building.</h1>

          <p className="projects-subtitle">
            Discover interesting projects, meet developers,
            and build something great together.
          </p>
        </header>

        <div className="projects-toolbar">
          <input
            className="projects-search"
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <span className="projects-count">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="projects-empty">
            <span>00</span>

            <h2>No projects found</h2>

            <p>
              Try searching for something else.
            </p>

            {search && (
              <button
                className="projects-clear"
                onClick={() => setSearch('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <article
                className="projects-card"
                key={project.id}
              >
                <div className="projects-card-top">
                  <span className="projects-category">
                    {project.category || 'General'}
                  </span>

                  <span className="projects-status">
                    {project.status}
                  </span>
                </div>

                <h2>{project.title}</h2>

                <p className="projects-description">
                  {project.description}
                </p>

                <div className="projects-meta">
                  <span>
                    Team size · {project.teamSize}
                  </span>

                  <span>
                    Looking for teammates
                  </span>
                </div>

                <Link
                  className="projects-view"
                  to={`/projects/${project.id}`}
                >
                  View Details →
                </Link>
              </article>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default Projects;