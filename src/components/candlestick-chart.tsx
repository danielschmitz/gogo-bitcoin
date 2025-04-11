"use client"

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { createChart, ColorType, CandlestickData } from 'lightweight-charts'
import { useTheme } from 'next-themes'
import { Skeleton } from '@/components/ui/skeleton'

interface OHLCData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartData, setChartData] = useState<OHLCData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)

  // Function to fetch historical Bitcoin price data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        // Get data for the last 30 days
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)

        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=30`
        )

        // Transform the data into the format required by lightweight-charts
        const formattedData = response.data.map((item: [number, number, number, number, number]) => {
          const [timestamp, open, high, low, close] = item
          return {
            time: new Date(timestamp).toISOString().split('T')[0],
            open,
            high,
            low,
            close,
          }
        })

        setChartData(formattedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching historical data:', err)
        setError('Failed to fetch historical data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [])

  // Create and update the chart based on theme and data changes
  useEffect(() => {
    if (!chartContainerRef.current || loading || error) return

    // Define chart colors based on theme
    const isDarkTheme = theme === 'dark'
    const backgroundColor = isDarkTheme ? '#1a1a1a' : '#ffffff'
    const textColor = isDarkTheme ? '#ffffff' : '#333333'
    const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    const upColor = '#26a69a'
    const downColor = '#ef5350'

    // Remove the existing chart if it exists
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    // Create a new chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 250,
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      timeScale: {
        timeVisible: true,
        borderColor: gridColor,
      },
    })

    // Add a candlestick series
    // @ts-ignore: Lightweight charts types may not be properly defined
    const candlestickSeries = chart.addCandlestickSeries({
      upColor,
      downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
    })

    // Set the data and reset the time scale
    if (chartData.length > 0) {
      candlestickSeries.setData(chartData as CandlestickData[])
      chart.timeScale().fitContent()
    }

    // Store references for cleanup
    chartRef.current = chart
    seriesRef.current = candlestickSeries

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
    }
  }, [chartData, loading, error, theme])

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="w-full h-full">
      {loading ? (
        <Skeleton className="w-full h-full rounded-md" />
      ) : (
        <div ref={chartContainerRef} className="w-full h-full" />
      )}
    </div>
  )
}
