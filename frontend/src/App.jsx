import { useState } from "react"

export default function App() {
  const [form, setForm] = useState({
    Gender: 1,
    Married: 1,
    Dependents: 0,
    Education: 1,
    Self_Employed: 0,
    ApplicantIncome: "",
    CoapplicantIncome: "",
    LoanAmount: "",
    Loan_Amount_Term: 360,
    Credit_History: 1,
    Property_Area_Semiurban: 0,
    Property_Area_Urban: 0,
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert("Error connecting to API. Make sure the backend is running.")
    }
    setLoading(false)
  }

  const riskColor = {
    "Low Risk": "bg-green-100 border-green-500 text-green-800",
    "Medium Risk": "bg-yellow-100 border-yellow-500 text-yellow-800",
    "High Risk": "bg-red-100 border-red-500 text-red-800",
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">🛡️ LoanGuard</h1>
          <p className="text-gray-400 mt-2">AI-powered loan default risk predictor</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-xl space-y-4">

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Gender</label>
              <select name="Gender" onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Married</label>
              <select name="Married" onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Education</label>
              <select name="Education" onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
                <option value={1}>Graduate</option>
                <option value={0}>Not Graduate</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Self Employed</label>
              <select name="Self_Employed" onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Dependents</label>
              <select name="Dependents" onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3+</option>
              </select>
            </div>
            <div>
  <label className="text-sm text-gray-400">Credit Score (300-850)</label>
  <input
    type="number"
    name="credit_score"
    placeholder="e.g. 700"
    min={300}
    max={850}
    onChange={(e) => {
      const score = parseInt(e.target.value)
      setForm({
        ...form,
        Credit_History: score >= 650 ? 1 : 0
      })
    }}
    className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white"
  />
  <p className="text-xs text-gray-500 mt-1">650+ = Good credit · Below 650 = Poor credit</p>
</div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Applicant Income ($)</label>
              <input type="number" name="ApplicantIncome" placeholder="e.g. 5000"
                onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Coapplicant Income ($)</label>
              <input type="number" name="CoapplicantIncome" placeholder="e.g. 1500"
                onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white" />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Loan Amount ($)</label>
              <input type="number" name="LoanAmount" placeholder="e.g. 120"
                onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Loan Term (months)</label>
              <select name="Loan_Amount_Term" onChange={handleChange} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
                <option value={360}>360</option>
                <option value={180}>180</option>
                <option value={120}>120</option>
                <option value={60}>60</option>
              </select>
            </div>
          </div>

          {/* Row 6 */}
          <div>
            <label className="text-sm text-gray-400">Property Area</label>
            <select name="Property_Area" onChange={(e) => {
              const val = e.target.value
              setForm({
                ...form,
                Property_Area_Semiurban: val === "semiurban" ? 1 : 0,
                Property_Area_Urban: val === "urban" ? 1 : 0,
              })
            }} className="w-full mt-1 bg-gray-800 rounded-lg p-2 text-white">
              <option value="rural">Rural</option>
              <option value="semiurban">Semiurban</option>
              <option value="urban">Urban</option>
            </select>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-2 transition">
            {loading ? "Analyzing..." : "Check Loan Risk"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-6 border-2 rounded-2xl p-6 text-center ${riskColor[result.risk]}`}>
            <p className="text-2xl font-bold">{result.approved ? "✅ Approved" : "❌ Rejected"}</p>
            <p className="text-lg mt-1">{result.risk}</p>
            <p className="text-sm mt-1">Approval Probability: {(result.probability * 100).toFixed(1)}%</p>
          </div>
        )}

      </div>
    </div>
  )
}