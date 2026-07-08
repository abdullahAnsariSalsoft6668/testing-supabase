-- Mark slot BOOKED when a patient books (patients cannot UPDATE doctor_slots directly)
CREATE OR REPLACE FUNCTION public.mark_slot_booked_on_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.slot_id IS NOT NULL THEN
        UPDATE public.doctor_slots
        SET status = 'BOOKED'
        WHERE id = NEW.slot_id
          AND status = 'AVAILABLE';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS appointments_mark_slot_booked ON public.appointments;
CREATE TRIGGER appointments_mark_slot_booked
    AFTER INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.mark_slot_booked_on_appointment();

-- Release slot when appointment is cancelled
CREATE OR REPLACE FUNCTION public.release_slot_on_appointment_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.slot_id IS NOT NULL
       AND NEW.status = 'CANCELLED'
       AND OLD.status IS DISTINCT FROM 'CANCELLED' THEN
        UPDATE public.doctor_slots
        SET status = 'AVAILABLE'
        WHERE id = OLD.slot_id
          AND status = 'BOOKED';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS appointments_release_slot_on_cancel ON public.appointments;
CREATE TRIGGER appointments_release_slot_on_cancel
    AFTER UPDATE OF status ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.release_slot_on_appointment_cancel();
