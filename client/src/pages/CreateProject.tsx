import { useEffect, useState, type FormEvent } from 'react';

function CreateProject() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [teamSize, setTeamSize] = useState(2);
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function getSession() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/auth/get-session',
          {
            credentials: 'include',
          },
        );

        const data = await response.json();

        if (!response.ok || !data.user) {
          throw new Error('You are not logged in');
        }

        setUserId(data.user.id);
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    }

    getSession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }

    if (teamSize < 1) {
      setError('Team size must be at least 1.');
      return;
    }

    if (!userId) {
      setError('You must be logged in to create a project.');
      return;
    }

    const requiredSkills = skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3000/users/${userId}/projects`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category: category.trim() || null,
            teamSize,
            requiredSkills,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create project',
        );
      }

      setMessage(
        `Project "${data.title}" created successfully!`,
      );

      setTitle('');
      setDescription('');
      setCategory('');
      setTeamSize(2);
      setSkills('');
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

  return (
    <main className="create-project-page">
      <div className="create-project-container">

        {/* Header */}

        <header className="create-project-header">
          <p className="create-project-eyebrow">
            COLLABCODE • PROJECTS
          </p>

          <h1>Create a Project</h1>

          <p className="create-project-subtitle">
            Turn an idea into something real. Define your
            project, find the right skills, and build a team.
          </p>
        </header>

        {/* Form */}

        <section className="create-project-card">
          <div className="create-project-section-heading">
            <span>01</span>

            <div>
              <h2>Project Details</h2>

              <p>
                Tell developers what you are building.
              </p>
            </div>
          </div>

          <form
            className="create-project-form"
            onSubmit={handleSubmit}
          >
            {/* Project Title */}

            <div className="create-form-group">
              <label htmlFor="project-title">
                Project Title
              </label>

              <input
                id="project-title"
                type="text"
                placeholder="e.g. CollabCode"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            {/* Description */}

            <div className="create-form-group">
              <label htmlFor="project-description">
                Description
              </label>

              <textarea
                id="project-description"
                rows={7}
                placeholder="Describe what you want to build, the problem it solves, and what you hope to achieve..."
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            {/* Category + Team Size */}

            <div className="create-project-two-column">
              <div className="create-form-group">
                <label htmlFor="project-category">
                  Category
                </label>

                <input
                  id="project-category"
                  type="text"
                  placeholder="e.g. Web Development"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                />
              </div>

              <div className="create-form-group">
                <label htmlFor="team-size">
                  Team Size
                </label>

                <input
                  id="team-size"
                  type="number"
                  min="1"
                  value={teamSize}
                  onChange={(event) =>
                    setTeamSize(Number(event.target.value))
                  }
                />

                <small>
                  Number of people you want on the team.
                </small>
              </div>
            </div>

            {/* Skills */}

            <div className="create-form-group">
              <label htmlFor="required-skills">
                Required Skills
              </label>

              <input
                id="required-skills"
                type="text"
                placeholder="React, TypeScript, Node.js"
                value={skills}
                onChange={(event) =>
                  setSkills(event.target.value)
                }
              />

              <small>
                Separate skills with commas.
              </small>
            </div>

            {/* Submit */}

            <div className="create-project-submit">
              <button
                className="create-project-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Creating Project...'
                  : 'Create Project →'}
              </button>
            </div>
          </form>

          {/* Messages */}

          {message && (
            <div className="create-project-message success">
              <strong>{message}</strong>
            </div>
          )}

          {error && (
            <div className="create-project-message error">
              <strong>Error: {error}</strong>
            </div>
          )}
        </section>

        {/* Small footer note */}

        <div className="create-project-note">
          <span>COLLABCODE</span>
          <p>
            Projects are better when the right people build them together.
          </p>
        </div>
      </div>
    </main>
  );
}

export default CreateProject;