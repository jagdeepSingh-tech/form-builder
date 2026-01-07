import React from "react";
import "./FormMeta.css";

export default function FormMeta({
  title,
  description,
  onChangeTitle,
  onChangeDescription,
}) {
  return (
    <section className="form-meta">
      <div className="form-meta__content">
        <div className="form-meta__field">
          <label className="form-meta__label" htmlFor="form-title">
            Form title
          </label>
          <input
            id="form-title"
            type="text"
            className="form-meta__input"
            placeholder="Untitled form"
            value={title}
            onChange={(event) => onChangeTitle(event.target.value)}
          />
        </div>

        <div className="form-meta__field">
          <label className="form-meta__label" htmlFor="form-description">
            Description
          </label>
          <textarea
            id="form-description"
            className="form-meta__textarea"
            placeholder="Describe what this form is used for"
            rows={2}
            value={description}
            onChange={(event) => onChangeDescription(event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}


