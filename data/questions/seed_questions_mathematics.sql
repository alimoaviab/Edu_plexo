
-- Seed Mathematics Questions for PTB Class 1
-- Generated on 2026-06-13T20:38:04.326Z

BEGIN;

-- Delete old seeds if any
DELETE FROM questions WHERE school_id = '__global__' AND id LIKE 'q_global_math_%';

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250904',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>5 دہائیاں اور 0 اکائیاں ............</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250904,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250905',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>6دہائیاں اور 5 اکائیاں ............</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250905,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250906',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>9 دہائیاں اور 8 اکائیاں ............</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250906,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250907',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>7 دہائیاں اور 0 اکائیاں ............</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250907,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250908',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>9 دہائیاں اور 9 اکائیاں ............</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250908,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250909',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>8 دہائیاں اور 1 اکائی ............</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250909,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250910',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>خانوں میں چھوٹا ہے یا بڑا ہے لکھیں: 5............ 6 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250910,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250911',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>خانوں میں چھوٹا ہے یا بڑا ہے لکھیں: 12 ............ 18 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250911,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250912',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>خانوں میں چھوٹا ہے یا بڑا ہے لکھیں: 29 ............ 34 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250912,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250913',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>خانوں میں چھوٹا ہے یا بڑا ہے لکھیں: 80 ............ 70 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250913,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250914',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'fill_in_the_blanks',
  'medium',
  '<p>خانوں میں چھوٹا ہے یا بڑا ہے لکھیں: 92 ............ 88 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250914,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250964',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'fill_in_the_blanks',
  'medium',
  '<p>خانے میں چھوٹا ہے اور بڑا ہے لکھیں: 12 ............ 18 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250964,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250965',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'fill_in_the_blanks',
  'medium',
  '<p>خانے میں چھوٹا ہے اور بڑا ہے لکھیں: 70............60 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250965,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250966',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'fill_in_the_blanks',
  'medium',
  '<p>خانے میں چھوٹا ہے اور بڑا ہے لکھیں: 99 ............ 90 سے</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250966,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250967',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'fill_in_the_blanks',
  'medium',
  '<p>خانے میں چھوٹا ہے اور بڑا ہے لکھیں: 23 ............ 32 سے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250967,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250969',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'fill_in_the_blanks',
  'medium',
  '<p>خانے میں چھوٹا ہے اور بڑا ہے لکھیں: 61 ............ 62 سے۔</p>',
  '[]',
  '',
  1,
  '{"original_question_id":250969,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250750',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'match_columns',
  'medium',
  '<p>اشیا گنیں اور درست عدد کے ساتھ ملائیں:</p>

<p><img src="/Equations/1st/mth-42.png" style="zoom:10%;" /></p>

<p> <img src="/Equations/1st/mth-43.png" style="zoom:10%;" /></p>

<p> <img src="/Equations/1st/mth-44.png" style="zoom:10%;" /></p>

<p> <img src="/Equations/1st/mth-45.png" style="zoom:10%;" /></p>

<p> <img src="/Equations/1st/mth-46.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  1,
  '{"original_question_id":250750,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251227',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'match_columns',
  'medium',
  '<p>ایک جسی رقوں کو ملائیں: </p>

<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td> <img src="/Equations/1st/mth-451.png" style="zoom:25%;" /></td>
			<td> <img src="/Equations/1st/mth-456.png" style="zoom:25%;" /></td>
		</tr>
		<tr>
			<td> <img src="/Equations/1st/mth-452.png" style="zoom:25%;" /></td>
			<td> <img src="/Equations/1st/mth-457.png" style="zoom:25%;" /></td>
		</tr>
		<tr>
			<td> <img src="/Equations/1st/mth-453.png" style="zoom:25%;" /></td>
			<td> <img src="/Equations/1st/mth-458.png" style="zoom:25%;" /></td>
		</tr>
		<tr>
			<td> <img src="/Equations/1st/mth-454.png" style="zoom:25%;" /></td>
			<td> <img src="/Equations/1st/mth-450.png" style="zoom:25%;" /></td>
		</tr>
		<tr>
			<td> <img src="/Equations/1st/mth-455.png" style="zoom:25%;" /></td>
			<td> <img src="/Equations/1st/mth-460.png" style="zoom:25%;" /></td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":251227,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251265',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">جنوری</td>
			<td style="text-align: center;">1st</td>
		</tr>
		<tr>
			<td style="text-align: center;">فروری</td>
			<td style="text-align: center;">2nd</td>
		</tr>
		<tr>
			<td style="text-align: center;">مارچ</td>
			<td style="text-align: center;">3rd</td>
		</tr>
		<tr>
			<td style="text-align: center;">اپریل</td>
			<td style="text-align: center;">4th</td>
		</tr>
		<tr>
			<td style="text-align: center;">مئی</td>
			<td style="text-align: center;">5th</td>
		</tr>
		<tr>
			<td style="text-align: center;">جون</td>
			<td style="text-align: center;">6th</td>
		</tr>
		<tr>
			<td style="text-align: center;">جولائی</td>
			<td style="text-align: center;">7th</td>
		</tr>
		<tr>
			<td style="text-align: center;">اگست</td>
			<td style="text-align: center;">8th</td>
		</tr>
		<tr>
			<td style="text-align: center;">ستمبر</td>
			<td style="text-align: center;">9th</td>
		</tr>
		<tr>
			<td style="text-align: center;">اکتوبر</td>
			<td style="text-align: center;">10th</td>
		</tr>
		<tr>
			<td style="text-align: center;">نومبر</td>
			<td style="text-align: center;">11th</td>
		</tr>
		<tr>
			<td style="text-align: center;">دسمبر</td>
			<td style="text-align: center;">12th</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":251265,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251274',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-505.png" style="zoom:15%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-506.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-507.png" style="zoom:15%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-508.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-509.png" style="zoom:15%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-510.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-511.png" style="zoom:15%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-512.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-513.png" style="zoom:15%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-514.png" style="zoom:20%;" /></td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":251274,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251281',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;">صفر</td>
			<td style="text-align: center;">5th</td>
		</tr>
		<tr>
			<td style="text-align: center;">رمضان</td>
			<td style="text-align: center;">2th</td>
		</tr>
		<tr>
			<td style="text-align: center;">رجب</td>
			<td style="text-align: center;">7th</td>
		</tr>
		<tr>
			<td style="text-align: center;">محرم</td>
			<td style="text-align: center;">1st</td>
		</tr>
		<tr>
			<td style="text-align: center;">جمادی اول</td>
			<td style="text-align: center;">10th</td>
		</tr>
		<tr>
			<td style="text-align: center;">ذی الحج</td>
			<td style="text-align: center;">9th</td>
		</tr>
		<tr>
			<td style="text-align: center;">شوال</td>
			<td style="text-align: center;">6th</td>
		</tr>
		<tr>
			<td style="text-align: center;">جمادی الثانی</td>
			<td style="text-align: center;">4th</td>
		</tr>
		<tr>
			<td style="text-align: center;">ذوالقعد</td>
			<td style="text-align: center;">12th</td>
		</tr>
		<tr>
			<td style="text-align: center;">ربیع الثانی</td>
			<td style="text-align: center;">9th</td>
		</tr>
		<tr>
			<td style="text-align: center;">شعبان</td>
			<td style="text-align: center;">11th</td>
		</tr>
		<tr>
			<td style="text-align: center;">ربیع الاول</td>
			<td style="text-align: center;">8th</td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":251281,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251319',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'match_columns',
  'medium',
  '<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px;">
	<tbody>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-557.png" style="zoom:20%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-558.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-559.png" style="zoom:20%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-560.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-561.png" style="zoom:20%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-562.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-563.png" style="zoom:20%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-564.png" style="zoom:20%;" /></td>
		</tr>
		<tr>
			<td style="text-align: center;"><img src="/Equations/1st/mth-565.png" style="zoom:20%;" /></td>
			<td style="text-align: center;"><img src="/Equations/1st/mth-566.png" style="zoom:20%;" /></td>
		</tr>
	</tbody>
</table>',
  '[]',
  '',
  1,
  '{"original_question_id":251319,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250709',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-1.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250709,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250710',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-2.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250710,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250711',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-3.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250711,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250712',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-4.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250712,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250713',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-5.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250713,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250714',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-6.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250714,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250715',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-7.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250715,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250716',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-8.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250716,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250717',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-9.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250717,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250718',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-10.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250718,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250719',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-11.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250719,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250720',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گنیں اور لکھیں: <img src="/Equations/1st/mth-12.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250720,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250721',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-13.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250721,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250722',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-14.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250722,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250723',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-15.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250723,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250724',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-16.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250724,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250725',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-17.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250725,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250726',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-18.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250726,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250727',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-19.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250727,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250728',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-20.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250728,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250729',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-21.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250729,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250730',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>شے کو گنیں اور ہندسوں اور الفاظ میں لکھیں: <img src="/Equations/1st/mth-22.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250730,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250731',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-23.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250731,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250732',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-24.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250732,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250733',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-25.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250733,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250734',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-26.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250734,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250735',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-27.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250735,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250736',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-28.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250736,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250737',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-29.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250737,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250738',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-30.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250738,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250739',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-31.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250739,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250740',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیاء کو گنیں اور ہندسوں اور اعداد میں لکھیں: <img src="/Equations/1st/mth-32.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250740,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250741',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد خانوں میں لکھیں: <img src="/Equations/1st/mth-33.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250741,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250742',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد خانوں میں لکھیں: <img src="/Equations/1st/mth-34.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250742,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250743',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد خانوں میں لکھیں: <img src="/Equations/1st/mth-35.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250743,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250744',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد خانوں میں لکھیں: <img src="/Equations/1st/mth-36.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250744,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250745',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد خانوں میں لکھیں: <img src="/Equations/1st/mth-37.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250745,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250746',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد خانوں میں لکھیں: <img src="/Equations/1st/mth-38.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250746,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250747',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد پر دائرہ لگائیں: <img src="/Equations/1st/mth-39.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250747,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250748',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد پر دائرہ لگائیں: <img src="/Equations/1st/mth-40.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250748,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250749',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست عدد پر دائرہ لگائیں: <img src="/Equations/1st/mth-41.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250749,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250751',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گھونسلے کے ساتھ خانے میں انڈوں کی تعداد لکھیں: <img src="/Equations/1st/mth-47.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250751,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250752',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گھونسلے کے ساتھ خانے میں انڈوں کی تعداد لکھیں: <img src="/Equations/1st/mth-48.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250752,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250753',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گھونسلے کے ساتھ خانے میں انڈوں کی تعداد لکھیں: <img src="/Equations/1st/mth-49.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250753,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250754',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گھونسلے کے ساتھ خانے میں انڈوں کی تعداد لکھیں: <img src="/Equations/1st/mth-49.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250754,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250755',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گھونسلے کے ساتھ خانے میں انڈوں کی تعداد لکھیں: <img src="/Equations/1st/mth-50.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250755,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250756',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>گھونسلے کے ساتھ خانے میں انڈوں کی تعداد لکھیں:<img src="/Equations/1st/mth-51.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250756,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250757',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا کو گنیں اور درست عدد کو رنگ کریں: <img src="/Equations/1st/mth-52.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250757,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250758',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا کو گنیں اور درست عدد کو رنگ کریں: <img src="/Equations/1st/mth-53.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250758,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250759',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا کو گنیں اور درست عدد کو رنگ کریں: <img src="/Equations/1st/mth-54.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250759,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250760',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>سیدھی گنتی گنیں اور چھوڑے گئے اعداد لکھیں: <img src="/Equations/1st/mth-55.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250760,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250761',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>الٹی گنتی گنیں اور چھوڑے گئے اعداد لکھیں:<img src="/Equations/1st/mth-56.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250761,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250762',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو چھوٹے سے بڑے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-57.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250762,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250763',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو چھوٹے سے بڑے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-58.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250763,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250764',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-59.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250764,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250765',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-60.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250765,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250766',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے پچھلا عدد لکھیں: <img src="/Equations/1st/mth-61.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250766,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250767',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے پچھلا عدد لکھیں: <img src="/Equations/1st/mth-62.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250767,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250768',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے پچھلا عدد لکھیں: <img src="/Equations/1st/mth-63.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250768,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250769',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے پچھلا عدد لکھیں: <img src="/Equations/1st/mth-64.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250769,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250770',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے اگلا عدد لکھیں: <img src="/Equations/1st/mth-65.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250770,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250771',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے اگلا عدد لکھیں:<img src="/Equations/1st/mth-66.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250771,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250772',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے اگلا عدد لکھیں: <img src="/Equations/1st/mth-67.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250772,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250773',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے عدد سے اگلا عدد لکھیں: <img src="/Equations/1st/mth-68.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250773,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250774',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-69.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250774,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250775',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-70.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250775,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250776',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں:<img src="/Equations/1st/mth-71.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250776,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250777',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-72.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250777,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250778',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-74.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250778,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250779',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-75.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250779,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250780',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-76.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250780,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250781',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-77.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250781,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250782',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-78.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250782,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250783',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-79.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250783,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250784',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-80.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250784,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250785',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-81.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250785,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250786',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-82.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250786,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250787',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور عدد لکھیں: <img src="/Equations/1st/mth-83.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250787,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250788',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-84.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250788,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250789',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-85.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250789,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250790',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں:<img src="/Equations/1st/mth-86.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250790,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250791',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-87.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250791,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250792',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-88.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250792,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250793',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-89.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250793,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250794',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-90.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250794,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250795',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-91.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250795,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250796',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-92.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250796,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250797',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-93.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250797,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250798',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-94.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250798,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250799',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-95.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250799,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250800',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-96.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250800,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250801',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-97.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250801,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250802',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-98.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250802,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250803',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-99.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250803,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250804',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-100.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250804,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250805',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-101.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250805,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250806',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-102.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250806,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250807',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-103.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250807,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250808',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-104.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250808,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250809',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-105.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250809,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250810',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-106.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250810,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250811',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-107.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250811,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250812',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-108.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250812,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250813',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-109.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250813,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250814',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں:<img src="/Equations/1st/mth-110.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250814,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250815',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-111.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250815,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250816',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-112.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250816,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250817',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں:<img src="/Equations/1st/mth-113.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250817,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250818',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد مکمل کریں: <img src="/Equations/1st/mth-114.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250818,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250819',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-115.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250819,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250820',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-116.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250820,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250821',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-117.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250821,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250822',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-118.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250822,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250823',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں:<img src="/Equations/1st/mth-119.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250823,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250824',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-120.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250824,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250825',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-121.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250825,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250826',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-122.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250826,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250827',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>Write numbers with the help of ones and tens:&nbsp;<img src="/Equations/1st/mth-123.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250827,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250828',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>خالی خانے پُر کریں: <img src="/Equations/1st/mth-124.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250828,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250829',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-125.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250829,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250830',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-126.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250830,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250831',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-127.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250831,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250832',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-128.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250832,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250833',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-129.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250833,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250834',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-130.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250834,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250835',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-131.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250835,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250836',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-132.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250836,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250837',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>نقطوں کو ملا کر تصویر مکمل کریں اور اس میں رنگ بھریں: <img src="/Equations/1st/mth-133.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250837,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250838',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-134.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250838,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250839',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-135.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250839,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250840',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-136.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250840,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250841',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-137.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250841,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250842',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-138.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250842,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250843',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-139.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250843,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250844',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-140.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250844,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250845',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-141.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250845,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250846',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-142.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250846,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250847',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-143.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250847,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250848',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-144.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250848,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250849',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-145.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250849,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250850',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-146.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250850,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250851',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-147.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250851,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250852',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-148.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250852,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250853',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-149.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250853,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250854',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-150.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250854,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250855',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-151.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250855,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250856',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-152.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250856,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250857',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-153.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250857,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250858',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-154.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250858,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250859',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-155.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250859,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250860',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-156.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250860,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250861',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-157.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250861,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250862',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-158.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250862,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250863',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-159.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250863,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250864',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-160.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250864,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250865',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-161.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250865,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250866',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-162.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250866,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250867',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-163.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250867,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250868',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-164.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250868,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250869',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-165.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250869,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250870',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-166.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250870,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250871',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-167.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250871,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250872',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-168.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250872,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250873',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-169.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250873,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250874',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-170.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250874,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250875',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-171.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250875,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250876',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-172.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250876,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250877',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-173.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250877,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250878',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-174.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250878,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250879',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-175.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250879,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250880',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-176.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250880,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250881',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-177.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250881,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250882',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-178.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250882,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250883',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-179.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250883,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250884',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-180.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250884,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250885',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-181.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250885,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250886',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-182.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250886,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250887',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-183.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250887,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250888',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-184.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250888,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250889',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-185.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250889,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250890',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-186.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250890,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250891',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-187.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250891,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250892',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-188.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250892,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250893',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-189.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250893,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250894',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-190.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250894,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250895',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اکائیوں اور دہائیوں کی مدد سے اعداد لکھیں: <img src="/Equations/1st/mth-191.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250895,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250896',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-192.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250896,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250897',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-193.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250897,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250898',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-194.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250898,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250899',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-195.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250899,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250900',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کےلیے اکائیاں اور دہائیاں لکھیں: <img src="/Equations/1st/mth-196.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250900,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250901',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کےلیے اکائیاں اور دہائیاں لکھیں: <img src="/Equations/1st/mth-197.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250901,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250902',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کےلیے اکائیاں اور دہائیاں لکھیں: <img src="/Equations/1st/mth-198.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250902,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250903',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کےلیے اکائیاں اور دہائیاں لکھیں: <img src="/Equations/1st/mth-199.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250903,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250915',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور بڑے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-200.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250915,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250916',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور بڑے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-201.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250916,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250917',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور بڑے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-202.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250917,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250918',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور بڑے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-203.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250918,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250919',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور بڑے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-204.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250919,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250920',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور بڑے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-205.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250920,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250921',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور چھوٹے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-206.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250921,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250922',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور چھوٹے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-207.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250922,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250923',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور چھوٹے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-208.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250923,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250924',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور چھوٹے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-209.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250924,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250925',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور چھوٹے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-210.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250925,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250926',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>موازنہ کریں اور چھوٹے عدد والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-211.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250926,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250927',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>ان اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-253.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250927,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250928',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>ان اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-254.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250928,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250929',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>ان اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-255.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250929,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250930',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>ان اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-256.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250930,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250931',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-212.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250931,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250932',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-213.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250932,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250933',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-214.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250933,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250934',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-215.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250934,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250935',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-216.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250935,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250936',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-217.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250936,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250937',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-218.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250937,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250938',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-219.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250938,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250939',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں: <img src="/Equations/1st/mth-220.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250939,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250940',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دہائیوں میں گنیں اور لکھیں:<img src="/Equations/1st/mth-221.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250940,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250941',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دئیے گئے خانوں میں چھوڑے گئے اعداد لکھیں۔</p>',
  '[]',
  '',
  2,
  '{"original_question_id":250941,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250942',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست خانےمیں لکھیں۔ <img src="/Equations/1st/mth-223.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250942,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250943',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا گنیں اور درست خانے میں لکھیں۔ <img src="/Equations/1st/mth-224.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250943,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250944',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>ہر مینڈک کےلیے ترتیبی عدد لکھیں۔ <img src="/Equations/1st/mth-225.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250944,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250945',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>دوسری، چھٹی اور آٹھویں پوزیشن والے آلوؤں پر دائرہ لگائیں۔ دائیں سے بائیں</p>',
  '[]',
  '',
  2,
  '{"original_question_id":250945,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250946',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا کو ملائیں جو 1-1 کی مطابق رکھتی ہیں اور خالی خانوں میں کم یا زیادہ لکھیں۔ <img src="/Equations/1st/mth-227.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250946,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250947',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>اشیا کو ملائیں جو 1-1 کی مطابق رکھتی ہیں اور خالی خانوں میں کم یا زیادہ لکھیں۔ <img src="/Equations/1st/mth-228.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250947,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250948',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>خانے کو ٹک لگائیں جس میں زیادہ اشیا ہیں اور خالی جگہ کو پُر کریں۔ <img src="/Equations/1st/mth-229.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250948,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250949',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.1',
  '1.1 Whole Numbers',
  'question_answers',
  'medium',
  '<p>خانے کو ٹک لگائیں جس میں زیادہ اشیا ہیں اور خالی جگہ کو پُر کریں۔ <img src="/Equations/1st/mth-230.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250949,"topic_id":8137,"topic_name":"1.1 Whole Numbers","priority":"Exercise","chapter":"1.1 Whole Numbers"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250950',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درست چھوڑے گئے اعداد لکھیں: <img src="/Equations/1st/mth-235.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250950,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250951',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درست چھوڑے گئے اعداد لکھیں: <img src="/Equations/1st/mth-236.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250951,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250952',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درست چھوڑے گئے اعداد لکھیں: <img src="/Equations/1st/mth-237.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250952,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250953',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دئیے گئے عدد سے پچھلے اور اگلے اعداد لکھیں: <img src="/Equations/1st/mth-231.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250953,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250954',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دئیے گئے عدد سے پچھلے اور اگلے اعداد لکھیں: <img src="/Equations/1st/mth-232.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250954,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250955',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دئیے گئے عدد سے پچھلے اور اگلے اعداد لکھیں: <img src="/Equations/1st/mth-233.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250955,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250956',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دئیے گئے عدد سے پچھلے اور اگلے اعداد لکھیں: <img src="/Equations/1st/mth-234.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250956,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250957',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-238.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250957,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250958',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-239.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250958,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250959',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-240.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250959,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250960',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کے درمیان والا عدد لکھیں: <img src="/Equations/1st/mth-241.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250960,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250961',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>الٹی گنتی گنیں اور درست عدد لکھیں: <img src="/Equations/1st/mth-242.png" style="zoom:18%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250961,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250962',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>الٹی گنتی گنیں اور درست عدد لکھیں:<img src="/Equations/1st/mth-243.png" style="zoom:18%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250962,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250963',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>ہر جانور کے ترتیبی عدد لکھیں (دائیں سے بائیں) <img src="/Equations/1st/mth-244.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250963,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250968',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>خانے میں چھوٹا ہے اور بڑا ہے لکھیں: 40 ............ 41 سے۔</p>',
  '[]',
  '',
  2,
  '{"original_question_id":250968,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250970',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو چھوٹے سے بڑے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-245.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250970,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250971',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو چھوٹے سے بڑے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-246.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250971,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250972',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-247.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250972,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250973',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کو بڑے سے چھوٹے کی ترتیب میں لکھیں: <img src="/Equations/1st/mth-248.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250973,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250974',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>اشیا کو گنیں ، درست اعداد لکھیں اور خالی جگہ کو پُر کریں:<img src="/Equations/1st/mth-249.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250974,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250975',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>اشیا کو گنیں ، درست اعداد لکھیں اور خالی جگہ کو پُر کریں: <img src="/Equations/1st/mth-250.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250975,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250976',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Read the instruction and write the correct number:&nbsp;<img src="/Equations/1st/mth-251.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250976,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250977',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '1.2',
  '1.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Read the instruction and write the correct number:&nbsp;<img src="/Equations/1st/mth-252.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250977,"topic_id":8138,"topic_name":"1.2 Review Exercise","priority":"Review Exercise","chapter":"1.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250978',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>اعداد کا موازنہ کریں اور لکھیں کہ ایک عدد دوسرے عدد سے کتنا زیادہ ہے: <img src="/Equations/1st/mth-257.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250978,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250979',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>اعداد کا موازنہ کریں اور لکھیں کہ ایک عدد دوسرے عدد سے کتنا زیادہ ہے: <img src="/Equations/1st/mth-258.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250979,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250980',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں: <img src="/Equations/1st/mth-259.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250980,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250981',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں: <img src="/Equations/1st/mth-260.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250981,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250982',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں۔ پھر علامت + اور = کو استعمال کریں اور درست جواب لکھیں: <img src="/Equations/1st/mth-261.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250982,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250983',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں۔ پھر علامت + اور = کو استعمال کریں اور درست جواب لکھیں: <img src="/Equations/1st/mth-262.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250983,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250984',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں: <img src="/Equations/1st/mth-263.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250984,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250985',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں: <img src="/Equations/1st/mth-264.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250985,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250986',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں: <img src="/Equations/1st/mth-265.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250986,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250987',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>گنیں اور جمع کریں: <img src="/Equations/1st/mth-266.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250987,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250988',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>تصویر کو دیکھیں اور خالی جگہ کر پُر کریں: <img src="/Equations/1st/mth-267.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250988,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250989',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>خانوں میں تعداد لکھیں: <img src="/Equations/1st/mth-268.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250989,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250990',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>خانوں میں تعداد لکھیں: <img src="/Equations/1st/mth-269.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250990,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250991',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>خانے میں تعداد لکھیں: <img src="/Equations/1st/mth-270.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250991,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250992',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-271.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250992,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250993',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-272.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250993,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250994',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-273.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250994,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_250995',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>جمع کریں اور رنگوں کا استعمال کرتے ہوئے تصویر میں رنگ بھریں۔ <img src="/Equations/1st/mth-274.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":250995,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251050',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-275.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251050,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251051',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-276.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251051,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251052',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-277.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251052,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251053',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-278.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251053,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251054',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-279.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251054,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251055',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-280.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251055,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251056',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-281.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251056,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251057',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-282.png" style="zoom:5%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251057,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251058',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>Zara has 22 red beads and 7 blue beads. How many beads does she have in total now?&nbsp;<img src="/Equations/1st/mth-305.png" style="zoom:7%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251058,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251059',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ایک مرتبان میں 60 بادام تھے۔ علی نے مزید 8 بادام مرتبان میں رکھ دئیے۔ مرتبان میں کل کتنے بادام ہیں؟ <img src="/Equations/1st/mth-306.png" style="zoom:7%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251059,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251060',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-283.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251060,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251061',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-284.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251061,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251062',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-285.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251062,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251063',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-286.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251063,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251064',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-287.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251064,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251065',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-288.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251065,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251066',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-289.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251066,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251067',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-290.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251067,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251068',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>عید پر ارتضی کو 40 روپے اور مصطفی کو 50 روپے ملے۔ دونوں کے پاس کل کتنی عیدی ہوگئی؟ <img src="/Equations/1st/mth-307.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251068,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251069',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ایک ٹوکری میں 65 سبز گیندیں تھیں۔ دکنادار نے اس میں 14 سرخ گیندیں مزید ڈال دیں۔ ٹوکری میں کل کتنی گیندیں تھیں؟ <img src="/Equations/1st/mth-308.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251069,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251070',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>آؤ جمع کریں: <img src="/Equations/1st/mth-291.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251070,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251071',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>آؤ جمع کریں: <img src="/Equations/1st/mth-292.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251071,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251072',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>آؤ جمع کریں: <img src="/Equations/1st/mth-293.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251072,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251073',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>آؤ جمع کریں: <img src="/Equations/1st/mth-294.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251073,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251074',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>آؤ جمع کریں: <img src="/Equations/1st/mth-295.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251074,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251075',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>آؤ جمع کریں: <img src="/Equations/1st/mth-296.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251075,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251076',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-297.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251076,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251077',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-298.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251077,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251078',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-299.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251078,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251079',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-300.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251079,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251080',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-301.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251080,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251081',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-302.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251081,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251082',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-303.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251082,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251083',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد کو لکھیں اور خانے کو پر کریں: <img src="/Equations/1st/mth-304.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251083,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251084',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-309.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251084,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251085',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-310.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251085,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251086',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-311.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251086,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251087',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-312.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251087,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251088',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-313.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251088,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251089',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-314.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251089,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251090',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-315.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251090,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251091',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.1',
  '2.1 Addition',
  'question_answers',
  'medium',
  '<p>ذہنی حکمت عملی کا استعمال کرتے ہوئے درج ذیل کو جمع کریں: <img src="/Equations/1st/mth-316.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251091,"topic_id":8139,"topic_name":"2.1 Addition","priority":"Exercise","chapter":"2.1 Addition"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251092',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کا موازنہ کریں اور لکھیں ایک عدد دوسرے سے کتنا کم ہے؟ <img src="/Equations/1st/mth-317.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251092,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251093',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کا موازنہ کریں اور لکھیں ایک عدد دوسرے سے کتنا کم ہے؟ <img src="/Equations/1st/mth-318.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251093,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251094',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>گنیں اور تفریق کریں پھر علامت - اور = کا استعمال کرتے ہوئے درست جواب لکھیں: <img src="/Equations/1st/mth-319.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251094,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251095',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>گنیں اور تفریق کریں پھر علامت - اور = کا استعمال کرتے ہوئے درست جواب لکھیں: <img src="/Equations/1st/mth-320.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251095,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251096',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>گنیں اور تفریق کریں پھر علامت - اور = کا استعمال کرتے ہوئے درست جواب لکھیں: <img src="/Equations/1st/mth-322.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251096,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251097',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>گنیں اور تفریق کریں پھر علامت - اور = کا استعمال کرتے ہوئے درست جواب لکھیں: <img src="/Equations/1st/mth-323.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251097,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251098',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>تفریق کریں: <img src="/Equations/1st/mth-324.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251098,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251099',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>تفریق کریں: <img src="/Equations/1st/mth-325.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251099,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251100',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>تفریق کریں: <img src="/Equations/1st/mth-326.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251100,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251101',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>تفریق کریں: <img src="/Equations/1st/mth-327.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251101,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251102',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>تصویر کو دیکھیں اور خالی جگہ پُر کریں: <img src="/Equations/1st/mth-575.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251102,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251103',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>خانے میں تعداد لکھیں: <img src="/Equations/1st/mth-328.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251103,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251104',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>خانے میں تعداد لکھیں: <img src="/Equations/1st/mth-329.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251104,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251105',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-330.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251105,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251106',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-331.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251106,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251107',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-332.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251107,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251108',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-333.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251108,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251109',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-334.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251109,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251110',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-335.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251110,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251111',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-336.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251111,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251112',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-337.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251112,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251113',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-338.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251113,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251114',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-339.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251114,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251115',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-340.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251115,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251116',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-341.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251116,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251117',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-342.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251117,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251118',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-343.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251118,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251119',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-344.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251119,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251120',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-345.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251120,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251121',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>ایک ٹرے میں 15 انڈے تھے۔ حریم کی ماں نے کیک بنانے کےلیے 5 انڈے استعمال کرلیے۔ ٹرے میں باقی کتنے انڈے بچے؟ <img src="/Equations/1st/mth-346.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251121,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251122',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>عمر کے پاس 18 اسٹرابریز تھیں۔ اس نے 6 اسٹرابریز کھالیں۔ باقی کتنی اسٹرابریز بچیں؟ <img src="/Equations/1st/mth-347.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251122,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251123',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-348.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251123,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251124',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-349.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251124,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251125',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-350.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251125,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251126',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-351.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251126,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251127',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-352.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251127,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251128',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-353.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251128,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251129',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-354.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251129,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251130',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-355.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251130,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251131',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-356.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251131,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251132',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-357.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251132,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251133',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-358.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251133,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251134',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-359.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251134,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251135',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>حمزہ کے پاس 72 سمندری گھونگے تھے۔ اس نے 32 سمندری گھونگے اپنی بہن حنا کو دے دیے۔ حمزہ کے پاس باقی کتنے سمندری گھونگے بچے؟ <img src="/Equations/1st/mth-360.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251135,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251136',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>ایک کہانی کی کتاب میں 66 صفحات ہیں۔سارہ نے 34 صفحات پڑھ لیے ہیں۔ باقی کتنے صفحات بچے؟ <img src="/Equations/1st/mth-361.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251136,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251137',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>احمد کے پاس 70 روپے تھے۔ اس نے 60 روپے اپنے بھائی فہد کو دے دیے۔ کتنے روپے بچے ہیں؟ <img src="/Equations/1st/mth-362.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251137,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251138',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>آؤ تفریق کریں:<img src="/Equations/1st/mth-363.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251138,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251139',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>آؤ تفریق کریں: <img src="/Equations/1st/mth-364.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251139,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251140',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>آؤ تفریق کریں: <img src="/Equations/1st/mth-365.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251140,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251141',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>آؤ تفریق کریں: <img src="/Equations/1st/mth-366.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251141,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251142',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>آؤ تفریق کریں: <img src="/Equations/1st/mth-367.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251142,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251143',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>آؤ تفریق کریں: <img src="/Equations/1st/mth-368.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251143,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251144',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم کریں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-369.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251144,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251145',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم کریں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-370.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251145,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251146',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-371.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251146,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251147',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-372.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251147,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251148',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-373.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251148,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251149',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-374.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251149,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251150',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-375.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251150,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251151',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-376.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251151,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251152',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-377.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251152,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251153',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-378.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251153,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251154',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-379.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251154,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251155',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-380.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251155,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251156',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-381.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251156,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251157',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں:<img src="/Equations/1st/mth-382.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251157,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251158',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-383.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251158,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251159',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.2',
  '2.2 Subtraction',
  'question_answers',
  'medium',
  '<p>دیے گئے اعداد کو ذہنی حکمت عملی کا استعمال کرتے ہوئے تفریق کریں: <img src="/Equations/1st/mth-384.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251159,"topic_id":8140,"topic_name":"2.2 Subtraction","priority":"Exercise","chapter":"2.2 Subtraction"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251160',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کا موازنہ کریں اور خالی جگہ پُر کریں: <img src="/Equations/1st/mth-385.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251160,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251161',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کا موازنہ کریں اور خالی جگہ پُر کریں: <img src="/Equations/1st/mth-386.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251161,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251162',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کا موازنہ کریں اور خالی جگہ پُر کریں: <img src="/Equations/1st/mth-387.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251162,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251163',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اعداد کا موازنہ کریں اور خالی جگہ پُر کریں: <img src="/Equations/1st/mth-388.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251163,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251164',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں، جمع کریں اور خانے پُر کریں: <img src="/Equations/1st/mth-389.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251164,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251165',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں، جمع کریں اور خانے پُر کریں: <img src="/Equations/1st/mth-390.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251165,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251166',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں، جمع کریں اور خانے پُر کریں: <img src="/Equations/1st/mth-391.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251166,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251167',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں، جمع کریں اور خانے پُر کریں:<img src="/Equations/1st/mth-576.png" style="zoom:35%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251167,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251168',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں اور تفریق کریں: <img src="/Equations/1st/mth-392.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251168,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251169',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں اور تفریق کریں: <img src="/Equations/1st/mth-393.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251169,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251170',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-394.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251170,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251171',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-395.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251171,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251172',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل تصویر کو دیکھیں اور خالی جگہ پُر کریں: <img src="/Equations/1st/mth-396.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251172,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251173',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل تصویر کر دیکھیں اور خالی جگہ پڑ کریں: <img src="/Equations/1st/mth-397.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251173,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251174',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-398.png" style="zoom:13%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251174,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251175',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد لکھیں اور خانے کو پُر کریں: <img src="/Equations/1st/mth-399.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251175,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251176',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد معلوم کریں: <img src="/Equations/1st/mth-400.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251176,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251177',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نامعلوم عدد معلوم کریں: <img src="/Equations/1st/mth-401.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251177,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251178',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد معلوم کریں: <img src="/Equations/1st/mth-402.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251178,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251179',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نا معلوم عدد معلوم  کریں: <img src="/Equations/1st/mth-403.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251179,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251180',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-404.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251180,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251181',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-405.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251181,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251182',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-406.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251182,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251183',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-407.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251183,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251184',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-408.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251184,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251185',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-409.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251185,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251186',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-410.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251186,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251187',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-411.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251187,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251188',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-412.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251188,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251189',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-413.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251189,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251190',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-414.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251190,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251191',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو حل کریں: <img src="/Equations/1st/mth-415.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251191,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251193',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>چڑیا گھر میں ارم نے 15 طوطے اور 3 کبوتر دیکھے اس نے کل کتنے پرندے دیکھے؟ <img src="/Equations/1st/mth-416.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251193,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251194',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>سارہ کے پاس دو کتابیں ہیں۔ اک کتاب کے 56 صفحات اور دوسری کتاب کے 42 صفحت ہیں۔ اگر سارہ دونوں کتابیں پڑھتی ہے تو اس نے کتنے صفحات پڑھے ہوں گے؟ <img src="/Equations/1st/mth-417.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251194,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251195',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '2.3',
  '2.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>زارا کی کلاس میں 45 طلباء ہیں۔ اگر اس میں سے 23 لڑکے ہوں تو لڑکیاں کتنی ہیں؟ <img src="/Equations/1st/mth-418.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251195,"topic_id":8141,"topic_name":"2.3 Review Exercise","priority":"Review Exercise","chapter":"2.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251196',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>سب سے چھوٹی چیز پر ٹک اور اور سب سے لمبی چیز پر کراس لگائیں۔ <img src="/Equations/1st/mth-419.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251196,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251197',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>سب سے لمبی چیز پر دائرہ لگائیں اور سب سے چھوٹی چیز پر کراس لگائیں: <img src="/Equations/1st/mth-420.png" style="zoom:13%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251197,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251198',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>سب سے چھوٹی چیز میں نیلا رنگ اور سب سے لمبی چیز میں سرخ رنگ بھریں۔ <img src="/Equations/1st/mth-421.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251198,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251199',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>سب سے چھوٹے میز کو ٹک کریں: <img src="/Equations/1st/mth-422.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251199,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251200',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>سب سے لمبے ذرافے میں رنگ بھریں: <img src="/Equations/1st/mth-423.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251200,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251201',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>اونچے کےلیے 1 زیادہ اونچے کےلیے 2 اور سب سے زیادہ اونچے کےلیے 3 لکھیں۔ <img src="/Equations/1st/mth-424.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251201,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251202',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>اونچے کےلیے 1 زیادہ اونچے کےلیے 2 اور سب سے زیادہ اونچے کےلیے 3 لکھیں۔ <img src="/Equations/1st/mth-425.png" style="zoom:13%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251202,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251203',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.1',
  '3.1 Length',
  'question_answers',
  'medium',
  '<p>سب سے اونچی عمارت میں رنگ بھریں: <img src="/Equations/1st/mth-426.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251203,"topic_id":8142,"topic_name":"3.1 Length","priority":"Exercise","chapter":"3.1 Length"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251204',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.2',
  '3.2 Mass',
  'question_answers',
  'medium',
  '<p>سب سے بھاری چیز پر ٹک اور بھاری چیز پ کراس لگائیں: <img src="/Equations/1st/mth-427.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251204,"topic_id":8143,"topic_name":"3.2 Mass","priority":"Exercise","chapter":"3.2 Mass"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251205',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.2',
  '3.2 Mass',
  'question_answers',
  'medium',
  '<p>سب سے ہلکی چیز پر ٹک لگائیں: <img src="/Equations/1st/mth-428.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251205,"topic_id":8143,"topic_name":"3.2 Mass","priority":"Exercise","chapter":"3.2 Mass"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251206',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.2',
  '3.2 Mass',
  'question_answers',
  'medium',
  '<p>کتاب سے ہلکی چیز بنائیں اور اس میں رنگ بھریں: <img src="/Equations/1st/mth-429.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251206,"topic_id":8143,"topic_name":"3.2 Mass","priority":"Exercise","chapter":"3.2 Mass"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251207',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>سب سے لمبی چیز پر ٹک  لگائیں: <img src="/Equations/1st/mth-430.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251207,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251208',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>بلے سے چھوٹی چیز بنائیں اور اس میں رنگ بھریں: <img src="/Equations/1st/mth-431.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251208,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251209',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>سب سے چھوٹے گملے میں رنگ بھریں: <img src="/Equations/1st/mth-432.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251209,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251210',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>دیے گئے خانوں میں درخت بنائیں اور ان میں رنگ کریں: <img src="/Equations/1st/mth-433.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251210,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251211',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>اونچے کےلیے 1 زیادہ اونچے کےلیے 2 اور سب سے اونچے کےلیے 3 لکھیں: <img src="/Equations/1st/mth-434.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251211,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251212',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل اشیا کا موازنہ کریں اور ہلکی کےلیے 1 کم ہلکی کےلیے 2 اور سب سے ہلکی کے لیے 3 لکھیں:<img src="/Equations/1st/mth-435.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251212,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251213',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>بھاری چیز کو ٹک کریں: <img src="/Equations/1st/mth-436.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251213,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251214',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '3.3',
  '3.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>سب سے ہلکی چیز میں نیلا اور سب سے بھاری چیز میں پیلا رنگ بھریں: <img src="/Equations/1st/mth-437.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251214,"topic_id":8144,"topic_name":"3.3 Review Exercise","priority":"Review Exercise","chapter":"3.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251215',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>سکے کی قدر لکھیں: <img src="/Equations/1st/mth-438.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251215,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251216',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>سکے کی قدر لکھیں: <img src="/Equations/1st/mth-439.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251216,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251217',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>سکے کی قدر لکھیں: <img src="/Equations/1st/mth-440.png" style="zoom:13%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251217,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251218',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>سکے کی قدر لکھیں: <img src="/Equations/1st/mth-441.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251218,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251219',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>نوٹ کی قدر لکھیں: <img src="/Equations/1st/mth-442.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251219,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251220',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>نوٹ کی قدر لکھیں: <img src="/Equations/1st/mth-449.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251220,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251221',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>نوٹ کی قدر لکھیں: <img src="/Equations/1st/mth-443.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251221,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251222',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>نوٹ کی قدر لکھیں: <img src="/Equations/1st/mth-444.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251222,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251223',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>درج ذیل کو مکمل کریں: <img src="/Equations/1st/mth-445.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251223,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251224',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>درج ذیل کو مکمل کریں: <img src="/Equations/1st/mth-446.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251224,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251225',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>درج ذیل کو مکمل کریں:<img src="/Equations/1st/mth-447.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251225,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251226',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>درج ذیل کو مکمل کریں: <img src="/Equations/1st/mth-448.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251226,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251228',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>اگر آپ دی گئی رقم کے ساتھ چیزیں خرید سکتے ہیں تو خانے پر ٹک لگائیں: <img src="/Equations/1st/mth-461.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251228,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251229',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>اگر آپ دی گئی رقم کے ساتھ چیزیں خرید سکتے ہیں تو خانے پر ٹک لگائیں: <img src="/Equations/1st/mth-462.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251229,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251230',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>اگر آپ دی گئی رقم کے ساتھ چیزیں خرید سکتے ہیں تو خانے پر ٹک لگائیں: <img src="/Equations/1st/mth-463.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251230,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251231',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>اگر آپ دی گئی رقم کے ساتھ چیزیں خرید سکتے ہیں تو خانے پر ٹک لگائیں: <img src="/Equations/1st/mth-464.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251231,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251232',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>اگر آپ دی گئی رقم کے ساتھ چیزیں خرید سکتے ہیں تو خانے پر ٹک لگائیں: <img src="/Equations/1st/mth-465.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251232,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251233',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>Look at the following items and their prices and then solve:&nbsp;<img src="/Equations/1st/mth-ex1.1-1.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251233,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251234',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>آبیحہ نے ایک گیند اور ایک ٹافی خریدی۔ اس نے کتنی رقم خرچ کریں۔ <img src="/Equations/1st/mth-466.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251234,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251235',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>حمزہ ایک واٹر پینٹ خریدنا چاہتا ہے۔ اس کے پاس 42 روپے ہیں۔ اسے مزید کتنی رقم کی ضرورت ہے؟ <img src="/Equations/1st/mth-467.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251235,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251236',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>مریم نے ایک واٹر پینٹ اور ایک گیند خریدا۔ اس نے کتنی رقم خرچ کی؟ <img src="/Equations/1st/mth-468.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251236,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251237',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.1',
  '4.1 Money',
  'question_answers',
  'medium',
  '<p>علی کے پاس 95 روپے تھے۔ اس نے ایک کتاب خریدی۔ علی کے پاس باقی کتنی رقم رہ گئی تھی؟<img src="/Equations/1st/mth-469.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251237,"topic_id":8145,"topic_name":"4.1 Money","priority":"Exercise","chapter":"4.1 Money"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251238',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو مکمل کریں:</p>',
  '[]',
  '',
  2,
  '{"original_question_id":251238,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251239',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل کو مکمل کریں: <img src="/Equations/1st/mth-471.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251239,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251240',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>صحیح رقم کے گروپ پر ٹک کا نشان لگائیں:</p>',
  '[]',
  '',
  2,
  '{"original_question_id":251240,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251241',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>صحیح رقم کے گروپ پر ٹک کا نشان لگائیں: <img src="/Equations/1st/mth-472.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251241,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251242',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں اور صحیح رقم لکھیں: <img src="/Equations/1st/mth-474.png" style="zoom:60%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251242,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251243',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں اور صحیح رقم لکھیں: <img src="/Equations/1st/mth-475.png" style="zoom:60%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251243,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251244',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں اور صحیح رقم لکھیں: <img src="/Equations/1st/mth-476.png" style="zoom:60%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251244,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251245',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گنیں اور صحیح رقم لکھیں: <img src="/Equations/1st/mth-477.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251245,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251246',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دی گئی چیزوں اور ان کی قیمت کو دیکھیں اور پھر حل کریں: حارث نے کھلونوں کی دکان سے ایک ٹرین اور ایک بطخ خریدی۔ اس نے کتنی رقم خرچ کی۔<img src="/Equations/1st/mth-478.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251246,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251247',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '4.2',
  '4.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>دی گئی چیزوں اور ان کی قیمت کو دیکھیں اور پھر حل کریں: عائشہ ایک ٹیڈی بیئر خریدنا چاہتی ہے۔ اسکے پاس 50 روپے ہیں۔ اسے مزید کتنی رقم کی ضرورت ہے؟ <img src="/Equations/1st/mth-479.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251247,"topic_id":8146,"topic_name":"4.2 Review Exercise","priority":"Review Exercise","chapter":"4.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251248',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>گھڑی دیکھیں اور وقت لکھیں: <img src="/Equations/1st/mth-480.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251248,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251249',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>گھڑی دیکھیں اور وقت لکھیں: <img src="/Equations/1st/mth-481.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251249,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251250',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>گھڑی دیکھیں اور وقت لکھیں: <img src="/Equations/1st/mth-482.png" style="zoom:8%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251250,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251251',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>گھڑی کو دیکھیں اور وقت لکھیں: <img src="/Equations/1st/mth-483.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251251,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251252',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست وقت ظاہر کرنے کےلیے سوائیاں بنائیں: <img src="/Equations/1st/mth-484.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251252,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251253',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست وقت ظاہر کرنے کےلیے سوائیاں بنائیں: <img src="/Equations/1st/mth-485.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251253,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251254',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست وقت ظاہر کرنے کےلیے سوائیاں بنائیں: <img src="/Equations/1st/mth-486.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251254,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251255',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>بائیں طرف اینا لوگ کلاک پر جو وقت ہے اس کو ڈیجیٹل کلاک پر دیکھ کر ٹک کریں: <img src="/Equations/1st/mth-487.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251255,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251256',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>بائیں طرف اینا لوگ کلاک پر جو وقت ہے اس کو ڈیجیٹل کلاک پر دیکھ کر ٹک کریں: <img src="/Equations/1st/mth-488.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251256,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251257',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>بائیں طرف اینا لوگ کلاک پر جو وقت ہے اس کو ڈیجیٹل کلاک پر دیکھ کر ٹک کریں: <img src="/Equations/1st/mth-489.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251257,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251258',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>بائیں طرف اینا لوگ کلاک پر جو وقت ہے اس کو ڈیجیٹل کلاک پر دیکھ کر ٹک کریں: <img src="/Equations/1st/mth-490.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251258,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251259',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>بائیں طرف اینا لوگ کلاک پر جو وقت ہے اس کو ڈیجیٹل کلاک پر دیکھ کر ٹک کریں: <img src="/Equations/1st/mth-491.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251259,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251260',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>ہفتے کے ہر دن کےلیے صحیح ترتیبی عدد لکھیں: <img src="/Equations/1st/mth-492.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251260,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251261',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست جواب والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-493.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251261,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251262',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست جواب والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-494.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251262,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251263',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست جواب والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-495.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251263,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251264',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>درست جواب والے خانے میں رنگ بھریں: <img src="/Equations/1st/mth-496.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251264,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251266',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-497.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251266,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251267',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-498.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251267,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251268',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-499.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251268,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251269',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.1',
  '5.1 Time',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-500.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251269,"topic_id":8147,"topic_name":"5.1 Time","priority":"Exercise","chapter":"5.1 Time"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251270',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گھڑی کو دیکھتے ہوئے وقت لکھیں: <img src="/Equations/1st/mth-501.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251270,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251271',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گھڑی کو دیکھتے ہوئے وقت لکھیں: <img src="/Equations/1st/mth-502.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251271,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251272',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گھڑی کو دیکھتے ہوئے وقت لکھیں: <img src="/Equations/1st/mth-503.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251272,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251273',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>گھڑی کو دیکھتے ہوئے وقت لکھیں: <img src="/Equations/1st/mth-504.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251273,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251275',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-515.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251275,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251276',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-516.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251276,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251277',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-517.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251277,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251278',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-518.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251278,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251279',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-519.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251279,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251280',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '5.2',
  '5.2 Review Exercise',
  'question_answers',
  'medium',
  '<p>Colour the box with correct answer:&nbsp;<img src="/Equations/1st/mth-520.png" style="zoom:13%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251280,"topic_id":8148,"topic_name":"5.2 Review Exercise","priority":"Review Exercise","chapter":"5.2 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251282',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نقطوں کو ملا کر تصویر مکمل کریں اور تمام مستطیلوں میں رنگ بھریں: <img src="/Equations/1st/mth-521.png" style="zoom:60%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251282,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251283',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>صرف مربعوں کو رنگ کرتے ہوئے کچھوے کو تالاب تک پہنچنے میں مدد کریں۔</p>',
  '[]',
  '',
  2,
  '{"original_question_id":251283,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251284',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>دی گئی تصویر میں تمام دائروں میں رنگ بھریں: <img src="/Equations/1st/mth-522.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251284,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251285',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>تصویر میں رنگ بھریں اور بتائیں کتنے بیضوی شکل کے ہیں؟ <img src="/Equations/1st/mth-523.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251285,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251286',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>تصویرمیں مثلیثں ڈھونڈیں اور ان میں سبز رنگ بھریں۔ <img src="/Equations/1st/mth-524.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251286,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251287',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونوں کو مکمل کرنے کےلیے شکل میں رنگ بھریں: <img src="/Equations/1st/mth-525.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251287,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251288',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونوں کو مکمل کرنے کےلیے شکل میں رنگ بھریں: <img src="/Equations/1st/mth-526.png" style="zoom:18%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251288,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251289',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونوں کو مکمل کرنے کےلیے شکل میں رنگ بھریں: <img src="/Equations/1st/mth-527.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251289,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251290',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونوں کو مکمل کریں: <img src="/Equations/1st/mth-528.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251290,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251291',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونوں کو مکمل کریں: <img src="/Equations/1st/mth-529.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251291,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251292',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونوں کو مکمل کریں: <img src="/Equations/1st/mth-530.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251292,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251293',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے خانے کو ٹک کریں: <img src="/Equations/1st/mth-531.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251293,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251294',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے خانے کو ٹک کریں: <img src="/Equations/1st/mth-532.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251294,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251295',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے خانے کو ٹک کریں: <img src="/Equations/1st/mth-533.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251295,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251296',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>اپنی مرضی سے پیٹرن بنا کر اشیاء میں رنگ بھریں: <img src="/Equations/1st/mth-534.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251296,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251297',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.1',
  '6.1 Shapes',
  'question_answers',
  'medium',
  '<p>اپنی مرضی سے پیٹرن بنا کر اشیاء میں رنگ بھریں: <img src="/Equations/1st/mth-535.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251297,"topic_id":8149,"topic_name":"6.1 Shapes","priority":"Exercise","chapter":"6.1 Shapes"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251298',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>تصویر ٹک کریں جہاں بلی ڈبے کے باہر ہے۔ <img src="/Equations/1st/mth-536.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251298,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251299',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>مرتبان میں رنگ بھریں جہاں بسکٹ مرتبان کے اندر ہے۔ <img src="/Equations/1st/mth-537.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251299,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251300',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>مرغی اور چوزوں پر دائرہ لگائیں جو اپنے گھر سے باہر ہیں: <img src="/Equations/1st/mth-538.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251300,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251301',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>تصویر ٹک کریں جہاں جہاز بادلوں کے اوپر ہے: <img src="/Equations/1st/mth-539.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251301,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251302',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>ان چیزوں میں رنگ بھریں جو کشتی کے نیچے ہیں: <img src="/Equations/1st/mth-540.png" style="zoom:10%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251302,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251303',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>رائٹنگ بورڈ کے اوپر والی چیز میں دائرہ لگائیں۔ <img src="/Equations/1st/mth-541.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251303,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251304',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>تصویر ہر ٹک کریں جہاں پرندہ گھر کے اوپر ہے۔ <img src="/Equations/1st/mth-542.png" style="zoom:40%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251304,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251305',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>لڑکے پر دائرہ لگائیں جو سلائیڈ کے نیچے ہے۔ <img src="/Equations/1st/mth-543.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251305,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251306',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>تصویر ہر ٹک کریں جہاں گھوڑا رکاوٹ پھلانگ رہا ہے۔ <img src="/Equations/1st/mth-544.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251306,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251307',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>تصویر پر ٹک کریں جہاں بچہ فٹ بال سے دور ہے۔<img src="/Equations/1st/mth-545.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251307,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251309',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>بطخ پر دائرہ لگایں کو تالاب سے دور ہے: <img src="/Equations/1st/mth-547.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251309,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251310',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>لڑکی پر دائرہ لگائیں جو لڑکے سے پہلے کھڑی ہے: <img src="/Equations/1st/mth-548.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251310,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251311',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>بس کے بعد کھڑی گاڑی پر دائرہ لگائیں: <img src="/Equations/1st/mth-549.png" style="zoom:25%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251311,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251312',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.2',
  '6.2 Position',
  'question_answers',
  'medium',
  '<p>جانور میں رنگ بھریں جو اونٹ سے پہلے ہے اور جو بعد میں اسے کراس کریں۔ <img src="/Equations/1st/mth-550.png" style="zoom:15%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251312,"topic_id":8150,"topic_name":"6.2 Position","priority":"Exercise","chapter":"6.2 Position"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251313',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>روزمرہ اشیاء کے صحیح نام، اضلاع کی تعداد اور کونوں کی تعداد لکھیں: <img src="/Equations/1st/mth-551.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251313,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251314',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>روزمرہ اشیاء کے صحیح نام، اضلاع کی تعداد اور کونوں کی تعداد لکھیں: <img src="/Equations/1st/mth-552.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251314,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251315',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>روزمرہ اشیاء کے صحیح نام، اضلاع کی تعداد اور کونوں کی تعداد لکھیں: <img src="/Equations/1st/mth-553.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251315,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251316',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>روزمرہ اشیاء کے صحیح نام، اضلاع کی تعداد اور کونوں کی تعداد لکھیں: <img src="/Equations/1st/mth-554.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251316,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251317',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>روزمرہ اشیاء کے صحیح نام، اضلاع کی تعداد اور کونوں کی تعداد لکھیں: <img src="/Equations/1st/mth-555.png" style="zoom:50%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251317,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251318',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>دائروں میں نیلا، مربعوں میں سبز، مستطیلوں میں پیلا، مثلثوں میں سرخ اور بیضوی شکل میں کالا رنگ کریں۔ <img src="/Equations/1st/mth-556.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251318,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251320',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے اشکال بنائیں اور رنگ بھریں: <img src="/Equations/1st/mth-567.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251320,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251321',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے اشکال بنائیں اور رنگ بھریں: <img src="/Equations/1st/mth-568.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251321,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251322',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے اشکال بنائیں اور رنگ بھریں: <img src="/Equations/1st/mth-569.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251322,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251323',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>نمونے کو مکمل کرنے کےلیے اشکال بنائیں اور رنگ بھریں: <img src="/Equations/1st/mth-570.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251323,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251324',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل تصویر کو دیکھیں اور صحیح جواب کو ٹک کریں:</p>',
  '[]',
  '',
  2,
  '{"original_question_id":251324,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251325',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درج ذیل تصویر کو دیکھیں اور صحیح جواب کو ٹک کریں:</p>',
  '[]',
  '',
  2,
  '{"original_question_id":251325,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251326',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>کار کے نیچے والی چیز میں رنگ بھریں: <img src="/Equations/1st/mth-571.png" style="zoom:20%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251326,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251327',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>پول کے اوپر والی چیز کو دائرہ لگائیں۔ <img src="/Equations/1st/mth-572.png" style="zoom:30%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251327,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251328',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>درخت کے نیچے والے جانور میں رنگ بھریں۔ <img src="/Equations/1st/mth-573.png" style="zoom:12%;" /></p>',
  '[]',
  '',
  2,
  '{"original_question_id":251328,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  question_html = EXCLUDED.question_html,
  options = EXCLUDED.options,
  answer = EXCLUDED.answer,
  chapter_id = EXCLUDED.chapter_id,
  chapter_name = EXCLUDED.chapter_name,
  updated_at = NOW();

INSERT INTO questions (
  id, school_id, created_by, created_by_name, class_id, class_name,
  subject_id, subject_name, chapter_id, chapter_name, type,
  difficulty, question_html, options, answer, marks, metadata,
  status, is_global, approval_status, created_at, updated_at
) VALUES (
  'q_global_math_251329',
  '__global__',
  'system',
  'System Seed',
  'gcls_945589bff9408c32',
  'ONE',
  'gsub_math_ptb_global_1',
  'Mathematics',
  '6.3',
  '6.3 Review Exercise',
  'question_answers',
  'medium',
  '<p>کچھ بچے قطار بنا کر ٹکٹیں لے رہے ہیں۔</p>',
  '[]',
  '',
  2,
  '{"original_question_id":251329,"topic_id":8151,"topic_name":"6.3 Review Exercise","priority":"Review Exercise","chapter":"6.3 Review Exercise"}'::jsonb,
  'active',
  true,
  'approved',
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
