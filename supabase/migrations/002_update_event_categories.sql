-- Update event categories
-- Remove '結婚記念日' and '命日', add '記念日'

-- First, update existing data
UPDATE events 
SET category = '記念日' 
WHERE category = '結婚記念日';

-- Remove events with '命日' category (or you can update them to 'その他' if preferred)
-- DELETE FROM events WHERE category = '命日';
-- Alternatively, if you want to keep the data but change the category:
UPDATE events 
SET category = 'その他' 
WHERE category = '命日';

-- Drop the existing check constraint
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

-- Add new check constraint with updated categories
ALTER TABLE events 
ADD CONSTRAINT events_category_check 
CHECK (category IN ('誕生日', '記念日', 'その他'));