import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';

type Skill = {
  skill: {
    id: string;
    name: string;
  };
};

type Application = {
  id: string;
  message: string | null;
  status: string;
  createdAt: string;
  applicant: {
    id: string;
    name: string | null;
    email: string;
  };
};

type Project = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  teamSize: number;
  status: string;

  owner: {
    id: string;
    name: string | null;
    email: string;
  };

  requiredSkills: Skill[];
  applications: Application[];
};

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [userId, setUserId] = useState('');

  const [applicationMessage, setApplicationMessage] = useState('');
  const [applying, setApplying] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');

  useEffect(() => {
    async function fetchProject() {
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

        setUserId(sessionData.user.id);

        const response = await fetch(
          `http://localhost:3000/projects/${id}`,
          {
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();

        setProject(data);
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

    fetchProject();
  }, [id]);

  async function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setApplicationStatus('');
    setError('');

    if (!applicationMessage.trim()) {
      setApplicationStatus(
        'Please write a message before applying.',
      );
      return;
    }

    if (!userId) {
      setApplicationStatus(
        'You must be logged in to apply.',
      );
      return;
    }

    if (!project) {
      return;
    }

    if (project.owner.id === userId) {
      setApplicationStatus(
        'You cannot apply to your own project.',
      );
      return;
    }

    try {
      setApplying(true);

      const response = await fetch(
        `http://localhost:3000/users/${userId}/projects/${project.id}/apply`,
        {
          method: 'POST',
          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: applicationMessage.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to apply to project',
        );
      }

      setApplicationMessage('');

      setApplicationStatus(
        'Application submitted successfully!',
      );

      setProject((currentProject) => {
        if (!currentProject) {
          return currentProject;
        }

        return {
          ...currentProject,
          applications: [
            ...currentProject.applications,
            {
              ...data,
              applicant: {
                id: userId,
                name: 'You',
                email: '',
              },
            },
          ],
        };
      });
    } catch (err) {
      setApplicationStatus(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
      );
    } finally {
      setApplying(false);
    }
  }

  async function handleApplicationStatus(
    applicationId: string,
    status: string,
  ) {
    try {
      setError('');

      const response = await fetch(
        `http://localhost:3000/applications/${applicationId}`,
        {
          method: 'PATCH',
          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update application',
        );
      }

      setProject((currentProject) => {
        if (!currentProject) {
          return currentProject;
        }

        return {
          ...currentProject,
          applications:
            currentProject.applications.map(
              (application) =>
                application.id === applicationId
                  ? {
                      ...application,
                      status: data.status,
                    }
                  : application,
            ),
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
      );
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="empty-state">
          <p>Loading project...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <div className="error">
          Error: {error}
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="page">
        <div className="empty-state">
          <h2>Project not found</h2>
          <Link
            to="/projects"
            className="btn btn-primary"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = project.owner.id === userId;

  return (
    <main className="page">

      {/* ---------- Back ---------- */}

      <div style={{ marginBottom: '32px' }}>
        <Link
          to="/projects"
          className="muted"
          style={{ fontSize: '14px' }}
        >
          ← Back to Projects
        </Link>
      </div>

      {/* ---------- Project Header ---------- */}

      <section className="card">

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="section-label">
              PROJECT
            </div>

            <h1 style={{ marginBottom: '20px' }}>
              {project.title}
            </h1>

            <p
              style={{
                maxWidth: '750px',
                margin: 0,
                color: 'var(--muted)',
                fontSize: '17px',
              }}
            >
              {project.description}
            </p>
          </div>

          <span className="badge badge-success">
            {project.status}
          </span>
        </div>

        {/* Project information */}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '35px',
            marginTop: '40px',
            paddingTop: '25px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div>
            <span className="muted">
              Category
            </span>

            <strong
              style={{
                display: 'block',
                marginTop: '5px',
              }}
            >
              {project.category ?? 'Not specified'}
            </strong>
          </div>

          <div>
            <span className="muted">
              Team Size
            </span>

            <strong
              style={{
                display: 'block',
                marginTop: '5px',
              }}
            >
              {project.teamSize}
            </strong>
          </div>

          <div>
            <span className="muted">
              Status
            </span>

            <strong
              style={{
                display: 'block',
                marginTop: '5px',
              }}
            >
              {project.status}
            </strong>
          </div>
        </div>

      </section>

      {/* ---------- Two Column Content ---------- */}

      <div
        className="grid grid-2"
        style={{ marginTop: '24px' }}
      >

        {/* ---------- Owner ---------- */}

        <section className="card">

          <div className="section-label">
            PROJECT OWNER
          </div>

          <h2>Owner</h2>

          <p>
            <strong>
              {project.owner.name ?? 'Unknown'}
            </strong>
          </p>

          <p className="muted">
            {project.owner.email}
          </p>

        </section>

        {/* ---------- Skills ---------- */}

        <section className="card">

          <div className="section-label">
            REQUIREMENTS
          </div>

          <h2>Required Skills</h2>

          {project.requiredSkills.length === 0 ? (
            <p className="muted">
              No skills specified.
            </p>
          ) : (
            <div className="skills-list">
              {project.requiredSkills.map((item) => (
                <span
                  className="skill"
                  key={item.skill.id}
                >
                  {item.skill.name}
                </span>
              ))}
            </div>
          )}

        </section>

      </div>

      {/* ---------- Apply ---------- */}

      {!isOwner && (
        <section
          className="card"
          style={{ marginTop: '24px' }}
        >

          <div className="section-label">
            JOIN THE PROJECT
          </div>

          <h2>Apply to this Project</h2>

          <p className="muted">
            Tell the project owner why you'd be
            a good fit for the team.
          </p>

          <form
            className="form"
            onSubmit={handleApply}
            style={{ marginTop: '28px' }}
          >

            <div className="form-group">

              <label htmlFor="application-message">
                Message
              </label>

              <textarea
                id="application-message"
                value={applicationMessage}
                onChange={(event) =>
                  setApplicationMessage(
                    event.target.value,
                  )
                }
                placeholder="Tell the project owner why you'd be a good fit..."
                rows={6}
              />

            </div>

            <div>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={applying}
              >
                {applying
                  ? 'Applying...'
                  : 'Apply to Project →'}
              </button>
            </div>

          </form>

          {applicationStatus && (
            <div
              className={
                applicationStatus.includes(
                  'successfully',
                )
                  ? 'success'
                  : 'error'
              }
              style={{ marginTop: '20px' }}
            >
              {applicationStatus}
            </div>
          )}

        </section>
      )}

      {/* ---------- Applications ---------- */}

      {isOwner && (
        <section
          style={{ marginTop: '70px' }}
        >

          <div className="page-header">
            <div className="section-label">
              TEAM MANAGEMENT
            </div>

            <h2>Applications</h2>

            <p>
              Review developers who want to join
              your project.
            </p>
          </div>

          {project.applications.length === 0 ? (
            <div className="empty-state">
              <h2>No applications yet</h2>

              <p>
                Applications from developers will
                appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-2">

              {project.applications.map(
                (application) => (
                  <article
                    className="card"
                    key={application.id}
                  >

                    {/* Applicant */}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '15px',
                      }}
                    >

                      <div>
                        <h3
                          style={{
                            marginBottom: '5px',
                            fontSize: '20px',
                          }}
                        >
                          {application.applicant.name ??
                            'Unknown'}
                        </h3>

                        <p
                          className="muted"
                          style={{ margin: 0 }}
                        >
                          {application.applicant.email}
                        </p>
                      </div>

                      <span
                        className={
                          application.status ===
                          'ACCEPTED'
                            ? 'badge badge-success'
                            : application.status ===
                                'REJECTED'
                              ? 'badge badge-warning'
                              : 'badge badge-primary'
                        }
                      >
                        {application.status}
                      </span>

                    </div>

                    {/* Message */}

                    <div
                      style={{
                        marginTop: '25px',
                        paddingTop: '20px',
                        borderTop:
                          '1px solid var(--border)',
                      }}
                    >
                      <span className="muted">
                        Application message
                      </span>

                      <p>
                        {application.message ||
                          'No message provided.'}
                      </p>
                    </div>

                    {/* Actions */}

                    {application.status ===
                      'PENDING' && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '20px',
                        }}
                      >

                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleApplicationStatus(
                              application.id,
                              'ACCEPTED',
                            )
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleApplicationStatus(
                              application.id,
                              'REJECTED',
                            )
                          }
                        >
                          Reject
                        </button>

                      </div>
                    )}

                  </article>
                ),
              )}

            </div>
          )}

        </section>
      )}

    </main>
  );
}

export default ProjectDetails;