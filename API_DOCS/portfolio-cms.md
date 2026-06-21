# 🚀 Portfolio CMS API Documentation

Welcome to the Portfolio CMS API endpoints documentation. This API provides routes to manage portfolio enhancements, track analytics, and generate SEO files like Sitemaps and robots.txt.

> **Base URL:** `http://localhost:5000/api/portfolio`

## Table of Contents

- [Quickstart Guide](#quickstart-guide)
- [Rate Limits](#rate-limits)
- [Endpoints](#endpoints)
  - [1. Enhance Portfolio Content](#1-enhance-portfolio-content)
  - [2. Submit Performance Metrics](#2-submit-performance-metrics)
  - [3. Get Analytics Bandwidth](#3-get-analytics-bandwidth)
  - [4. Get Sitemap XML](#4-get-sitemap-xml)
  - [5. Get Robots.txt](#5-get-robotstxt)
- [Error Codes & Responses](#error-codes--responses)

---

## Quickstart Guide

1. **Get an Authentication Token:**
   Most protected endpoints require a Firebase ID Token. Obtain this token from the frontend Firebase Auth SDK upon logging in:
   ```javascript
   const token = await firebase.auth().currentUser.getIdToken();
   ```

2. **Make a Request:**
   Include the token in your requests via the `Authorization` header.
   ```http
   Authorization: Bearer <your-token>
   ```

3. **Explore the Endpoints:**
   - Enhance the contents of a specific portfolio section with AI via `/enhance-portfolio-content`.
   - Submit metrics via `/:id/performance`.

---

## Rate Limits

While no explicit route-level rate limits are currently enforced on the portfolio router manually beyond global API limiters, general rate limits apply across the platform. Responses containing rate-limit values typically include standard rate-limiting headers such as `X-RateLimit-Reset` and `X-RateLimit-Limit`. Be mindful of hitting AI providers directly.

---

## Endpoints

### 1. Enhance Portfolio Content

Enhance a specific portfolio section utilizing AI. This does **not** save automatically; it returns a before/after comparison.

- **URL:** `/api/portfolio/enhance-portfolio-content`
- **Method:** `POST`
- **Auth required:** Yes (`Bearer Token`)

#### Request Schema

```json
{
  "sectionType": "hero | projects | about | skills",
  "content": {
    "key": "value"
  }
}
```
*`content` must be a non-null JSON object containing the fields for the specified section.*

#### Response Schema (Success 200)

```json
{
  "success": true,
  "message": "Enhancement suggestion generated. Review before applying.",
  "data": {
    "sectionType": "projects",
    "before": { /* original data */ },
    "after": { /* ai improved data */ },
    "improvements": ["Made the tone more professional", "Added action verbs"]
  }
}
```

#### Example cURL

```bash
curl -X POST http://localhost:5000/api/portfolio/enhance-portfolio-content \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "sectionType": "hero",
    "content": { "title": "Developer", "subtitle": "I make websites" }
  }'
```

#### Example Fetch

```javascript
const enhanceContent = async () => {
  const response = await fetch('http://localhost:5000/api/portfolio/enhance-portfolio-content', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sectionType: 'hero',
      content: { title: 'Developer', subtitle: 'I make websites' }
    })
  });
  const data = await response.json();
  console.log(data);
};
```

---

### 2. Submit Performance Metrics

Analyze or track performance metrics for a specific portfolio.

- **URL:** `/api/portfolio/:id/performance`
- **Method:** `POST`
- **Auth required:** Yes (`Bearer Token`)
- **Path Parameters:**
  - `id` (string) - The unique identifier of the portfolio.

#### Request Schema

```json
{
  "htmlSizeKB": 12.5,
  "cssSizeKB": 4.2,
  "imageSizeMB": 1.1,
  "externalRequests": 5,
  "cssSelectors": 120,
  "fontStrategy": "swap"
}
```
*At least one of `htmlSizeKB`, `cssSizeKB`, or `imageSizeMB` is required.*

#### Response Schema (Success 200)

```json
{
  "success": true,
  "message": "Performance metrics recorded for portfolio 123",
  "data": {
    "portfolioId": "123",
    "receivedMetrics": {
      "htmlSizeKB": 12.5,
      "cssSizeKB": 4.2,
      "imageSizeMB": 1.1,
      "externalRequests": 5,
      "cssSelectors": 120,
      "fontStrategy": "swap"
    }
  }
}
```

#### Example cURL

```bash
curl -X POST http://localhost:5000/api/portfolio/YOUR_PORTFOLIO_ID/performance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "htmlSizeKB": 12.5,
    "cssSizeKB": 4.2,
    "imageSizeMB": 1.1
  }'
```

#### Example Fetch

```javascript
fetch('http://localhost:5000/api/portfolio/YOUR_PORTFOLIO_ID/performance', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    htmlSizeKB: 12.5,
    cssSizeKB: 4.2,
    imageSizeMB: 1.1
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 3. Get Analytics Bandwidth

Get an estimation or tracked usage of bandwidth for a specific public portfolio.

- **URL:** `/api/portfolio/:slug/bandwidth`
- **Method:** `GET`
- **Auth required:** No

#### Response Schema (Success 200)

```json
{
  "success": true,
  "data": {
    "slug": "johndoe",
    "estimatedPageSizeKB": 500,
    "monthlyViews": 1200,
    "bandwidthUsageMB": "585.94",
    "freeTierLimitMB": 102400,
    "usagePercentage": "0.57",
    "warning": false
  }
}
```

#### Example cURL

```bash
curl -X GET http://localhost:5000/api/portfolio/johndoe/bandwidth
```

#### Example Fetch

```javascript
fetch('http://localhost:5000/api/portfolio/johndoe/bandwidth')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

### 4. Get Sitemap XML

Generate and retrieve the `sitemap.xml` for a public portfolio. Results are cached daily.

- **URL:** `/api/portfolio/public/:slug/sitemap.xml`
- **Method:** `GET`
- **Auth required:** No
- **Headers Returned:**
  - `Content-Type: application/xml`
  - `Cache-Control: max-age=86400`

#### Example cURL

```bash
curl -X GET http://localhost:5000/api/portfolio/public/johndoe/sitemap.xml
```

#### Example Fetch

```javascript
fetch('http://localhost:5000/api/portfolio/public/johndoe/sitemap.xml')
  .then(res => res.text())
  .then(xmlString => console.log(xmlString));
```

---

### 5. Get Robots.txt

Generate and retrieve `robots.txt` dynamically mapped to the portfolio's sitemap. Results are cached shortly.

- **URL:** `/api/portfolio/public/:slug/robots.txt`
- **Method:** `GET`
- **Auth required:** No
- **Headers Returned:**
  - `Content-Type: text/plain`
  - `Cache-Control: max-age=300`

#### Example cURL

```bash
curl -X GET http://localhost:5000/api/portfolio/public/johndoe/robots.txt
```

#### Example Fetch

```javascript
fetch('http://localhost:5000/api/portfolio/public/johndoe/robots.txt')
  .then(res => res.text())
  .then(text => console.log(text));
```

---

## Error Codes & Responses

Standard error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here",
  "error": "ErrorType"
}
```

| Status Code | Description | Endpoint(s) | Typical Causes |
|-------------|-------------|-------------|----------------|
| `400`       | Bad Request | Enhancement, Performance, Sitemap | Missing required fields (`sectionType`, `content`), invalid format or invalid slug string. |
| `401`       | Unauthorized| Enhancement, Performance | Missing or invalid Firebase Bearer token. |
| `404`       | Not Found   | Sitemap, Robots, Bandwidth | The specified `slug` does not correspond to an existing portfolio template. |
| `500`       | Server Error| (All) | Backend logic failure, database, or file-system error. |