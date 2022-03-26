# social-media-platform-api
Social Media Platform API with NodeJS ExpressJS and MongoDB and Mongoose

## Description

## Installation with Docker

1. Clone from git

2. cd into social-media-platform-api

3. run `yarn install` to install all dependencies

## Running the app

```bash
# development mode with Dockerfile.dev
$ dokcer-compose up

# production mode with Dockerfile
$ dokcer-compose up
```

# Social Media Platform API Documentation

## Health Check:
### Method: `GET`

### Request Endpoint:
```
http://localhost:3000/api/v1/health
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "Welcome to Social Media Platform API",
    "response": null,
    "error": null
}
```

## User SignUp:
### Method: `POST`
### Schema:
```javascript
const schema = object().keys({
	name: string().regex(/^[A-Za-z ]+$/).required(),
    email: string().email().required(),
    password: string().min(8).required()
});
```

### Request Sample Data:
```json
{
    "name": "Shahabuddin Ahmed",
    "email": "shahabuddin.cse.ru@gmail.com",
    "password": "0123456789"
}
```
### Request Endpoint:
```
http://localhost:3000/api/v1/user/signup
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "User Successfully created.",
    "data": {
        "name": "Shahabuddin Ahmed",
        "email": "shahabuddin.cse.ru@gmail.com",
        "image": ""
    },
    "errors": []
}
```

## User Login:
### Method: `POST`
### Schema:
```javascript
const schema = object().keys({
	email: string().email().required(),
    password: string().min(8).required()
});
```

### Request Sample Data:
```json
{
    "email": "shahabuddin.cse.ru@gmail.com",
    "password": "9876543210"
}
```
### Request Endpoint:
```
http://localhost:3000/api/v1/user/login
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "User login Successfully",
    "data": {
        "name": "Shahabuddin Ahmed",
        "email": "shahabuddin.cse.ru@gmail.com"
    },
    "errors": [],
    "toekn": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjNmNDE2YWE3Y2ZhMjliYTYzNWQzMWQiLCJlbWFpbCI6InNoYWhhYnVkZGluLmNzZS5ydUBnbWFpbC5jb20iLCJpYXQiOjE2NDgzMTI3NTcsImV4cCI6MTY0ODc0NDc1N30.dqRc-4tifsc-IMFaJvNgOHFELaMEbV_IvWFJiJHd2Cs"
}
```

## Create Post:
### Method: `POST`
### Schema:
```javascript
const schema = object().keys({
	title: string().required(),
    description: string().required(),
    images: array().items(string().uri()).required()
});
```

### Request Sample Data:
```json
{
    "title": "Social media post 6",
    "description": "This is social media post details 6",
    "images": []
}
```
### Request Endpoint:
```
http://localhost:3000/api/v1/post/create
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "Post Successfully created.",
    "data": {
        "id": "623f506fae82fd639d8c7ffd",
        "name": "Social media post 6",
        "description": "This is social media post details 6",
        "images": []
    },
    "errors": []
}
```

## Update Post:
### Method: `PATCH`
### Schema:
```javascript
const schema = object().keys({
	id: string().length(24).required(),
    title: string().required(),
    description: string().required(),
    images: array().items(string().uri()).required()
});
```

### Request Sample Data:
```json
{
    "id": "623f506fae82fd639d8c7ffd",
    "title": "Social media updated post 1",
    "description": "This is social media updated post details 1",
    "images": []
}
```
### Request Endpoint:
```
http://localhost:3000/api/v1/post/update
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "Post updated Successfully",
    "data": {
        "id": "623f506fae82fd639d8c7ffd",
        "name": "Social media updated post 1",
        "description": "This is social media updated post details 1",
        "images": []
    },
    "errors": []
}
```

## Delete Post:
### Method: `DELETE`
### Schema:
```javascript
const schema = object().keys({
	id: string().length(24).required()
});
```

### Request Sample Data:
```json
{
    "id": "623f506fae82fd639d8c7ffd"
}
```
### Request Endpoint:
```
http://localhost:3000/api/v1/post/update
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "Post deleted Successfully",
    "data": null,
    "errors": []
}
```

## List Post:
### Method: `GET`
### Schema:
```javascript
const schema = object().keys({
	skip: number().integer().optional(),
    limit: number().integer().optional()
});
```

### Request Endpoint:
```
http://localhost:3000/api/v1/post/list?skip=0&limit=10
```
### Response:
```json
{
    "code": "SUCCESS",
    "message": "Post deleted Successfully",
    "data": [
        {
            "id": "623f4bb30cde40a3d8ef9d29",
            "name": "Social media post 1",
            "description": "This is social media post details 1",
            "images": []
        },
        {
            "id": "623f4fd6ae82fd639d8c7fea",
            "name": "Social media post 2",
            "description": "This is social media post details 2",
            "images": []
        },
        {
            "id": "623f4fe1ae82fd639d8c7fec",
            "name": "Social media post 3",
            "description": "This is social media post details 3",
            "images": []
        },
        {
            "id": "623f4febae82fd639d8c7fee",
            "name": "Social media post 4",
            "description": "This is social media post details 4",
            "images": []
        },
        {
            "id": "623f4ff3ae82fd639d8c7ff0",
            "name": "Social media post 5",
            "description": "This is social media post details 5",
            "images": []
        }
    ],
    "errors": [],
    "skip": 0,
    "limit": 10,
    "count": 5
}
```