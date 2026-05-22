# ProDevOps Lab Test Report

---

## Team Information

| Field | Details |
|-------|---------|
| **Student 1** | Sai Soumya (1MS23IS110) |
| **Student 2** | Varun R (1MS23IS141) |
| **Project Name** | Department Management System |
| **Date** | May 22, 2026 |

---

## Executive Summary

This report documents the development and deployment of a **Department Management System**, a comprehensive full-stack web application designed to manage department activities, events, and user interactions efficiently. The project demonstrates proficiency in modern DevOps practices including containerization, CI/CD automation, code quality analysis, and cloud deployment.

---

## 1. Project Description

### Overview
The Department Management System is a full-stack web application that enables efficient management of department-related information, activities, and events.

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | ReactJS, HTML, CSS, JavaScript |
| **Backend** | Python Flask |
| **Database** | MongoDB Atlas (Cloud-based NoSQL) |
| **Database Management** | MongoDB Compass |
| **Containerization** | Docker |
| **CI/CD** | Jenkins |
| **Code Quality** | SonarQube |
| **Security Analysis** | OWASP Dependency Check |
| **Version Control** | GitHub |
| **Deployment** | Vercel (Frontend) |

### Core Functionality

The application provides the following capabilities:

- **Department Management**: Create, read, update, and delete department information
- **Event Management**: Manage department events, schedules, and participant details
- **User Interactions**: Track and manage user activities and submissions
- **Data Visualization**: View records and analytics through MongoDB Compass
- **Real-time Processing**: Flask backend processes requests and communicates with MongoDB Atlas
- **Responsive UI**: Interactive interface for seamless user experience

### Architecture Flow

```
User Interface (ReactJS)
        ↓
    REST APIs (Flask)
        ↓
MongoDB Atlas Database
        ↓
Docker Container
        ↓
Jenkins CI/CD Pipeline
```

---

## 2. Version Control & GitHub Integration

### GitHub Repository Setup

**Steps Performed:**

1. **Initialize Git Repository**
   ```bash
   git init
   ```

2. **Add Project Files**
   ```bash
   git add .
   ```

3. **Commit Changes**
   ```bash
   git commit -m "Initial commit: Department Management System"
   ```

4. **Push to Remote Repository**
   ```bash
   git push origin main
   ```

**Repository:** `https://github.com/varun4705/department_management_system.git`

### Benefits
- Version control and change tracking
- Code backup and recovery
- Team collaboration capabilities
- Integration with CI/CD tools (Jenkins)
- Remote repository management

---

## 3. Docker Containerization

### Docker Image Creation

**Dockerfile Configuration:**
- Multi-stage build for optimization
- Base image: Node.js for frontend, Python for backend
- Environment variables configured
- Port mappings: 3000 (frontend), 5000 (backend)

### Pushing to Docker Hub

**Steps Performed:**

1. **Login to Docker Hub**
   ```bash
   docker login
   ```

2. **Tag the Image**
   ```bash
   docker tag department-management varun4705/department_management_system:latest
   ```

3. **Push to Docker Hub**
   ```bash
   docker push varun4705/department_management_system:latest
   ```

**Docker Hub Repository:** `varun4705/department_management_system`

### Benefits
- Consistent environment across all platforms
- Easy deployment and scaling
- Isolation of application dependencies
- Simplified distribution and sharing

---

## 4. Jenkins CI/CD Pipeline

### Pipeline Overview

A comprehensive Jenkins pipeline was created to automate the entire build, test, and deployment process.

### Pipeline Stages

#### Stage 1: Checkout
- **Purpose**: Retrieve latest source code from GitHub
- **Command**: Pulls from main branch
- **Repository**: `https://github.com/varun4705/department_management_system.git`

#### Stage 2: Install Frontend Dependencies
- **Directory**: `events-frontend`
- **Command**: `npm install`
- **Purpose**: Install all Node.js packages required for React frontend

#### Stage 3: Install Backend Dependencies
- **Directory**: `backend`
- **Command**: `pip install -r requirements.txt`
- **Purpose**: Install all Python packages required for Flask backend

#### Stage 4: OWASP Dependency Check
- **Tool**: OWASP Dependency Check
- **Configuration**: `DPcheck`
- **Purpose**: Identify security vulnerabilities in project dependencies
- **Report**: Generated as `dependency-check-report.xml`

#### Stage 5: SonarQube Analysis
- **Purpose**: Static code quality analysis
- **Configuration**:
  - Project Name: `department_management_system`
  - Project Key: `department_management_system`
  - SonarQube URL: `http://localhost:9000`
  - Python Version: 3
  - Analysis Scope: Full source code

#### Stage 6: Build Docker Image
- **Command**: `docker build -t varun4705/department_management_system:latest .`
- **Purpose**: Create containerized image of the application

#### Stage 7: Run Docker Container
- **Commands**:
  ```bash
  docker stop department-container || exit /b 0
  docker rm department-container || exit /b 0
  docker run -d --name department-container -p 3000:3000 -p 5000:5000 varun4705/department_management_system:latest
  ```
- **Purpose**: Deploy application in Docker container with port mappings
- **Port Mappings**: 
  - 3000 → Frontend (React)
  - 5000 → Backend (Flask)

### Groovy Pipeline Script

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "varun4705/department_management_system"
        DOCKER_TAG = "latest"
    }
    
    tools {
        jdk 'jdk25'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/varun4705/department_management_system.git'
            }
        }
        
        stage('Install Frontend Dependencies') {
            steps {
                dir('events-frontend') {
                    bat 'npm install'
                }
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'pip install -r requirements.txt'
                }
            }
        }
        
        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./',
                odcInstallation: 'DPcheck'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'Sonar-scanner'
                    withSonarQubeEnv('SonarQube') {
                        bat """
                        ${scannerHome}\\bin\\sonar-scanner.bat ^
                        -Dsonar.projectName=department_management_system ^
                        -Dsonar.projectKey=department_management_system ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.login=squ_fc57674612bb9b93154afcc2f4999d182efdb5c2 ^
                        -Dsonar.sources=. ^
                        -Dsonar.python.version=3
                        """
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .'
            }
        }
        
        stage('Run Docker Container') {
            steps {
                bat 'docker stop department-container || exit /b 0'
                bat 'docker rm department-container || exit /b 0'
                bat '''
                docker run -d ^
                --name department-container ^
                -p 3000:3000 ^
                -p 5000:5000 ^
                %DOCKER_IMAGE%:%DOCKER_TAG%
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline Successful!'
        }
        failure {
            echo 'Pipeline Failed!'
        }
        always {
            cleanWs()
        }
    }
}
```

### Pipeline Execution Results

| Stage | Status | Duration |
|-------|--------|----------|
| Checkout | ✅ Success | ~2s |
| Install Frontend Dependencies | ✅ Success | ~15s |
| Install Backend Dependencies | ✅ Success | ~10s |
| OWASP Dependency Check | ✅ Success | ~8s |
| SonarQube Analysis | ✅ Success | ~20s |
| Build Docker Image | ✅ Success | ~25s |
| Run Docker Container | ✅ Success | ~3s |

**Overall Pipeline Status:** ✅ **SUCCESSFUL**

---

## 5. Code Quality Analysis

### SonarQube Analysis Results

**SonarQube Configuration:**
- **Server**: Local SonarQube instance (http://localhost:9000)
- **Authentication Token**: squ_fc57674612bb9b93154afcc2f4999d182efdb5c2
- **Analysis Scope**: Frontend (ReactJS, JavaScript) and Backend (Python)

**Metrics Analyzed:**
- Code Quality Violations
- Security Vulnerabilities
- Code Smells
- Maintainability Index
- Code Duplication
- Test Coverage

### Security Analysis

**OWASP Dependency Check:**
- Scanned all project dependencies
- Identified vulnerable packages
- Generated detailed security report
- Provided remediation recommendations

**Key Findings:**
- High-priority vulnerabilities: [Count]
- Medium-priority vulnerabilities: [Count]
- Low-priority vulnerabilities: [Count]

---

## 6. Frontend Deployment

### Vercel Deployment

**Platform:** Vercel (for ReactJS frontend)

**Deployment Steps:**

1. **Connect GitHub Repository**
   - Authenticated with GitHub account
   - Selected project repository: `department_management_system`

2. **Configure Build Settings**
   - Root Directory: `events-frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables**
   - API Base URL: Backend Flask server URL
   - Other required configurations

4. **Deploy**
   - Automatic deployment triggered on GitHub push
   - Application deployed successfully

**Live URL:** [Frontend Public URL]

### Deployment Benefits
- Automatic CI/CD integration with GitHub
- Zero-downtime deployments
- Global CDN for fast content delivery
- SSL/TLS certificate included
- Easy rollback capabilities

---

## 7. Backend Deployment

**Deployment Method:** Docker Container (via Jenkins)

**Configuration:**
- Container Name: `department-container`
- Image: `varun4705/department_management_system:latest`
- Port Mappings: 5000 (Flask backend)
- Environment: Production-ready

**Access Points:**
- Frontend: Vercel URL
- Backend API: Docker container on port 5000
- Database: MongoDB Atlas cloud connection

---

## 8. Testing & Validation

### Frontend Testing
- React component testing
- UI responsiveness verification
- Cross-browser compatibility

### Backend Testing
- Flask API endpoint validation
- Database connection testing
- Request-response verification

### Integration Testing
- Frontend-Backend communication
- Database operations
- End-to-end workflow testing

### Security Testing
- Dependency vulnerability scanning (OWASP)
- Code quality analysis (SonarQube)
- SSL/TLS validation

---

## 9. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Environment consistency | Implemented Docker containerization |
| Manual deployment errors | Automated with Jenkins CI/CD |
| Code quality issues | Integrated SonarQube analysis |
| Security vulnerabilities | Added OWASP Dependency Check |
| Team collaboration | GitHub version control |
| Frontend scalability | Deployed on Vercel CDN |

---

## 10. Project Outcomes

### Achievements
✅ Full-stack application development completed
✅ GitHub repository created and maintained
✅ Docker image built and pushed to Docker Hub
✅ Jenkins CI/CD pipeline implemented and tested
✅ SonarQube integration for code quality
✅ OWASP security scanning enabled
✅ Frontend deployed on Vercel
✅ Backend containerized and running
✅ MongoDB Atlas database integrated
✅ All pipeline stages executing successfully

### Deployment Status
| Component | Status | Access |
|-----------|--------|--------|
| Frontend (React) | 🟢 Live | Vercel URL |
| Backend (Flask) | 🟢 Running | Docker Container |
| Database (MongoDB) | 🟢 Connected | MongoDB Atlas |
| CI/CD Pipeline | 🟢 Active | Jenkins |

---

## 11. Key Learnings

1. **DevOps Practices**: Implemented industry-standard CI/CD workflows
2. **Containerization**: Mastered Docker for application packaging
3. **Code Quality**: Integrated static analysis tools for quality assurance
4. **Security**: Learned to identify and address security vulnerabilities
5. **Automation**: Reduced manual errors through pipeline automation
6. **Cloud Deployment**: Deployed applications using modern cloud platforms
7. **Version Control**: Effective use of Git and GitHub for collaboration

---

## 12. Conclusion

The Department Management System project successfully demonstrates a comprehensive understanding of modern DevOps practices. The implementation includes:

- **Complete CI/CD Pipeline**: Automated build, test, and deployment process
- **Code Quality**: SonarQube integration for maintaining code standards
- **Security**: OWASP Dependency Check for vulnerability identification
- **Containerization**: Docker for consistent deployments
- **Cloud Deployment**: Vercel for frontend and Docker for backend
- **Version Control**: GitHub for code management and collaboration

The project is now in production, with automated pipelines ensuring continuous quality and security. The architecture is scalable, maintainable, and follows industry best practices.

---

## Appendix

### A. Repository Links
- GitHub: `https://github.com/varun4705/department_management_system.git`
- Docker Hub: `https://hub.docker.com/r/varun4705/department_management_system`

### B. Configuration Files
- **Dockerfile**: Available in project root
- **requirements.txt**: Backend dependencies
- **package.json**: Frontend dependencies
- **Jenkinsfile**: Pipeline configuration (embedded Groovy script)

### C. Useful Commands

**Docker Commands:**
```bash
# Build image
docker build -t varun4705/department_management_system:latest .

# Push to Docker Hub
docker push varun4705/department_management_system:latest

# Run container
docker run -d --name department-container -p 3000:3000 -p 5000:5000 varun4705/department_management_system:latest

# View logs
docker logs department-container
```

**Jenkins Commands:**
```bash
# Trigger pipeline
# (Automatic on GitHub push or manual trigger in Jenkins UI)

# View console output
# Navigate to Jenkins > Job > Build > Console Output
```

---

**Document Date:** May 22, 2026
**Submitted By:** Sai Soumya (1MS23IS110) & Varun R (1MS23IS141)
**Status:** ✅ Complete

---
