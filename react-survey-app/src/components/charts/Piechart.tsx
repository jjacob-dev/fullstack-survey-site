"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  python: {
    label: "Python",
    color: "hsl(var(--chart-1))",
  },
  html: {
    label: "HTML/CSS",
    color: "hsl(var(--chart-2))",
  },
  javascript: {
    label: "JavaScript",
    color: "hsl(var(--chart-3))",
  },
  c: {
    label: "C++",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function Piechart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentData, setRecent] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch counts data from your API
        const result = await axios.get(
          "https://flask-backsurvey-37288cfae4ae.herokuapp.com/counts?columns=language"
        );
        const recent = await axios.get(
          "https://flask-backsurvey-37288cfae4ae.herokuapp.com/last-entry/language"
        );

        setRecent(recent.data.language);

        // Example response format: [{ language: 'python', count: 275 }, { language: 'html', count: 241 }, ...]
        const counts = result.data;

        // Prepare chartData based on counts received
        const processChartData = () => {
          if (!counts.language) return [];
          return Object.keys(counts.language).map((key) => ({
            language: key,
            amount: counts.language[key],
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

  const languageIndex = (recent: string) => {
    console.log(recent);
    switch (recent) {
      case "C++":
        return 0;
      case "HTML/CSS":
        return 1;
      case "JavaScript":
        return 2;
      case "Python":
        return 3;
    }
  };

  const determineFillColour = (language: string) => {
    switch (language) {
      case "Python":
        return "var(--color-python)";
      case "HTML/CSS":
        return "var(--color-html)";
      case "JavaScript":
        return "var(--color-javascript)";
      case "C++":
        return "var(--color-c)";
    }
  };

  return (
    <div>
      <CardHeader className="items-center pb-0">
        <CardTitle>Prefered Coding Lanaguage</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="language"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={languageIndex(String(recentData))}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <Sector {...props} outerRadius={outerRadius + 10} />
            )}
          />
        </PieChart>
      </ChartContainer>
      <CardFooter>Your preffered language is {recentData}</CardFooter>
    </div>
  );
}
