// controllers/slotsController.js

const Doctor = require("../Models/Doctor");
const { appointmentModel } = require("../Models/appointment");

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

    // Skip lunch slots, but include everything else
    if (slotStart < breakEnd && slotEnd > lunchMin) {
      cursor += slotLength;
      continue;
    }

    slots.push({
      start: toHHMM(slotStart),
      end: toHHMM(slotEnd),
      booked: false, // default
    });

    cursor += slotLength;
  }

  return slots;
}

exports.getSlotsForDoctor = async (req, res) => {
  try {
    const { doctorEmail, date } = req.query;
    if (!doctorEmail || !date) {
      return res
        .status(400)
        .json({ message: "doctorEmail & date are required" });
    }

    const doc = await Doctor.findOne({ Email: doctorEmail });
    if (!doc) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await appointmentModel.find({ doctorEmail, date });

    // ✅ Extract directly from saved appointment time field
    const bookedTimes = appointments.map((app) => app.time);

    const slots = generateSlots(doc.From, doc.To, 15, "13:00", 45);

    const updatedSlots = slots.map((slot) => ({
      ...slot,
      booked: bookedTimes.includes(slot.start),
    }));

    return res.json({
      date,
      doctorEmail,
      availableSlots: updatedSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to generate slots",
      error: err.message,
    });
  }
};
