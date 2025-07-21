# 🔐 OpenFGA Node.js Authorization Demo

This project demonstrates how to implement **fine-grained, relationship-based access control** using [OpenFGA](https://openfga.dev) in a modern **Node.js** application.

Inspired by real-world authorization use-cases from platforms like **Google Drive** and **GitHub**, this demo shows how to model complex access patterns with simplicity and scalability.

---

## � Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/openfga-demo.git
cd openfga-demo

# 2. Install dependencies
npm install # or npm install

# 3. Start everything (Node.js + OpenFGA + Postgres)
docker compose up -d
npm start # or npm start
```

OpenFGA will be available at [http://localhost:8080](http://localhost:8080)
The Node.js app will run at [http://localhost:8000](http://localhost:8000)

---

## �📌 Features

- ✅ OpenFGA integration via official JavaScript SDK
- ✅ Define and manage authorization models (schema)
- ✅ Add relationship-based access rules using **tuples**
- ✅ Fine-grained permissions: owner, viewer, editor
- ✅ Share files with users dynamically
- ✅ Visualize and test policies using [OpenFGA Playground](https://play.fga.dev)
- ✅ Docker setup to run OpenFGA locally

---

## 📂 Project Structure

```bash
.
├── docker-compose.yml     # Sets up OpenFGA + Postgres
├── index.js               # Main Node.js server file
├── openfga.js             # FGA client configuration
├── db.js                  # File metadata storage (JSON-based)
├── middlewares/           # Auth middleware
├── public/                # Static frontend assets
├── data/files.json        # File records (mock DB)
├── README.md              # You're here :)
└── package.json
```

---

## 🛠️ API Endpoints

### Auth & User

- `POST /signup` — Get a JWT token (body: `{ username, email }`)

### Files

- `GET /files` — List files user can view (requires JWT)
- `POST /create-file` — Create a new file (body: `{ id, filename }`, requires JWT)
- `POST /share-file` — Share a file with another user (body: `{ id, username }`, requires JWT, owner only)

### Relations

- `GET /relations` — List available types and relations

---

## 📬 Example Usage (with curl)

```bash
# Signup as Alice
curl -X POST http://localhost:8000/signup -H 'Content-Type: application/json' -d '{"username":"alice","email":"alice@example.com"}'

# Use the token from above for the next requests:
export TOKEN=... # paste the JWT here

# Create a file as Alice
curl -X POST http://localhost:8000/create-file \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"id":"file-1","filename":"demo.pdf"}'

# Share file with Bob
curl -X POST http://localhost:8000/share-file \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"id":"file-1","username":"bob"}'

# List files as Alice
curl -X GET http://localhost:8000/files -H "Authorization: Bearer $TOKEN"

# Get available relations
curl -X GET http://localhost:8000/relations
```

---

## 🔒 Security Notes

- **JWT Secret:** For demo purposes, the JWT secret is hardcoded. For production, always use environment variables and strong secrets.
- **No Passwords:** This POC does not implement password authentication or user persistence.
- **File Storage:** File metadata is stored in a JSON file for simplicity. Use a real database for production.
