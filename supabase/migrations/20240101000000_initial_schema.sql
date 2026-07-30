-- ==========================================
-- KELIAA MVP - Initial Database Schema
-- ==========================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Create Tables
-- ==========================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  birth_date DATE,
  country TEXT,
  city TEXT,
  denomination TEXT,
  biography TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.psychometric_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES public.psychometric_tests(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.test_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.test_questions(id) ON DELETE CASCADE NOT NULL,
  answer_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.psychometric_tests(id) ON DELETE CASCADE NOT NULL,
  score DECIMAL,
  dimensions JSONB,
  profile_code TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_one UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_two UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  compatibility_score DECIMAL,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_one, user_two)
);

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  provider TEXT,
  transaction_reference TEXT,
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL,
  metadata JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Create Indexes
-- ==========================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_matches_user_one ON public.matches(user_one);
CREATE INDEX idx_matches_user_two ON public.matches(user_two);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- ==========================================
-- 3. Automatic Profile Creation Trigger
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 4. Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychometric_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. Define RLS Policies
-- ==========================================

-- Profiles: Authenticated users can view profiles. Users can update their own.
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Profile Photos
CREATE POLICY "Profile photos are viewable by authenticated users"
  ON public.profile_photos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert photos for their profile"
  ON public.profile_photos FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update their own photos"
  ON public.profile_photos FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their own photos"
  ON public.profile_photos FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid())
  );

-- Tests and Questions: Read-only for authenticated users
CREATE POLICY "Tests are viewable by authenticated users"
  ON public.psychometric_tests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Test questions are viewable by authenticated users"
  ON public.test_questions FOR SELECT USING (auth.role() = 'authenticated');

-- Test Answers: Users can only manage their own answers
CREATE POLICY "Users can view their own answers"
  ON public.test_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own answers"
  ON public.test_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own answers"
  ON public.test_answers FOR UPDATE USING (auth.uid() = user_id);

-- Test Results: Users can only view their own results
CREATE POLICY "Users can view their own test results"
  ON public.test_results FOR SELECT USING (auth.uid() = user_id);

-- Matches: Users can only see matches involving themselves
CREATE POLICY "Users can view their matches"
  ON public.matches FOR SELECT USING (auth.uid() = user_one OR auth.uid() = user_two);

-- Conversations: Users can view conversations if they are part of the match
CREATE POLICY "Users can view conversations of their matches"
  ON public.conversations FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE matches.id = match_id AND (matches.user_one = auth.uid() OR matches.user_two = auth.uid())
    )
  );

-- Messages: Users can read and send messages in their conversations
CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      JOIN public.matches ON conversations.match_id = matches.id
      WHERE conversations.id = conversation_id 
      AND (matches.user_one = auth.uid() OR matches.user_two = auth.uid())
    )
  );
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations 
      JOIN public.matches ON conversations.match_id = matches.id
      WHERE conversations.id = conversation_id 
      AND (matches.user_one = auth.uid() OR matches.user_two = auth.uid())
    )
  );

-- Subscriptions and Payments: Users can only see their own
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions WHERE id = subscription_id AND user_id = auth.uid()
    )
  );

-- Notifications: Users can only see and update their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reports: Users can insert reports
CREATE POLICY "Users can insert reports"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- ==========================================
-- 6. Configure Storage for Avatars
-- ==========================================

-- Insert the bucket (ignore error if it already exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text
  );
  
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text
  );
