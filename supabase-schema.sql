-- ==========================================
-- 0. CLEANUP (DROP EXISTING TABLES & USERS)
-- ==========================================
DROP FUNCTION IF EXISTS GET_PUBLIC_AVAILABILITY(DATE, DATE);
DROP TABLE IF EXISTS INQUIRIES CASCADE;

-- Remove existing admin user if they exist to avoid conflicts
DO $$
BEGIN
    DELETE FROM auth.identities WHERE email = 'jombenitez96@gmail.com';
    DELETE FROM auth.users WHERE email = 'jombenitez96@gmail.com';
END $$;


-- ==========================================
-- 1. SETUP EXTENSIONS & TABLES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE INQUIRIES (
    ID              UUID DEFAULT uuid_generate_v4() PRIMARY KEY
,   CLIENT_NAME     TEXT NOT NULL
,   EMAIL           TEXT
,   PHONE           TEXT
,   LOCATION        TEXT
,   PROJECT_NOTES   TEXT
,   SERVICE_TYPE    TEXT NOT NULL
,   EVENT_DATE      DATE NOT NULL
,   START_TIME      TIME NOT NULL
,   END_TIME        TIME NOT NULL
,   STATUS          TEXT NOT NULL DEFAULT 'PENDING'
,   SOURCE          TEXT NOT NULL DEFAULT 'WEBSITE'
,   ADMIN_NOTES     TEXT
,   CREATED_AT      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
,   UPDATED_AT      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE INQUIRIES ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 3. PUBLIC POLICIES
-- ==========================================
-- ALLOW ANYONE TO SUBMIT A NEW INQUIRY (BUT STRICTLY RESTRICT WHAT THEY CAN INSERT)
CREATE POLICY "ALLOW PUBLIC INSERT" ON INQUIRIES
    FOR INSERT 
    WITH CHECK (
        STATUS = 'PENDING' 
        AND SOURCE = 'WEBSITE' 
        AND ADMIN_NOTES IS NULL
    );


-- ==========================================
-- 4. ADMIN POLICIES
-- ==========================================
-- ADMINS (AUTHENTICATED USERS) HAVE FULL ACCESS
CREATE POLICY "ALLOW AUTHENTICATED READ" ON INQUIRIES
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "ALLOW AUTHENTICATED UPDATE" ON INQUIRIES
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "ALLOW AUTHENTICATED DELETE" ON INQUIRIES
    FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "ALLOW AUTHENTICATED INSERT" ON INQUIRIES
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');


-- ==========================================
-- 5. SECURE FUNCTION FOR PUBLIC AVAILABILITY
-- ==========================================
-- THIS FUNCTION RUNS AS THE DATABASE OWNER (SECURITY DEFINER), BYPASSING RLS,
-- BUT IT ONLY RETURNS THE EVENT_DATE AND STATUS COLUMNS, KEEPING ALL CLIENT DATA SECURE.
CREATE OR REPLACE FUNCTION GET_PUBLIC_AVAILABILITY(START_DATE DATE, END_DATE DATE)
RETURNS TABLE (
    EVENT_DATE DATE
,   STATUS TEXT
) 
LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$
  SELECT 
      EVENT_DATE
  ,   STATUS 
  FROM 
      INQUIRIES
  WHERE 
      EVENT_DATE >= START_DATE 
      AND EVENT_DATE <= END_DATE
      AND STATUS IN ('PENDING', 'CONFIRMED', 'COMPLETED');
$$;


-- ==========================================
-- 6. SEED ADMIN USER
-- ==========================================
DO $$
DECLARE
    NEW_USER_ID UUID := uuid_generate_v4();
BEGIN
    -- 1. CREATE THE USER IN THE AUTH SCHEMA
    INSERT INTO AUTH.USERS (
        ID
    ,   INSTANCE_ID
    ,   EMAIL
    ,   ENCRYPTED_PASSWORD
    ,   EMAIL_CONFIRMED_AT
    ,   RAW_APP_META_DATA
    ,   RAW_USER_META_DATA
    ,   CREATED_AT
    ,   UPDATED_AT
    ,   ROLE
    ,   CONFIRMATION_TOKEN
    ,   EMAIL_CHANGE
    ,   EMAIL_CHANGE_TOKEN_NEW
    ,   RECOVERY_TOKEN
    )
    VALUES (
        NEW_USER_ID
    ,   '00000000-0000-0000-0000-000000000000'
    ,   'jombenitez96@gmail.com'
    ,   crypt('Fanny26!', gen_salt('bf'))
    ,   NOW()
    ,   '{"provider":"email","providers":["email"]}'
    ,   '{}'
    ,   NOW()
    ,   NOW()
    ,   'authenticated'
    ,   ''
    ,   ''
    ,   ''
    ,   ''
    );
  
    -- 2. CREATE THE REQUIRED AUTH IDENTITY
    INSERT INTO AUTH.IDENTITIES (
        ID
    ,   USER_ID
    ,   IDENTITY_DATA
    ,   PROVIDER
    ,   PROVIDER_ID
    ,   LAST_SIGN_IN_AT
    ,   CREATED_AT
    ,   UPDATED_AT
    )
    VALUES (
        uuid_generate_v4()
    ,   NEW_USER_ID
    ,   format('{"sub":"%s","email":"%s"}', NEW_USER_ID::text, 'jombenitez96@gmail.com')::jsonb
    ,   'email'
    ,   NEW_USER_ID::text
    ,   NOW()
    ,   NOW()
    ,   NOW()
    );
END $$;
