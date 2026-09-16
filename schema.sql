CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE - Auth-linked user roles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    community_slug VARCHAR(50) DEFAULT 'wambule',
    role TEXT DEFAULT 'contributor' CHECK (role IN ('contributor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. DICTIONARY TABLE - Wambule language entries
CREATE TABLE dictionary (
    id BIGSERIAL PRIMARY KEY,
    community_slug VARCHAR(50) DEFAULT 'wambule',
    word_devanagari VARCHAR(255) NOT NULL,
    word_sirijanga VARCHAR(255),
    romanized VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    dialect_origin VARCHAR(100) DEFAULT 'Standard',
    meaning_nepali TEXT NOT NULL,
    meaning_english TEXT NOT NULL,
    example_sentence_wambule TEXT,
    example_sentence_nepali TEXT,
    audio_path TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. MEDIA_HUB TABLE - Heritage media submissions
CREATE TABLE media_hub (
    id BIGSERIAL PRIMARY KEY,
    community_slug VARCHAR(50) DEFAULT 'wambule',
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('music', 'story', 'heritage_photo')),
    description TEXT,
    media_path TEXT NOT NULL,
    transcript TEXT,
    district_origin VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_hub ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES - Profiles Table
CREATE POLICY "Public profiles read"
    ON profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Profile owner update"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- 6. RLS POLICIES - Dictionary Table
CREATE POLICY "Dictionary public read"
    ON dictionary
    FOR SELECT
    USING (true);

CREATE POLICY "Dictionary admin edit"
    ON dictionary
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 7. RLS POLICIES - Media Hub Table
CREATE POLICY "Media approved read"
    ON media_hub
    FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Media admin full access"
    ON media_hub
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Media contributor submit"
    ON media_hub
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Media admin update status"
    ON media_hub
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 8. FULL TEXT SEARCH INDEX - Dictionary Table
ALTER TABLE dictionary ADD COLUMN fts_vector tsvector
    GENERATED ALWAYS AS (
        to_tsvector('simple', coalesce(word_devanagari, '')) ||
        to_tsvector('simple', coalesce(word_sirijanga, '')) ||
        to_tsvector('simple', coalesce(romanized, '')) ||
        to_tsvector('english', coalesce(meaning_english, ''))
    ) STORED;

CREATE INDEX dictionary_fts_idx ON dictionary USING gin(fts_vector);
