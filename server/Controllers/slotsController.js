const Doctor = require("../Models/Doctor");
const { appointmentModel } = require("../Models/appointment");
const DoctorLeave = require("../Models/DoctorLeave"); // ✅ Import leave model

function generateSlots(
  workStart,
  workEnd,
  slotLength,
  lunchStart,
  lunchLength
) {
  const toMinutes = (str) => {
    const m = str.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!m) throw new Error(`Invalid time format: ${str}`);
    let [, hh, mm, ampm] = m;
    hh = parseInt(hh);
    mm = parseInt(mm);
    if (ampm) {
      if (ampm.toUpperCase() === "PM" && hh < 12) hh += 12;
      if (ampm.toUpperCase() === "AM" && hh === 12) hh = 0;
    }
    return hh * 60 + mm;
  };

  const toHHMM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const startMin = toMinutes(workStart);
  const endMin = toMinutes(workEnd);
  const lunchMin = toMinutes(lunchStart);
  const breakEnd = lunchMin + lunchLength;

  const slots = [];
  let cursor = startMin;

  while (cursor + slotLength <= endMin) {
    const slotStart = cursor;
    const slotEnd = cursor + slotLength;

    // Skip lunch time
    if (slotStart < breakEnd && slotEnd > lunchMin) {
      cursor += slotLength;
      continue;
    }

    slots.push({
      start: toHHMM(slotStart),
      end: toHHMM(slotEnd),
      booked: false,
    });

    cursor += slotLength;
  }

  return slots;
}

const getSlotsForDoctor = async (req, res) => {
  try {
    const { doctorEmail, date } = req.query;
    if (!doctorEmail || !date) {
      return res
        .status(400)
        .json({ message: "doctorEmail & date are required" });
    }

    const doctor = await Doctor.findOne({ Email: doctorEmail });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    console.log("hiiiiiiiiiii");
    const queryDate = new Date(date);

    /* ---------- 1️⃣  Approved leave still takes priority ---------- */
    const onLeave = await DoctorLeave.findOne({
      doctorEmail,
      status: "Approved",
      fromDate: { $lte: queryDate },
      toDate: { $gte: queryDate },
    });
    if (onLeave) {
      return res.status(200).json({
        date,
        doctorEmail,
        availableSlots: [],
        message: "Doctor is unavailable on this date due to approved leave.",
      });
    }

    /* ---------- 2️⃣  Same‑day “Unavailable” toggle logic ---------- */
    const todayISO = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }); // YYYY‑MM‑DD
    const queryISO = queryDate.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    if (doctor.Availability === false && queryISO === todayISO) {
      // Off only for today; future dates will fall through
      console.log("Doctor is unavailable");
      return res.status(200).json({
        date,
        doctorEmail,
        availableSlots: [],
        message: "Doctor is unavailable today.",
      });
    }
    console.log("Doctor is available");

    /* ---------- 3️⃣  Normal slot generation ---------- */
    const appointments = await appointmentModel.find({
      doctorEmail,
      date: queryDate,
    });
    const bookedTimes = appointments.map((a) => a.time);

    const slots = generateSlots(doctor.From, doctor.To, 15, "13:00", 45).map(
      (slot) => ({ ...slot, booked: bookedTimes.includes(slot.start) })
    );

    return res.status(200).json({
      date,
      doctorEmail,
      availableSlots: slots,
    });
  } catch (err) {
    console.error("Slot generation error:", err);
    res.status(500).json({
      message: "Failed to generate slots",
      error: err.message,
    });
  }
};
module.exports = {
  generateSlots,
  getSlotsForDoctor,
};
