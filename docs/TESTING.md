# App Testing Guide

> Hospital Management MVP — React Native + Supabase  
> Last updated: July 2026

---

## Test Accounts

| Role    | Email                  | Notes                        |
|---------|------------------------|------------------------------|
| Admin   | admin@mailinator.com   | Full hospital management     |
| Doctor  | user@mailinator.com    | Must be approved by admin    |
| Patient | user1@mailinator.com   | End-user booking flow        |

---

## Recommended Test Order

```
1. Admin  → set up hospitals, departments, approve doctors
2. Doctor → add schedule slots
3. Patient → explore, book, track appointments
4. Doctor → confirm / complete appointments
5. Patient → verify status update
```

---

## 1. Auth Flow

### Login
- [ ] Enter valid credentials → lands on correct role home screen
- [ ] Enter wrong password → error message shown
- [ ] Check **Remember me** → sign out → reopen app → email pre-filled, checkbox checked
- [ ] Uncheck **Remember me** → email cleared immediately
- [ ] Eye icon on password field → toggles visibility

### Register (new patient)
- [ ] Tap Register → fill name, email, password → submit
- [ ] **Complete Profile** screen appears → fill gender, DOB, blood group, address → save
- [ ] Lands on Patient Home

---

## 2. Admin Flow

### Dashboard
- [ ] Stats grid loads (hospitals, departments, doctors counts)
- [ ] Profile info card shows name and role

### Hospitals
- [ ] List loads with icon, address, phone, email rows
- [ ] **+ Add** → fill name, address, phone → save → toast "Created"
- [ ] **Edit** a hospital → change a field → save → list updates
- [ ] **Delete** → confirm dialog appears → confirm → hospital removed

### Departments
- [ ] List loads with hospital badge on each card
- [ ] **+ Add** → pick a hospital → fill department name → save
- [ ] Edit and delete work correctly

### Doctors
- [ ] Default filter: **Pending** tab shows pending registrations
- [ ] Switch to **Approved** / **Rejected** filter pills → list updates
- [ ] Tap a doctor → **Doctor Detail** screen (profile hero, info rows)
- [ ] **Approve** a pending doctor → status changes, toast shown
- [ ] **Reject** a different pending doctor

### Menu
- [ ] Avatar card shows name, email, role
- [ ] **Refresh Session** → toast shown
- [ ] **Sign Out** → returns to Login

---

## 3. Doctor Flow

### Login & Approval
- [ ] Login as doctor → if status PENDING → Pending Approval screen shown
- [ ] After admin approves → login again → lands on Doctor Dashboard

### Dashboard
- [ ] Today's appointment count shown
- [ ] Upcoming appointment list loads (or empty state)

### Schedule (Slots)
- [ ] Calendar loads with available dates
- [ ] Tap a date → **+ Add Slot** → pick start / end time → save
- [ ] Slot appears on calendar for that date
- [ ] Tap existing slot → edit or delete

### Visits (Appointments)
- [ ] Full appointment list loads (patient name, date, time, status badge)
- [ ] Tap appointment → detail screen with patient info
- [ ] **Confirm** a PENDING appointment → status → CONFIRMED
- [ ] **Complete** a CONFIRMED appointment → status → COMPLETED

---

## 4. Patient Flow

### Home Screen
- [ ] Time-based greeting: "Good morning / afternoon / evening, [Name]"
- [ ] Today's date displayed correctly
- [ ] Stats bar: total visits count, upcoming count
- [ ] Quick-action cards: **Find Doctor**, **My Visits**, **My Profile** — all navigate correctly
- [ ] Upcoming appointment shown (or empty state with "Find a Doctor" CTA)
- [ ] Health Tip of the Day card at bottom

### Explore Screen
- [ ] **Hospitals tab** — list loads with icon, address, "Browse departments" footer
- [ ] Search by hospital name → list filters in real time
- [ ] Tap **×** → clears search
- [ ] Tap a hospital → **Hospital Departments** screen
- [ ] Tap a department → **Department Doctors** → DoctorCard list
- [ ] Switch to **Doctors tab** → all approved doctors shown
- [ ] Search by doctor name or specialization → filters correctly
- [ ] Tap a doctor → **Doctor Detail** screen

### Book an Appointment
- [ ] On Doctor Detail → tap **Book Appointment**
- [ ] Calendar shows → tap a date with available slots
- [ ] Pick a time slot → add optional notes → tap **Confirm Booking**
- [ ] Toast "Appointment booked" → navigates back

### My Visits
- [ ] Full appointment list loads with date badge, doctor name, status badge
- [ ] Tap appointment → detail screen (doctor, hospital, date, time, notes)
- [ ] **Cancel** a PENDING appointment → confirm dialog → status → CANCELLED

---

## 5. Edge Cases

| Scenario                              | Expected Result                                      |
|---------------------------------------|------------------------------------------------------|
| No hospitals / departments / doctors  | EmptyState shown with helpful message                |
| No upcoming appointment               | Empty state + "Find a Doctor" CTA button             |
| Search with no matches                | "No results" empty state + hint to switch tabs       |
| Switch tabs mid-loading               | No flicker (shimmer only on first load)              |
| Book a slot already taken             | Error toast shown                                    |
| Patient without complete profile      | Redirected to Complete Profile screen                |
| Doctor not yet approved               | Pending Approval screen (main tabs not shown)        |
| Network slow / offline                | Skeleton shimmer stays until data arrives            |

---

## 6. Full Round-Trip Test

```
1. Admin: Add hospital → Add department → Approve doctor
2. Doctor: Login → Add slots on tomorrow's date
3. Patient: Login → Explore → Find that doctor → Book a slot
4. Doctor: Login → Visits → Confirm the appointment
5. Patient: Login → My Visits → Verify status is CONFIRMED
6. Doctor: Login → Visits → Mark as Complete
7. Patient: Login → My Visits → Verify status is COMPLETED
```

---

## 7. Supabase Migrations (run once in SQL Editor)

| File | Purpose |
|------|---------|
| `supabase/migrations/012_fix_doctor_patient_insert_rls.sql` | Doctor/patient insert RLS |
| `supabase/migrations/013_fix_admin_doctors_select.sql` | Admin doctors select |
| `supabase/migrations/014_sync_doctor_user_role.sql` | Sync doctor user role |
| `supabase/migrations/015_book_appointment_slot_trigger.sql` | Slot booking trigger |
| `supabase/migrations/016_add_patient_profile_columns.sql` | Patient profile columns |
| `supabase/migrations/017_fix_patient_insert_rls.sql` | Patient insert RLS |
| `supabase/migrations/018_fix_patients_rls_recursion.sql` | Fix RLS recursion |
| `supabase/migrations/019_fix_appointments_users_rls.sql` | Appointments + users RLS |
| `supabase/migrations/020_doctor_appointments_rpc.sql` | Doctor appointments RPC |

---

## 8. Notes

- Always test Admin → Doctor → Patient in order so data exists at each step.
- The "Remember me" feature stores only email, never the password.
- Shimmer skeletons show only on the first load of each screen; tab switches refresh silently.
- All delete actions go through a confirmation dialog (no accidental deletes).
