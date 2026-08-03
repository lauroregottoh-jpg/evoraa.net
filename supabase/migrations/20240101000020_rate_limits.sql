-- Rate limiting buckets (service_role only). Soft-launch abuse protection.

CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  bucket_key text PRIMARY KEY,
  hit_count integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated → client cannot read/write.

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
)
RETURNS TABLE(allowed boolean, remaining integer, retry_after_seconds integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_count integer;
  v_start timestamptz;
  v_retry integer;
BEGIN
  IF p_key IS NULL OR length(trim(p_key)) < 3 THEN
    RETURN QUERY SELECT false, 0, p_window_seconds;
    RETURN;
  END IF;

  INSERT INTO public.rate_limit_buckets AS b (bucket_key, hit_count, window_start, updated_at)
  VALUES (p_key, 1, v_now, v_now)
  ON CONFLICT (bucket_key) DO UPDATE
  SET
    hit_count = CASE
      WHEN b.window_start + make_interval(secs => p_window_seconds) <= v_now THEN 1
      ELSE b.hit_count + 1
    END,
    window_start = CASE
      WHEN b.window_start + make_interval(secs => p_window_seconds) <= v_now THEN v_now
      ELSE b.window_start
    END,
    updated_at = v_now
  RETURNING b.hit_count, b.window_start INTO v_count, v_start;

  IF v_count > p_max THEN
    v_retry := GREATEST(
      1,
      CEIL(EXTRACT(EPOCH FROM (v_start + make_interval(secs => p_window_seconds) - v_now)))::integer
    );
    RETURN QUERY SELECT false, 0, v_retry;
  ELSE
    RETURN QUERY SELECT true, GREATEST(0, p_max - v_count), 0;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;

REVOKE ALL ON TABLE public.rate_limit_buckets FROM PUBLIC;
REVOKE ALL ON TABLE public.rate_limit_buckets FROM anon;
REVOKE ALL ON TABLE public.rate_limit_buckets FROM authenticated;
