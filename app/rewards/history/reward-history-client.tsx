"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRewardById } from "@/lib/database"
import { formatDistanceToNow, subDays, isWithinInterval, parseISO, format, parse, startOfDay, endOfDay, isToday } from "date-fns"
import { History, Gift, ArrowUpCircle, ArrowDownCircle, Calendar, ChevronDown, Trophy } from "lucide-react"
import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

type TimeRange = 'all' | 'yesterday' | 'week' | 'month' | 'year' | 'custom-range'

export default function RewardHistoryClient({ user, transactions, claimedRewards }: { 
  user: any, 
  transactions: any[],
  claimedRewards: any[]
}) {
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [startDateStr, setStartDateStr] = useState('')
  const [endDateStr, setEndDateStr] = useState('')
  
  // Update date strings when date objects change
  useEffect(() => {
    if (startDate) {
      setStartDateStr(format(startDate, 'yyyy-MM-dd'))
    } else {
      setStartDateStr('')
    }
    if (endDate) {
      setEndDateStr(format(endDate, 'yyyy-MM-dd'))
    } else {
      setEndDateStr('')
    }
  }, [startDate, endDate])

  // Handle date input changes
  const handleDateInputChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDateStr(value)
      const date = value ? parse(value, 'yyyy-MM-dd', new Date()) : null
      if (date && !isNaN(date.getTime())) {
        setStartDate(date)
      } else if (value === '') {
        setStartDate(undefined)
      }
    } else {
      setEndDateStr(value)
      const date = value ? parse(value, 'yyyy-MM-dd', new Date()) : null
      if (date && !isNaN(date.getTime())) {
        setEndDate(date)
      } else if (value === '') {
        setEndDate(undefined)
      }
    }
  }

  // Reset date states when time range changes to non-custom values
  useEffect(() => {
    if (timeRange === 'custom-range') {
      if (!startDate || !endDate) {
        // Set default range to last 7 days when custom range is selected and no dates are set
        const today = new Date()
        const lastWeek = subDays(today, 6)
        setStartDate(lastWeek)
        setEndDate(today)
      }
    } else {
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }, [timeRange])

  // Helper function to check if a date is within the selected range
  const isDateInRange = (date: Date, start: Date | undefined, end: Date | undefined, hover: Date | null) => {
    if (!start && !end) return false
    
    const startDate = start ? new Date(start) : null
    const endDate = end ? new Date(end) : null
    
    if (startDate && endDate) {
      return isWithinInterval(date, { start: startDate, end: endDate })
    }
    
    if (startDate && hover && date > startDate && date < hover) {
      return true
    }
    
    return false
  }

  // Handle date selection in the range picker
  const handleDateClick = (date: Date) => {
    if (!startDate && !endDate) {
      setStartDate(date)
    } else if (startDate && !endDate) {
      if (date > startDate) {
        setEndDate(date)
      } else {
        setEndDate(startDate)
        setStartDate(date)
      }
    } else {
      setStartDate(date)
      setEndDate(undefined)
    }
  }

  // Apply quick date range selection
  const applyQuickRange = (days: number) => {
    const today = new Date()
    const startDate = subDays(today, days - 1)
    setStartDate(startDate)
    setEndDate(today)
    setTimeRange('custom-range')
    setIsDateRangeOpen(false)
    setShowSecondCalendar(false)
  }
  
  // Apply the selected date range and filter transactions
  const applyDateRange = () => {
    if (startDate && endDate) {
      // Set the time range to custom to trigger the filter
      setTimeRange('custom-range')
      setIsDateRangeOpen(false)
    }
  }

  const filterByDate = (itemDate: string) => {
    const date = parseISO(itemDate)
    const now = new Date()
    
    if (timeRange === 'yesterday') {
      const yesterday = subDays(now, 1)
      return isWithinInterval(date, { start: startOfDay(yesterday), end: endOfDay(yesterday) })
    } else if (timeRange === 'week') {
      return isWithinInterval(date, { start: subDays(now, 7), end: now })
    } else if (timeRange === 'month') {
      return isWithinInterval(date, { start: subDays(now, 30), end: now })
    } else if (timeRange === 'year') {
      return isWithinInterval(date, { start: subDays(now, 365), end: now })
    } else if (timeRange === 'custom-range' && startDate && endDate) {
      const start = startOfDay(startDate)
      const end = endOfDay(endDate)
      return isWithinInterval(date, { start, end })
    }
    return timeRange === 'all'
  }

  // Calculate points summary
  const totalEarned = transactions
    .filter(tx => tx.type === 'earn')
    .reduce((sum, tx) => sum + tx.points, 0);
    
  const totalRedeemed = claimedRewards
    .reduce((sum, reward) => {
      const rewardDetails = getRewardById(reward.reward_id);
      return sum + (rewardDetails?.points_required || 0);
    }, 0);
    
  const availablePoints = totalEarned - totalRedeemed;
  
  // Filter transactions and rewards based on selected time range
  const filteredTransactions = transactions.filter(tx => filterByDate(tx.created_at))
  const filteredRewards = claimedRewards.filter(reward => filterByDate(reward.claimed_at))
  
  return (
    <div className="container py-8">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">Reward History</h1>
          <p className="mt-2 text-muted-foreground">
            Track your points and rewards
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-between text-left font-normal",
                  !timeRange && "text-muted-foreground"
                )}
              >
                {timeRange === 'all' && 'All Time'}
                {timeRange === 'yesterday' && 'Yesterday'}
                {timeRange === 'week' && 'Last 7 Days'}
                {timeRange === 'month' && 'Last 30 Days'}
                {timeRange === 'year' && 'Last Year'}
                {timeRange === 'custom-range' && (startDate && endDate ? 
                  `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}` : 
                  'Custom Date Range')}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="grid gap-1 p-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setTimeRange('all')}
                  className={`justify-start ${timeRange === 'all' ? 'bg-accent' : ''}`}
                >
                  All Time
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setTimeRange('yesterday')}
                  className={`justify-start ${timeRange === 'yesterday' ? 'bg-accent' : ''}`}
                >
                  Yesterday
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setTimeRange('week')}
                  className={`justify-start ${timeRange === 'week' ? 'bg-accent' : ''}`}
                >
                  Last 7 Days
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setTimeRange('month')}
                  className={`justify-start ${timeRange === 'month' ? 'bg-accent' : ''}`}
                >
                  Last 30 Days
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setTimeRange('year')}
                  className={`justify-start ${timeRange === 'year' ? 'bg-accent' : ''}`}
                >
                  Last Year
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setTimeRange('custom-range')}
                  className={`justify-start ${timeRange === 'custom-range' ? 'bg-accent' : ''}`}
                >
                  Custom Date Range
                </Button>
                {timeRange === 'custom-range' && (
                  <div className="p-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Date Range</span>
                      {/* <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => applyQuickRange(7)}
                          className="h-7 px-2 text-xs"
                        >
                          7d
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => applyQuickRange(30)}
                          className="h-7 px-2 text-xs"
                        >
                          30d
                        </Button>
                      </div> */}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Start Date</label>
                        <input
                          type="date"
                          value={startDateStr}
                          onChange={(e) => handleDateInputChange('start', e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">End Date</label>
                        <input
                          type="date"
                          value={endDateStr}
                          onChange={(e) => handleDateInputChange('end', e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t mt-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setStartDate(undefined)
                          setEndDate(undefined)
                        }}
                        disabled={!startDate && !endDate}
                        className="h-8 text-xs text-destructive"
                      >
                        Clear
                      </Button>
                      {/* <Button 
                        variant="default" 
                        size="sm"
                        onClick={applyDateRange}
                        disabled={!startDate || !endDate}
                        className="h-8 text-xs"
                      >
                        Apply
                      </Button> */}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Points Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Points Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Earned</p>
              <p className="text-2xl font-bold">{totalEarned} <span className="text-sm font-normal">pts</span></p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        {/* Available Points Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Available</p>
              <p className="text-2xl font-bold">{Math.max(0, availablePoints)} <span className="text-sm font-normal">pts</span></p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Gift className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        {/* Redeemed Points Card */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100">Redeemed</p>
              <p className="text-2xl font-bold">{totalRedeemed} <span className="text-sm font-normal">pts</span></p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
          <TabsTrigger value="transactions">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="mr-2 h-4 w-4" />
            Claimed Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Point History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        {tx.type === 'earn' ? (
                          <ArrowUpCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="h-6 w-6 text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === 'earn' ? 'text-green-500' : 'text-amber-500'}`}>
                          {tx.type === 'earn' ? '+' : '-'}{Math.abs(tx.points)} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Claimed Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              {claimedRewards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No rewards claimed yet
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRewards.map((reward) => {
                    const rewardDetails = getRewardById(reward.reward_id)
                    if (!rewardDetails) return null
                    
                    return (
                      <div 
                        key={reward.id}
                        className="flex items-start justify-between p-4 rounded-lg border"
                      >
                        <div className="flex space-x-4">
                          <div className="h-16 w-16 rounded-md bg-muted overflow-hidden">
                            {rewardDetails.image_url && (
                              <img 
                                src={rewardDetails.image_url} 
                                alt={rewardDetails.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{rewardDetails.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Claimed {formatDistanceToNow(new Date(reward.claimed_at), { addSuffix: true })}
                            </p>
                            <div className="mt-1">
                              <Badge variant={reward.status === 'delivered' ? 'default' : 'secondary'}>
                                {reward.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-500">
                            -{rewardDetails.points_required} pts
                          </p>
                          {reward.tracking_number && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Tracking: {reward.tracking_number}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
