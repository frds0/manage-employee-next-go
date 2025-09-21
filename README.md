# Manage Employee Next Go

A modern, full-stack employee management system built with **Next.js** for frontend and **Go** for backend.

Live Demo: [Cick Here](https://manage-employee-next-go.vercel.app)

Email: firdaus@g.com

Password: 1234

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running the App](#running-the-app)  

---

## Overview

This project is an employee management application. It allows users to perform typical CRUD (Create, Read, Update, Delete) operations for employee data. The frontend is built with Next.js and the backend is written in Go. It is designed to be fast, responsive, and scalable.

---

## Features

- Create, view, edit, delete employee records  
- Responsive UI  
- Separation of concerns: frontend/backend  
- API-based architecture

---

## Tech Stack

| Layer        | Technology               |
|---------------|--------------------------|
| Frontend      | Next.js / React          |
| Backend       | Go (Golang)              |
| Styling       | CSS / module CSS / (or whatever used) |
| Hosting       | Vercel (frontend)        |
| API           | REST                     |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version LTS recommended)  
- [Yarn](https://yarnpkg.com/) **or** `npm`  
- Go (Golang) (version 1.xx or higher)  
- Git  

---

### Installation


Clone the repo:

```bash
git clone https://github.com/frds0/manage-employee-next-go.git
cd manage-employee-next-go

```
Setup backend:
```bash
cd backend
# install dependencies (if any)
go mod download

# run the backend
go run main.go

```
Setup frontend:
```bash 
cd frontend
# install dependencies
npm install    # or yarn install

```
run the frontend
```bash
npm run dev    # or yarn dev
```
## Running the App

# After both backend & frontend are running:

Frontend likely runs at http://localhost:3000
Backend at http://localhost:8000 
