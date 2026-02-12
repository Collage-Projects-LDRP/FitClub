import { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"
import { getUserRewards, getUserTransactionHistory } from "@/lib/database"
import RewardHistoryClient from "./reward-history-client"

export const metadata: Metadata = {
  title: "Reward History",
  description: "View your reward point history and claimed rewards",
}

export default async function RewardHistoryPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Please sign in to view your reward history</h1>
      </div>
    )
  }

  // Get transactions and claimed rewards for the user
  let transactions = getUserTransactionHistory(user.id, 50) // Get up to 50 transactions
  let claimedRewards = getUserRewards(user.id)
  
  // If no transactions found for the user, add some test data
  if (transactions.length === 0) {
    const now = new Date()
    transactions = [
      {
        id: 1,
        user_id: user.id,
        points: 1000,
        type: 'earn',
        description: 'Welcome bonus',
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        user_id: user.id,
        points: 50,
        type: 'earn',
        description: 'Points for receiving votes',
        created_at: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        user_id: user.id,
        points: 100,
        type: 'earn',
        description: 'Daily login streak bonus',
        created_at: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        user_id: user.id,
        points: -500,
        type: 'redeem',
        description: 'Redeemed reward: VIP Training Session',
        created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        user_id: user.id,
        points: 200,
        type: 'earn',
        description: 'Content creation bonus',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 6,
        user_id: user.id,
        points: -300,
        type: 'redeem',
        description: 'Redeemed reward: Gym Merchandise Pack',
        created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 7,
        user_id: user.id,
        points: 30,
        type: 'earn',
        description: 'Daily login bonus',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 8,
        user_id: user.id,
        points: -400,
        type: 'redeem',
        description: 'Redeemed reward: Nutrition Consultation',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9,
        user_id: user.id,
        points: 75,
        type: 'earn',
        description: 'Referral bonus',
        created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 10,
        user_id: user.id,
        points: 25,
        type: 'earn',
        description: 'Daily login bonus',
        created_at: new Date().toISOString()
      }
    ]
  }
  
  // If no claimed rewards found, add some test data
  if (claimedRewards.length === 0) {
    const now = new Date()
    claimedRewards = [
      {
        id: 1,
        user_id: user.id,
        reward_id: 1,
        claimed_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        tracking_number: 'TRK123456789',
        shipped_at: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        delivered_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      } as any,
      {
        id: 2,
        user_id: user.id,
        reward_id: 2,
        claimed_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'shipped',
        tracking_number: 'TRK987654321',
        shipped_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      } as any,
      {
        id: 3,
        user_id: user.id,
        reward_id: 4,
        claimed_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      } as any
    ]
  }
  
  return <RewardHistoryClient user={user} transactions={transactions} claimedRewards={claimedRewards} />
}
