import { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Gift, MessageSquare, Share2, UserPlus, Calendar, Award, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Rewards FAQ",
  description: "Learn how to earn and use your reward points",
}

const faqs = [
  {
    question: "How do I earn reward points?",
    answer: "You can earn reward points through various activities on our platform. Here are some ways to earn points:",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    points: [
      { text: "Receive votes on your profile", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
      { text: "Share your posts and content", icon: <Share2 className="h-4 w-4 text-blue-500" /> },
      { text: "Engage with other users' content", icon: <MessageSquare className="h-4 w-4 text-purple-500" /> },
      { text: "Refer friends to join the platform", icon: <UserPlus className="h-4 w-4 text-pink-500" /> },
      { text: "Complete your profile and daily check-ins", icon: <Calendar className="h-4 w-4 text-orange-500" /> },
      { text: "Achieve milestones and badges", icon: <Award className="h-4 w-4 text-amber-500" /> },
    ]
  },
  {
    question: "How do I check my current points balance?",
    answer: "Your current points balance is displayed in the navigation bar at the top of the page. Click on it to see more details about your rewards and history.",
    icon: <Gift className="h-5 w-5 text-pink-500" />
  },
  {
    question: "How do I redeem my points for rewards?",
    answer: "To redeem your points for rewards, visit the Rewards Store and browse the available rewards. When you find a reward you like and have enough points, click the 'Claim' button and follow the instructions to complete your redemption.",
    icon: <Gift className="h-5 w-5 text-blue-500" />
  },
  {
    question: "Do my points expire?",
    answer: "Yes, reward points expire after 12 months of inactivity on your account. As long as you remain active on the platform, your points will not expire.",
    icon: <Calendar className="h-5 w-5 text-amber-500" />
  },
  {
    question: "Can I transfer my points to another user?",
    answer: "No, reward points are non-transferable and can only be used by the account that earned them.",
    icon: <UserPlus className="h-5 w-5 text-purple-500" />
  },
  {
    question: "What happens if I return or cancel a reward?",
    answer: "If you return or cancel a reward, the points used for that reward will be credited back to your account. Please note that processing may take 3-5 business days.",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  }
]

export default function RewardsFaqPage() {
  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Rewards FAQ</h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to know about earning and using your reward points
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-8">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-300" />
              <span>How to Earn Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Engage with Content</h4>
                  <p className="text-sm text-muted-foreground">Earn points by commenting and reacting to posts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-purple-100 p-1.5 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Share Your Profile</h4>
                  <p className="text-sm text-muted-foreground">Get points when others sign up through your referral</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-green-100 p-1.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Daily Check-ins</h4>
                  <p className="text-sm text-muted-foreground">Log in daily to earn bonus points</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-amber-100 p-1.5 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Complete Challenges</h4>
                  <p className="text-sm text-muted-foreground">Participate in special events and challenges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <AccordionItem value={`item-${index}`} className="border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                      {faq.icon}
                    </div>
                    <span className="text-left font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="pl-11">
                    <p className="mb-3">{faq.answer}</p>
                    {faq.points && (
                      <ul className="space-y-2">
                        {faq.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5">{point.icon}</span>
                            <span>{point.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Gift className="mb-3 h-10 w-10 text-pink-500" />
            <h3 className="mb-2 text-xl font-semibold">Need more help?</h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              If you have any other questions about our rewards program, feel free to contact our support team.
            </p>
            <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
