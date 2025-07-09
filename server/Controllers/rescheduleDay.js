/**
 * Reschedule every “pending / started / in‑progress” appointment
 * that falls on the given date for a particular doctor.
 *
 * ‑ Adds a 24‑h one‑time token to each appointment.
 * ‑ Sends an e‑mail to every patient with a “Reschedule” link.
 * ‑ Returns the number of notifications sent.
 */

const { v4: uuid } = require("uuid");
const { appointmentModel } = require("../Models/appointment");
const sendEmail = require("../Controllers/email"); // same wrapper you already use
const Doctor = require("../Models/Doctor");
const { generateSlots } = require("../Controllers/slotsController");

async function rescheduleDay({ doctor, dateISO, cutoff }) {
  console.log("Inside reshedule method");
  // build a 24‑hour window for that calendar day (IST not required here)
  cutoff = cutoff || new Date();
  const cutoffHHMM = cutoff.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }); // e.g. "11:00"

  // ── 2. build start/end of that calendar day ───────────────────────
  const start = new Date(dateISO);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  // ── 3. fetch only slots today AND starting after the cutoff ───────
  const appts = await appointmentModel.find({
    doctorEmail: doctor.Email,
    date: { $gte: start, $lt: end },
    status: { $nin: ["Completed"] }, // ignore finished visits
    time: { $gte: cutoffHHMM }, // slot on/after 11:00
  });

  if (!appts.length) return 0;

  // ── 4. generate token + send e‑mail per appointment ───────────────
  await Promise.all(
    appts.map(async (a) => {
      a.rescheduleToken = uuid();
      a.rescheduleExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await a.save();

      const link = `http://localhost:3000/reschedule/${a.rescheduleToken}`;

      await sendEmail(
        a.email,
        "Doctor unavailable – please reschedule",

        `
  <div style="
    font-family: Arial, sans-serif;
    background: url('https://cdn.pixabay.com/photo/2016/03/31/20/11/doctor-1295581_1280.png') no-repeat center;
    background-size: cover;
    padding: 40px;
    color: #ffffff;
    text-shadow: 1px 1px 2px #000;
    border-radius: 12px;
  ">
    <div style="background-color: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 10px;">
      <h2 style="color: #4fd1c5;"> <p>Dear ${a.fullName || "patient"},</p></h2>

      <p style="font-size: 16px;">
        Thank you for scheduling your appointment with us! But Doctor is Unavailable due to some Emergency Problem
      </p>
      <ul style="line-height: 1.8; font-size: 16px;">
          <p>Dr ${doctor.Name} became unavailable today.</p>
        <p>Your slot at <strong>${a.time}</strong> needs to be re‑scheduled.</p>
        <p><a href="${link}">Click here to pick a new time</a> (link valid 24 h)</p>
        <p>— RaagviCare Team</p>
      </ul>

      <p>
        Please arrive 10-15 minutes early and carry any necessary documents. If you need assistance, our team is just a call away.
      </p>

      <p style="font-style: italic;">We're here to care for you every step of the way.</p>

      <br />
      <p>Warm regards,<br/><strong>RaagviCare Team</strong></p>
    </div>
  </div>
  `
      );
    })
  );

  return appts.length;
}

const getRescheduleInfo = async (req, res) => {
  try {
    const { token } = req.params;
    const { date: dParam } = req.query; // optional ?date=...
    const appt = await appointmentModel.findOne({
      rescheduleToken: token,
      rescheduleExpires: { $gt: new Date() },
    });
    if (!appt) return res.status(404).json({ message: "Link invalid/expired" });

    const doctor = await Doctor.findOne({ Email: appt.doctorEmail });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const day = dParam || new Date().toISOString().slice(0, 10); // "YYYY‑MM‑DD"
    const dayDate = new Date(day);

    const booked = await appointmentModel
      .find({
        doctorEmail: appt.doctorEmail,
        date: dayDate,
        _id: { $ne: appt._id },
      })
      .distinct("time");

    const slots = generateSlots(doctor.From, doctor.To, 15, "13:00", 45).map(
      (s) => ({ ...s, booked: booked.includes(s.start) })
    );

    res.json({ appointment: appt, slots, message: "" });
  } catch (err) {
    console.error("getRescheduleInfo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const postReschedule = async (req, res) => {
  try {
    const { token } = req.params;
    const { date, time } = req.body;

    const appt = await appointmentModel.findOne({
      rescheduleToken: token,
      rescheduleExpires: { $gt: new Date() },
    });
    if (!appt) return res.status(404).json({ message: "Link invalid/expired" });

    /* clash check */
    const clash = await appointmentModel.findOne({
      doctorEmail: appt.doctorEmail,
      date: new Date(date),
      time,
    });
    if (clash) {
      /* refresh slot grid */
      const doctor = await Doctor.findOne({ Email: appt.doctorEmail });
      const booked = await appointmentModel
        .find({
          doctorEmail: appt.doctorEmail,
          date: new Date(date),
        })
        .distinct("time");

      const slots = generateSlots(doctor.From, doctor.To, 15, "13:00", 45).map(
        (s) => ({ ...s, booked: booked.includes(s.start) })
      );

      return res.status(409).json({
        message: "That slot was just booked, please choose another.",
        availableSlots: slots,
      });
    }

    /* save & confirm */
    appt.date = new Date(date);
    appt.time = time;
    appt.status = "Pending";
    appt.rescheduleToken = undefined;
    appt.rescheduleExpires = undefined;
    await appt.save();
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      
      <!-- Header Image -->
      <img 
        src="https://cdn.pixabay.com/photo/2016/03/31/20/11/doctor-1295581_1280.png" 
        alt="Doctor" 
        style="width: 100%; max-height: 300px; object-fit: cover;"
      />

      <!-- Body Content -->
      <div style="padding: 30px;">
        <h2 style="color: #4fd1c5;">Hello Sir/Mam,</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for Re-scheduling your appointment with us! Below are your appointment details:
        </p>

        <ul style="line-height: 1.8; font-size: 16px; color: #333; padding-left: 0; list-style: none;">
          <li><strong>Doctor:</strong>  ${appt.doctor}</li>
          <li><strong>Date:</strong> ${new Date(date).toDateString()}</li>
          <li><strong>Slot Time:</strong> ${time}</li>
          <li><strong>Status:</strong> <span style="color: #ffc107;">Pending</span></li>
        </ul>

        <p style="color: #333;">
          Please arrive 10-15 minutes early and carry any necessary documents. If you need assistance, our team is just a call away.
        </p>

        <p style="font-style: italic; color: #555;">We're here to care for you every step of the way.</p>

        <br />
        <p style="color: #333;">Warm regards,<br/><strong>RaagviCare Team</strong></p>
      </div>
    </div>
  </div>
`;

    await sendEmail(appt.email, "Appointment re‑booked", html);

    res.json({ message: "Rescheduled" });
  } catch (err) {
    console.error("postReschedule:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRescheduleInfo,
  rescheduleDay,
  postReschedule,
};
