import { useState, type FormEvent } from 'react';

function AiAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setAnswer('');

    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:3000/ai-assistant',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: question.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'AI assistant request failed',
        );
      }

      setAnswer(
        data.answer ||
          data.response ||
          data.output ||
          'The AI returned an empty response.',
      );
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
    <main className="ai-page">
      <div className="ai-container">

        {/* Header */}

        <header className="ai-header">
          <p className="ai-eyebrow">
            COLLABCODE • AI ASSISTANT
          </p>

          <h1>Build smarter.</h1>

          <p className="ai-subtitle">
            Ask questions about projects, technologies,
            collaboration, or ideas you want to turn into
            something real.
          </p>
        </header>

        {/* Assistant */}

        <section className="ai-card">
          <div className="ai-section-heading">
            <span>01</span>

            <div>
              <h2>Ask the Assistant</h2>

              <p>
                Describe what you need help with.
              </p>
            </div>
          </div>

          <form
            className="ai-form"
            onSubmit={handleSubmit}
          >
            <div className="ai-form-group">
              <label htmlFor="ai-question">
                Your Question
              </label>

              <textarea
                id="ai-question"
                rows={7}
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                placeholder="For example: What skills should I learn to build a full-stack collaboration platform?"
                disabled={loading}
              />
            </div>

            <button
              className="ai-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Thinking...'
                : 'Ask AI →'}
            </button>
          </form>

          {/* Error */}

          {error && (
            <div className="ai-message ai-error">
              <strong>AI Assistant:</strong>
              <p>{error}</p>
            </div>
          )}

          {/* Answer */}

          {answer && (
            <div className="ai-answer">
              <div className="ai-answer-header">
                <span>AI RESPONSE</span>
              </div>

              <div className="ai-answer-content">
                {answer}
              </div>
            </div>
          )}
        </section>

        {/* Suggested Questions */}

        <section className="ai-suggestions">
          <div className="ai-suggestions-heading">
            <span>02</span>

            <div>
              <h2>Try asking</h2>

              <p>
                Start with one of these prompts.
              </p>
            </div>
          </div>

          <div className="ai-suggestion-grid">
            <button
              type="button"
              onClick={() =>
                setQuestion(
                  'What skills are important for a full-stack developer?',
                )
              }
            >
              <span>01</span>
              <strong>Full-stack skills</strong>
              <p>
                What should a full-stack developer learn?
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setQuestion(
                  'How should I structure a team for a software project?',
                )
              }
            >
              <span>02</span>
              <strong>Build a team</strong>
              <p>
                How should I structure a project team?
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setQuestion(
                  'What technology stack would be suitable for a collaborative web application?',
                )
              }
            >
              <span>03</span>
              <strong>Choose a stack</strong>
              <p>
                What stack should I use for my project?
              </p>
            </button>
          </div>
        </section>

        {/* Footer Note */}

        <div className="ai-note">
          <span>COLLABCODE AI</span>

          <p>
            AI-generated suggestions should be reviewed
            before making important technical decisions.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AiAssistant;