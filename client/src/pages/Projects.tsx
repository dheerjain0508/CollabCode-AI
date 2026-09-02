import { useEffect, useState } from 'react';
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

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://localhost:3000/projects');

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
    project.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <main className="page">
        <div className="page-header">
          <h1>Projects</h1>
          <p>Discover projects and find your next team.</p>
        </div>

        <div className="empty-state">
          <p>Loading projects...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <div className="page-header">
          <h1>Projects</h1>
        </div>

        <div className="error">
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="page">

      {/* ---------- Header ---------- */}

      <header className="page-header">
        <div className="section-label">
          COLLABORATE
        </div>

        <h1>Projects</h1>

        <p>
          Discover interesting projects, meet developers,
          and build something great together.
        </p>
      </header>

      {/* ---------- Search ---------- */}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* ---------- Projects ---------- */}

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects found</h2>

          <p>
            Try searching for something else.
          </p>

          {search && (
            <button
              className="btn btn-secondary"
              onClick={() => setSearch('')}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-2">

          {filteredProjects.map((project) => (
            <article
              className="card project-card"
              key={project.id}
            >

              {/* Project title + status */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '20px',
                }}
              >
                <h2>{project.title}</h2>

                <span className="badge badge-success">
                  {project.status}
                </span>
              </div>

              {/* Description */}

              <p>
                {project.description}
              </p>

              {/* Project information */}

              <div className="project-meta">

                <span>
                  {project.category ?? 'General'}
                </span>

                <span>•</span>

                <span>
                  Team size · {project.teamSize}
                </span>

              </div>

              {/* Footer */}

              <div className="project-footer">

                <span className="muted">
                  Looking for teammates
                </span>

                <Link
                  className="btn btn-primary"
                  to={`/projects/${project.id}`}
                >
                  View Details →
                </Link>

              </div>

            </article>
          ))}

        </div>
      )}

    </main>
  );
}

export default Projects;