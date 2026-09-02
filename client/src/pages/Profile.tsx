import { useEffect, useState } from 'react';

type ProfileData = {
  bio: string | null;
  experienceLevel: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  profile: ProfileData | null;
  skills: {
    skill: {
      id: string;
      name: string;
    };
    level: string | null;
  }[];
};

function Profile() {
  const [user, setUser] = useState<User | null>(null);

  const [bio, setBio] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('BEGINNER');
  const [addingSkill, setAddingSkill] = useState(false);
  useEffect(() => {
    async function fetchProfile() {
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

        const userId = sessionData.user.id;

        const response = await fetch(
          `http://localhost:3000/users/${userId}`,
          {
            credentials: 'include',
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data: User = await response.json();

        setUser(data);

        setBio(data.profile?.bio ?? '');
        setExperienceLevel(
          data.profile?.experienceLevel ?? '',
        );
        setGithubUrl(data.profile?.githubUrl ?? '');
        setPortfolioUrl(data.profile?.portfolioUrl ?? '');
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

    fetchProfile();
  }, []);

  async function handleSubmit(event: any) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (bio.length > 500) {
      setError('Bio must be 500 characters or less.');
      return;
    }

    try {
      setSaving(true);

      if (!user) {
        throw new Error('User not found');
      }

      const response = await fetch(
        `http://localhost:3000/users/${user.id}/profile`,
        {
          method: 'PATCH',
          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            bio: bio || null,
            experienceLevel: experienceLevel || null,
            githubUrl: githubUrl || null,
            portfolioUrl: portfolioUrl || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update profile',
        );
      }

      setMessage('Profile updated successfully!');

      setUser((currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        return {
          ...currentUser,
          profile: data,
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
      );
    } finally {
      setSaving(false);
    }
  }
  async function handleAddSkill(event: any) {
  event.preventDefault();

  setError('');
  setMessage('');

  if (!skillName.trim()) {
    setError('Skill name is required.');
    return;
  }

  if (!user) {
    setError('User not found.');
    return;
  }

  try {
    setAddingSkill(true);

    const response = await fetch(
      `http://localhost:3000/users/${user.id}/skills`,
      {
        method: 'POST',

        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: skillName.trim(),
          level: skillLevel,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to add skill',
      );
    }

    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const existingSkillIndex =
        currentUser.skills.findIndex(
          (item) => item.skill.id === data.skill.id,
        );

      if (existingSkillIndex !== -1) {
        const updatedSkills = [...currentUser.skills];

        updatedSkills[existingSkillIndex] = data;

        return {
          ...currentUser,
          skills: updatedSkills,
        };
      }

      return {
        ...currentUser,
        skills: [...currentUser.skills, data],
      };
    });

    setSkillName('');
    setSkillLevel('BEGINNER');

    setMessage('Skill added successfully!');
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Something went wrong',
    );
  } finally {
    setAddingSkill(false);
  }
}
  if (loading) {
    return <h1>Loading profile...</h1>;
  }

  if (error && !user) {
    return <h1>Error: {error}</h1>;
  }

  if (!user) {
    return <h1>Profile not found</h1>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      <h2>{user.name || 'Unnamed User'}</h2>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <hr />

      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Bio</label>

          <br />

          <textarea
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            placeholder="Tell other developers about yourself..."
            rows={5}
          />

          <br />

          <small>{bio.length}/500 characters</small>
        </div>

        <br />

        <div>
          <label>Experience Level</label>

          <br />

          <select
            value={experienceLevel}
            onChange={(event) =>
              setExperienceLevel(event.target.value)
            }
          >
            <option value="">Select level</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">
              Intermediate
            </option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

        <br />

        <div>
          <label>GitHub URL</label>

          <br />

          <input
            type="url"
            value={githubUrl}
            onChange={(event) =>
              setGithubUrl(event.target.value)
            }
            placeholder="https://github.com/username"
          />
        </div>

        <br />

        <div>
          <label>Portfolio URL</label>

          <br />

          <input
            type="url"
            value={portfolioUrl}
            onChange={(event) =>
              setPortfolioUrl(event.target.value)
            }
            placeholder="https://yourportfolio.com"
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
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

      <hr />

      <h2>Skills</h2>

<form onSubmit={handleAddSkill}>
  <div>
    <label>Skill Name</label>

    <br />

    <input
      type="text"
      value={skillName}
      onChange={(event) =>
        setSkillName(event.target.value)
      }
      placeholder="e.g. React"
    />
  </div>

  <br />

  <div>
    <label>Skill Level</label>

    <br />

    <select
      value={skillLevel}
      onChange={(event) =>
        setSkillLevel(event.target.value)
      }
    >
      <option value="BEGINNER">Beginner</option>
      <option value="INTERMEDIATE">
        Intermediate
      </option>
      <option value="ADVANCED">Advanced</option>
      <option value="EXPERT">Expert</option>
    </select>
  </div>

  <br />

  <button type="submit" disabled={addingSkill}>
    {addingSkill ? 'Adding...' : 'Add Skill'}
  </button>
</form>

<br />

{user.skills.length === 0 ? (
  <p>No skills added yet.</p>
) : (
  <ul>
    {user.skills.map((item) => (
      <li key={item.skill.id}>
        <strong>{item.skill.name}</strong>
        {item.level ? ` - ${item.level}` : ''}
      </li>
    ))}
  </ul>
)}

      {user.skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <ul>
          {user.skills.map((item) => (
            <li key={item.skill.id}>
              {item.skill.name}
              {item.level ? ` - ${item.level}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;