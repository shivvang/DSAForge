
# **DSAForge 🔨**  
**A microservices-based platform for managing, organizing, and revising DSA problems with advanced features.**

---

## 🚀 **Overview**  
**DSAForge** is a robust microservices application built with the **MERN Stack**, designed to help developers efficiently manage and master **Data Structures and Algorithms (DSA)** problems. It leverages microservices architecture to ensure scalability, modularity, and seamless integration across different services.

---

## 🛠️ **Architecture Overview**  

The project is divided into **4 microservices**:

1. **Gateway Service (Port: 3000)**  
   - Entry point for all client requests.  
   - Routes traffic to appropriate services using **express-http-proxy**.  

2. **User Service (Port: 3001)**  
   - Handles user authentication and management.  

3. **Problem Service (Port: 3002)**  
   - Manages DSA problem-related operations.  

4. **Review Service (Port: 3003)**  
   - Handles user reviews, notes, and feedback.  

---

## 📦 **Tech Stack**  
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Proxy:** express-http-proxy  
- **Logging:** Winston  
- **Unique Identifiers:** UUID  

---

## 📂 **Folder Structure**  

```
/DSAForge
│
├── gateway/        # API Gateway for routing requests
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── user-service/   # Handles user authentication & user data
│   ├── index.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── package.json
│   └── .env
│
├── problem-service/ # Manages DSA problems
│   ├── index.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── package.json
│   └── .env
│
├── review-service/  # Handles user reviews & feedback
│   ├── index.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── package.json
│   └── .env
│
├── README.md       # Documentation
└── .gitignore      # Git ignored files
```

---

## 🌐 **Endpoints Overview**  

### **Gateway (Port 8000)**  
- `/user/* → Redirects to User Service`  
- `/problems/* → Redirects to Problem Service`  
- `/reviews/* → Redirects to Review Service`  

### **User Service (Port 8001)**  
- `POST /user/signup` → Register a new user  
- `POST /user/login` → Authenticate user  

### **Problem Service (Port 8002)**  
- `GET /problems` → List all problems  
- `GET /problems/:id` → Get problem details  

### **Review Service (Port 8003)**  
- `POST /reviews` → Add a review  
- `GET /reviews/:id` → Fetch reviews  

---

## ⚙️ **Installation & Setup**  

### **1. Clone the repository:**  
```bash
git clone https://github.com/yourusername/DSAForge.git
cd DSAForge
```

### **2. Install dependencies:**  
For each service (`gateway`, `user-service`, `problem-service`, `review-service`):  
```bash
cd <service-folder>
npm install
```

### **3. Environment Variables:**  
Create a `.env` file in each service with:  
```env
PORT=300X
DB_URL=<your-mongodb-url>
JWT_SECRET=<your-secret-key>
```

### **4. Start the services:**  
In each folder, run:  
```bash
npm start
```



## ✅ **Key Features**  
- Microservices Architecture for scalability.  
- API Gateway using **express-http-proxy**.  
- Modular structure for better code maintainability.  
- Secure authentication system.  
- Optimized database design with MongoDB.  
- Logging with **Winston**.  

Why DSAForge Was Discontinued?
DSAForge was originally planned as a microservices-based system, but after development, it became clear that microservices were unnecessary for this use case. The project suffered from design flaws, unnecessary complexity, and a lack of clear separation of concerns.

However, the process was highly educational. Key takeaways include:

Understanding Microservices vs. Monoliths → Not every project benefits from microservices.
Messaging Systems → Learned RabbitMQ for event-driven communication and BullMQ for job scheduling.
Efficient Caching → Used Redis for performance optimization.
MongoDB Change Streams → Explored real-time data updates.
This failure reinforced the importance of choosing the right architecture for the problem at hand.