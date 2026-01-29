const { useState } = React;

export function EventRSVPForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [dietary, setDietary] = useState("");
  const [guests, setGuests] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleReset() {
    setName("");
    setEmail("");
    setAttendees(1);
    setDietary("");
    setGuests(false);
    setSubmitted(false);
  }

  return (
    <div className="container">
      <h1 className="title">Event RSVP</h1>
      
      <form onSubmit={handleSubmit} className="rsvp-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="attendees" className="form-label">Number of attendees:</label>
          <input
            id="attendees"
            type="number"
            required
            min="1"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dietary" className="form-label">Dietary preferences (optional):</label>
          <input
            id="dietary"
            type="text"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="form-input"
            placeholder="e.g., Vegetarian, Gluten-free"
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={guests}
              onChange={(e) => setGuests(e.target.checked)}
              className="checkbox-input"
            />
            Bringing additional guests
          </label>
        </div>

        <button type="submit" className="submit-btn">Submit RSVP</button>
      </form>

      {submitted && (
        <div className="confirmation">
          <h2 className="confirmation-title">RSVP Submitted!</h2>
          <div className="confirmation-details">
            <p><span>Name:</span> {name}</p>
            <p><span>Email:</span> {email}</p>
            <p><span>Number of attendees:</span> {attendees}</p>
            <p><span>Dietary preferences:</span> {dietary || "None"}</p>
            <p><span>Bringing additional guests:</span> {guests ? "Yes" : "No"}</p>
          </div>
          <button onClick={handleReset} className="reset-btn">Submit Another RSVP</button>
        </div>
      )}
    </div>
  );
}