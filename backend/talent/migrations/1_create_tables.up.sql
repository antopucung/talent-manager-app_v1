CREATE TABLE talents (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  bio TEXT,
  location VARCHAR(255),
  skills TEXT[], -- Array of skills
  experience_level VARCHAR(50) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  hourly_rate DOUBLE PRECISION,
  availability VARCHAR(50) CHECK (availability IN ('available', 'busy', 'unavailable')),
  profile_image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE talent_media (
  id BIGSERIAL PRIMARY KEY,
  talent_id BIGINT REFERENCES talents(id) ON DELETE CASCADE,
  media_type VARCHAR(20) CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  story_content TEXT,
  budget_min DOUBLE PRECISION,
  budget_max DOUBLE PRECISION,
  project_type VARCHAR(50) CHECK (project_type IN ('film', 'commercial', 'tv_show', 'documentary', 'music_video', 'other')),
  required_skills TEXT[],
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_by_user_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE talent_matches (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  talent_id BIGINT REFERENCES talents(id) ON DELETE CASCADE,
  match_score DOUBLE PRECISION,
  ai_reasoning TEXT,
  status VARCHAR(50) DEFAULT 'suggested' CHECK (status IN ('suggested', 'contacted', 'hired', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_type VARCHAR(20) CHECK (user_type IN ('talent', 'client')),
  user_id BIGINT NOT NULL,
  subscription_type VARCHAR(50) CHECK (subscription_type IN ('gallery_upgrade', 'verification', 'ai_premium')),
  tier VARCHAR(50) CHECK (tier IN ('basic', 'premium')),
  price DOUBLE PRECISION,
  billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'yearly')),
  starts_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_talents_skills ON talents USING GIN(skills);
CREATE INDEX idx_talents_location ON talents(location);
CREATE INDEX idx_talents_subscription_tier ON talents(subscription_tier);
CREATE INDEX idx_projects_required_skills ON projects USING GIN(required_skills);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_talent_matches_project_id ON talent_matches(project_id);
CREATE INDEX idx_talent_matches_talent_id ON talent_matches(talent_id);
