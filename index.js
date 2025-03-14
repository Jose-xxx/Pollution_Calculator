import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PollutionFootprintCalculator = () => {
  const [miles, setMiles] = useState(0);
  const [meat, setMeat] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [plastic, setPlastic] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [tips, setTips] = useState("");

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("pollutionHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const calculateFootprint = () => {
    const carbonFromDriving = miles * 0.2 * 365;
    const carbonFromMeat = meat * 27 * 52;
    const carbonFromElectricity = electricity * 0.4 * 12;
    const carbonFromPlastic = plastic * 6 * 12;

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
      setTips("Your footprint is quite high! Consider using public transport, reducing meat consumption, and minimizing plastic use.");
    } else if (carbon > 2000) {
      setTips("You're doing okay, but there's room for improvement! Try using energy-efficient appliances and reducing waste.");
    } else {
      setTips("Great job! You're keeping your footprint low. Keep up the eco-friendly habits!");
    }
  };

  const data = [
    { name: "Car Usage", value: miles * 0.2 * 365 },
    { name: "Meat Consumption", value: meat * 27 * 52 },
    { name: "Electricity Use", value: electricity * 0.4 * 12 },
    { name: "Plastic Waste", value: plastic * 6 * 12 }
  ];

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Pollution Footprint Calculator</h2>
          <label className="block mb-2">How many miles do you drive per day?</label>
          <input type="number" className="border p-2 w-full rounded mb-4" value={miles} onChange={(e) => setMiles(e.target.value)} />
          <label className="block mb-2">How many meat meals per week?</label>
          <input type="number" className="border p-2 w-full rounded mb-4" value={meat} onChange={(e) => setMeat(e.target.value)} />
          <label className="block mb-2">How much electricity do you use per month? (kWh)</label>
          <input type="number" className="border p-2 w-full rounded mb-4" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
          <label className="block mb-2">How much plastic waste do you produce per month? (kg)</label>
          <input type="number" className="border p-2 w-full rounded mb-4" value={plastic} onChange={(e) => setPlastic(e.target.value)} />
          <Button onClick={calculateFootprint} className="w-full">Calculate</Button>
          {result !== null && (
            <>
              <p className="mt-4 font-bold text-lg">Your estimated yearly carbon footprint is {result.toFixed(2)} kg CO₂.</p>
              <p className="mt-2 text-md text-gray-600">{tips}</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          <h3 className="text-lg font-bold mt-6">Your History</h3>
          <ul className="mt-2">
            {history.map((entry, index) => (
              <li key={index} className="text-sm text-gray-700">{entry.date}: {entry.value.toFixed(2)} kg CO₂</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollutionFootprintCalculator;
