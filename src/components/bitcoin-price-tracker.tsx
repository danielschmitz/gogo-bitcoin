"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface BitcoinPrice {
  usd: number
  usd_24h_change: number
}

export function BitcoinPriceTracker() {
  const [price, setPrice] = useState<BitcoinPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
        )
        setPrice(response.data.bitcoin)
        setError(null)
      } catch (err) {
        console.error('Error fetching Bitcoin price:', err)
        setError('Failed to fetch Bitcoin price. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    // Fetch price immediately
    fetchPrice()

    // Set up an interval to fetch the price every 10 seconds
    const interval = setInterval(fetchPrice, 10000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="flex flex-col space-y-2">
      {loading && !price ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : (
        <>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">
              {price ? formatCurrency(price.usd) : '--'}
            </span>
          </div>
          {price && (
            <div className="flex items-center gap-1">
              <span className={`flex items-center ${price.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {price.usd_24h_change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {Math.abs(price.usd_24h_change).toFixed(2)}%
              </span>
              <span className="text-muted-foreground text-sm">(24h)</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
