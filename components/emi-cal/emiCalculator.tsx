'use client'

import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(30000); // Default principal amount
  const [months, setMonths] = useState<number>(9); // Default tenure in months
  const [interestRate, setInterestRate] = useState<number>(3); // Default interest rate
  const [emi, setEmi] = useState<number>(0); // EMI result
  const [totalInterest, setTotalInterest] = useState<number>(0); // Total interest payable

  // Function to calculate EMI
  const calculateEMI = (principal: number, tenure: number, rate: number) => {
    const monthlyRate = rate / 12 / 100; // Convert annual rate to monthly rate
    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    const totalInterestPayable = emiValue * tenure - principal; // Total interest to be paid
    setEmi(emiValue);
    setTotalInterest(totalInterestPayable);
  };

  // Function to determine the interest rate based on the selected loan term
  const determineInterestRate = (tenure: number) => {
    if (tenure <= 3) return 3;
    if (tenure <= 6) return 6;
    if (tenure <= 9) return 10;
    return 12;
  };

  // Update interest rate and EMI calculation whenever the loan term changes
  useEffect(() => {
    const rate = determineInterestRate(months);
    setInterestRate(rate);
    calculateEMI(loanAmount, months, rate);
  }, [loanAmount, months]);

  // Doughnut chart data configuration, updated dynamically
  const data = {
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [loanAmount, totalInterest],
        backgroundColor: ['#4A90E2', '#FF6F61'], // Blue for principal, pink for interest
        hoverBackgroundColor: ['#4A90E2', '#FF6F61'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    borderColor: 'white',
  };




  const EmiCalculatorMobile = () => (
    <div className="block lg:hidden max-w-4xl mx-auto h-[100dvh] p-6 bg-gradient-to-bl from-[#e4dfec] to-gray-200 shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-purple-700">Loan Calculator</h1>
      
      {/* Container for responsiveness */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left side: Sliders and EMI details */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Loan Amount Slider */}
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount: ₹{loanAmount}
            </label>
            <input
              type="range"
              id="loanAmount"
              min="1000"
              max="200000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full appearance-none bg-gray-300 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Loan Term Slider */}
          <div>
            <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
              Length: {months} months
            </label>
            <input
              type="range"
              id="months"
              min="1"
              max="12"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full appearance-none bg-gray-300 rounded-lg h-2 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              * Interest rate: {interestRate}% ({months <= 3 ? '3% for 3 months' : months <= 6 ? '6% for 6 months' : months <= 9 ? '10% for 9 months' : '12% for more than 9 months'})
            </p>
          </div>

          {/* EMI Result Display */}
          <div className="mt-4 p-4 bg-purple-100 rounded-lg">
            <p className="text-lg font-medium">
              Monthly Payable: ₹{emi.toFixed(2)}/mo
            </p>
          </div>
        </div>

        {/* Bottom row for Principal, Interest, and Total Payable amounts */}
        <div className="flex flex-row w-full lg:flex-row justify-between items-center mt-10 p-4 bg-purple-50 rounded-lg">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <p className="text-gray-700 font-medium">Principal</p>
            <p className="text-purple-700">₹{loanAmount}</p>
          </div>
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <p className="text-gray-700 font-medium">Interest</p>
            <p className="text-purple-700">₹{totalInterest.toFixed(2)}</p>
          </div>
          <div className="text-center lg:text-left mb-4">
            <p className="text-gray-700 font-medium">Total Payable</p>
            <p className="text-purple-700">₹{(loanAmount + totalInterest).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Right side: Doughnut Chart */}
      <div className="w-full lg:w-1/2 flex justify-center items-center mt-6">
        <div className="w-64 h-64 md:w-72 md:h-72">
          <h2 className="text-center text-xl font-semibold mb-2 text-gray-700">Payment Breakup</h2>
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );

  return (

    
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-bl from-[#e4dfec] to-gray-200 shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-purple-700">Loan Calculator</h1>
      
      {/* Container for responsiveness */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left side: Sliders and EMI details */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Loan Amount Slider */}
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount: ₹{loanAmount}
            </label>
            <input
              type="range"
              id="loanAmount"
              min="1000"
              max="200000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full appearance-none bg-gray-300 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Loan Term Slider */}
          <div>
            <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-2">
              Length: {months} months
            </label>
            <input
              type="range"
              id="months"
              min="1"
              max="12"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full appearance-none bg-gray-300 rounded-lg h-2 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              * Interest rate: {interestRate}% ({months <= 3 ? '3% for 3 months' : months <= 6 ? '6% for 6 months' : months <= 9 ? '10% for 9 months' : '12% for more than 9 months'})
            </p>
          </div>

          {/* EMI Result Display */}
          <div className="mt-4 p-4 bg-purple-100 rounded-lg">
            <p className="text-lg font-medium">
              Monthly Payable: ₹{emi.toFixed(2)}/mo
            </p>
          </div>
        </div>

        {/* Right side: Doughnut Chart */}
        <div className="w-full lg:w-1/2 flex justify-center items-center order-last lg:order-none">
          <div className="w-64 h-64 md:w-72 md:h-72">
            <h2 className="text-center text-xl font-semibold mb-2 text-gray-700">Payment Breakup</h2>
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>

      {/* Bottom row for Principal, Interest, and Total Payable amounts */}
      <div className="flex flex-col lg:flex-row justify-between items-center mt-10 p-4 bg-purple-50 rounded-lg order-first lg:order-none">
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <p className="text-gray-700 font-medium">Principal</p>
          <p className="text-purple-700">₹{loanAmount}</p>
        </div>
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <p className="text-gray-700 font-medium">Interest</p>
          <p className="text-purple-700">₹{totalInterest.toFixed(2)}</p>
        </div>
        <div className="text-center lg:text-left">
          <p className="text-gray-700 font-medium">Total Payable</p>
          <p className="text-purple-700">₹{(loanAmount + totalInterest).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
