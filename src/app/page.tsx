// Use client directive for client-side interactivity
"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { BitcoinPriceTracker } from "@/components/bitcoin-price-tracker";
import { CandlestickChart } from "@/components/candlestick-chart";
import { formatDistance } from "date-fns";

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update the "last updated" time every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-3xl font-bold">GogoBitcoin</h1>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Bitcoin Price (USD)</CardTitle>
            <CardDescription>
              Live price updated every 10 seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BitcoinPriceTracker />
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {formatDistance(lastUpdated, new Date(), { addSuffix: true })}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>30-Day Price Trend</CardTitle>
            <CardDescription>
              Historical performance over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CandlestickChart />
          </CardContent>
        </Card>
      </div>

      <footer className="mt-auto py-4 text-center text-sm text-muted-foreground">
        <p>Data provided by public Bitcoin APIs • {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
