# Cloud Computing Project Report: Search Engine Web Application

## 1. Executive Summary

This report details the design, implementation, and deployment of a full-stack, cloud-hosted Search Engine Web Application. Developed to meet academic requirements, the project demonstrates proficiency in cloud computing, database indexing, RESTful API design, and modern frontend architecture.

## 2. Architecture & Tech Stack

The project adheres to a robust, scalable Client-Server architecture deployed across free-tier cloud providers.

- **Frontend**: React + Vite + TypeScript. Deployed on **Vercel** for global CDN delivery, optimal caching, and CI/CD integration.
- **Backend**: Node.js + Express. Deployed on **Render**, serving as a stateless API handling business logic and rate-limiting.
- **Database**: MongoDB Atlas (Cloud Database). Utilizes native MongoDB `$text` indexing for efficient full-text search capability.

## 3. Search Mechanism & Indexing

The core functional requirement—the search mechanism—was implemented directly at the database layer rather than using inefficient in-memory filtering.

- **The Index**: A compound `$text` index was placed on `title`, `description`, and `category` fields (`itemSchema.index({ title: 'text', description: 'text', ... })`).
- **Weighting**: The fields were weighted to prioritize relevance (e.g., matching a keyword in the `title` carries 10x the weight of matching in the `description`).
- **Relevance Scoring**: The API sorts results by descending `$meta: 'textScore'`, returning the most contextually relevant documents first.

## 4. Bonus Features Implemented

1. **Server-side Pagination**: Cursor/Skip-based pagination to restrict payload size, returning exactly 10 or 20 items per request and total available pages.
2. **Debounced Search with Autocomplete**: Reduces API load by waiting 400ms after the user stops typing, coupled with a specific `/api/suggestions` endpoint for prefix matching.
3. **Advanced Filtering and Sorting**: Allowed combinatorial filtering (by Category) and sorting (by Relevance, Price, or Date).

## 5. Security & Cloud Readiness

- Implemented `helmet` for HTTP header security and `cors` for safe cross-origin mapping between Vercel and Render.
- Implemented `express-rate-limit` to prevent basic DDoS and brute-force attacks.
- Configured Environment variables (`MONGO_URI`, `PORT`, `VITE_API_URL`) separated by environment to avoid hardcoding secrets in version control.

## 6. Challenges & Solutions

- **Challenge**: MongoDB Atlas free UI doesn't natively support "type-ahead" partial string matching without Edge features.
- **Solution**: Designed a secondary fast path (`/suggestions`) utilizing indexed RegEx searches restricted strictly by prefix length and limiting to 5 results to ensure minimal latency.
- **Challenge**: Dealing with cold-starts on Render's free tier.
- **Solution**: Configured the frontend to gracefully handle timeout states using comprehensive loading skeletons.

## 7. Conclusion

The resulting search application effectively meets the criteria for a 100% cloud-deployed, performant, and secure system, highlighting best practices for scalable web architecture.
