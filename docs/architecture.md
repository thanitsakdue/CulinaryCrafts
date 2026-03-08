# 🏗️ Architecture Documentation

## System Overview

Culinary Crafts เป็น **Agentic AI Cooking Assistant** ที่ออกแบบตาม **Microservices Architecture** โดยใช้ **LangGraph State Machine** เป็น core orchestrator สำหรับการจัดการ multi-step reasoning และ interactive decision making

## 🎯 Architecture Principles

### 1. **Security by Design**
- **Zero Trust Architecture**: ตรวจสอบ authentication ทุก request
- **Defense in Depth**: หลายชั้นของการป้องกัน (WAF, Rate Limiting, Input Validation)
- **Least Privilege**: ให้สิทธิ์เฉพาะที่จำเป็น
- **Secrets Management**: จัดการ API keys อย่างปลอดภัยด้วย Google Secret Manager

### 2. **Scalability First**  
- **Horizontal Scaling**: Scale out แทน scale up
- **Stateless Services**: ไม่เก็บ state ใน application layer
- **Async Processing**: ใช้ message queues สำหรับ long-running tasks
- **Caching Strategy**: Multi-layer caching (Memory, Redis, CDN)

### 3. **Observability**
- **Structured Logging**: JSON logs พร้อม correlation IDs
- **Metrics Collection**: Application และ infrastructure metrics
- **Distributed Tracing**: ติดตาม request flow ข้าม services
- **Health Checks**: Readiness และ liveness probes

## 🔄 LangGraph State Machine Design

### State Definition

```python
class CulinaryState(TypedDict):
    # User Context
    user_id: str
    session_id: str
    
    # Input Processing
    user_input: str
    image_data: Optional[bytes]
    parsed_ingredients: List[str]
    
    # Memory Management
    user_profile: UserProfile
    session_context: SessionContext
    
    # Processing States
    analysis_complete: bool
    information_gaps: List[str]
    interaction_needed: bool
    
    # Recipe Processing
    search_results: List[Recipe]
    filtered_recipes: List[Recipe]
    final_recommendation: Recipe
    
    # Response Generation
    response_message: dict
    flex_message: dict
```

### Node Definitions

#### 1. **Input Analysis Node**
- ประมวลผลข้อความและรูปภาพ
- ระบุวัตถุดิบจาก multimodal input
- ตรวจจับ intent และ context

#### 2. **Memory Retrieval Node**
- ดึง user profile จาก Firestore
- โหลด session context
- ตรวจสอบ conversation history

#### 3. **Gap Analysis Node**  
- ประเมินความสมบูรณ์ของข้อมูล
- ระบุข้อมูลที่ขาดหาย
- ตัดสินใจว่าต้องถามเพิ่มหรือไม่

#### 4. **User Interaction Node**
- สร้างคำถามที่เหมาะสม
- จัดการการตอบกลับจาก user
- อัปเดต session context

#### 5. **RAG Search Node**
- ค้นหาสูตรอาหารจาก Vertex AI Search
- กรองผลลัพธ์ตาม user preferences
- ตรวจสอบ source credibility

#### 6. **Response Synthesis Node**
- สร้าง personalized recommendations
- จัดรูปแบบเป็น LINE Flex Message
- เพิ่ม source attribution

## 🛡️ Security Architecture

### Network Security
```
Internet → WAF → Load Balancer → API Gateway → Services
```

### Authentication Flow
```
User → LINE Login → JWT Token → API Gateway → Services
```

### Authorization Layers
1. **API Gateway Level**: Rate limiting, CORS, basic validation
2. **Service Level**: JWT verification, role-based access
3. **Resource Level**: Data-level permissions

### Data Protection
- **Encryption at Rest**: Firestore native encryption
- **Encryption in Transit**: TLS 1.3 throughout
- **PII Handling**: Anonymization และ pseudonymization
- **Audit Logging**: ทุก data access ถูกบันทึก

## 📊 Scalability Strategy

### Horizontal Scaling Patterns

#### 1. **Stateless Services**
```yaml
# Example Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: culinary-api
spec:
  replicas: 3  # Auto-scaling based on CPU/Memory
  strategy:
    type: RollingUpdate
```

#### 2. **Caching Layers**
- **L1 Cache**: In-memory application cache
- **L2 Cache**: Redis cluster สำหรับ session data
- **L3 Cache**: CDN สำหรับ static content

#### 3. **Database Scaling**
- **Firestore**: Native horizontal scaling
- **Read Replicas**: สำหรับ read-heavy workloads
- **Connection Pooling**: เพิ่มประสิทธิภาพ database connections

### Performance Optimization

#### 1. **Async Processing**
```python
# Example: Background recipe processing
@celery.task
async def process_recipe_recommendation(user_id: str, ingredients: List[str]):
    # Long-running AI processing
    pass
```

#### 2. **Batch Operations**
- Batch vector embeddings สำหรับ RAG
- Bulk Firestore operations
- Grouped API calls to external services

#### 3. **Resource Management**
- **CPU Limits**: ป้องกัน resource exhaustion
- **Memory Limits**: ควบคุม memory usage
- **Request Timeouts**: ป้องกัน hanging requests

## 🔍 Monitoring & Observability

### Metrics Collection
```yaml
Key Metrics:
  - Response Time (P50, P95, P99)
  - Error Rate (4xx, 5xx)
  - Throughput (requests/second)
  - Resource Utilization (CPU, Memory)
  - Business Metrics (recipe recommendations, user interactions)
```

### Alerting Strategy
```yaml
Critical Alerts:
  - API Error Rate > 5%
  - Response Time P95 > 2s
  - Service Unavailable
  
Warning Alerts:
  - High Memory Usage > 80%
  - Queue Depth Increase
  - Unusual Traffic Patterns
```

### Distributed Tracing
- **Request ID**: ติดตาม request ตลอด lifecycle
- **Service Maps**: ภาพรวม service dependencies  
- **Performance Bottlenecks**: ระบุ slow components

## 🚀 Deployment Strategy

### CI/CD Pipeline
```yaml
Stages:
  1. Code Quality Checks (linting, type checking)
  2. Unit Tests (>80% coverage)
  3. Integration Tests (API contracts)
  4. Security Scans (vulnerability assessment)
  5. Build & Push (Docker images)
  6. Deploy to Staging
  7. E2E Tests (user journeys)
  8. Deploy to Production (blue-green)
```

### Environment Strategy
- **Development**: Local Docker Compose
- **Staging**: GKE cluster (single node)
- **Production**: GKE cluster (multi-zone, auto-scaling)

### Rollback Strategy
- **Blue-Green Deployment**: Zero-downtime deployments
- **Health Checks**: Automated rollback on failure
- **Database Migrations**: Forward-compatible schemas

---

## 📚 Additional Resources

- [API Documentation](./api-documentation.md)
- [Deployment Guide](./deployment-guide.md)  
- [Security Guidelines](./security-guidelines.md)
- [Troubleshooting Guide](./troubleshooting.md)