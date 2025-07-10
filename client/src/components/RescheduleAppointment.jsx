import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SlotSelector from "../components/SlotSelector";

export default function RescheduleAppointment() {
  const { token } = useParams();
  const navigate = useNavigate();
  //   const token = "d11d958f-554d-476a-a1f4-01f8f29e90ff";
  console.log("RescheduleAppointment token:", token);
  const [appt, setAppt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [when, setWhen] = useState({ date: "", time: "" });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reschedule/${token}`)
      .then(({ data }) => {
        setAppt(data.appointment);
        setSlots(data.slots);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Link expired");
        navigate("/");
      });
  }, [token, navigate]);

  async function onDateChange(e) {
    const date = e.target.value;
    setWhen((p) => ({ ...p, date, time: "" }));
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/reschedule/${token}?date=${date}`
      );
      setSlots(data.slots);
      setMsg(data.message || "");
    } catch {
      setSlots([]);
      setMsg("Failed to load slots");
    }
  }
  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/reschedule/${token}`, when);
      toast.success("Appointment rescheduled!");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(err.response.data.message);
        setSlots(err.response.data.availableSlots || []);
        setWhen((p) => ({ ...p, time: "" }));
        return;
      }
      toast.error(err.response?.data?.message || "Error");
    }
  }

  if (!appt) return null; // or spinner

  return (
    <div className="container mt-4">
      <h3>Reschedule your appointment with {appt.doctor}</h3>

      <form onSubmit={submit}>
        <label className="form-label fw-bold mt-3">Choose Date</label>
        <input
          type="date"
          className="form-control w-50"
          min={new Date().toISOString().slice(0, 10)}
          value={when.date}
          onChange={onDateChange}
          required
        />

        {when.date && (
          <>
            <SlotSelector
              doctorEmail={appt.doctorEmail}
              selectedDate={when.date}
              selectedSlot={when.time}
              onSlotSelect={(t) => setWhen((p) => ({ ...p, time: t }))}
              onMessage={setMsg}
            />
            {msg && <p className="text-danger fw-bold mt-2">{msg}</p>}
          </>
        )}

        <button className="btn btn-primary mt-4" disabled={!when.time}>
          Confirm
        </button>
      </form>
    </div>
  );
}
