-- PostgreSQL Initial Seed Data for Flora Period Tracker

-- Insert Default User
INSERT INTO users (id, name, email, avatar, age, cycle_length, period_length, last_period_start, theme, water_target)
VALUES (1, 'Emma Rose', 'emma@flora.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 26, 28, 5, '2026-07-05', 'vintage', 2500)
ON CONFLICT (id) DO NOTHING;

-- Insert Cycles
INSERT INTO cycle_logs (id, user_id, start_date, end_date, flow, pain, symptoms, notes)
VALUES 
  ('1', 1, '2026-05-10', '2026-05-14', 'Medium', 4, ARRAY['Cramps', 'Headache'], 'Felt mild cramps'),
  ('2', 1, '2026-06-07', '2026-06-11', 'Heavy', 6, ARRAY['Cramps', 'Bloating', 'Fatigue'], 'Heavy flow on day 2'),
  ('3', 1, '2026-07-05', '2026-07-09', 'Medium', 3, ARRAY['Headache', 'Back Pain'], 'Smooth cycle')
ON CONFLICT (id) DO NOTHING;

-- Insert Moods
INSERT INTO mood_logs (user_id, log_date, mood, note)
VALUES 
  (1, '2026-07-25', 'Calm', 'Had chamomile tea, walked in the rose garden. Felt very at peace.'),
  (1, '2026-07-26', 'Tired', 'Woke up in the middle of the night. Slow workday today.'),
  (1, '2026-07-27', 'Happy', 'Did yoga in the morning, energy is picking up!'),
  (1, '2026-07-28', 'Calm', 'Feeling grounded. Preparing for my upcoming cycle next week.')
ON CONFLICT (user_id, log_date) DO NOTHING;

-- Insert Medications
INSERT INTO medications (id, user_id, name, dosage, time, repeat_schedule, notifications)
VALUES 
  ('m1', 1, 'Iron & Folic Acid', '1 Capsule', '08:30 AM', 'Daily', true),
  ('m2', 1, 'Evening Primrose Oil', '1000mg', '07:00 PM', 'Daily', true),
  ('m3', 1, 'Magnesium Bisglycinate', '200mg', '09:30 PM', 'Daily', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Medication Completions
INSERT INTO medication_completions (medication_id, completed_date)
VALUES 
  ('m1', '2026-07-27'),
  ('m1', '2026-07-28'),
  ('m2', '2026-07-27'),
  ('m3', '2026-07-27'),
  ('m3', '2026-07-28')
ON CONFLICT DO NOTHING;

-- Insert Appointments
INSERT INTO appointments (id, user_id, doctor_name, specialty, appointment_date, appointment_time, notes, synced)
VALUES 
  ('a1', 1, 'Dr. Evelyn Fontaine', 'Holistic Gynecologist', '2026-08-03', '10:00 AM', 'Discuss hormone blood test results & herbal cycle infusions.', true),
  ('a2', 1, 'Dr. Sarah Lin', 'Endocrinologist', '2026-08-15', '02:30 PM', 'Routine checkup for thyroid panel.', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Community Posts
INSERT INTO community_posts (id, user_id, author, avatar, title, content, tags, likes, liked, saved, time_ago)
VALUES 
  ('p1', 1, 'Wildflower_9', '🌸', 'Soothing Chamomile & Raspberry Leaf Tea Infusions', 'I have started drinking raspberry leaf tea exactly 5 days before my cycle begins, and it has reduced my pelvic cramps by at least half! Has anyone else tried this? I add a tiny bit of raw lavender honey and fresh mint leaves.', ARRAY['Herbal Remedies', 'Cramp Relief', 'Self-Care'], 42, false, true, '4 hours ago'),
  ('p2', 1, 'Selene_Mind', '🌙', 'Luteal Phase Mood Swings & Cozy Digital Sabbaticals', 'During my luteal phase (days 21-28), I feel an overwhelming urge to log off social media and just read poetry, light vanilla candles, and rest. I used to feel guilty, but now I embrace it as a sacred period of hibernation. How do you all cope with the pre-period low energy?', ARRAY['Mental Health', 'Luteal Phase', 'Slow Living'], 58, true, false, '6 hours ago'),
  ('p3', 1, 'HormoneHarmony', '✨', 'Seed Cycling for Period Regularity: My 3-Month Journey', 'I have been seed cycling (pumpkin & flax seeds in the first half, sesame & sunflower in the second half) and my cycle length normalized from a wild 35-42 days to a clean 29 days. Highly recommend looking into seed cycling if you have minor hormonal imbalances.', ARRAY['Nutrition', 'Cycle Syncing', 'Hormones'], 89, false, true, '1 day ago')
ON CONFLICT (id) DO NOTHING;

-- Insert Post Comments
INSERT INTO post_comments (id, post_id, author, avatar, content, time_ago)
VALUES 
  ('c1', 'p1', 'Lila_Bloom', '🍃', 'Yes! Raspberry leaf tea is a uterine tonic. Adding ginger also helps with period inflammation!', '2 hours ago'),
  ('c2', 'p1', 'TeaLover_2', '☕', 'Trying this tonight! Thanks for the tip, cramps have been tough this month.', '1 hour ago'),
  ('c3', 'p2', 'FloraDior', '🌺', 'Embracing this completely changed my relationship with my body. We are not designed to be hyper-productive 100% of the time.', '3 hours ago')
ON CONFLICT (id) DO NOTHING;

-- Insert Notifications
INSERT INTO notifications (id, user_id, text, notification_type, is_read, time_label)
VALUES 
  ('n1', 1, 'AI Forecast: Your fertile window starts tomorrow. Stay hydrated 🌸', 'ai', false, 'Luteal Phase'),
  ('n2', 1, 'Reminder: Take Iron & Folic Acid pill at 08:30 AM.', 'med', false, 'Luteal Phase'),
  ('n3', 1, 'Dr. Evelyn Fontaine confirmed your appointment on Aug 3.', 'app', true, 'Follicular Phase')
ON CONFLICT (id) DO NOTHING;
