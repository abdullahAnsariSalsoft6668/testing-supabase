-- Atomic same-doctor reschedule: keep appointment id, move to a new open slot.
-- Run in Supabase SQL Editor after 030_join_patient_hospital.sql (safe to re-run).

CREATE OR REPLACE FUNCTION public.reschedule_appointment(
  p_appointment_id UUID,
  p_slot_id UUID,
  p_patient_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  caller_patient_id UUID;
  patient_id UUID;
  apt public.appointments;
  old_slot_id UUID;
  new_slot public.doctor_slots;
  time_changed BOOLEAN;
BEGIN
  IF p_appointment_id IS NULL OR p_slot_id IS NULL THEN
    RAISE EXCEPTION 'appointment and new time are required';
  END IF;

  IF uid IS NOT NULL THEN
    SELECT p.id INTO caller_patient_id
    FROM public.patients p
    WHERE p.user_id = uid
    LIMIT 1;
    IF caller_patient_id IS NULL THEN
      RAISE EXCEPTION 'Only the patient can reschedule this visit';
    END IF;
    patient_id := caller_patient_id;
  ELSE
    patient_id := p_patient_id;
  END IF;

  IF patient_id IS NULL THEN
    RAISE EXCEPTION 'Patient is missing';
  END IF;

  SELECT * INTO apt
  FROM public.appointments
  WHERE id = p_appointment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Visit not found';
  END IF;

  IF apt.patient_id IS DISTINCT FROM patient_id THEN
    RAISE EXCEPTION 'This visit does not belong to the patient on this call';
  END IF;

  IF apt.status::text NOT IN ('PENDING', 'CONFIRMED') THEN
    RAISE EXCEPTION 'This visit cannot be moved because it is %', apt.status::text;
  END IF;

  old_slot_id := apt.slot_id;

  SELECT * INTO new_slot
  FROM public.doctor_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'That time is not on the schedule';
  END IF;

  IF new_slot.doctor_id IS DISTINCT FROM apt.doctor_id THEN
    RAISE EXCEPTION 'This visit can only be moved with the same doctor. Use CareHub to book a different doctor.';
  END IF;

  IF new_slot.appointment_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'That time is in the past. Please pick a later day.';
  END IF;

  IF old_slot_id IS NOT DISTINCT FROM p_slot_id THEN
    RETURN jsonb_build_object(
      'ok', true,
      'unchanged', true,
      'appointment_id', apt.id,
      'doctor_id', apt.doctor_id,
      'appointment_date', apt.appointment_date,
      'appointment_time', apt.appointment_time
    );
  END IF;

  IF new_slot.status::text IS DISTINCT FROM 'AVAILABLE' THEN
    RAISE EXCEPTION 'That time is no longer open. Please pick another time.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.slot_id = p_slot_id
      AND a.id IS DISTINCT FROM apt.id
      AND a.status::text IN ('PENDING', 'CONFIRMED', 'COMPLETED')
  ) THEN
    RAISE EXCEPTION 'That time is already booked. Please pick another time.';
  END IF;

  time_changed :=
    apt.appointment_date IS DISTINCT FROM new_slot.appointment_date
    OR apt.appointment_time IS DISTINCT FROM new_slot.start_time;

  UPDATE public.doctor_slots
  SET status = 'BOOKED'
  WHERE id = new_slot.id
    AND status = 'AVAILABLE';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'That time is no longer open. Please pick another time.';
  END IF;

  UPDATE public.appointments
  SET
    slot_id = new_slot.id,
    appointment_date = new_slot.appointment_date,
    appointment_time = new_slot.start_time,
    reminder_called_at = CASE WHEN time_changed THEN NULL ELSE reminder_called_at END,
    reminder_call_id = CASE WHEN time_changed THEN NULL ELSE reminder_call_id END
  WHERE id = apt.id;

  IF old_slot_id IS NOT NULL THEN
    UPDATE public.doctor_slots
    SET status = 'AVAILABLE'
    WHERE id = old_slot_id
      AND status = 'BOOKED';
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'unchanged', false,
    'appointment_id', apt.id,
    'doctor_id', apt.doctor_id,
    'appointment_date', new_slot.appointment_date,
    'appointment_time', new_slot.start_time
  );
END;
$$;

ALTER FUNCTION public.reschedule_appointment(UUID, UUID, UUID) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.reschedule_appointment(UUID, UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reschedule_appointment(UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reschedule_appointment(UUID, UUID, UUID) TO service_role;

NOTIFY pgrst, 'reload schema';
