# AI Tools API Documentation

## 1. Generate LinkedIn Headlines

### Endpoint
`POST /api/ai/linkedin-headline`

### Description
Generates AI-powered LinkedIn headline suggestions based on portfolio data.

### Authentication
Not required

### Request Body

```json
{
  "name": "John Doe",
  "skills": ["React", "Node.js", "MongoDB"],
  "experience": "Frontend Developer"
}
```

### Success Response

```json
{
  "success": true,
  "headlines": [
    "Frontend Developer | React & Node.js Enthusiast"
  ]
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Portfolio data missing |
| 500 | Failed to generate headlines |

---

## 2. Fetch AI Provider Models

### Endpoint
`GET /api/ai/models`

### Description
Fetches available AI models for a provider such as OpenRouter.

### Authentication
Not required

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| provider | string | AI provider name |

### Example Request

```http
GET /api/ai/models?provider=openrouter
```

### Success Response

```json
{
  "success": true,
  "models": [
    {
      "id": "model-id",
      "name": "Model Name",
      "description": "Model description",
      "pricing": {},
      "context_length": 8192
    }
  ]
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 500 | Failed to fetch models |

---

## 3. Get AI Configuration

### Endpoint
`GET /api/ai/config`

### Description
Returns saved AI provider configuration for the authenticated user.

### Authentication
Required (`verifyToken` middleware)

### Success Response

```json
{
  "success": true,
  "config": {
    "provider": "openrouter",
    "model": "gpt-4",
    "hasKey": true
  }
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 401 | Unauthorized |
| 500 | Failed to fetch AI configuration |

---

## 4. Update AI Configuration

### Endpoint
`PUT /api/ai/config`

### Description
Updates AI provider configuration for the authenticated user.

### Authentication
Required (`verifyToken` middleware)

### Request Body

```json
{
  "provider": "openrouter",
  "apiKey": "your-api-key",
  "model": "gpt-4"
}
```

### Success Response

```json
{
  "success": true,
  "message": "AI Configuration updated"
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 401 | Unauthorized |
| 500 | Failed to save AI configuration |