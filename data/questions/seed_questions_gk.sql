
-- Seed General Knowledge Questions for PTB Class 1
-- Generated on 2026-06-13T20:05:34.345Z

BEGIN;

-- Delete old seeds if any
DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_gk_%';

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207352',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'mcq',
  'medium',
  '<p>ہمیں صبح&nbsp;...... اٹھنا چاہیے۔</p>',
  '["جلدی","دیر سے","یہ تمام","ان میں سے کوئی نہیں"]',
  'جلدی',
  1,
  '{"original_question_id":207352,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207353',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'mcq',
  'medium',
  '<p>کوڑے کو&nbsp;...... ڈالنا چاہیے۔</p>',
  '["سڑک پر","کوڑے دان میں","یہ تمام","ان میں سے کوئی نہیں"]',
  'کوڑے دان میں',
  1,
  '{"original_question_id":207353,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207354',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'mcq',
  'medium',
  '<p>بات کرتے وقت اپنی&nbsp;...... کا انتظار کرنا چاہیے۔</p>',
  '["مرضی","باری","یہ تمام","ان میں سے کوئی نہیں"]',
  'باری',
  1,
  '{"original_question_id":207354,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207356',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_78ddf1ee03023e7c',
  'Chapter 2: My Body',
  'mcq',
  'medium',
  '<p>شام کے وقت چیزیں کیسی نظر آتی ہیں؟</p>',
  '["روشن","مدھم","یہ تمام","ان میں سے کوئی نہیں"]',
  'مدھم',
  1,
  '{"original_question_id":207356,"topic_id":7263,"topic_name":"2.1 میرا جسم","priority":"Exercise","chapter":"Chapter 2: My Body"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207357',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_78ddf1ee03023e7c',
  'Chapter 2: My Body',
  'mcq',
  'medium',
  '<p>دن کے وقت آسمان کیسا نظر آتا ہے؟</p>',
  '["نیلا","کالا","یہ تمام","ان میں سے کوئی نہیں"]',
  'نیلا',
  1,
  '{"original_question_id":207357,"topic_id":7263,"topic_name":"2.1 میرا جسم","priority":"Exercise","chapter":"Chapter 2: My Body"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207358',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_78ddf1ee03023e7c',
  'Chapter 2: My Body',
  'mcq',
  'medium',
  '<p>ٹیلی وژن تیز آواز میں سننا کیسا لگتا ہے؟</p>',
  '["اچھا","بُرا","یہ تمام","ان میں سے کوئی نہیں"]',
  'بُرا',
  1,
  '{"original_question_id":207358,"topic_id":7263,"topic_name":"2.1 میرا جسم","priority":"Exercise","chapter":"Chapter 2: My Body"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207359',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_78ddf1ee03023e7c',
  'Chapter 2: My Body',
  'mcq',
  'medium',
  '<p>میز چھونے میں کیسا لگتا ہے؟</p>',
  '["سخت","نرم","یہ تمام","ان میں سے کوئی نہیں"]',
  'سخت',
  1,
  '{"original_question_id":207359,"topic_id":7263,"topic_name":"2.1 میرا جسم","priority":"Exercise","chapter":"Chapter 2: My Body"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207360',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_78ddf1ee03023e7c',
  'Chapter 2: My Body',
  'mcq',
  'medium',
  '<p>چینی کا ذائقہ کیسا لگتا ہے؟</p>',
  '["میٹھا","کھٹا","یہ تمام","ان میں سے کوئی نہیں"]',
  'میٹھا',
  1,
  '{"original_question_id":207360,"topic_id":7263,"topic_name":"2.1 میرا جسم","priority":"Exercise","chapter":"Chapter 2: My Body"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207386',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a94c48a7b7c0f15b',
  'Chapter 10: Means of Transport',
  'mcq',
  'medium',
  '<p>سب سے تیز رفتار سواری کون سی ہے؟</p>',
  '["​​​​​​​","​​​​​​​","ان میں سے کوئی نہیں"]',
  '',
  1,
  '{"original_question_id":207386,"topic_id":7271,"topic_name":"10.1 ذرائع آمدرفت","priority":"Exercise","chapter":"Chapter 10: Means of Transport"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207387',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a94c48a7b7c0f15b',
  'Chapter 10: Means of Transport',
  'mcq',
  'medium',
  '<p>سب سے آہستہ چلنے والی سواری کون سی ہے؟</p>',
  '["یہ تمام"]',
  '',
  1,
  '{"original_question_id":207387,"topic_id":7271,"topic_name":"10.1 ذرائع آمدرفت","priority":"Exercise","chapter":"Chapter 10: Means of Transport"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207388',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a94c48a7b7c0f15b',
  'Chapter 10: Means of Transport',
  'mcq',
  'medium',
  '<p>ہوائی جہاز کہاں سے پرواز کرتے ہیں؟</p>',
  '["ان میں سے کوئی نہیں"]',
  '',
  1,
  '{"original_question_id":207388,"topic_id":7271,"topic_name":"10.1 ذرائع آمدرفت","priority":"Exercise","chapter":"Chapter 10: Means of Transport"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207393',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_f025883adc5a7999',
  'Chapter 14: Earth and Sky',
  'mcq',
  'medium',
  '<p>زمین کا زیادہ تر حصہ اس پر مشتمل ہے۔</p>',
  '["خشکی","پانی","یہ دونوں","ان میں سے کوئی نہیں"]',
  'پانی',
  1,
  '{"original_question_id":207393,"topic_id":7275,"topic_name":"14.1 زمین اور آسمان","priority":"Exercise","chapter":"Chapter 14: Earth and Sky"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207394',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_f025883adc5a7999',
  'Chapter 14: Earth and Sky',
  'mcq',
  'medium',
  '<p>یہ ہمیں دن کے وقت حرارت فراہم کرتا ہے۔</p>',
  '["چاند","سورج","یہ دونوں","ان میں سے کوئی نہیں"]',
  'سورج',
  1,
  '{"original_question_id":207394,"topic_id":7275,"topic_name":"14.1 زمین اور آسمان","priority":"Exercise","chapter":"Chapter 14: Earth and Sky"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207395',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_f025883adc5a7999',
  'Chapter 14: Earth and Sky',
  'mcq',
  'medium',
  '<p>یہ رات کے وقت آسمان پر چمکتا ہے۔</p>',
  '["سورج","ستارہ","یہ دونوں","ان میں سے کوئی نہیں"]',
  'ستارہ',
  1,
  '{"original_question_id":207395,"topic_id":7275,"topic_name":"14.1 زمین اور آسمان","priority":"Exercise","chapter":"Chapter 14: Earth and Sky"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207396',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_f025883adc5a7999',
  'Chapter 14: Earth and Sky',
  'mcq',
  'medium',
  '<p>انسان زمین کے اس حصے پر رہتے ہیں۔</p>',
  '["خشکی","پانی","یہ دونوں","ان میں سے کوئی نہیں"]',
  'خشکی',
  1,
  '{"original_question_id":207396,"topic_id":7275,"topic_name":"14.1 زمین اور آسمان","priority":"Exercise","chapter":"Chapter 14: Earth and Sky"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207397',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_f025883adc5a7999',
  'Chapter 14: Earth and Sky',
  'mcq',
  'medium',
  '<p>زمین کیا ہے؟</p>',
  '["ستارا","سیارہ","یہ دونوں","ان میں سے کوئی نہیں"]',
  'سیارہ',
  1,
  '{"original_question_id":207397,"topic_id":7275,"topic_name":"14.1 زمین اور آسمان","priority":"Exercise","chapter":"Chapter 14: Earth and Sky"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207343',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میرا نام .................. ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207343,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207344',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میری عمر ..................​​​​​​​ سال ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207344,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207345',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میں ..................​​​​​​​ جماعت میں ہوں۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207345,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207346',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میرے والد کا نام .................. ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207346,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207347',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میری امی مجھ سے&nbsp;.................. کرتی ہیں۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207347,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207348',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میرے&nbsp;.................. بہن بھائی ہیں۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207348,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207349',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میرا پسندیدہ کھیل&nbsp;.................. ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207349,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207350',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>مجھے کھانے میں&nbsp;..................​​​​​​​ اور&nbsp;.................. پسند ہیں۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207350,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207351',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'fill_in_the_blanks',
  'medium',
  '<p>میری خواہش ہے کہ میں بڑے ہو کر&nbsp;.................. بنوں۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207351,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207371',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_65b7aa3eff9018c8',
  'Chapter 7: Places of Worship',
  'fill_in_the_blanks',
  'medium',
  '<p>ہندو عبادت کےلیے .................. جاتے ہیں۔</p>',
  '[]',
  'مندر',
  1,
  '{"original_question_id":207371,"topic_id":7268,"topic_name":"7.1 عبادت گاہیں","priority":"Exercise","chapter":"Chapter 7: Places of Worship"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207372',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_65b7aa3eff9018c8',
  'Chapter 7: Places of Worship',
  'fill_in_the_blanks',
  'medium',
  '<p>سکھوں کی عبادت گاہ کو .................. کہتے ہیں۔</p>',
  '[]',
  'گردوارہ',
  1,
  '{"original_question_id":207372,"topic_id":7268,"topic_name":"7.1 عبادت گاہیں","priority":"Exercise","chapter":"Chapter 7: Places of Worship"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207373',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_65b7aa3eff9018c8',
  'Chapter 7: Places of Worship',
  'fill_in_the_blanks',
  'medium',
  '<p>مسلمان نماز کےلیے .................. جاتے ہیں۔</p>',
  '[]',
  'مسجد',
  1,
  '{"original_question_id":207373,"topic_id":7268,"topic_name":"7.1 عبادت گاہیں","priority":"Exercise","chapter":"Chapter 7: Places of Worship"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207374',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_65b7aa3eff9018c8',
  'Chapter 7: Places of Worship',
  'fill_in_the_blanks',
  'medium',
  '<p>مسیحی عبادت کےلیے .................. میں جاتے ہیں۔</p>',
  '[]',
  'گرجا گھر',
  1,
  '{"original_question_id":207374,"topic_id":7268,"topic_name":"7.1 عبادت گاہیں","priority":"Exercise","chapter":"Chapter 7: Places of Worship"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207375',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_65b7aa3eff9018c8',
  'Chapter 7: Places of Worship',
  'fill_in_the_blanks',
  'medium',
  '<p>ہمیں تمام مذاہب کے لوگوں اور ان کی عبادت گاہوں کا .................. کرنا چاہیے۔</p>',
  '[]',
  'لحاظ',
  1,
  '{"original_question_id":207375,"topic_id":7268,"topic_name":"7.1 عبادت گاہیں","priority":"Exercise","chapter":"Chapter 7: Places of Worship"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207380',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_732ecb583a977057',
  'Chapter 9: My School',
  'fill_in_the_blanks',
  'medium',
  '<p>میرے سکول کا نام ..................ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207380,"topic_id":7270,"topic_name":"9.1 میرا سکول","priority":"Exercise","chapter":"Chapter 9: My School"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207381',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_732ecb583a977057',
  'Chapter 9: My School',
  'fill_in_the_blanks',
  'medium',
  '<p>میرا سکول .................. میں ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207381,"topic_id":7270,"topic_name":"9.1 میرا سکول","priority":"Exercise","chapter":"Chapter 9: My School"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207382',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_732ecb583a977057',
  'Chapter 9: My School',
  'fill_in_the_blanks',
  'medium',
  '<p>میرے کلاس ٹیچر کا نام .................. ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207382,"topic_id":7270,"topic_name":"9.1 میرا سکول","priority":"Exercise","chapter":"Chapter 9: My School"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207383',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_732ecb583a977057',
  'Chapter 9: My School',
  'fill_in_the_blanks',
  'medium',
  '<p>میرے سکول کے ہیڈ ماسٹر / کی ہیڈ مسٹریس کا نام .................. ہے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207383,"topic_id":7270,"topic_name":"9.1 میرا سکول","priority":"Exercise","chapter":"Chapter 9: My School"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207366',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a0ac64f4d44f5665',
  'Chapter 6: Our Morals',
  'true_false_statements',
  'medium',
  '<p>گھر کا کوڑا&nbsp;کوڑے دان میں ڈالنا چاہیے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207366,"topic_id":7267,"topic_name":"6.1 ہمارا علاقہ","priority":"Exercise","chapter":"Chapter 6: Our Morals"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207367',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a0ac64f4d44f5665',
  'Chapter 6: Our Morals',
  'true_false_statements',
  'medium',
  '<p>گلی کی دیوار پر لکھنا چاہیے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207367,"topic_id":7267,"topic_name":"6.1 ہمارا علاقہ","priority":"Exercise","chapter":"Chapter 6: Our Morals"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207368',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a0ac64f4d44f5665',
  'Chapter 6: Our Morals',
  'true_false_statements',
  'medium',
  '<p>اپنے گھر اور محلے کو صاف رکھنا چاہیے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207368,"topic_id":7267,"topic_name":"6.1 ہمارا علاقہ","priority":"Exercise","chapter":"Chapter 6: Our Morals"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207369',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a0ac64f4d44f5665',
  'Chapter 6: Our Morals',
  'true_false_statements',
  'medium',
  '<p>گندا پانی باہر گلی میں جمع ہونا چاہیے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":207369,"topic_id":7267,"topic_name":"6.1 ہمارا علاقہ","priority":"Exercise","chapter":"Chapter 6: Our Morals"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207355',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_fb3a8969da3ccb67',
  'Chapter 1: My Introduction',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" dir="rtl" style="width:500px;margin-left:auto;margin-right:auto;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>خصوصیات</strong></td>
			<td style="text-align: center;"><strong>میرا پسندیدہ</strong></td>
			<td style="text-align: center;"><strong>دوست کا پسندیدہ</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;">رنگ</td>
			<td style="text-align: center;">&nbsp;</td>
			<td style="text-align: center;">&nbsp;</td>
		</tr>
		<tr>
			<td style="text-align: center;">موسم</td>
			<td style="text-align: center;">&nbsp;</td>
			<td style="text-align: center;">&nbsp;</td>
		</tr>
		<tr>
			<td style="text-align: center;">پھل</td>
			<td style="text-align: center;">&nbsp;</td>
			<td style="text-align: center;">&nbsp;</td>
		</tr>
		<tr>
			<td style="text-align: center;">لباس</td>
			<td style="text-align: center;">&nbsp;</td>
			<td style="text-align: center;">&nbsp;</td>
		</tr>
		<tr>
			<td style="text-align: center;">جانور</td>
			<td style="text-align: center;">&nbsp;</td>
			<td style="text-align: center;">&nbsp;</td>
		</tr>
		<tr>
			<td style="text-align: center;">کھیل</td>
			<td style="text-align: center;">&nbsp;</td>
			<td style="text-align: center;">&nbsp;</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":207355,"topic_id":7262,"topic_name":"1.1 میرا تعارف","priority":"Exercise","chapter":"Chapter 1: My Introduction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207361',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_78ddf1ee03023e7c',
  'Chapter 2: My Body',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" dir="rtl" style="margin-left:auto;margin-right:auto;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>کالم(الف)</strong></td>
			<td style="text-align: center;"><strong>کالم(ب)</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u02-1.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">دیکھنا</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u02-2.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">سونگھنا</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u02-3.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">سننا</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u02-4.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">چھونا</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u02-5.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">چکھنا</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":207361,"topic_id":7263,"topic_name":"2.1 میرا جسم","priority":"Exercise","chapter":"Chapter 2: My Body"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207364',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_3f58c09a6b76842f',
  'Chapter 4: My Family and Friends',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" dir="rtl" style="margin-left:auto;margin-right:auto;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>کالم(الف)</strong></td>
			<td style="text-align: center;"><strong>کالم (ب)</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;">ابو کے ابو</td>
			<td style="text-align: center;">نانا</td>
		</tr>
		<tr>
			<td style="text-align: center;">ابو کی امی</td>
			<td style="text-align: center;">نانی</td>
		</tr>
		<tr>
			<td style="text-align: center;">ابو بہن</td>
			<td style="text-align: center;">چچا</td>
		</tr>
		<tr>
			<td style="text-align: center;">ابو کے بڑے بھائی</td>
			<td style="text-align: center;">پھوپھی</td>
		</tr>
		<tr>
			<td style="text-align: center;">ابو کے چھوٹے بھائی</td>
			<td style="text-align: center;">خالہ</td>
		</tr>
		<tr>
			<td style="text-align: center;">امی کی امی</td>
			<td style="text-align: center;">ماموں</td>
		</tr>
		<tr>
			<td style="text-align: center;">امی کے ابو</td>
			<td style="text-align: center;">تایا</td>
		</tr>
		<tr>
			<td style="text-align: center;">امی کی بہن</td>
			<td style="text-align: center;">دادا</td>
		</tr>
		<tr>
			<td style="text-align: center;">امی کے بھائی</td>
			<td style="text-align: center;">دادی</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":207364,"topic_id":7265,"topic_name":"4.1 میرا خاندان اور میرے دوست","priority":"Exercise","chapter":"Chapter 4: My Family and Friends"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207370',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_a0ac64f4d44f5665',
  'Chapter 6: Our Morals',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" dir="rtl" style="width:500px;margin-left:auto;margin-right:auto;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>کالم (الف)</strong></td>
			<td style="text-align: center;"><strong>کالم (ب)</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;">کچا گھر</td>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u06-1.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">فلیٹ</td>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u06-2.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">جھونپڑی</td>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u06-3.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">پختہ گھر</td>
			<td style="text-align: center;"><img src="/Equations/1st/wa-u06-4.png" style="zoom:20%;" /></td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":207370,"topic_id":7267,"topic_name":"6.1 ہمارا علاقہ","priority":"Exercise","chapter":"Chapter 6: Our Morals"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207379',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_66d37a14e3fa67d7',
  'Chapter 8: Our Beloved Country Pakistan',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" dir="rtl" style="width:500px;margin-left:auto;margin-right:auto;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>پرچم میں رنگ اور علامت</strong></td>
			<td style="text-align: center;"><strong>مطلب</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;">سبزرنگ</td>
			<td style="text-align: center;">دیگر مذاہب کےپاکستانی</td>
		</tr>
		<tr>
			<td style="text-align: center;">سفید رنگ</td>
			<td style="text-align: center;">ترقی</td>
		</tr>
		<tr>
			<td style="text-align: center;">چاند</td>
			<td style="text-align: center;">روشنی اور علم</td>
		</tr>
		<tr>
			<td style="text-align: center;">ستارا</td>
			<td style="text-align: center;">مسلمان آبادی</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":207379,"topic_id":7269,"topic_name":"8.1 ہمارا پیارا وطن پاکستان","priority":"Exercise","chapter":"Chapter 8: Our Beloved Country Pakistan"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207390',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_3113e31b1ed2757a',
  'Chapter 11: Traffic Rules',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" dir="rtl" style="width:500px;margin-left:auto;margin-right:auto;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>کالم (الف)</strong></td>
			<td style="text-align: center;"><strong>کالم (ب)</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-011-1.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">یہاں گاڑی کھڑی کرنا منع ہے</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-011-2.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">پیدل سڑک پار کرنے کی جگہ</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-011-3.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">رفتار کی حد 60 کلو میٹر فی گھنٹا</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-011-4.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">رک جائیے</td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/wa-011-5.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">اب آپ جاسکتے ہیں</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":207390,"topic_id":7272,"topic_name":"11.1 ٹریفک قوانین","priority":"Exercise","chapter":"Chapter 11: Traffic Rules"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207362',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_afd1de0e4fdb54d8',
  'Chapter 3: Health and Hygiene',
  'question_answers',
  'medium',
  '<p>آپ خود کو کیسے صاف رکھ سکتے ہیں؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207362,"topic_id":7264,"topic_name":"3.1 صحت و صفائی","priority":"Exercise","chapter":"Chapter 3: Health and Hygiene"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207363',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_afd1de0e4fdb54d8',
  'Chapter 3: Health and Hygiene',
  'question_answers',
  'medium',
  '<p>اپنے دوستوں کو بتائیں کہ صاف ستھرا نہ رہنے کا نتیجہ کیا ہوسکتا ہے؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207363,"topic_id":7264,"topic_name":"3.1 صحت و صفائی","priority":"Exercise","chapter":"Chapter 3: Health and Hygiene"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207365',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_1071e802782c87a4',
  'Chapter 5: Games and Recreation',
  'question_answers',
  'medium',
  '<p>آپ کا پسندیدہ کھیل کون سا ہے؟ اس کھیل کے کوئی تین قوانین بتائیں۔</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207365,"topic_id":7266,"topic_name":"5.1 کھیل اور قوانین","priority":"Exercise","chapter":"Chapter 5: Games and Recreation"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207376',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_65b7aa3eff9018c8',
  'Chapter 7: Places of Worship',
  'question_answers',
  'medium',
  '<p>کیا آپ کسی دوسرے مذہب سے تعلق رکھنے والے فرد کو جانتے ہیں؟ان کا لحاظ کیوں ضروری ہے؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207376,"topic_id":7268,"topic_name":"7.1 عبادت گاہیں","priority":"Exercise","chapter":"Chapter 7: Places of Worship"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207377',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_66d37a14e3fa67d7',
  'Chapter 8: Our Beloved Country Pakistan',
  'question_answers',
  'medium',
  '<p>ہمارے ملک کا پورا نام کیا ہے؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207377,"topic_id":7269,"topic_name":"8.1 ہمارا پیارا وطن پاکستان","priority":"Exercise","chapter":"Chapter 8: Our Beloved Country Pakistan"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207378',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_66d37a14e3fa67d7',
  'Chapter 8: Our Beloved Country Pakistan',
  'question_answers',
  'medium',
  '<p>ہم کس تاریخ کو جشن آزادی مناتے ہیں؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207378,"topic_id":7269,"topic_name":"8.1 ہمارا پیارا وطن پاکستان","priority":"Exercise","chapter":"Chapter 8: Our Beloved Country Pakistan"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207384',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_732ecb583a977057',
  'Chapter 9: My School',
  'question_answers',
  'medium',
  '<p>آپ اور آپ کے سکول کے دوست گھر میں کون سی زبان بولتے ہیں؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207384,"topic_id":7270,"topic_name":"9.1 میرا سکول","priority":"Exercise","chapter":"Chapter 9: My School"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207385',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_732ecb583a977057',
  'Chapter 9: My School',
  'question_answers',
  'medium',
  '<p>آپ سکول اور کمرۂ جماعت کو صاف رکھنے کےلیے دوسروں کی مدد کیسے کرتے ہیں؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207385,"topic_id":7270,"topic_name":"9.1 میرا سکول","priority":"Exercise","chapter":"Chapter 9: My School"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207389',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_3113e31b1ed2757a',
  'Chapter 11: Traffic Rules',
  'question_answers',
  'medium',
  '<p>اگر ہم ٹریفک کے قوانین پر عمل نہ کریں تو ہمیں کس قسم کی مشکلات کا سامنا کرنا پڑ سکتا ہے؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207389,"topic_id":7272,"topic_name":"11.1 ٹریفک قوانین","priority":"Exercise","chapter":"Chapter 11: Traffic Rules"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207391',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_60ccb041e1697432',
  'Chapter 12: Good Moral Habits',
  'question_answers',
  'medium',
  '<p>آپ کا پسندیدہ دوست کون سا ہے؟ اس میں کون سی اچھی عادات موجود ہیں؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207391,"topic_id":7273,"topic_name":"12.1 اچھے اخلاق و عادات","priority":"Exercise","chapter":"Chapter 12: Good Moral Habits"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_gk_207392',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_5031f4c3b6e883de',
  'General Knowledge',
  'gch_60ccb041e1697432',
  'Chapter 12: Good Moral Habits',
  'question_answers',
  'medium',
  '<p>غیر صحت مند خوراک کھانے سے کیا نقصان ہو سکتا ہے؟</p>',
  '[]',
  '',
  2,
  '{"original_question_id":207392,"topic_id":7273,"topic_name":"12.1 اچھے اخلاق و عادات","priority":"Exercise","chapter":"Chapter 12: Good Moral Habits"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

COMMIT;
