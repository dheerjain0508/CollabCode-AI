function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-eyebrow">COLLABCODE • DEVELOPER COMMUNITY</p>

        <h1>
          Build together.
          <br />
          Find your people.
        </h1>

        <p className="home-description">
          CollabCode helps developers discover projects, find teammates,
          and turn ideas into real products.
        </p>

        <div className="home-actions">
          <a href="/projects" className="home-button primary">
            Explore Projects
          </a>

          <a href="/create-project" className="home-button secondary">
            Create a Project
          </a>
        </div>
      </section>

      <section className="home-features">
        <article>
          <span>01</span>
          <h2>Discover</h2>
          <p>
            Explore projects that match your interests, skills, and
            ambitions.
          </p>
        </article>

        <article>
          <span>02</span>
          <h2>Collaborate</h2>
          <p>
            Connect with developers and build meaningful projects
            together.
          </p>
        </article>

        <article>
          <span>03</span>
          <h2>Build</h2>
          <p>
            Turn ideas into working products with the right team around
            you.
          </p>
        </article>
      </section>

      <section className="home-bottom">
        <div>
          <strong>Projects</strong>
          <p>Find ideas worth building.</p>
        </div>

        <div>
          <strong>Developers</strong>
          <p>Meet people who build.</p>
        </div>

        <div>
          <strong>AI Assistant</strong>
          <p>Get smarter project insights.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;