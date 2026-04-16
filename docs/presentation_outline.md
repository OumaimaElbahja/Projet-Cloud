# Presentation Outline: Cloud Search Engine Application

**(Target Time: 5-10 Minutes)**

## Slide 1: Title Slide

- **Title**: Cloud Search Engine Web Application
- **Subtitle**: Full-Stack Implementation & Deployment
- Your Name / Course Info

## Slide 2: Project Overview & Objectives

- **Core Goal**: Build a functional, cloud-deployed search engine.
- **Key Requirements met**: Keyword search, remote database, public access.
- **Bonus Features**: Pagination, Category Filtering, Sorting, Autocomplete Suggestions.

## Slide 3: Architecture & Tech Stack

- **Frontend**: React + Vite (Fast compilation, modular components).
- **Backend**: Node.js + Express (RESTful API, secure middleware).
- **Database**: MongoDB Atlas (NoSQL, flexible schema).
- **Cloud Providers**: Render (Backend) + Vercel (Frontend).

## Slide 4: The Search Mechanism (Deep Dive)

- Explain the MongoDB `$text` Index.
- Show code snippet of the weighted index (Title = 10, Desc = 1).
- Explain Relevance Scoring (`$meta: "textScore"`) and how it differs from simple string `includes()`.

## Slide 5: Performance & Security

- **Debouncing**: Why we delay API requests by 400ms (saves bandwidth, prevents API spam).
- **Pagination**: Loading 150+ items at once is slow; pagination fixes this.
- **Security Middleware**: Brief mention of `helmet` and `express-rate-limit`.

## Slide 6: Live Demo

- **Showcase 1**: Type "Laptop" and see autocomplete suggestions.
- **Showcase 2**: Hit enter to see exact matches ordered by relevance.
- **Showcase 3**: Filter by "Electronics" and sort by "Price: Low to High".
- **Showcase 4**: Click "Next Page" to demonstrate server-side pagination.

## Slide 7: Cloud Deployment Workflow

- **Database**: Creating the Atlas Cluster & Whitelisting IPs.
- **Backend**: Binding Render to GitHub and injecting `MONGO_URI`.
- **Frontend**: Binding Vercel to GitHub and targeting the `/frontend` root with `VITE_API_URL`.

## Slide 8: Challenges Faced & Lessons Learned

- Handling asynchronous state in React (Loading skeletons).
- Overcoming MongoDB Atlas free-tier limitations.
- Understanding CORS between Vercel and Render.

## Slide 9: Q&A

- Open the floor for questions from the professor/classmates.
