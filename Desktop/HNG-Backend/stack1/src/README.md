# Profile Intelligence Service

## Overview
This project is a backend API built for the Stage 1 Backend Assessment: Data Persistence & API Design.

It accepts a name, enriches it using multiple third-party APIs, stores the processed result in a MongoDB database, and provides endpoints to retrieve, filter, and delete stored profiles.

## Features
- Integrates with:
  - Genderize API
  - Agify API
  - Nationalize API
- Stores processed profile data in MongoDB
- Prevents duplicate profile creation using idempotency
- Supports retrieval by ID
- Supports profile listing with optional filters
- Supports profile deletion
- Returns clean and consistent JSON responses
- Enables CORS for external access

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS
- UUID

## External APIs Used
- Genderize: `https://api.genderize.io?name={name}`
- Agify: `https://api.agify.io?name={name}`
- Nationalize: `https://api.nationalize.io?name={name}`


## Development mode

npm run dev

## Production mode

npm start

## Server runs on:

http://localhost:3000

API Endpoints : Create Profile
POST /api/profiles

Request Body

{
  "name": "ella"
}
Success Response (201)
{
  "status": "success",
  "data": {
    "id": "019d914b-6b4d-7425-b35d-4facefd707c2",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 97517,
    "age": 53,
    "age_group": "adult",
    "country_id": "CM",
    "country_probability": 0.09677289106552395,
    "created_at": "2026-04-15T13:18:52.238Z"
  }
}

and many more results

## Installation

https://github.com/lordrock/hngstack1/tree/main/Desktop/HNG-Backend/stack1

## Deployment : Base URL:
https://hngstack1-production.up.railway.app
https://hngstack1-production.up.railway.app/api/profiles

## End-point
/api/profiles

## Author

Oyewumi Isaac Ayomide