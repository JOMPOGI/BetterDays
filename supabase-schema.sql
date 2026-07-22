-- Supabase schema for Better Days Studios Inquiries

-- Create the inquiries table
CREATE TABLE inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    social_handle TEXT,
    location TEXT,
    project_notes TEXT,
    category TEXT NOT NULL, -- e.g., 'Wedding', 'Birthday', 'Commercial', 'Portrait', 'Studio'
    service_type TEXT NOT NULL, -- e.g., 'Photography', 'Videography', 'Both'
    event_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'AVAILABLE', 'PENDING', 'CONFIRMED', 'BOOKED', 'CANCELLED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (so the calendar can check availability)
-- Note: In a production app, you might want to restrict this to only return dates and statuses, not client info.
CREATE POLICY "Allow public read access to status and dates" ON inquiries
    FOR SELECT USING (true);

-- Allow anonymous insert access (so users can submit inquiries)
CREATE POLICY "Allow anonymous insert" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to run the function before an update
CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
