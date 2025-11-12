-- Create table for admin to-do items
CREATE TABLE IF NOT EXISTS public.admin_todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  details text,
  is_done boolean NOT NULL DEFAULT false,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to update updated_at on row changes
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_admin_todos ON public.admin_todos;
CREATE TRIGGER set_timestamp_admin_todos
BEFORE UPDATE ON public.admin_todos
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();
