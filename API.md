# API Documentation

This project provides a RESTful API for managing Pokemon data and user Box entries. The API supports OpenAPI (`/api`) endpoints.

This document details the API provided for you for HW4. You may use this document as reference to help you develop your backend that replicates the behavior of this API in HW5. 

## Base URL

Where the base URLs are on this document, you can assume you will use your own localhost Express server for testing purposes. Replace the placeholder url below with your own localhost at whatever port you are hosting your server on.

`[localhost]`

## Authentication

Box endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## API Endpoints

### Pokemon Endpoints

These endpoints do not require authentication.

#### List Pokemon

Get a paginated list of Pokemon.

**Endpoint**: `GET /pokemon/`

**Query Parameters**:
- `limit` (number, required): Maximum number of Pokemon to return
- `offset` (number, required): Number of Pokemon to skip

**Response**: `Pokemon[]`

**Example Request**:
```
GET [localhost]/pokemon/?limit=10&offset=0
```

#### Get Pokemon by Name

Get detailed information about a specific Pokemon.

**Endpoint**: `GET /pokemon/:name`

**Path Parameters**:
- `name` (string, required): The name of the Pokemon

**Response**: `Pokemon`

**Example Request**:
```
GET [localhost]/pokemon/pikachu
```

### Box Endpoints

These endpoints require authentication. All operations are scoped to the authenticated user's pennkey.

#### List Box Entries

Get a list of all Box entry IDs for the authenticated user.

**Endpoint**: `GET /box/`

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>` (required)

**Response**: `string[]` (array of Box entry IDs)

**Example Request**:
```
GET [localhost]/box/
Authorization: Bearer <JWT_TOKEN>
```

#### Create Box Entry

Create a new Box entry for the authenticated user.

**Endpoint**: `POST /box/`

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>` (required)
- `Content-Type: application/json`

**Request Body**: `InsertBoxEntry`

**Response**: `BoxEntry`

**Example Request**:
```
POST [localhost]/box/
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "createdAt": "2024-01-15T10:30:00Z",
  "level": 25,
  "location": "Route 1",
  "notes": "Caught during morning walk",
  "pokemonId": 25
}
```

#### Get Box Entry

Get a specific Box entry by ID.

**Endpoint**: `GET /box/:id`

**Path Parameters**:
- `id` (string, required): The Box entry ID

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>` (required)

**Response**: `BoxEntry`

**Example Request**:
```
GET [localhost]/box/clx1234567890
Authorization: Bearer <JWT_TOKEN>
```

#### Update Box Entry

Update an existing Box entry. All fields are optional.

**Endpoint**: `PUT /box/:id`

**Path Parameters**:
- `id` (string, required): The Box entry ID

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>` (required)
- `Content-Type: application/json`

**Request Body**: `UpdateBoxEntry` (all fields optional)

**Response**: `BoxEntry`

**Example Request**:
```
PUT [localhost]/box/clx1234567890
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "level": 30,
  "notes": "Evolved to Raichu"
}
```

#### Delete Box Entry

Delete a specific Box entry.

**Endpoint**: `DELETE /box/:id`

**Path Parameters**:
- `id` (string, required): The Box entry ID

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>` (required)

**Response**: `void` (204 No Content)

**Example Request**:
```
DELETE [localhost]/box/clx1234567890
Authorization: Bearer <JWT_TOKEN>
```

#### Clear All Box Entries

Delete all Box entries for the authenticated user.

**Endpoint**: `DELETE /box/`

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>` (required)

**Response**: `void` (204 No Content)

**Example Request**:
```
DELETE [localhost]/box/
Authorization: Bearer <JWT_TOKEN>
```

## Type Definitions

### Pokemon

```typescript
{
  id: number;
  name: string;
  description: string;
  types: PokemonType[];
  moves: PokemonMove[];
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };
  stats: {
    hp: number;
    speed: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
  };
}
```

### PokemonType

```typescript
{
  name: string;        // Type name in uppercase (e.g., "FIRE", "WATER")
  color: string;       // Hex color code for the type
}
```

### PokemonMove

```typescript
{
  name: string;
  power?: number;      // Optional, undefined if power is 0 or null
  type: PokemonType;
}
```

### BoxEntry

```typescript
{
  id: string;          // CUID2-generated unique identifier
  createdAt: string;   // ISO 8601 date string
  level: number;
  location: string;
  notes?: string;      // Optional notes about the entry
  pokemonId: number;   // Pokemon ID from the Pokemon API
}
```

### InsertBoxEntry

Used for creating new Box entries. Same as `BoxEntry` but without the `id` field (generated automatically).

```typescript
{
  createdAt: string;   // ISO 8601 date string
  level: number;
  location: string;
  notes?: string;      // Optional
  pokemonId: number;
}
```

### UpdateBoxEntry

Used for updating Box entries. All fields are optional.

```typescript
{
  createdAt?: string;
  level?: number;
  location?: string;
  notes?: string;
  pokemonId?: number;
}
```

## Error Responses

The API uses standard HTTP status codes and returns error objects with the following structure:

### Error Codes

- `UNAUTHORIZED` (401): Missing or invalid authentication token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `BAD_REQUEST` (400): Invalid request parameters or body
- `CONFLICT` (409): Resource conflict
- `INTERNAL_SERVER_ERROR` (500): Server error

### Error Response Format

```typescript
{
  code: string;        // Error code (e.g., "UNAUTHORIZED")
  message: string;     // Human-readable error message
}
```

## Example Usage

### Get a list of Pokemon

```bash
curl "[localhost]/pokemon/?limit=10&offset=0"
```

### Get Pokemon details

```bash
curl "[localhost]/pokemon/pikachu"
```

### Create a Box entry

```bash
curl -X POST "[localhost]/box/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "createdAt": "2024-01-15T10:30:00Z",
    "level": 25,
    "location": "Route 1",
    "notes": "Caught during morning walk",
    "pokemonId": 25
  }'
```

### List user's Box entries

```bash
curl "[localhost]/box/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get a specific Box entry

```bash
curl "[localhost]/box/clx1234567890" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Box entry

```bash
curl -X PUT "[localhost]/box/clx1234567890" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "level": 30,
    "notes": "Evolved to Raichu"
  }'
```

### Delete a Box entry

```bash
curl -X DELETE "[localhost]/box/clx1234567890" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Clear all Box entries

```bash
curl -X DELETE "[localhost]/box/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
