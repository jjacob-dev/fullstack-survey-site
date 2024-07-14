"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  Red: {
    label: "Red",
    color: "hsl(var(--red))",
  },
  Blue: {
    label: "Blue",
    color: "hsl(var(--blue))",
  },
  Green: {
    label: "Green",
    color: "hsl(var(--green))",
  },
  Purple: {
    label: "Purple",
    color: "hsl(var(--purple))",
  },
  Pink: {
    label: "Pink",
    color: "hsl(var(--pink))",
  },
} satisfies ChartConfig;

export function Barchart() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch counts data from your API
        const result = await axios.get(
          "http://localhost:5000/counts?columns=colour"
        );

        const counts = result.data;

        // Prepare chartData based on counts received
        const processChartData = () => {
          if (!counts.colour) return [];
          return Object.keys(counts.colour).map((key) => ({
            colour: key,
            amount: counts.colour[key],
            fill: determineFillColour(key), // Custom function to set fill color based on language
          }));
        };

        // Set the updated chartData state
        setChartData(processChartData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  const determineFillColour = (colour: string) => {
    switch (colour) {
      case "Red":
        return "var(--color-Red)";
      case "Green":
        return "var(--color-Green)";
      case "Blue":
        return "var(--color-Blue)";
      case "Purple":
        return "var(--color-Purple)";
      case "Pink":
        return "var(--color-Pink)";
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Favourite colour graph</CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="colour"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              chartConfig[value as keyof typeof chartConfig]?.label
            }
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="amount"
            strokeWidth={2}
            radius={8}
            activeIndex={2}
            activeBar={({ ...props }) => {
              return (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              );
            }}
          />
        </BarChart>
      </ChartContainer>
      <CardFooter>Your favourite color is</CardFooter>
    </div>
  );
}
