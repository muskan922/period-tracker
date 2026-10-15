-- PostgreSQL Database Schema for Flora Period Tracker

-- Create Database (run manually in psql if needed: CREATE DATABASE flora_period_tracker;)

-- Drop existing tables
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS medication_completions CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS symptom_logs CASCADE;
DROP TABLE IF EXISTS mood_logs CASCADE;
DROP TABLE IF EXISTS cycle_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'Emma Rose',
    email VARCHAR(150) UNIQUE DEFAULT 'emma@flora.com',
    password_hash VARCHAR(255) DEFAULT '$2a$10$abcdefghijklmnopqrstuv',
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    age INTEGER DEFAULT 26,
    cycle_length INTEGER DEFAULT 28,
    period_length INTEGER DEFAULT 5,
    last_period_start DATE DEFAULT '2026-07-05',
    theme VARCHAR(30) DEFAULT 'vintage',
    water_target INTEGER DEFAULT 2500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cycle Logs Table
CREATE TABLE cycle_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    flow VARCHAR(20) NOT NULL, -- 'Light', 'Medium', 'Heavy'
    pain INTEGER DEFAULT 1,    -- 1-10
    symptoms TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Mood Logs Table
CREATE TABLE mood_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    mood VARCHAR(30) NOT NULL, -- 'Happy', 'Calm', 'Sad', 'Anxious', 'Angry', 'Tired'
    note TEXT,
    UNIQUE(user_id, log_date)
);

-- 4. Daily Vitals & Symptoms Log Table (30-day tracking)
CREATE TABLE symptom_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    cramps INTEGER DEFAULT 0,
    bloating INTEGER DEFAULT 0,
    headache INTEGER DEFAULT 0,
    acne INTEGER DEFAULT 0,
    back_pain INTEGER DEFAULT 0,
    water_intake INTEGER DEFAULT 0, -- in ml
    sleep_hours NUMERIC(3,1) DEFAULT 7.0,
    weight NUMERIC(4,1) DEFAULT 58.0,
    exercise_minutes INTEGER DEFAULT 0,
    UNIQUE(user_id, log_date)
);

-- 5. Medications Table
CREATE TABLE medications (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    time VARCHAR(30) NOT NULL,
    repeat_schedule VARCHAR(50) DEFAULT 'Daily',
    notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Medication Completion Logs Table
CREATE TABLE medication_completions (
    id SERIAL PRIMARY KEY,
    medication_id VARCHAR(50) REFERENCES medications(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    UNIQUE(medication_id, completed_date)
);

-- 7. Appointments Table
CREATE TABLE appointments (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(150) NOT NULL,
    specialty VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(30) NOT NULL,
    notes TEXT,
    synced BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Community Posts Table
CREATE TABLE community_posts (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '🌸',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    likes INTEGER DEFAULT 0,
    liked BOOLEAN DEFAULT false,
    saved BOOLEAN DEFAULT false,
    time_ago VARCHAR(50) DEFAULT 'Just now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Post Comments Table
CREATE TABLE post_comments (
    id VARCHAR(50) PRIMARY KEY,
    post_id VARCHAR(50) REFERENCES community_posts(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '🌸',
    content TEXT NOT NULL,
    time_ago VARCHAR(50) DEFAULT 'Just now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Notifications Table
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL, -- 'ai', 'med', 'app'
    is_read BOOLEAN DEFAULT false,
    time_label VARCHAR(50) DEFAULT 'Luteal Phase',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
