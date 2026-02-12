import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards Store",
  description: "Redeem your points for amazing rewards",
}

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
