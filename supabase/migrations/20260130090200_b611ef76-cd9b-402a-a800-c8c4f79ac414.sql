-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create keywords table
CREATE TABLE public.keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    keyword TEXT NOT NULL,
    keyword_type TEXT NOT NULL DEFAULT 'general',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dark_web_sources table
CREATE TABLE public.dark_web_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT NOT NULL,
    risk_level TEXT NOT NULL DEFAULT 'medium',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monitoring_sessions table
CREATE TABLE public.monitoring_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    keywords_count INTEGER NOT NULL DEFAULT 0,
    sources_scanned INTEGER NOT NULL DEFAULT 0,
    alerts_generated INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.monitoring_sessions(id) ON DELETE CASCADE NOT NULL,
    keyword_id UUID REFERENCES public.keywords(id) ON DELETE CASCADE NOT NULL,
    source_id UUID REFERENCES public.dark_web_sources(id) ON DELETE CASCADE NOT NULL,
    keyword_text TEXT NOT NULL,
    source_name TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    message TEXT NOT NULL,
    matched_content TEXT,
    is_reviewed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dark_web_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policies for keywords
CREATE POLICY "Users can view own keywords" ON public.keywords
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keywords" ON public.keywords
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keywords" ON public.keywords
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own keywords" ON public.keywords
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policies for dark_web_sources (readable by all authenticated users)
CREATE POLICY "Authenticated users can view sources" ON public.dark_web_sources
    FOR SELECT TO authenticated
    USING (true);

-- RLS Policies for monitoring_sessions
CREATE POLICY "Users can view own sessions" ON public.monitoring_sessions
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.monitoring_sessions
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.monitoring_sessions
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view own alerts" ON public.alerts
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON public.alerts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.alerts
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at
    BEFORE UPDATE ON public.keywords
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for alerts table
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- Seed dark web sources
INSERT INTO public.dark_web_sources (name, url, source_type, risk_level) VALUES
    ('Dark Forum Alpha', 'darkforum-alpha.onion', 'forum', 'high'),
    ('Breach Database Market', 'breach-db-market.onion', 'marketplace', 'critical'),
    ('Shadow Paste', 'shadow-paste.onion', 'paste', 'medium'),
    ('Underground IRC', 'underground-irc.onion', 'irc', 'high'),
    ('Leak Archives', 'leak-archives.onion', 'database', 'critical'),
    ('Crypt0 Forums', 'crypt0-forums.onion', 'forum', 'medium'),
    ('Data Dump Central', 'datadump-central.onion', 'marketplace', 'high'),
    ('Anonymous Pastes', 'anon-pastes.onion', 'paste', 'low'),
    ('Hidden Wiki Links', 'hidden-wiki.onion', 'directory', 'medium'),
    ('Card Market Pro', 'cardmarket-pro.onion', 'marketplace', 'critical');