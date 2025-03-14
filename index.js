import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PollutionFootprintCalculator = () => {
  const [miles, setMiles] = useState("");
  const [meat, setMeat] = useState("");
  const [electricity, setElectricity] = useState("");
  const [plastic, setPlastic] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [tips, setTips] = useState("");

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("pollutionHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const calculateFootprint = () => {
    const milesValue = parseFloat(miles) || 0;
    const meatValue = parseFloat(meat) || 0;
    const electricityValue = parseFloat(electricity) || 0;
    const plasticValue = parseFloat(plastic) || 0;

    const carbonFromDriving = milesValue * 0.2 * 365;
    const carbonFromMeat = meatValue * 27 * 52;
    const carbonFromElectricity = electricityValue * 0.4 * 12;
    const carbonFromPlastic = plasticValue * 6 * 12;

    const totalCarbon = carbonFromDriving + carbonFromMeat + carbonFromElectricity + carbonFromPlastic;
    setResult(totalCarbon);

    const newEntry = { date: new Date().toLocaleDateString(), value: totalCarbon };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem("pollutionHistory", JSON.stringify(updatedHistory));

    generateTips(totalCarbon);
  };

  const generateTips = (carbon) => {
    if (carbon > 5000) {
      setTips("🚨 Your footprint is quite high! Consider using public transport, reducing meat consumption, and minimizing plastic use.");
    } else if (carbon > 2000) {
      setTips("👍 You're doing okay, but there's room for improvement! Try using energy-efficient appliances and reducing waste.");
    } else {
      setTips("🌱 Great job! You're keeping your footprint low. Keep up the eco-friendly habits!");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("pollutionHistory");
  };

  const data = [
    { name: "Car Usage", value: parseFloat(miles) * 0.2 * 365 || 0 },
    { name: "Meat Consumption", value: parseFloat(meat) * 27 * 52 || 0 },
    { name: "Electricity Use", value: parseFloat(electricity) * 0.4 * 12 || 0 },
    { name: "Plastic Waste", value: parseFloat(plastic) * 6 * 12 || 0 }
  ];

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-50 rounded-xl shadow-lg">
      <Card>
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-green-700">🌍 Pollution Footprint Calculator</h2>
          {[{ label: "Miles driven per day", value: miles, setter: setMiles },
            { label: "Meat meals per week", value: meat, setter: setMeat },
            { label: "Electricity use per month (kWh)", value: electricity, setter: setElectricity },
            { label: "Plastic waste per month (kg)", value: plastic, setter: setPlastic }].map((item, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-semibold">{item.label}</label>
              <input 
                type="number" 
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400" 
                value={item.value} 
                onChange={(e) => item.setter(e.target.value)} 
                min="0" 
              />
            </div>
          ))}
          <Button onClick={calculateFootprint} className="w-full bg-green-500 hover:bg-green-600">Calculate</Button>
          {result !== null && (
            <>
              <p className="mt-4 font-bold text-lg text-center text-green-800">🌱 Your estimated yearly carbon footprint: <span className="text-green-600">{result.toFixed(2)} kg CO₂</span></p>
              <p className="mt-2 text-md text-gray-600 text-center">{tips}</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip wrapperStyle={{ fontSize: "14px" }} />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          <h3 className="text-lg font-bold mt-6 text-center text-gray-700">📜 Your History</h3>
          <ul className="mt-2 text-center">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <li key={index} className="text-sm text-gray-700">{entry.date}: {entry.value.toFixed(2)} kg CO₂</li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No history available.</p>
            )}
          </ul>
          {history.length > 0 && <Button onClick={clearHistory} className="mt-4 w-full bg-red-500 hover:bg-red-600">Clear History</Button>}
        </CardContent>
      </Card>
    </div>
  );
};

export default PollutionFootprintCalculator;
