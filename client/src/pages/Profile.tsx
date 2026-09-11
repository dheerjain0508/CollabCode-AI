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
        setExperienceLevel(data.profile?.experienceLevel ?? '');
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

  async function handleAddSkill(
    event: React.FormEvent<HTMLFormElement>,
  ) {
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
    return (
      <main className="profile-page">
        <p className="loading-text">Loading profile...</p>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="profile-page">
        <div className="profile-message error">
          Error: {error}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-message">
          Profile not found
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <header className="profile-header">
          <p className="profile-eyebrow">
            COLLABCODE • DEVELOPER PROFILE
          </p>

          <h1>My Profile</h1>

          <p className="profile-subtitle">
            Manage your developer information, experience,
            and skills.
          </p>
        </header>

        <section className="profile-card profile-overview">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase() || '?'}
          </div>

          <div>
            <h2>{user.name || 'Unnamed User'}</h2>
            <p>{user.email}</p>
          </div>
        </section>

        <section className="profile-card">
          <div className="section-heading">
            <span>01</span>
            <div>
              <h2>Profile Information</h2>
              <p>Tell other developers a little about yourself.</p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="bio">Bio</label>

              <textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                placeholder="Tell other developers about yourself..."
                rows={5}
              />

              <small>{bio.length}/500 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="experience">
                Experience Level
              </label>

              <select
                id="experience"
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

            <div className="form-group">
              <label htmlFor="github">GitHub URL</label>

              <input
                id="github"
                type="url"
                value={githubUrl}
                onChange={(event) =>
                  setGithubUrl(event.target.value)
                }
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">
                Portfolio URL
              </label>

              <input
                id="portfolio"
                type="url"
                value={portfolioUrl}
                onChange={(event) =>
                  setPortfolioUrl(event.target.value)
                }
                placeholder="https://yourportfolio.com"
              />
            </div>

            <button
              className="profile-button"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </section>

        <section className="profile-card">
          <div className="section-heading">
            <span>02</span>
            <div>
              <h2>Skills</h2>
              <p>Add the technologies you work with.</p>
            </div>
          </div>

          <form
            className="skill-form"
            onSubmit={handleAddSkill}
          >
            <div className="form-group">
              <label htmlFor="skillName">
                Skill Name
              </label>

              <input
                id="skillName"
                type="text"
                value={skillName}
                onChange={(event) =>
                  setSkillName(event.target.value)
                }
                placeholder="e.g. React"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skillLevel">
                Skill Level
              </label>

              <select
                id="skillLevel"
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

            <button
              className="profile-button"
              type="submit"
              disabled={addingSkill}
            >
              {addingSkill ? 'Adding...' : 'Add Skill'}
            </button>
          </form>

          <div className="skills-list">
            {user.skills.length === 0 ? (
              <p className="empty-skills">
                No skills added yet.
              </p>
            ) : (
              user.skills.map((item) => (
                <div
                  className="skill-item"
                  key={item.skill.id}
                >
                  <strong>{item.skill.name}</strong>
                  <span>
                    {item.level || 'Not specified'}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {(message || error) && (
          <div
            className={`profile-message ${
              error ? 'error' : 'success'
            }`}
          >
            {error || message}
          </div>
        )}

      </div>
    </main>
  );
}

export default Profile;