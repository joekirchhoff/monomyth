# Monomyth

Monomyth is a full-stack short fiction platform. This project seeks to create a cleaner, less distracting reading and writing experience, while also featuring robust tools specific to short fiction, such as genre tagging and sorting.

## Live Demo

[monomyth.netlify.app](https://monomyth.netlify.app/)

A Guest account is available for demonstration purposes. Please feel free to explore.

## Key Features

- Read, create, edit, and delete stories in a custom rich text editor
- Like and comment on stories
- Sort stories and comments by time and score
- Filter stories by genre and genre combinations
- Search story titles and text using fuzzy search
- Curate a user profile, showcasing your collected works alongside a bio and personal links

## Technology

### Front End

- Client built using [React](https://reactjs.org/)
- Client routing handled through [React Router](https://v5.reactrouter.com/web/guides/quick-start)
- Extensive use of [styled-components](https://styled-components.com/), as well as a global ThemeProvider to centralize common CSS values. This made for a very "flat," modularized development process, while also creating a central compendium of style variables such as color and font.
- Custom rich text editor developed using the [Draft.js](https://draftjs.org/) framework. This allowed for a lightweight, extensible editor that can evolve alongside the needs of the app.

### Back End

- API built using [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/)
- Non-relational database built with [MongoDB](https://www.mongodb.com/)
- Email and password authentication powered by [Passport](https://www.passportjs.org/)
- Sessions managed using [express-session](https://www.npmjs.com/package/express-session)
- Form data validated and sanitized through [express-validator](https://express-validator.github.io/docs/)
- User passwords hashed and salted using [bcrypt](https://www.npmjs.com/package/bcrypt)
- Fuzzy search powered by [MongoDB Atlas Search](https://www.mongodb.com/docs/atlas/atlas-search/)

## Planned Features

- Expanded authentication strategies
- Nested comments
- User-defined themes / "day mode." The app was designed with expanded themes in mind, so all colors and shared CSS values are managed within a styled-components ThemeProvider
- Additional genres, including subgenres. The genres are managed as database documents, allowing for easy expansion and edits.
- "Mythos" models, connecting stories from different authors that share a literary universe

## Misc.

### Etymology

The term "Monomyth" is a synonym for the "Hero's Journey," a story pattern popularized by comparative mythologist [Joseph Campbell](https://en.wikipedia.org/wiki/Joseph_Campbell). This pattern can be applied to countless stories with striking accuracy, ranging from ancient myths to modern movies, suggesting a universal storytelling language that transcends time, culture, and medium. It has also been reverse-engineered to [moderate success](https://en.wikipedia.org/wiki/Star_Wars_(film)).

### Developer Portfolio

[joekirchhoff.com](https://joekirchhoff.com)