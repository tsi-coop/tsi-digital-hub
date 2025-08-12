-- init.sql for Docker installation

-- Enable vector extension if not already enabled (for PostgreSQL with pgvector)
-- CREATE EXTENSION IF NOT EXISTS vector;

---
-- Schema Definitions
---
CREATE EXTENSION vector;

CREATE TABLE IF NOT EXISTS _state (
    state_slug VARCHAR(2) NOT NULL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    region VARCHAR(10),
    active SMALLINT DEFAULT 1
);

---

CREATE TABLE IF NOT EXISTS _city (
    city_slug VARCHAR(20) NOT NULL PRIMARY KEY,
    state_slug VARCHAR(2) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    active SMALLINT DEFAULT 1,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug)
);

---

CREATE TABLE IF NOT EXISTS _taxonomy (
    txy_id INTEGER NOT NULL PRIMARY KEY,
    txy_slug VARCHAR(40) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(100),
    is_root BOOLEAN NOT NULL,
    parent VARCHAR(40),
    active SMALLINT DEFAULT 1
    -- No direct foreign key for 'parent' as it references a slug, not a primary key in the same table.
    -- This would typically be handled at the application level or with a trigger for validation.
);

---

CREATE TABLE IF NOT EXISTS _solution_tags (
    solution_tag_id INTEGER NOT NULL PRIMARY KEY,
    txy_slug VARCHAR(40) NOT NULL,
    solution_type VARCHAR(20) NOT NULL,
    solution_slug VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(100),
    solution_search TEXT,
    active SMALLINT DEFAULT 1,
    FOREIGN KEY (txy_slug) REFERENCES _taxonomy(txy_slug)
);

---

CREATE TABLE IF NOT EXISTS _service_tags (
    service_tag_id INTEGER NOT NULL PRIMARY KEY,
    txy_slug VARCHAR(40) NOT NULL,
    service_type VARCHAR(20) NOT NULL,
    service_slug VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(100),
    service_search TEXT,
    active SMALLINT DEFAULT 1,
    FOREIGN KEY (txy_slug) REFERENCES _taxonomy(txy_slug)
);

---

CREATE TABLE IF NOT EXISTS _training_tags (
    training_tag_id INTEGER NOT NULL PRIMARY KEY,
    txy_slug VARCHAR(40) NOT NULL,
    training_type VARCHAR(20) NOT NULL,
    training_slug VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(100),
    training_search TEXT,
    active SMALLINT DEFAULT 1,
    FOREIGN KEY (txy_slug) REFERENCES _taxonomy(txy_slug)
);

---

CREATE TABLE IF NOT EXISTS _skill_tags (
    skill_tag_id INTEGER NOT NULL PRIMARY KEY,
    txy_slug VARCHAR(40) NOT NULL,
    skill_type VARCHAR(20) NOT NULL,
    skill_slug VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(100),
    skill_search TEXT,
    active SMALLINT DEFAULT 1,
    FOREIGN KEY (txy_slug) REFERENCES _taxonomy(txy_slug)
);

---

CREATE TABLE IF NOT EXISTS _lookup (
    lookup_id INTEGER NOT NULL PRIMARY KEY,
    lookup_type VARCHAR(40) NOT NULL,
    lookup_slug VARCHAR(20) NOT NULL,
    lookup_value VARCHAR(40) NOT NULL,
    active SMALLINT DEFAULT 1
);

---

CREATE TABLE IF NOT EXISTS _member_registry (
    email VARCHAR(40) NOT NULL PRIMARY KEY,
    account_type VARCHAR(20) NOT NULL,
    secret TEXT,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

---

CREATE TABLE IF NOT EXISTS _organization_account (
    account_slug VARCHAR(40) NOT NULL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    org_name VARCHAR(50) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    start_year INTEGER NOT NULL,
    category VARCHAR(40),
    num_employees_range VARCHAR(20),
    industry_slug VARCHAR(20) NOT NULL,
    state_slug VARCHAR(2) NOT NULL,
    city_slug VARCHAR(20) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    solutions_interested TEXT[],
    services_interested TEXT[],
    training_interested TEXT[],
    skills_interested TEXT[],
    txy_interested TEXT[],
    solutions_interested_vector vector(500),
    services_interested_vector vector(500),
    training_interested_vector vector(500),
    skills_interested_vector vector(500),
    txy_interested_vector vector(500),
    visible SMALLINT DEFAULT 0,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INTEGER,
    about VARCHAR(1000) DEFAULT '',
    plan_type SMALLINT DEFAULT 0,
    plan_expiry DATE DEFAULT CURRENT_DATE + INTERVAL '1 year',
    tsv_body TSVECTOR,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- industry_slug would ideally reference a _lookup table for industries if one exists.
);

---

CREATE TABLE IF NOT EXISTS _professional_account (
    account_slug VARCHAR(40) NOT NULL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    name VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL DEFAULT 'M',
    household_income VARCHAR(30),
    college VARCHAR(40),
    disability VARCHAR(30),
    start_year INTEGER NOT NULL,
    industry_slug VARCHAR(20) NOT NULL,
    state_slug VARCHAR(2) NOT NULL, -- Changed from VARCHAR(4) to VARCHAR(2) to match _state
    city_slug VARCHAR(20) NOT NULL,
    solutions_interested TEXT[],
    services_interested TEXT[],
    training_interested TEXT[],
    skills_interested TEXT[],
    txy_interested TEXT[],
    solutions_interested_vector vector(500),
    services_interested_vector vector(500),
    training_interested_vector vector(500),
    skills_interested_vector vector(500),
    txy_interested_vector vector(500),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INTEGER,
    status SMALLINT DEFAULT 0,
    visible SMALLINT DEFAULT 0,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    about VARCHAR(1000) DEFAULT '',
    tsv_body TSVECTOR,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- industry_slug would ideally reference a _lookup table for industries if one exists.
);

---

CREATE TABLE IF NOT EXISTS _role (
    role_slug VARCHAR(30) NOT NULL PRIMARY KEY,
    description VARCHAR(100) NOT NULL,
    active SMALLINT DEFAULT 1
);

---

CREATE TABLE IF NOT EXISTS _user (
    user_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(40) NOT NULL,
    secret TEXT,
    role_slug VARCHAR(30) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    active SMALLINT DEFAULT 1,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_slug) REFERENCES _role(role_slug)
    -- account_slug could reference _organization_account or _professional_account
    -- This typically implies a check constraint or a separate "accounts" master table.
);

---

CREATE TABLE IF NOT EXISTS _kyc (
    kyc_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    kyc_type VARCHAR(20) NOT NULL,
    kyc_detail VARCHAR(100) NOT NULL,
    doc_path VARCHAR(100),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _solution (
    solution_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    title VARCHAR(100) NOT NULL,
    positioning VARCHAR(1000),
    features TEXT,
    benefits TEXT,
    collaterals TEXT[],
    start_year SMALLINT,
    num_customers_range VARCHAR(20),
    solutions_offered TEXT[],
    solutions_offered_vector vector(500),
    skills_used TEXT[],
    skills_used_vector vector(500),
    visible SMALLINT DEFAULT 0,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    industry_slug VARCHAR(20) NOT NULL,
    state_slug VARCHAR(2) NOT NULL,
    city_slug VARCHAR(20) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    solution_link VARCHAR(400),
    tsv_body TSVECTOR,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _service (
    service_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    title VARCHAR(100) NOT NULL,
    positioning VARCHAR(1000),
    description TEXT,
    collaterals TEXT[],
    start_year SMALLINT,
    num_customers_range VARCHAR(20),
    services_offered TEXT[],
    services_offered_vector vector(500),
    skills_used TEXT[],
    skills_used_vector vector(500),
    visible SMALLINT DEFAULT 0,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    industry_slug VARCHAR(20) NOT NULL,
    state_slug VARCHAR(2) NOT NULL,
    city_slug VARCHAR(20) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    service_link VARCHAR(400),
    tsv_body TSVECTOR,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _training (
    training_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    title VARCHAR(100) NOT NULL,
    positioning VARCHAR(1000),
    course_outline TEXT,
    collaterals TEXT[],
    start_year SMALLINT,
    num_students_range VARCHAR(20),
    trainings_offered TEXT[],
    trainings_offered_vector vector(500),
    skills_offered TEXT[],
    skills_offered_vector vector(500),
    visible SMALLINT DEFAULT 0,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    industry_slug VARCHAR(20) NOT NULL,
    state_slug VARCHAR(2) NOT NULL,
    city_slug VARCHAR(20) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    training_link VARCHAR(400),
    tsv_body TSVECTOR,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _enquiry (
    enquiry_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    enquiry_type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    query TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    discoverable SMALLINT DEFAULT 0,
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    status SMALLINT DEFAULT 0,
    tsv_body TSVECTOR
    -- from_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _enquiry_recipients (
    recipient_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    enquiry_id BIGINT NOT NULL,
    sender_name VARCHAR(40),
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enquiry_id) REFERENCES _enquiry(enquiry_id)
    -- account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _rfp (
    rfp_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    rfp_type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    summary TEXT,
    expiry DATE,
    docs TEXT[],
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    discoverable SMALLINT DEFAULT 0,
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    status SMALLINT DEFAULT 0,
    tsv_body TSVECTOR
    -- from_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _rfp_recipients (
    recipient_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    rfp_id BIGINT NOT NULL,
    sender_name VARCHAR(40),
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rfp_id) REFERENCES _rfp(rfp_id)
    -- account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _testimonial (
    testimonial_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    testimonial_type VARCHAR(20) NOT NULL,
    testimonial TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    to_account_type VARCHAR(20) NOT NULL,
    to_account_slug VARCHAR(40) NOT NULL,
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    status SMALLINT DEFAULT 0,
    tsv_body TSVECTOR
    -- from_account_slug and to_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _post (
    post_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    content_brief VARCHAR(1000),
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    source_link VARCHAR(400),
    status SMALLINT DEFAULT 0,
    disscount INTEGER DEFAULT 0,
    tsv_body TSVECTOR
    -- from_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _discussion (
    discussion_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    content_type VARCHAR(20) NOT NULL,
    content_uuid VARCHAR(36),
    parent_uuid VARCHAR(36),
    discussion_note TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    to_account_type VARCHAR(20) NOT NULL,
    to_account_slug VARCHAR(40) NOT NULL,
    counted SMALLINT DEFAULT 0,
    txy_offered TEXT[],
    txy_offered_vector vector(500)
    -- content_uuid and parent_uuid would likely reference UUIDs from other content tables (_post, _solution, etc.)
    -- from_account_slug and to_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _job (
    job_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100),
    description TEXT,
    state_slug VARCHAR(2),
    city_slug VARCHAR(20),
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 0,
    tsv_body TSVECTOR,
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- from_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _job_application (
    job_application_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    job_id BIGINT NOT NULL,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    applicant_name VARCHAR(40) NOT NULL,
    covering_letter TEXT,
    state_slug VARCHAR(2) NOT NULL,
    city_slug VARCHAR(20) NOT NULL,
    resume_path VARCHAR(200),
    status SMALLINT,
    to_account_type VARCHAR(20) NOT NULL,
    to_account_slug VARCHAR(40) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES _job(job_id),
    FOREIGN KEY (state_slug) REFERENCES _state(state_slug),
    FOREIGN KEY (city_slug) REFERENCES _city(city_slug)
    -- from_account_slug and to_account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _moderation (
    moderation_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content_type VARCHAR(20) NOT NULL,
    content_uuid VARCHAR(36) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 0,
    comments VARCHAR(400)
    -- content_uuid would reference UUIDs from various content tables
);

---

CREATE TABLE IF NOT EXISTS _support_request (
    support_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    type VARCHAR(20) NOT NULL,
    query VARCHAR(200) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 0
    -- account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _email_template (
    template_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(20),
    template TEXT,
    active SMALLINT DEFAULT 0
);

---

CREATE TABLE IF NOT EXISTS _invite (
    invite_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    subject VARCHAR(100),
    template_id INTEGER NOT NULL,
    recipients TEXT[],
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 0,
    FOREIGN KEY (template_id) REFERENCES _email_template(template_id)
);

---

CREATE TABLE IF NOT EXISTS _precise_letter (
    letter_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    subject VARCHAR(100),
    body TEXT,
    to_account_type VARCHAR(20) NOT NULL,
    to_account_slug VARCHAR(40) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- to_account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _audit_log (
    audit_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type VARCHAR(20) NOT NULL,
    user_id BIGINT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES _user(user_id)
);

---

CREATE TABLE IF NOT EXISTS _notification (
    notification_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(200),
    content_type VARCHAR(20) NOT NULL,
    content_uuid VARCHAR(36) NOT NULL,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    to_account_type VARCHAR(20) NOT NULL,
    to_account_slug VARCHAR(40) NOT NULL,
    viewed SMALLINT DEFAULT 0,
    email_sent SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- content_uuid would reference UUIDs from various content tables
    -- from_account_slug and to_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _document (
    _did INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    file_extn VARCHAR(12),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

---

CREATE TABLE IF NOT EXISTS _cfeed (
    cfeed_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    content_type VARCHAR(20) NOT NULL,
    content_uuid VARCHAR(36),
    title VARCHAR(100) NOT NULL,
    summary TEXT,
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    status SMALLINT DEFAULT 0,
    community_section VARCHAR(30) NOT NULL
    -- content_uuid would reference UUIDs from various content tables
    -- from_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _meetup (
    meetup_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    meeting_date DATE NOT NULL,
    meeting_time VARCHAR(30) NOT NULL,
    meeting_link VARCHAR(1000),
    meeting_city VARCHAR(20),
    meeting_state VARCHAR(2),
    meeting_address VARCHAR(300),
    meeting_geo_link VARCHAR(300),
    txy_offered TEXT[],
    txy_offered_vector vector(500),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    from_account_type VARCHAR(20) NOT NULL,
    from_account_slug VARCHAR(40) NOT NULL,
    posted_by VARCHAR(50) NOT NULL,
    status SMALLINT DEFAULT 0,
    tsv_body TSVECTOR,
    FOREIGN KEY (meeting_state) REFERENCES _state(state_slug),
    FOREIGN KEY (meeting_city) REFERENCES _city(city_slug)
    -- from_account_slug would reference _organization_account or _professional_account
    -- posted_by would ideally reference a _user table's email or ID
);

---

CREATE TABLE IF NOT EXISTS _ambassador_account (
    account_slug VARCHAR(40) NOT NULL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE,
    name VARCHAR(50) NOT NULL,
    solutions_interested TEXT[],
    services_interested TEXT[],
    training_interested TEXT[],
    skills_interested TEXT[],
    txy_interested TEXT[],
    solutions_interested_vector vector(500),
    services_interested_vector vector(500),
    training_interested_vector vector(500),
    skills_interested_vector vector(500),
    txy_interested_vector vector(500),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INTEGER,
    status SMALLINT DEFAULT 0,
    visible SMALLINT DEFAULT 0,
    about VARCHAR(1000) DEFAULT '',
    plan_type SMALLINT DEFAULT 0,
    plan_expiry DATE DEFAULT CURRENT_DATE + INTERVAL '1 year'
);

---

CREATE TABLE IF NOT EXISTS _donation_receipt (
    receipt_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    donation_type VARCHAR(30) NOT NULL DEFAULT 'member_services',
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    account_name VARCHAR(50) NOT NULL,
    kyc_type VARCHAR(20) NOT NULL,
    kyc_detail VARCHAR(30) NOT NULL,
    start_date DATE,
    end_date DATE,
    amount_paid FLOAT NOT NULL,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT DEFAULT ''
    -- account_slug would reference _organization_account or _professional_account
);

---

CREATE TABLE IF NOT EXISTS _rating (
    assessment_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid VARCHAR(36) UNIQUE,
    org_name VARCHAR(50) NOT NULL,
    assessment_type VARCHAR(30) NOT NULL DEFAULT 'digital_maturity',
    version VARCHAR(10) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    account_slug VARCHAR(40) NOT NULL,
    assessment JSON NOT NULL,
    results JSON NOT NULL,
    status SMALLINT DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- account_slug would reference _organization_account or _professional_account
);

---
-- Indexes and Alterations
---

CREATE INDEX idx__cfeed_status_created ON _cfeed (status, created DESC);

---

CREATE INDEX idx__cfeed_txy_offered_vector ON _cfeed USING HNSW (txy_offered_vector vector_l2_ops);

---

ALTER TABLE _cfeed ALTER COLUMN summary TYPE TEXT;

---
-- Load master data (with docker)
\COPY _state FROM '/docker-entrypoint-initdb.d/_state.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _city FROM '/docker-entrypoint-initdb.d/_city.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _lookup FROM '/docker-entrypoint-initdb.d/_lookup.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _role FROM '/docker-entrypoint-initdb.d/_role.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _taxonomy FROM '/docker-entrypoint-initdb.d/_taxonomy.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _solution_tags FROM '/docker-entrypoint-initdb.d/_solution_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _service_tags FROM '/docker-entrypoint-initdb.d/_service_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _training_tags FROM '/docker-entrypoint-initdb.d/_training_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
\COPY _skill_tags FROM '/docker-entrypoint-initdb.d/_skill_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
---

---
-- Load master data (without docker)
-- \COPY _state FROM 'C:/work/tsi-digital-hub/backend/db/_state.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _city FROM 'C:/work/tsi-digital-hub/backend/db/_city.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _lookup FROM 'C:/work/tsi-digital-hub/backend/db/_lookup.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _role FROM 'C:/work/tsi-digital-hub/backend/db/_role.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _taxonomy FROM 'C:/work/tsi-digital-hub/backend/db/_taxonomy.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _solution_tags FROM 'C:/work/tsi-digital-hub/backend/db/_solution_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _service_tags FROM 'C:/work/tsi-digital-hub/backend/db/_service_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _training_tags FROM 'C:/work/tsi-digital-hub/backend/db/_training_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
-- \COPY _skill_tags FROM 'C:/work/tsi-digital-hub/backend/db/_skill_tags.csv' WITH (FORMAT CSV, DELIMITER '|');
---

INSERT INTO _organization_account(account_slug,org_name,account_type,start_year,industry_slug,state_slug,city_slug,latitude,longitude) SELECT 'tsicoop.org', 'TSI TECH SOLUTIONS COOP FOUNDATION','ADMIN',2024,'IT','TN','Coimbatore',0,0 WHERE NOT EXISTS (SELECT account_slug FROM _organization_account WHERE account_slug='tsicoop.org');
INSERT INTO _USER (name,role_slug,email,mobile,account_type,account_slug) SELECT 'System Administrator','ADMIN','admin@tsicoop.org','123456789','ADMIN','tsicoop.org' WHERE NOT EXISTS (SELECT email FROM _user WHERE email='admin@tsicoop.org');

