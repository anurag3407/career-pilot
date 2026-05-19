# Portfolio API Documentation

## 1. Enhance Portfolio Content

### Endpoint
`POST /api/portfolio/enhance-portfolio-content`

### Description
Enhances portfolio section content using AI and returns suggested improvements without automatically saving changes.

### Authentication
Required (`verifyToken` middleware)

### Request Body

```json
{
  "sectionType": "hero",
  "content": {
    "title": "Frontend Developer",
    "description": "I build modern web apps."
  }
}
```

### Allowed Section Types

- hero
- projects
- about
- skills

### Success Response

```json
{
  "success": true,
  "message": "Enhancement suggestion generated. Review before applying.",
  "data": {
    "sectionType": "hero",
    "before": {},
    "after": {},
    "improvements": []
  }
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Missing or invalid sectionType/content |
| 401 | Unauthorized |
| 500 | Internal server error |

---

## 2. Generate Portfolio Sitemap

### Endpoint
`GET /api/portfolio/public/:slug/sitemap.xml`

### Description
Generates XML sitemap for a public portfolio template.

### Authentication
Not required

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | Portfolio template slug |

### Example Request

```http
GET /api/portfolio/public/retro-pixel/sitemap.xml
```

### Success Response

Returns XML sitemap content.

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid portfolio slug |
| 404 | Portfolio template not found |
| 500 | Internal server error |

---

## 3. Generate Portfolio Robots.txt

### Endpoint
`GET /api/portfolio/public/:slug/robots.txt`

### Description
Generates robots.txt file for public portfolio templates.

### Authentication
Not required

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | Portfolio template slug |

### Example Request

```http
GET /api/portfolio/public/retro-pixel/robots.txt
```

### Success Response

Returns robots.txt content.

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid portfolio slug |
| 404 | Portfolio template not found |
| 500 | Internal server error |