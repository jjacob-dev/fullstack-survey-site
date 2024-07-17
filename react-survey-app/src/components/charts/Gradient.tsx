"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Gradient() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [averageAge, setAverage] = useState(Number);

  const ages = [
    { age: "10+", amount: 0 },
    { age: "20+", amount: 0 },
    { age: "30+", amount: 0 },
    { age: "40+", amount: 0 },
    { age: "50+", amount: 0 },
    { age: "60+", amount: 0 },
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch counts data from your API
        const result = await axios.get(
          "flask-test.us-east-1.elasticbeanstalk.com/counts?columns=age"
        );

        const counts = result.data;

        let totalSum = 0;
        let totalCount = 0;

        for (const [age, count] of Object.entries(result.data.age)) {
          totalSum += Number(age) * Number(count);
          totalCount += Number(count);
        }

        const averageAge = Math.round(totalSum / totalCount);
        setAverage(averageAge);

        const determineAgeRange = (age: number, amount: number): void => {
          if (age >= 10 && age <= 19) {
            ages[0].amount += amount;
          } else if (age >= 20 && age <= 29) {
            ages[1].amount += amount;
          } else if (age >= 30 && age <= 39) {
            ages[2].amount += amount;
          } else if (age >= 40 && age <= 49) {
            ages[3].amount += amount;
          } else if (age >= 50 && age <= 59) {
            ages[4].amount += amount;
          } else if (age >= 60) {
            ages[5].amount += amount;
          }
        };

        const processChartData = () => {
          if (!counts.age) return [];
          return Object.keys(counts.age).map((key) => ({
            age: key,
            amount: counts.age[key],
            range: determineAgeRange(Number(key), counts.age[key]),
          }));
        };

        processChartData();

        setChartData(ages);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <div>
      <CardHeader>
        <CardTitle>Survey user's ages</CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-amount)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-amount)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <Area
            dataKey="amount"
            type="natural"
            fill="url(#fillAmount)"
            fillOpacity={0.4}
            stroke="var(--color-amount)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
      <CardFooter>Average age of survey user is {averageAge}</CardFooter>
    </div>
  );
}
