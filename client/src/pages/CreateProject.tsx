import { useState } from 'react';
import { useEffect } from 'react';
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
 async function handleSubmit(event: any) {
    event.preventDefault();

    setError('');
    setMessage('');

    // Basic validation
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
      title,
      description,
      category: category || null,
      teamSize,
      requiredSkills,
    }),
  },
);

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || 'Failed to create project',
        );
      }

      const project = await response.json();

      setMessage(
        `Project "${project.title}" created successfully!`,
      );

      // Clear form
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
    <div>
      <h1>Create Project</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Title</label>

          <br />

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Description</label>

          <br />

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Category</label>

          <br />

          <input
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Team Size</label>

          <br />

          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(event) =>
              setTeamSize(Number(event.target.value))
            }
          />
        </div>

        <br />

        <div>
          <label>
            Required Skills
            <br />
            <small>Separate skills with commas</small>
          </label>

          <br />

          <input
            type="text"
            placeholder="React, TypeScript, Node.js"
            value={skills}
            onChange={(event) =>
              setSkills(event.target.value)
            }
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {error && (
        <p>
          <strong>Error: {error}</strong>
        </p>
      )}
    </div>
  );
}

export default CreateProject;