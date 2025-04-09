# Smart Construction Resource Optimization using AI

This project is a full-stack web application designed to intelligently optimize resource allocation in construction projects. It leverages a Django backend, MySQL database, and pretrained AutoGluon ML models to provide real-time predictions for material requirements and task durations based on historical and real-time project data.

Traditional construction planning methods rely on static spreadsheets or manual estimates, which often lead to inefficient resource usage, cost overruns, and project delays. This solution addresses those inefficiencies by providing AI-powered recommendations based on structured inputs like task type, project scale, and delivery conditions.

The platform includes a web-based dashboard to manage projects and tasks, a prediction API integrated with AutoGluon for intelligent recommendations, and a MySQL database to securely store user-entered construction data.

---

## 🚀 Features

- Django-based backend connected to a MySQL database
- AutoGluon-powered AI predictions for:
  - Cement, steel, and labor hour requirements
  - Task closure duration estimates
- REST API endpoint for AI-powered predictions
- Project and Task CRUD functionality via Django Admin
- Basic HTML/JS frontend integrated with prediction engine

---

## 🧠 AI Integration with AutoGluon

AutoGluon-Tabular is used to train and serve prediction models:

1. Resource Prediction Model  
   - Inputs: Project Type, Task Type, Size, Complexity, Workforce, etc.  
   - Output: Cement_tons, Steel_kg, LaborHours

2. Task Duration Model  
   - Inputs: Resource Delivery, Material Availability, Weather Impact  
   - Output: ActualDuration (in days)

Models are trained offline and saved as predictors. They are then loaded into Django and exposed via API.

---

## 📦 Tech Stack

- Backend: Django (Python)
- Database: MySQL
- ML Framework: AutoGluon (Tabular)
- Frontend: HTML, CSS, JavaScript (Django templates)
- API: Django REST-style view (POST)

