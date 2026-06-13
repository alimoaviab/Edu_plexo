
-- Seed English Questions for PTB Class 1
-- Generated on 2026-06-13T19:37:38.313Z

BEGIN;

-- Delete old seeds if any
DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_eng_%';

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_eng_163267',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'mcq',
  'medium',
  '<p>Sa&#39;ad is&nbsp;...... years old.</p>',
  '["Four","Five","Six","Seven"]',
  'Six',
  1,
  '{"original_question_id":163267,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163268',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'mcq',
  'medium',
  '<p>Sa&#39;ad has&nbsp;...... family members.</p>',
  '["Six","Seven","Eight","Nine"]',
  'Eight',
  1,
  '{"original_question_id":163268,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163269',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'mcq',
  'medium',
  '<p>Sa&#39;ad washes his hands with&nbsp;...... and water.</p>',
  '["Soap","Soil","Oil","Lotion"]',
  'Soap',
  1,
  '{"original_question_id":163269,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163270',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'mcq',
  'medium',
  '<p>Sa&#39;ad&#39;s&nbsp;...... tells him a bedtime story.</p>',
  '["Sister","Father","Mother","Brother"]',
  'Mother',
  1,
  '{"original_question_id":163270,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163286',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'mcq',
  'medium',
  '<p>We use &#39;scissors&#39; for cutting&nbsp;......</p>',
  '["Flowers","Fruits","Vegerables","Paper"]',
  'Paper',
  1,
  '{"original_question_id":163286,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163287',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'mcq',
  'medium',
  '<p>She is helping her&nbsp;...... to make pencil shaving artwork.</p>',
  '["Sister","Brother","Friend","Cousin"]',
  'Sister',
  1,
  '{"original_question_id":163287,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163288',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'mcq',
  'medium',
  '<p>They need&nbsp;...... things to complete their artwork.</p>',
  '["Two","Five","Seven","Ten"]',
  'Seven',
  1,
  '{"original_question_id":163288,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163289',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'mcq',
  'medium',
  '<p>Hina draws some&nbsp;...... on paper.</p>',
  '["Leaves","Lines","Circles","Flowers"]',
  'Flowers',
  1,
  '{"original_question_id":163289,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163293',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'mcq',
  'medium',
  '<p>The poem is written by&nbsp;......</p>',
  '["Edward Anthony","Ryan Gibbs","William Wordsworth","Robert Frost"]',
  'Edward Anthony',
  1,
  '{"original_question_id":163293,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_163294',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'mcq',
  'medium',
  '<p>The correct thyming word for &#39;fun&#39; is&nbsp;......</p>',
  '["''Two''","''Bat''","''Red''","''Son''"]',
  '''Son''',
  1,
  '{"original_question_id":163294,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_163295',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'mcq',
  'medium',
  '<p>Complete the line, &quot;You&#39;ll grow to be an/a&nbsp;...... brat.</p>',
  '["Older","Elder","Young","Adult"]',
  'Adult',
  1,
  '{"original_question_id":163295,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_163306',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'mcq',
  'medium',
  '<p>All&nbsp;...... and vegetables are good for health.</p>',
  '["Junk food","Fruits","Drinks","All"]',
  'Fruits',
  1,
  '{"original_question_id":163306,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_163307',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'mcq',
  'medium',
  '<p>...... was sitting quietly in a corner.</p>',
  '["Apple","Carrot","Mango","Banana"]',
  'Carrot',
  1,
  '{"original_question_id":163307,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_163308',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'mcq',
  'medium',
  '<p>Apple said sorry to Carrot for being&nbsp;...... to her.</p>',
  '["Proud","Polite","Kind","Rude"]',
  'Rude',
  1,
  '{"original_question_id":163308,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_163330',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'mcq',
  'medium',
  '<p>Ayyan and&nbsp;...... are making an Eid card.</p>',
  '["Sana","Maham","Sehar","Sobia"]',
  'Maham',
  1,
  '{"original_question_id":163330,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_163331',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'mcq',
  'medium',
  '<p>They draw some&nbsp;...... on the card.</p>',
  '["Lines","Circles","Flowers","Boxes"]',
  'Flowers',
  1,
  '{"original_question_id":163331,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_163332',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'mcq',
  'medium',
  '<p>They give the card to their cousin,&nbsp;......</p>',
  '["Amna","Asma","Aasia","Anum"]',
  'Asma',
  1,
  '{"original_question_id":163332,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_205760',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Paly","Play","Playy","Ply"]',
  'Play',
  1,
  '{"original_question_id":205760,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_205762',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Clock","Cloock","Clcok","Clook"]',
  'Clock',
  1,
  '{"original_question_id":205762,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_205764',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Terain","Trrain","Train","Teran"]',
  'Train',
  1,
  '{"original_question_id":205764,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_205765',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Story","Stoory","Storry","Stury"]',
  'Story',
  1,
  '{"original_question_id":205765,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_205766',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Brothar","Beother","Brother","Bruther"]',
  'Brother',
  1,
  '{"original_question_id":205766,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_316121',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'tick_correct_spelling',
  'medium',
  '',
  '["Stitch","Stitceh","Stitche","Sttitch"]',
  'Stitch',
  1,
  '{"original_question_id":316121,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Additional","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_316122',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'tick_correct_spelling',
  'medium',
  '',
  '["Crowen","Crown","Crouwn","Cerown"]',
  'Crown',
  1,
  '{"original_question_id":316122,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Additional","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_316123',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'tick_correct_spelling',
  'medium',
  '',
  '["Meand","Mand","Mend","Mende"]',
  'Mend',
  1,
  '{"original_question_id":316123,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Additional","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_316124',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'tick_correct_spelling',
  'medium',
  '',
  '["Cobblerr","Cobler","Cobblar","Cobbler"]',
  'Cobbler',
  1,
  '{"original_question_id":316124,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Additional","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_205841',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Respect","Rispect","Resppect","Raspact"]',
  'Respect',
  1,
  '{"original_question_id":205841,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_205842',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Cullect","Collect","Collact","Colect"]',
  'Collect',
  1,
  '{"original_question_id":205842,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_205843',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Flawer","Fluwer","Flower","Flowar"]',
  'Flower',
  1,
  '{"original_question_id":205843,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_205844',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Lead","Laad","Leed","Led"]',
  'Lead',
  1,
  '{"original_question_id":205844,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_205845',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Gluee","Glue","Gloe","Glo"]',
  'Glue',
  1,
  '{"original_question_id":205845,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_316131',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'tick_correct_spelling',
  'medium',
  '',
  '["Share","Sharee","Shere","Sharre"]',
  'Share',
  1,
  '{"original_question_id":316131,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Additional","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_316132',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'tick_correct_spelling',
  'medium',
  '',
  '["Insiste","Insist","Inssist","Ensist"]',
  'Insist',
  1,
  '{"original_question_id":316132,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Additional","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_316133',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'tick_correct_spelling',
  'medium',
  '',
  '["Certaine","Cartain","Certain","Certein"]',
  'Certain',
  1,
  '{"original_question_id":316133,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Additional","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_316134',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'tick_correct_spelling',
  'medium',
  '',
  '["Adullt","Adulet","Adulte","Adult"]',
  'Adult',
  1,
  '{"original_question_id":316134,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Additional","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_205861',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Ealthy","Hellthy","Healthy","Helthy"]',
  'Healthy',
  1,
  '{"original_question_id":205861,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_205862',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Iqual","Equal","Equaal","Aqual"]',
  'Equal',
  1,
  '{"original_question_id":205862,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_205863',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Piple","Pple","People","Peple"]',
  'People',
  1,
  '{"original_question_id":205863,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_205864',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Sorry","Soory","Sory","Sarry"]',
  'Sorry',
  1,
  '{"original_question_id":205864,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_205865',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Baskit","Basket","Baskett","Baskat"]',
  'Basket',
  1,
  '{"original_question_id":205865,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_316142',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Met","Mett","Mat","Meat"]',
  'Met',
  1,
  '{"original_question_id":316142,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316143',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Introdce","Introduce","Intruduce","Introducee"]',
  'Introduce',
  1,
  '{"original_question_id":316143,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316144',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Explaned","Expleined","Explained","Explainad"]',
  'Explained',
  1,
  '{"original_question_id":316144,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316145',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Welcomed","Welcomad","Walcomed","Welcomede"]',
  'Welcomed',
  1,
  '{"original_question_id":316145,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316146',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Throgh","Through","Thrugh","Througeh"]',
  'Through',
  1,
  '{"original_question_id":316146,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316147',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Mannars","Menners","Manners","Maners"]',
  'Manners',
  1,
  '{"original_question_id":316147,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316148',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'tick_correct_spelling',
  'medium',
  '',
  '["Qoueue","Queua","Quaue","Queue"]',
  'Queue',
  1,
  '{"original_question_id":316148,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Additional","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_316149',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'tick_correct_spelling',
  'medium',
  '',
  '["Though","Thugh","Thogh","Tehough"]',
  'Though',
  1,
  '{"original_question_id":316149,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Additional","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_316150',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'tick_correct_spelling',
  'medium',
  '',
  '["Courese","Course","Coursse","Corse"]',
  'Course',
  1,
  '{"original_question_id":316150,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Additional","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_316151',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'tick_correct_spelling',
  'medium',
  '',
  '["Leaveng","Leavinng","Leeving","Leaving"]',
  'Leaving',
  1,
  '{"original_question_id":316151,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Additional","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_316152',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'tick_correct_spelling',
  'medium',
  '',
  '["Spring","Spreng","Spering","Sprinng"]',
  'Spring',
  1,
  '{"original_question_id":316152,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Additional","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_316153',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'tick_correct_spelling',
  'medium',
  '',
  '["Making","Meking","Makinng","Makking"]',
  'Making',
  1,
  '{"original_question_id":316153,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Additional","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_316154',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'tick_correct_spelling',
  'medium',
  '',
  '["Piecee","Piece","Pieece","Piiece"]',
  'Piece',
  1,
  '{"original_question_id":316154,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Additional","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_316155',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'tick_correct_spelling',
  'medium',
  '',
  '["Greetinges","Greaetings","Greetings","Gretings"]',
  'Greetings',
  1,
  '{"original_question_id":316155,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Additional","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_316156',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'tick_correct_spelling',
  'medium',
  '',
  '["Cousin","Cusin","Cosin","Cousen"]',
  'Cousin',
  1,
  '{"original_question_id":316156,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Additional","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_316157',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Together","Togethar","Togather","Toogether"]',
  'Together',
  1,
  '{"original_question_id":316157,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_316158',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Proudlly","Proudly","Prodly","Prudly"]',
  'Proudly',
  1,
  '{"original_question_id":316158,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_316159',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Chalenged","Challanged","Challenged","Challengad"]',
  'Challenged',
  1,
  '{"original_question_id":316159,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_316160',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Heppily","Happilly","Hapily","Happily"]',
  'Happily',
  1,
  '{"original_question_id":316160,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_316161',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Thought","Thoght","Thught","Thoughet"]',
  'Thought',
  1,
  '{"original_question_id":316161,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_316162',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Rached","Reched","Reachad","Reached"]',
  'Reached',
  1,
  '{"original_question_id":316162,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_316163',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'tick_correct_spelling',
  'medium',
  '',
  '["Lodly","Ludly","Loudlly","Loudly"]',
  'Loudly',
  1,
  '{"original_question_id":316163,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Additional","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_205960',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Down","Downn","Duwn","Dun"]',
  'Down',
  1,
  '{"original_question_id":205960,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_205963',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'tick_correct_spelling',
  'medium',
  '<p>Correct Spelling</p>',
  '["Chiar","Chair","Chaiir","Chear"]',
  'Chair',
  1,
  '{"original_question_id":205963,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_205965',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Satretch","Setretch","Stretch","Stretsh"]',
  'Stretch',
  1,
  '{"original_question_id":205965,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_205967',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Adopt","Adoopt","Adopat","Adobt"]',
  'Adopt',
  1,
  '{"original_question_id":205967,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_205968',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'tick_correct_spelling',
  'medium',
  '<p>Correct spelling</p>',
  '["Haapy","Happy","Happyy","Hapy"]',
  'Happy',
  1,
  '{"original_question_id":205968,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450300',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'grammar',
  'medium',
  '<p>I ......... a policeman. </p>',
  '["am","is","are","were"]',
  'am',
  1,
  '{"original_question_id":450300,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450306',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'grammar',
  'medium',
  '<p>Zara and Iqra ......... good students. </p>',
  '["are","is","am","was"]',
  'are',
  1,
  '{"original_question_id":450306,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450309',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'grammar',
  'medium',
  '<p>This ......... my bedroom. </p>',
  '["is","am","are","were"]',
  'is',
  1,
  '{"original_question_id":450309,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450310',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'grammar',
  'medium',
  '<p>They ......... very kind. </p>',
  '["am","are","is","was"]',
  'are',
  1,
  '{"original_question_id":450310,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450311',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'grammar',
  'medium',
  '<p>Miss Asma ......... our class teacher. </p>',
  '["are","is","were","am"]',
  'is',
  1,
  '{"original_question_id":450311,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163264',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>This is an ..................(green, orange, like) <img src="/Equations/1st/engnew-chap2-1.png" style="zoom:50%;" /></p>',
  '[]',
  'orange',
  1,
  '{"original_question_id":163264,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163265',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>Its leaves are ................... (green, orange, like) <img src="/Equations/1st/engnew-chap2-1.png" style="zoom:50%;" /></p>',
  '[]',
  'green',
  1,
  '{"original_question_id":163265,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163266',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>I .................. it.(green, orange, like) <img src="/Equations/1st/engnew-chap2-1.png" style="zoom:50%;" /></p>',
  '[]',
  'like',
  1,
  '{"original_question_id":163266,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_450664',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>................. is a girl. (She, He) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450664,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_450665',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>................. are a student. (It, You)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450665,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_450666',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>................. is a good boy. (He, She) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450666,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_450667',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>................. are in class one. (I, We) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450667,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_450668',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>................. am a teacher. (You, I)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450668,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_450669',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'fill_in_the_blanks',
  'medium',
  '<p>................. is a rabbit. (It, They) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450669,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163274',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>Cobbler, cobbler, mend my .......... (eight, down, crown, shoe, two)</p>',
  '[]',
  'shoe',
  1,
  '{"original_question_id":163274,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163275',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>Stitch it up and stitch it  .................. (eight, down, crown, shoe, two)</p>',
  '[]',
  'down',
  1,
  '{"original_question_id":163275,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163276',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>Half past  .................. is much too late! (eight, down, crown, shoe, two)</p>',
  '[]',
  'two',
  1,
  '{"original_question_id":163276,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163277',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>Get it done by half past .......... (eight, down, crown, shoe, two)</p>',
  '[]',
  'eight',
  1,
  '{"original_question_id":163277,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163278',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>And I''ll give you half a .......... (eight, down, crown, shoe, two)</p>',
  '[]',
  'crown',
  1,
  '{"original_question_id":163278,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450226',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>She is a .................. <img src="/Equations/1st/engnew-chap3-5.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450226,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450227',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>Sajid has a pet ..................<img src="/Equations/1st/engnew-chap3-6.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450227,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450228',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>Maha has two .................. <img src="/Equations/1st/engnew-chap3-7.png" style="zoom:30%;" /><img src="/Equations/1st/engnew-chap3-7.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450228,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450230',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>A person who mends shoes is a ..........(cobbler, teacher, doctor, gardener)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450230,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450231',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>A person who teaches is a ..........(cobbler, teacher, doctor, gardener)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450231,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450232',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>A person who treats ill people is a ..........(cobbler, teacher, doctor, gardener)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450232,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450233',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'fill_in_the_blanks',
  'medium',
  '<p>A person who works in a garden is a ..........(cobbler, teacher, doctor, gardener)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450233,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450661',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Hira and Asma are playing. ................. are good friends. (He, They) <img src="/Equations/1st/engnew-review1-10.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450661,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450662',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Vicky is a boy. .................. is a good student. (He, She) <img src="/Equations/1st/engnew-review1-11.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450662,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450663',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Hi, Rita! .................. look happy. (They, You) <img src="/Equations/1st/engnew-review1-12.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450663,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450679',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'fill_in_the_blanks',
  'medium',
  '<p>Label the thing using ''a'' or ''an'': .................. car <img src="/Equations/1st/gohar-eng-chap5-1.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450679,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450680',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'fill_in_the_blanks',
  'medium',
  '<p>Label the thing using ''a'' or ''an'': .................. sun <img src="/Equations/1st/gohar-eng-chap5-2.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450680,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450681',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'fill_in_the_blanks',
  'medium',
  '<p>Label the thing using ''a'' or ''an'': .................. aeroplane <img src="/Equations/1st/gohar-eng-chap5-3.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450681,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450682',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'fill_in_the_blanks',
  'medium',
  '<p>Label the thing using ''a'' or ''an'': .................. orange <img src="/Equations/1st/gohar-eng-chap5-4.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450682,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450683',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'fill_in_the_blanks',
  'medium',
  '<p>Label the thing using ''a'' or ''an'': .................. ice cream <img src="/Equations/1st/gohar-eng-chap5-5.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450683,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450684',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'fill_in_the_blanks',
  'medium',
  '<p>Label the thing using ''a'' or ''an'': .................. ball <img src="/Equations/1st/gohar-eng-chap5-6.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":450684,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450275',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Umair is eating ......... orange. (a, an) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450275,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450276',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>I have ......... pen. (a, an) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450276,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450277',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>The bird is sitting in ......... tree. (a, an)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450277,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450278',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>He bought ......... umbrella. (a, an) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450278,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163312',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p>Miss Anum is the ..................teacher of grade 1. (clean, teacher, English, carefully) </p>',
  '[]',
  'English',
  1,
  '{"original_question_id":163312,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163313',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p>Keep your classroom ..................(clean, teacher, English, carefully) </p>',
  '[]',
  'clean',
  1,
  '{"original_question_id":163313,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163314',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p>Listen to your teacher  ..................(clean, teacher, English, carefully) </p>',
  '[]',
  'carefully',
  1,
  '{"original_question_id":163314,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163315',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p>Respect your  ..................(clean, teacher, English, carefully) </p>',
  '[]',
  'teacher',
  1,
  '{"original_question_id":163315,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450290',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p><strong>''Cat'' </strong>rhymes with .......... (hat, mouse) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450290,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450291',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p><strong>''Sun'' </strong>rhymes with .......... (goat, bun) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450291,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450292',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p><strong>''Hen'' </strong>rhymes with .......... (ten, rain) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450292,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450293',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'fill_in_the_blanks',
  'medium',
  '<p><strong>''Ring'' </strong>rhymes with .......... (swing, nut) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450293,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163319',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>Good-bye,  ..................! Good-bye, ice! (ball, snow, gald, spring, shout) </p>',
  '[]',
  'snow',
  1,
  '{"original_question_id":163319,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163320',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>Leaving us this fine . .................... day. (ball, snow, gald, spring, shout) </p>',
  '[]',
  'spring',
  1,
  '{"original_question_id":163320,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163321',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>Here''s my good old bat and  ..................! (ball, snow, gald, spring, shout) </p>',
  '[]',
  'ball',
  1,
  '{"original_question_id":163321,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163322',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>Now I just could . ................. and sing. (ball, snow, gald, spring, shout) </p>',
  '[]',
  'shout',
  1,
  '{"original_question_id":163322,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163323',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>I''m so  .................. because it''s spring. (ball, snow, gald, spring, shout) </p>',
  '[]',
  'glad',
  1,
  '{"original_question_id":163323,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450695',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>We have .................. eyes to see with. </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450695,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450696',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>We have .................. nose to smell with. </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450696,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450697',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>.................. is our homeland. </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450697,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450698',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>.................. is the Capital city of Pakistan. </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450698,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450361',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>The rabbit has ......... fur. (light, soft, short) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450361,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450362',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>Tom is a ......... boy. (light, soft, short) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450362,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450363',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>It is a ......... box. (light, soft, short) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450363,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450690',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>I ......... Haris. (is, am, are) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450690,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450691',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>He ......... a doctor. (is, am, are) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450691,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450692',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>We ......... tired. (is, am, are) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450692,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450693',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>She .......... writing a letter. (is, am, are) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450693,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450694',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'fill_in_the_blanks',
  'medium',
  '<p>They ......... very busy. (is, am, are) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450694,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Grammar","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450719',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>She .................. a teacher. (is, are)</p>',
  '[]',
  '',
  1,
  '{"original_question_id":450719,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450720',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>I .................. Hamza. (am, is) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450720,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450721',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>They .................. sleepy. (are, am) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450721,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163343',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>The tortoise reached the  ................... first. (hare, challenged, finish line, ashamed, rude) </p>',
  '[]',
  'finish line',
  1,
  '{"original_question_id":163343,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163344',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>The .................. was making fun of the tortoise. (hare, challenged, finish line, ashamed, rude) </p>',
  '[]',
  'hare',
  1,
  '{"original_question_id":163344,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163345',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>The hare felt ................... (hare, challenged, finish line, ashamed, rude) </p>',
  '[]',
  'proud',
  1,
  '{"original_question_id":163345,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163346',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>He said sorry to the tortoise for his  .................. behaviour. (hare, challenged, finish line, ashamed, rude) </p>',
  '[]',
  'ashamed',
  1,
  '{"original_question_id":163346,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163347',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>The tortoise .................. the hare to a race. (hare, challenged, finish line, ashamed, rude) </p>',
  '[]',
  'challenged',
  1,
  '{"original_question_id":163347,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_450725',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>I am Samra. This is .................. pet. (our, my, your) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450725,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Grammar","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_450726',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>We are brother and sister. This is .................. house. (our, my, your) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450726,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Grammar","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_450727',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'fill_in_the_blanks',
  'medium',
  '<p>You are Arun. This is .................. pencil. (our, my, your) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450727,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Grammar","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163351',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'fill_in_the_blanks',
  'medium',
  '<p>The colour of the kitty cat is&nbsp;.&nbsp;..................</p>',
  '[]',
  'black and white',
  1,
  '{"original_question_id":163351,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_163352',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'fill_in_the_blanks',
  'medium',
  '<p>The kitty cat eats its food at&nbsp;...................</p>',
  '[]',
  'dawn',
  1,
  '{"original_question_id":163352,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_163353',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'fill_in_the_blanks',
  'medium',
  '<p>The kitty cat wants to have a rest on the&nbsp;...................</p>',
  '[]',
  'chair',
  1,
  '{"original_question_id":163353,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450739',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'fill_in_the_blanks',
  'medium',
  '<p>Nimra is a girl. This is ......... cat. (his, her, their) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450739,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Grammar","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450740',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'fill_in_the_blanks',
  'medium',
  '<p>Usman is a doctor. This is ......... clinic. (his, her, their)  </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450740,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Grammar","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450741',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'fill_in_the_blanks',
  'medium',
  '<p>Amna and Ambreen are sisters. Yunas is ......... father. (his, her, their)  </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450741,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Grammar","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450746',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Seeta is a girl. This is ......... cat. (his, her, their) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450746,"topic_id":5128,"topic_name":"4 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450747',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Ahmad is a boy. This is ......... car. (his, her, their)  </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450747,"topic_id":5128,"topic_name":"4 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450748',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'fill_in_the_blanks',
  'medium',
  '<p>Sam and Ben are brothers. Mr. Patrick is ......... uncle. (his, her, their) </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450748,"topic_id":5128,"topic_name":"4 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_459573',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'true_false_statements',
  'medium',
  '<p><img src="/Equations/9th/mthnew-ex1.1-6.svg" />.......... <img src="/Equations/9th/mthnew-ex1.1-6.svg" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":459573,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_205743',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-1.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">a</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-4.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">u</td>
		</tr>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-2.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">v</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-5.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">j</td>
		</tr>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-3.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">e</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-6.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">s</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":205743,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_457524',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'match_columns',
  'medium',
  '<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td colspan="1" rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l2-1.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Boy</td>
			<td colspan="1" rowspan="2" style="text-align: center;"><img src="/Equations/1st/Screenshot 2026-01-17 113534.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">Cow</td>
		</tr>
		<tr>
			<td colspan="1" rowspan="2" style="text-align: center;"><img src="/Equations/1st/Screenshot 2026-01-17 113253.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Ball</td>
			<td colspan="1" rowspan="2" style="text-align: center;"><img src="/Equations/1st/Screenshot 2026-01-17 113608.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">Elephant</td>
		</tr>
		<tr>
			<td colspan="1" rowspan="2" style="text-align: center;"><img src="/Equations/1st/Screenshot 2026-01-17 113406.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Banana</td>
			<td colspan="1" rowspan="2" style="text-align: center;"><img src="/Equations/1st/Screenshot 2026-01-17 113640.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">Girl</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  1,
  '{"original_question_id":457524,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_205778',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-1.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Car</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-3.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">House</td>
		</tr>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-2.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Rabbit</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-4.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">Girl</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":205778,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_205821',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-5.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Cook</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-7.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">Eat</td>
		</tr>
		<tr>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-6.png" style="zoom:50%;" /></td>
			<td style="text-align: center;">Read</td>
			<td rowspan="2" style="text-align: center;"><img src="/Equations/1st/eng-l3-8.png" style="zoom:50%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;">Brush</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":205821,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450225',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'match_columns',
  'medium',
  '<p style="text-align: center;">The rhyming words. </p>

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">Cook</td>
			<td style="text-align: center;">Blow</td>
		</tr>
		<tr>
			<td style="text-align: center;">Late</td>
			<td style="text-align: center;">Book</td>
		</tr>
		<tr>
			<td style="text-align: center;">Grow</td>
			<td style="text-align: center;">Eight</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450225,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_450255',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'match_columns',
  'medium',
  '<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><strong>Masculine </strong></td>
			<td style="text-align: center;"><strong>Feminine</strong></td>
		</tr>
		<tr>
			<td style="text-align: center;">Father</td>
			<td style="text-align: center;">Lioness</td>
		</tr>
		<tr>
			<td style="text-align: center;">Uncle </td>
			<td style="text-align: center;">Sister</td>
		</tr>
		<tr>
			<td style="text-align: center;">Lion</td>
			<td style="text-align: center;">Mother</td>
		</tr>
		<tr>
			<td style="text-align: center;">Brother</td>
			<td style="text-align: center;">Aunt</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  1,
  '{"original_question_id":450255,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_205854',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'match_columns',
  'medium',
  '<p><strong>Begin with the same sound.</strong></p>

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">Feel</td>
			<td style="text-align: center;">Toy</td>
		</tr>
		<tr>
			<td style="text-align: center;">Train</td>
			<td style="text-align: center;">Say</td>
		</tr>
		<tr>
			<td style="text-align: center;">Sad</td>
			<td style="text-align: center;">Fun</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  1,
  '{"original_question_id":205854,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_205934',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">Swing</td>
			<td style="text-align: center;">Fall</td>
		</tr>
		<tr>
			<td style="text-align: center;">Tall</td>
			<td style="text-align: center;">Sleep</td>
		</tr>
		<tr>
			<td style="text-align: center;">Keep</td>
			<td style="text-align: center;">Ring</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":205934,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_249517',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line: <img src="/Equations/1st/eng-1.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":249517,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451791',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-1.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451791,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451792',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-2.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451792,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451793',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-3.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451793,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451794',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-4.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451794,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451795',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-5.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451795,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451796',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-6.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451796,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451797',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace the given line:<img src="/Equations/1st/engnew-chap1-7.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451797,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451798',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and color the picture below:<img src="/Equations/1st/engnew-chap1-8.png" style="zoom:30%;" /></p>

<p><img src="/Equations/1st/engnew-chap1-9.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451798,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451799',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and copy the capital and small letters: <img src="/Equations/1st/engnew-chap1-10.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451799,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451800',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and copy the capital and small letters: <img src="/Equations/1st/engnew-chap1-11.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451800,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451801',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and copy the capital and small letters: <img src="/Equations/1st/engnew-chap1-12.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451801,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451802',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and copy the capital and small letters: <img src="/Equations/1st/engnew-chap1-13.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451802,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451804',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and copy the capital and small letters: <img src="/Equations/1st/engnew-chap1-15.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451804,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451805',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Trace and copy the capital and small letters: <img src="/Equations/1st/engnew-chap1-14.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451805,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451806',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write capital letters in alphabetical order. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":451806,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451807',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the letter that comes before the given letter: <img src="/Equations/1st/engnew-chap1-16.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451807,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451808',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the letter that comes before the given letter: <img src="/Equations/1st/engnew-chap1-17.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451808,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451809',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the letter that comes after the given letter: <img src="/Equations/1st/engnew-chap1-18.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":451809,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_451810',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Copy the given words:</p>

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">sun</td>
			<td>     </td>
			<td style="text-align: center;">ant</td>
			<td>     </td>
		</tr>
		<tr>
			<td style="text-align: center;">pan</td>
			<td> </td>
			<td style="text-align: center;">rat</td>
			<td> </td>
		</tr>
		<tr>
			<td style="text-align: center;">jug</td>
			<td> </td>
			<td style="text-align: center;">hen</td>
			<td> </td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":451810,"topic_id":5114,"topic_name":"1.1 Time to Recall","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163261',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'question_answers',
  'medium',
  '<p>How many sisters does Sa&#39;ad have?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163261,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163262',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'question_answers',
  'medium',
  '<p>Write two things that Sa&#39;ad does when he comes back home from school.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163262,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163263',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_99594bc9e666dd45',
  'UNIT 2: My Family and I',
  'question_answers',
  'medium',
  '<p>What do you like to do in the evening?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163263,"topic_id":5115,"topic_name":"2.1 My Father and I","priority":"Exercise","chapter":"UNIT 2: My Family and I"}'::jsonb,
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
  'q_global_eng_163271',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'question_answers',
  'medium',
  '<p>Why did the boy go to the cobbler?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163271,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163272',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'question_answers',
  'medium',
  '<p>How many times did the boy go to the cobbler?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163272,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163273',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a19feee121fc3fb4',
  'UNIT 3: Cobbler, Cobbler',
  'question_answers',
  'medium',
  '<p>Find and write the pairs of rhyming words in the poem &quot;Cobbler, Cobbler&quot;.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163273,"topic_id":5116,"topic_name":"3.1 Cobbler, Cobbler","priority":"Exercise","chapter":"UNIT 3: Cobbler, Cobbler"}'::jsonb,
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
  'q_global_eng_163279',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>How many brothers and sisters do you have?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163279,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163280',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>What are three things that you do in your school?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163280,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163281',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>When do you get up in the morning?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163281,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450234',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Read the given words and underline the consonant blends.</p>

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">Brick</td>
			<td style="text-align: center;">Block</td>
			<td style="text-align: center;">Drop</td>
			<td style="text-align: center;">Blue</td>
		</tr>
		<tr>
			<td style="text-align: center;">Dream</td>
			<td style="text-align: center;">Class</td>
			<td style="text-align: center;">Brain</td>
			<td style="text-align: center;">Clock</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450234,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450652',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Look at the given pictures and circle their letter sounds: c      b <img src="/Equations/1st/engnew-review1-1.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450652,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450653',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Look at the given pictures and circle their letter sounds: k     m <img src="/Equations/1st/engnew-review1-2.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450653,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450654',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Look at the given pictures and circle their letter sounds: s      z <img src="/Equations/1st/engnew-review1-3.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450654,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450655',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the name of the given picture: <img src="/Equations/1st/engnew-review1-4.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450655,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450656',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the names of the given picture:<img src="/Equations/1st/engnew-review1-5.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450656,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450657',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the name of the given picture:  <img src="/Equations/1st/engnew-review1-6.png" style="zoom:35%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450657,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450658',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the name of the given picture: <img src="/Equations/1st/engnew-review1-7.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450658,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450659',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the name of the given picture: <img src="/Equations/1st/engnew-review1-8.png" style="zoom:35%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450659,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450660',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write the name of the given picture: <img src="/Equations/1st/engnew-review1-9.png" style="zoom:35%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450660,"topic_id":5117,"topic_name":"1 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163283',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Who did Huma help in making pencil shaving artwork?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163283,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163284',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>What did they do before collecting the pencil shavings?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163284,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163285',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Name any two things we need to make pencil shaving artwork.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163285,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450240',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Underline the consonant blends in the given words. </p>

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">Blink</td>
			<td style="text-align: center;">Draw</td>
			<td style="text-align: center;">Climb</td>
		</tr>
		<tr>
			<td style="text-align: center;">close</td>
			<td style="text-align: center;">Bring</td>
			<td style="text-align: center;">Dress</td>
		</tr>
		<tr>
			<td style="text-align: center;">Brown</td>
			<td style="text-align: center;">Black</td>
			<td style="text-align: center;">Blew</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450240,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450251',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Write ''a'' or ''an'' before the words: (a)......... orange. (b) ......... lamp</p>',
  '[]',
  '',
  2,
  '{"original_question_id":450251,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450252',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Write ''a'' or ''an'' before the words: (a)......... umbrella (b) ......... horse</p>',
  '[]',
  '',
  2,
  '{"original_question_id":450252,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450253',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Write ''a'' or ''an'' before the words:<strong> </strong>(a) ......... ant (b) ......... cat </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450253,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450670',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words (this and that) by looking at the picture:</p>

<p>This/That is an orange.<img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" /><img src="/Equations/1st/engnew-chap4-1.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450670,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450671',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words (this and that) by looking at the picture:</p>

<p>This/That is a table. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" />                   <img src="/Equations/1st/engnew-chap4-3.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450671,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450672',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words (this and that) by looking at the picture:</p>

<p>This/That is a clock. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" /><img src="/Equations/1st/engnew-chap4-2.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450672,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_450673',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_36c055fc3d5698e1',
  'UNIT 4: Let''s Have Fun!',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words (this and that) by looking at the picture:</p>

<p>This/That is a car. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" />                      <img src="/Equations/1st/engnew-chap4-5.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450673,"topic_id":5118,"topic_name":"4.1 Let''s have Fun!","priority":"Exercise","chapter":"UNIT 4: Let''s Have Fun!"}'::jsonb,
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
  'q_global_eng_163290',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Is sharing a good habit? Do you have this habit?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163290,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_163291',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Would you like to share your things with your friends? Why?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163291,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_163292',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>What do you like to share with your friends?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163292,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450254',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Circle the word in each row that rhymes with the given word:</p>

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">Well</td>
			<td style="text-align: center;">Fair</td>
			<td style="text-align: center;">Red</td>
			<td style="text-align: center;">Smell</td>
		</tr>
		<tr>
			<td style="text-align: center;">Lack</td>
			<td style="text-align: center;">Dove</td>
			<td style="text-align: center;">Rack</td>
			<td style="text-align: center;">Hat</td>
		</tr>
		<tr>
			<td style="text-align: center;">Float</td>
			<td style="text-align: center;">Coat</td>
			<td style="text-align: center;">Shell</td>
			<td style="text-align: center;">Flight</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450254,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450674',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words by looking at the picture:</p>

<p>These/Those are cars. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" />                   <img src="/Equations/1st/engnew-chap5-2.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450674,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450675',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words by looking at the picture:</p>

<p>These/Those are books. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" /><img src="/Equations/1st/engnew-chap5-6.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450675,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450676',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words by looking at the picture:</p>

<p>These/Those are watches. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" />                        <img src="/Equations/1st/engnew-chap5-3.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450676,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450677',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words by looking at the picture:</p>

<p>These/Those are colour pencils. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" /><img src="/Equations/1st/engnew-chap5-4.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450677,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_450678',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_efae9822c7f2f934',
  'UNIT 5: Sharing is Caring',
  'question_answers',
  'medium',
  '<p>Circle the correct pointing words by looking at the picture:</p>

<p>These/Those are cups. <img src="/Equations/1st/engnew-chap5-1.png" style="zoom:25%;" />                               <img src="/Equations/1st/engnew-chap5-5.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450678,"topic_id":5119,"topic_name":"5.1 Sharing is Carring","priority":"Exercise","chapter":"UNIT 5: Sharing is Caring"}'::jsonb,
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
  'q_global_eng_163296',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Is sharing a good habit? Why?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163296,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163297',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>What things did Huma collect before making the pencil shavings?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163297,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163298',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>What do you like to share with your friends?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163298,"topic_id":5120,"topic_name":"2 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163303',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'question_answers',
  'medium',
  '<p>Who was sad?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163303,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_163304',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'question_answers',
  'medium',
  '<p>What did Juicy Apple say to Red Carrot?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163304,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_163305',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'question_answers',
  'medium',
  '<p>Is it good to make fun of others?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163305,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_450289',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'question_answers',
  'medium',
  '<p>Write numbers from 1-10 in words. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450289,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_450685',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_ded975dddfc4492b',
  'UNIT 6: Blessings of Allah سبحان تعالیٰ',
  'question_answers',
  'medium',
  '<p>Tick the fruits and circle the vegetables.</p>

<p><img src="/Equations/1st/engnew-chap6-1.png" style="zoom:30%;" /><img src="/Equations/1st/engnew-chap6-2.png" style="zoom:30%;" /><img src="/Equations/1st/engnew-chap6-3.png" style="zoom:30%;" /><img src="/Equations/1st/engnew-chap6-4.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450685,"topic_id":5121,"topic_name":"6.1 Blessing of Allah سبحان و تعالیٰ","priority":"Exercise","chapter":"UNIT 6: Blessings of Allah سبحان تعالیٰ"}'::jsonb,
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
  'q_global_eng_163310',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Who was new in the school?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163310,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163311',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Who teaches English to grade 1?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163311,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450294',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Write the names of any three objects in the classroom. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450294,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450295',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Write the names of any three objects at home.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":450295,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450296',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="height:200px;width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/engnew-chap7-1.png" style="zoom:20%;" /></td>
			<td style="text-align: center;">Circle the iron on the left.</td>
			<td style="text-align: center;"><img src="/Equations/1st/engnew-chap7-1.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/engnew-chap7-2.png" style="zoom:25%;" /></td>
			<td style="text-align: center;">Tick the bag on the right.</td>
			<td style="text-align: center;"><img src="/Equations/1st/engnew-chap7-2.png" style="zoom:25%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/engnew-chap7-3.png" style="zoom:10%;" /></td>
			<td style="text-align: center;">Cross the sofa on the left. </td>
			<td style="text-align: center;"><img src="/Equations/1st/engnew-chap7-3.png" style="zoom:10%;" /></td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450296,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450312',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Write the names of three things about <u><strong>Clothes</strong></u>. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450312,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450313',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Write the names of three things about <b><u>Food</u></b>. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450313,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_450314',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a33dd7fadbe75f63',
  'UNIT 7: Classroom Manners',
  'question_answers',
  'medium',
  '<p>Write the names of three things about <u><strong>Classroom Objects</strong></u>. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450314,"topic_id":5122,"topic_name":"7.1 Classroom Manners","priority":"Exercise","chapter":"UNIT 7: Classroom Manners"}'::jsonb,
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
  'q_global_eng_163316',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>What is the poem &quot;It&#39;s Spring Time&quot; about?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163316,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163317',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Why does the poet want to shout and sing?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163317,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163318',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Name the seasons mentioned in the poem &quot;It&#39;s Spring Time&quot;.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163318,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_205902',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Write any three body parts.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":205902,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450341',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Arrange the given words in alphabetical order. (Tree, Hang, Wind, lack, Mind)</p>',
  '[]',
  '',
  2,
  '{"original_question_id":450341,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450342',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Make a rhyming word for each given word. (a) Tree (b) Hang</p>',
  '[]',
  '',
  2,
  '{"original_question_id":450342,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450346',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Write any three body parts. </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450346,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450686',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Look at the given picture and label the name of the type of weather: <img src="/Equations/1st/engnew-chap8-1.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450686,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450687',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Look at the given picture and label the name of the type of weather: <img src="/Equations/1st/engnew-chap8-2.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450687,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450688',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Look at the given picture and label the name of the type of weather: <img src="/Equations/1st/engnew-chap8-3.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450688,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_450689',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b86f4289f903d9d',
  'UNIT 8: Nature is Beautiful',
  'question_answers',
  'medium',
  '<p>Look at the given picture and label the name of the type of weather: <img src="/Equations/1st/engnew-chap8-4.png" style="zoom:35%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450689,"topic_id":5123,"topic_name":"8.1 Nature is Beautiful","priority":"Exercise","chapter":"UNIT 8: Nature is Beautiful"}'::jsonb,
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
  'q_global_eng_163327',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>What are the children making?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163327,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_163328',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>What does Maham draw on the card?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163328,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_163329',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>What do they do after making the card?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163329,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_450700',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>Write the ordinal number in words in their correct position:</p>

<p><img src="/Equations/1st/engnew-chap9-1.png" style="zoom:60%;" /><img src="/Equations/1st/engnew-chap9-2.png" style="zoom:55%;" /><img src="/Equations/1st/engnew-chap9-3.png" style="zoom:55%;" /><img src="/Equations/1st/engnew-chap9-4.png" style="zoom:55%;" /><img src="/Equations/1st/engnew-chap9-5.png" style="zoom:60%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450700,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Exercise","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_450705',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>Look at the picture and write its name. Use an adjective to tell their colour: <img src="/Equations/1st/engnew-chap9-6.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450705,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Grammar","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_450706',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>Look at the picture and write its name. Use an adjective to tell their colour: <img src="/Equations/1st/engnew-chap9-7.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450706,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Grammar","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_450707',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>Look at the picture and write its name. Use an adjective to tell their colour: <img src="/Equations/1st/engnew-chap9-8.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450707,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Grammar","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_450708',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>Look at the picture and write its name. Use an adjective to tell their colour: <img src="/Equations/1st/engnew-chap9-9.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450708,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Grammar","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_450709',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_961f0cfb4a9bf742',
  'UNIT 9: A Greeting Card',
  'question_answers',
  'medium',
  '<p>Look at the picture and write its name. Use an adjective to tell their colour: <img src="/Equations/1st/engnew-chap9-10.png" style="zoom:70%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":450709,"topic_id":5124,"topic_name":"9.1 A Greeting Card","priority":"Grammar","chapter":"UNIT 9: A Greeting Card"}'::jsonb,
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
  'q_global_eng_163333',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Why are Ayyan and Maham happy?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163333,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163334',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Write any two classroom manners.</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163334,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163335',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Who was looking at the classroom manners?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163335,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_450718',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Arrange the given words in alphabetical order. (rain, zoo, nose, bus, camel, key) </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450718,"topic_id":5125,"topic_name":"3 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163340',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'question_answers',
  'medium',
  '<p>What happened during the race?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163340,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163341',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'question_answers',
  'medium',
  '<p>Who was proud?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163341,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163342',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'question_answers',
  'medium',
  '<p>What do you learn from the story?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163342,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_450724',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_d2c4d99ac3c4e417',
  'UNIT 10: The Hare and the Tortoise',
  'question_answers',
  'medium',
  '<p>Circle the plurals that end in an ''s'' sound and square the plurals that end in a ''z'' sound. </p>

<table border="1" cellpadding="1" cellspacing="1" style="width:100%;">
	<tbody>
		<tr>
			<td style="text-align: center;">Ants</td>
			<td style="text-align: center;">Hats</td>
			<td style="text-align: center;">Tigers</td>
			<td style="text-align: center;">Flower</td>
		</tr>
		<tr>
			<td style="text-align: center;">Pandas</td>
			<td style="text-align: center;">Snakes</td>
			<td style="text-align: center;">Books</td>
			<td style="text-align: center;">Dogs</td>
		</tr>
	</tbody>
</table>

<p> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450724,"topic_id":5126,"topic_name":"10.1 The Hare and the Tortoise","priority":"Exercise","chapter":"UNIT 10: The Hare and the Tortoise"}'::jsonb,
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
  'q_global_eng_163348',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'question_answers',
  'medium',
  '<p>What is the colour of the kitty cat?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163348,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_163349',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'question_answers',
  'medium',
  '<p>At what time does the cat sleep and play?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163349,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_163350',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'question_answers',
  'medium',
  '<p>Where did the cat have a rest?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163350,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450736',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'question_answers',
  'medium',
  '<p>How many months are there in a year?</p>

<p><img src="/Equations/5th/engnew-chap12-4.png" style="zoom:50%;" /> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450736,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450737',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'question_answers',
  'medium',
  '<p>What is your birthday month?</p>

<p> <img src="/Equations/5th/engnew-chap12-4.png" style="zoom:50%;" /> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450737,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_450738',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_a9747bd7f02d4652',
  'UNIT 11: Love Animals',
  'question_answers',
  'medium',
  '<p>Name the sixth month of a year.</p>

<p> <img src="/Equations/5th/engnew-chap12-4.png" style="zoom:50%;" /> </p>',
  '[]',
  '',
  2,
  '{"original_question_id":450738,"topic_id":5127,"topic_name":"11.1 Love Animals","priority":"Exercise","chapter":"UNIT 11: Love Animals"}'::jsonb,
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
  'q_global_eng_163354',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>Why did the hare make fun of the tortoise?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163354,"topic_id":5128,"topic_name":"4 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163355',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>What happened during the race of hare and tortoise?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163355,"topic_id":5128,"topic_name":"4 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_163356',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'question_answers',
  'medium',
  '<p>How do we take care of our pet animals?</p>',
  '[]',
  '',
  2,
  '{"original_question_id":163356,"topic_id":5128,"topic_name":"4 Review","priority":"Exercise","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318055',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend congratulating him/her on his/her success in the examination .</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318055,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318056',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your mother asking about her illness.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318056,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318057',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend and tell him/her about your school teachers.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318057,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318058',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your father telling him about your health.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318058,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318059',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend inviting him/her to spend summer vacation with you.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318059,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318060',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your father asking him to send more money for living expenses. You have spent all your money due to extra hostel expenses.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318060,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318061',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend to request him to lend you his/her camera. You are going to visit a historical place.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318061,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318062',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to thank him for your birthday present. Your uncle has sent you a present on your birthday.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318062,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318063',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend to telling him/her about your new school.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318063,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318064',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your younger brother advising him to study hard.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318064,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318065',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your father/mother telling him/her about your success in examination.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318065,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318066',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a lettet to your friend for the loan of bike.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318066,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318067',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend for borrowing some books.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318067,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318068',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your younger brother giving him a piece of good advice.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318068,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318069',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your father telling him about your mother&#39;s illeness.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318069,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318070',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your brother inviting him to spend winter vacation with you.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318070,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318071',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Letter to your friend to tell him/her about your school.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318071,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
  'q_global_eng_318072',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_61e7b1e4f8b1bc32',
  'English',
  'gch_8b08ad9913937971',
  'UNIT 1: Time to Recall',
  'letters',
  'medium',
  '<p>Write a letter to your friend condoling the death of his/her mother.</p>',
  '[]',
  '',
  5,
  '{"original_question_id":318072,"topic_id":10198,"topic_name":"5 Letters","priority":"Additional","chapter":"UNIT 1: Time to Recall"}'::jsonb,
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
