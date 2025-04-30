# 🏡 e-Property – Real Estate Listing Platform

A full-stack real estate listing app using the MERN stack, offering property browsing, filtering, and management with user roles and secure authentication.

## 🚀 Features
- JWT-based user authentication and role management
- Property CRUD operations (admin/user)
- Filter/search by price, location, and type
- Image upload and preview
- Responsive UI using Tailwind CSS

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT

## 📦 Folder Structure
e-property/ ├── backend/ │ ├── controllers/ │ ├── models/ │ ├── routes/ │ └── config/ 
            ├── frontend/ │ ├── components/ │ ├── pages/ │ ├── utils/ │ └── styles/


## 🔧 Setup Instructions

### 1. Backend
```bash
cd backend
npm install

## 🔐 Environment Variables
| Variable      | Description                   |
|---------------|-------------------------------|
| `PORT`        | Backend server port           |
| `MONGO_URI`   | MongoDB connection string     |
| `JWT_SECRET`  | Secret key for authentication |

## 🛣️ API Endpoints
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Log in and get a token
- `GET /api/properties` – Fetch all properties
- `POST /api/properties` – Create a property (admin only)
- `PUT /api/properties/:id` – Edit a property
- `DELETE /api/properties/:id` – Delete a property

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

