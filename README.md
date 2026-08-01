# Distributed Order Processing System

An event-driven microservices application built using **Node.js**, **TypeScript**, **RabbitMQ**, **MySQL**, **Prisma ORM**, **Docker**, and the **Saga Orchestration Pattern**.

The system demonstrates distributed transactions, asynchronous communication, retry mechanisms, dead-letter queues (DLQ), idempotent consumers, and compensation workflows.

---

# Architecture

![System Architecture](images/architecture.png)

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Programming Language |
| Express.js | REST API |
| RabbitMQ | Message Broker |
| MySQL | Database |
| Prisma ORM | Database ORM |
| Docker | Containerization |
| Docker Compose | Multi-container setup |

---

# Project Structure

```
order-processing-system/
│
├── README.md
├── docker-compose.yml
├── images/
│   └── architecture.png
│
├── postman/
│   └── Order Processing.postman_collection.json
│
└── backend/
    ├── order-service/
    ├── inventory-service/
    ├── payment-service/
    ├── shipping-service/
    ├── notification-service/
    └── saga-orchestrator/
```

---

# Services

## Order Service

Responsibilities

- Create Order
- Publish `order.created`
- Listen `inventory.released`
- Cancel Order

Database

- MySQL

---

## Inventory Service

Responsibilities

- Reserve Inventory
- Release Inventory
- Retry Failed Messages
- Dead Letter Queue Handling

Database

- MySQL

---

## Payment Service

Responsibilities

- Process Payment
- Publish
    - payment.completed
    - payment.failed

Database

- MySQL

---

## Shipping Service

Responsibilities

- Create Shipment
- Publish shipment.created

Database

- MySQL

---

## Notification Service

Responsibilities

- Send Email Notification
- Send Shipment Notification

Database

- MySQL

---

## Saga Orchestrator

Responsibilities

- Listen Domain Events
- Coordinate Distributed Transaction
- Trigger Compensation Flow

---

# Event Flow (Success)

```
Client
   │
   ▼
Order Service
   │
order.created
   ▼
RabbitMQ
   ▼
Inventory Service
   │
inventory.reserved
   ▼
RabbitMQ
   ▼
Payment Service
   │
payment.completed
   ▼
RabbitMQ
   ▼
Shipping Service
   │
shipment.created
   ▼
RabbitMQ
   ▼
Notification Service
```

---

# Compensation Flow

```
payment.failed
      │
      ▼
Saga Orchestrator
      │
inventory.release
      ▼
RabbitMQ
      ▼
Inventory Service
      │
inventory.released
      ▼
RabbitMQ
      ▼
Order Service
      │
order.cancelled
```

---

# Retry & Dead Letter Queue

Inventory Service supports automatic retries.

Flow

```
Inventory Queue
      │
      ▼
Processing
      │
Error
      ▼
Retry Queue
(5 Seconds TTL)
      │
Retry
      ▼
Inventory Queue
      │
3 Attempts
      ▼
Dead Letter Queue
```

---

# Correlation ID

Every order is assigned a unique Correlation ID.

Example

```
345c5fd3-d08c-41a4-9e76-19675bcd77d9
```

The Correlation ID is propagated across all microservices to trace the lifecycle of an order.

---

# Idempotent Consumer

Shipping Service implements idempotent consumers.

Duplicate events are ignored using the `ProcessedEvent` table.

---

# API

## Create Order

**POST**

```
/orders
```

Request

```json
{
    "customerId":"CUST-001",
    "sku":"LAPTOP",
    "quantity":1
}
```

Response

```json
{
    "message":"Order Created"
}
```

---

# Running the Project

## Clone

```bash
git clone <repository-url>
```

---

## Start RabbitMQ & MySQL

```bash
docker-compose up -d
```

---

## Install Dependencies

Example

```bash
cd backend/order-service
npm install
```

Repeat for every service.

---

## Start Services

Order Service

```bash
npm run dev
```

Inventory Service

```bash
npm run dev
```

Payment Service

```bash
npm run dev
```

Shipping Service

```bash
npm run dev
```

Notification Service

```bash
npm run dev
```

Saga Orchestrator

```bash
npm run dev
```

---

# RabbitMQ Exchanges

| Exchange | Type |
|----------|------|
| order-exchange | Topic |
| retry-exchange | Direct |
| dlx-exchange | Direct |

---

# Main Events

- order.created
- inventory.reserved
- payment.completed
- payment.failed
- inventory.release
- inventory.released
- shipment.created
- order.cancelled

---

# Features

- Event Driven Architecture
- Saga Orchestration
- RabbitMQ Topic Exchange
- Retry Queue
- Dead Letter Queue
- Correlation IDs
- Idempotent Consumer
- Dockerized Services
- Prisma ORM
- MySQL
- Compensation Transactions
- Structured Logging
- Microservices Architecture

---

# Author

**Abhay Tripathi**

Full Stack Developer

Node.js | TypeScript | Angular | NestJS | RabbitMQ | Docker | Prisma | MySQL