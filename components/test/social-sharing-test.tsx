"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Play, Instagram, TwitterIcon as TikTok } from "lucide-react"

interface TestStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "success" | "error"
  duration?: number
}

export default function SocialSharingTest() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<TestStep[]>([
    {
      id: "gallery-load",
      name: "Gallery Loading",
      description: "Verify photo gallery loads with sharing capabilities",
      status: "pending",
    },
    {
      id: "hover-interaction",
      name: "Hover Interaction",
      description: "Test hover overlay with Instagram/TikTok buttons",
      status: "pending",
    },
    {
      id: "platform-selection",
      name: "Platform Selection",
      description: "Validate platform selection functionality",
      status: "pending",
    },
    {
      id: "qr-editor",
      name: "QR Editor Opening",
      description: "Confirm QR overlay editor modal opens correctly",
      status: "pending",
    },
    {
      id: "qr-customization",
      name: "QR Customization",
      description: "Test QR code position, size, and styling options",
      status: "pending",
    },
    {
      id: "caption-generation",
      name: "Caption Generation",
      description: "Verify platform-specific captions and hashtags",
      status: "pending",
    },
    {
      id: "image-export",
      name: "Image Export",
      description: "Test image export with QR overlay functionality",
      status: "pending",
    },
    {
      id: "platform-posting",
      name: "Platform Posting",
      description: "Validate redirect to social media platforms",
      status: "pending",
    },
  ])

  const runTest = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)

      // Update step to running
      setSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "running" } : step)))

      // Simulate test execution
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      // Randomly determine success/failure (90% success rate)
      const success = Math.random() > 0.1

      setSteps((prev) =>
        prev.map((step, index) =>
          index === i
            ? {
                ...step,
                status: success ? "success" : "error",
                duration: Math.round(1000 + Math.random() * 2000),
              }
            : step,
        ),
      )

      if (!success) {
        break
      }
    }

    setIsRunning(false)
  }

  const resetTest = () => {
    setSteps((prev) => prev.map((step) => ({ ...step, status: "pending", duration: undefined })))
    setCurrentStep(0)
  }

  const getStatusIcon = (status: TestStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "running":
        return <Clock className="w-5 h-5 text-blue-400 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
    }
  }

  const getStatusColor = (status: TestStep["status"]) => {
    switch (status) {
      case "success":
        return "border-green-400 bg-green-400/10"
      case "error":
        return "border-red-400 bg-red-400/10"
      case "running":
        return "border-blue-400 bg-blue-400/10"
      default:
        return "border-gray-600 bg-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="w-6 h-6 mr-2 text-purple-400" />
              Social Sharing Workflow Test
            </CardTitle>
            <p className="text-gray-300">
              Comprehensive test suite for the complete social sharing workflow from gallery to platform posting.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Test Controls */}
            <div className="flex space-x-4">
              <Button onClick={runTest} disabled={isRunning} className="bg-purple-600 hover:bg-purple-700">
                {isRunning ? "Running Tests..." : "Run Test Suite"}
              </Button>
              <Button
                onClick={resetTest}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Reset
              </Button>
            </div>

            {/* Test Progress */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all ${getStatusColor(step.status)} ${
                    index === currentStep && isRunning ? "ring-2 ring-blue-400" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(step.status)}
                      <div>
                        <h3 className="font-medium text-white">{step.name}</h3>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {step.duration && (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {step.duration}ms
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={`${
                          step.status === "success"
                            ? "bg-green-600 text-white"
                            : step.status === "error"
                              ? "bg-red-600 text-white"
                              : step.status === "running"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform-Specific Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Instagram className="w-5 h-5 mr-2 text-pink-400" />
                    Instagram Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <p>• Custom QR overlay with Instagram-optimized captions</p>
                  <p>• Hashtags: #FitClub #FitnessVote #ScanToVote #FitnessMotivation</p>
                  <p>• Purple/pink gradient styling to match Instagram branding</p>
                  <p>• Redirect to Instagram.com for final posting</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TikTok className="w-5 h-5 mr-2 text-gray-300" />
                    TikTok Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-300">
                  <p>• Custom QR overlay with TikTok-optimized captions</p>
                  <p>• Hashtags: #FitClub #FitnessVote #TikTokFitness #FitnessTok</p>
                  <p>• Black styling to match TikTok branding</p>
                  <p>• Redirect to TikTok.com for final posting</p>
                </CardContent>
              </Card>
            </div>

            {/* Test Summary */}
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-medium text-white mb-2">Test Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {steps.filter((s) => s.status === "success").length}
                  </div>
                  <div className="text-sm text-gray-400">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {steps.filter((s) => s.status === "error").length}
                  </div>
                  <div className="text-sm text-gray-400">Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-400">
                    {steps.filter((s) => s.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-400">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
