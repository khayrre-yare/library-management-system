# Library Management System — ERD

```mermaid
erDiagram
    USERS ||--o{ BORROWINGS : submits
    BOOKS ||--o{ BORROWINGS : requested_in
    CATEGORIES ||--o{ BOOKS : classifies

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar role
        timestamp created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
    }

    BOOKS {
        bigint id PK
        bigint category_id FK
        varchar title
        varchar author
        varchar isbn UK
        varchar description
        varchar cover_url
        integer published_year
        integer total_copies
        integer available_copies
        timestamp created_at
        timestamp updated_at
    }

    BORROWINGS {
        bigint id PK
        bigint user_id FK
        bigint book_id FK
        varchar status
        timestamp requested_at
        timestamp approved_at
        timestamp due_date
        timestamp returned_at
    }

    CONTACT_MESSAGES {
        bigint id PK
        varchar name
        varchar email
        varchar subject
        varchar message
        boolean is_read
        timestamp created_at
    }
```

## Relationships

- One category can contain many books.
- One user can submit many borrowing requests.
- One book can appear in many borrowing records over time.
- Contact messages are independent records reviewed by an administrator.

## Borrowing status flow

```text
PENDING ──> APPROVED ──> RETURNED
   └──────> REJECTED
```
