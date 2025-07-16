-- Insert sample talents with success stories
INSERT INTO talents (
  name, email, phone, bio, location, skills, experience_level, 
  hourly_rate, availability, profile_image_url, is_verified, 
  subscription_tier, subscription_expires_at
) VALUES 
(
  'Sarah Chen',
  'sarah.chen@example.com',
  '+1-555-0123',
  'Award-winning cinematographer with 8+ years of experience in feature films and commercials. Known for innovative lighting techniques and visual storytelling that brings scripts to life. Recently wrapped principal photography on "Midnight in Tokyo" - a Netflix original series that garnered 50M+ views in its first month.',
  'Los Angeles, CA',
  ARRAY['Cinematography', 'Lighting Design', 'Camera Operation', 'Color Grading', 'Visual Storytelling', 'RED Camera', 'ARRI Alexa'],
  'expert',
  150.00,
  'available',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  true,
  'premium',
  '2024-12-31 23:59:59'
),
(
  'Marcus Rodriguez',
  'marcus.rodriguez@example.com',
  '+1-555-0124',
  'Creative director and producer specializing in high-impact commercial campaigns. Led the creative team behind the viral "Dreams Come True" campaign for Nike, which achieved 100M+ impressions and won 3 Cannes Lions. Expert in brand storytelling and multi-platform content creation.',
  'New York, NY',
  ARRAY['Creative Direction', 'Commercial Production', 'Brand Strategy', 'Team Leadership', 'Campaign Development', 'Post-Production'],
  'expert',
  200.00,
  'busy',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  true,
  'premium',
  '2024-12-31 23:59:59'
),
(
  'Emma Thompson',
  'emma.thompson@example.com',
  '+1-555-0125',
  'Versatile actress and voice talent with extensive experience in film, television, and commercial work. Featured in over 50 national commercials and 3 feature films. Known for authentic performances and ability to connect with diverse audiences. Recent work includes lead role in indie film "The Last Summer" which won Best Picture at Sundance.',
  'Atlanta, GA',
  ARRAY['Acting', 'Voice Over', 'Commercial Performance', 'Character Development', 'Improvisation', 'Method Acting'],
  'advanced',
  75.00,
  'available',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  true,
  'basic',
  '2024-12-31 23:59:59'
),
(
  'David Kim',
  'david.kim@example.com',
  '+1-555-0126',
  'Sound engineer and music composer with a passion for creating immersive audio experiences. Composed original scores for 15+ independent films and designed sound for major commercial campaigns including Apple and Tesla. Specializes in electronic and orchestral fusion that enhances emotional storytelling.',
  'Seattle, WA',
  ARRAY['Sound Design', 'Music Composition', 'Audio Engineering', 'Pro Tools', 'Logic Pro', 'Film Scoring', 'Live Recording'],
  'advanced',
  85.00,
  'available',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  false,
  'basic',
  '2024-12-31 23:59:59'
),
(
  'Isabella Martinez',
  'isabella.martinez@example.com',
  '+1-555-0127',
  'Fashion and lifestyle photographer turned film director. Transitioned from shooting for Vogue and Harper''s Bazaar to directing music videos and short films. Her debut short film "Reflections" was selected for 12 international film festivals and won Best Director at the LA Short Film Festival.',
  'Miami, FL',
  ARRAY['Photography', 'Film Direction', 'Visual Aesthetics', 'Fashion Photography', 'Music Videos', 'Short Films', 'Creative Vision'],
  'intermediate',
  95.00,
  'available',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
  true,
  'premium',
  '2024-12-31 23:59:59'
),
(
  'James Wilson',
  'james.wilson@example.com',
  '+1-555-0128',
  'Veteran stunt coordinator and action choreographer with 12+ years in the industry. Coordinated stunts for major blockbusters including Marvel films and Fast & Furious franchise. Known for innovative safety protocols and realistic action sequences that push creative boundaries while prioritizing performer safety.',
  'Vancouver, BC',
  ARRAY['Stunt Coordination', 'Action Choreography', 'Safety Protocols', 'Wire Work', 'Vehicle Stunts', 'Fight Choreography', 'Risk Assessment'],
  'expert',
  180.00,
  'busy',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  true,
  'premium',
  '2024-12-31 23:59:59'
);

-- Insert sample talent media
INSERT INTO talent_media (talent_id, media_type, media_url, title, description, is_featured) VALUES
-- Sarah Chen's portfolio
(1, 'image', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop', 'Midnight in Tokyo - Behind the Scenes', 'Cinematography work on Netflix original series', true),
(1, 'video', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'Cinematography Reel 2024', 'Latest work showcasing lighting and camera techniques', true),
(1, 'image', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop', 'Commercial Campaign - Luxury Brand', 'High-end commercial cinematography', false),

-- Marcus Rodriguez's portfolio  
(2, 'image', 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop', 'Nike Dreams Campaign', 'Creative direction for viral Nike campaign', true),
(2, 'image', 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop', 'Cannes Lions Winner', 'Award-winning commercial production', true),

-- Emma Thompson's portfolio
(3, 'image', 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=600&fit=crop', 'The Last Summer - Sundance', 'Lead role in award-winning indie film', true),
(3, 'video', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 'Acting Demo Reel', 'Showcase of commercial and film work', false),

-- David Kim's portfolio
(4, 'image', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', 'Studio Recording Session', 'Composing original film score', true),
(4, 'image', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop', 'Sound Design Setup', 'Professional audio engineering workspace', false),

-- Isabella Martinez's portfolio
(5, 'image', 'https://images.unsplash.com/photo-1554048612-b6ebae92138d?w=800&h=600&fit=crop', 'Reflections - Film Festival', 'Award-winning short film direction', true),
(5, 'image', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop', 'Fashion Photography', 'Previous work for major magazines', false),

-- James Wilson's portfolio
(6, 'image', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', 'Marvel Stunt Coordination', 'Behind the scenes of major blockbuster', true),
(6, 'image', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Action Choreography', 'Complex stunt sequence planning', false);
