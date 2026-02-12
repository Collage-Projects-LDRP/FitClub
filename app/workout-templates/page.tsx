"use client";

import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Share2, Sparkles, TrendingUp, Zap, Heart, MessageSquare, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type ReelTemplate = {
  id: string;
  title: string;
  description: string;
  preview: string;
  duration: string;
  category: 'Transitions' | 'Text Overlay' | 'Before/After' | 'Workout' | 'Transformation' | 'Challenge' | 'Showcase' | 'Community' | 'Achievement' | 'Featured' | 'Events';
  engagement: string;
  aspectRatio: '9:16' | '1:1' | '16:9';
  likes: number;
  uses: number;
  isNew?: boolean;
  isTrending?: boolean;
};

const reelTemplates: ReelTemplate[] = [
  {
    id: 'maxopolis-before-after',
    title: 'Maxopolis Before/After',
    description: 'Showcase transformations with our signature before/after reveal effect',
    preview: '/before-after.jpg',
    duration: '0:30',
    category: 'Before/After',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 3567,
    uses: 1890,
    isTrending: true,
    isNew: true
  },
  {
    id: 'maxopolis-personal-best',
    title: 'Personal Best',
    description: 'Celebrate your fitness achievements and personal records',
    preview: '/personal-best.png',
    duration: '0:25',
    category: 'Achievement',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 2789,
    uses: 1321,
    isTrending: true
  },
  {
    id: 'maxopolis-8week-challenge',
    title: '8-Week Challenge',
    description: 'Document your 8-week transformation journey with our challenge template',
    preview: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80',
    duration: '0:45',
    category: 'Challenge',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 4231,
    uses: 2150,
  },
  {
    id: 'maxopolis-physique',
    title: 'Physique Showcase',
    description: 'Highlight your best angles with our physique showcase template',
    preview: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80',
    duration: '0:25',
    category: 'Showcase',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 2456,
    uses: 1123
  },
  {
    id: 'maxopolis-squad',
    title: 'Squad Goals',
    description: 'Showcase your training group or fitness community',
    preview: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80',
    duration: '0:35',
    category: 'Community',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 3123,
    uses: 1456,
    isTrending: true
  },
  {
    id: 'maxopolis-on-reel',
    title: 'Maxopolis On Reel',
    description: 'Our signature template for engaging fitness content',
    preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80',
    duration: '0:30',
    category: 'Featured',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 4123,
    uses: 2345,
    isTrending: true,
    isNew: true
  },
  {
    id: 'maxopolis-event',
    title: 'Event Highlights',
    description: 'Capture the energy of Maxopolis fitness events',
    preview: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80',
    duration: '0:45',
    category: 'Events',
    engagement: 'High',
    aspectRatio: '9:16',
    likes: 3567,
    uses: 1789
  }
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Transitions': 'bg-gradient-to-r from-blue-500 to-cyan-400',
    'Text Overlay': 'bg-gradient-to-r from-purple-500 to-pink-400',
    'Before/After': 'bg-gradient-to-r from-amber-500 to-orange-400',
    'Workout': 'bg-gradient-to-r from-rose-500 to-pink-400',
    'Transformation': 'bg-gradient-to-r from-emerald-500 to-teal-400',
    'Challenge': 'bg-gradient-to-r from-violet-500 to-indigo-400',
    'Showcase': 'bg-gradient-to-r from-yellow-500 to-orange-400',
    'Community': 'bg-gradient-to-r from-green-500 to-blue-400',
    'Achievement': 'bg-gradient-to-r from-red-500 to-pink-400',
    'Featured': 'bg-gradient-to-r from-purple-500 to-pink-400',
    'Events': 'bg-gradient-to-r from-blue-500 to-cyan-400'
  };
  return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-400';
};

import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  })
};

export default function ReelTemplatesPage() {
  // Removed selectedTemplate state as we don't need it anymore
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="text-xs font-medium text-primary">100+ Templates Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Stunning <span className="text-primary">Reel Creation Templates</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base">
            Create professional fitness reels in minutes with our <span className="text-purple-300 font-medium">customizable templates</span>
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search templates..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
              />
            </div>
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant="outline" size="sm" className="rounded-full h-9 px-4 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
              <Sparkles className="w-4 h-4 mr-1.5" /> All Templates
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full h-9 px-4 text-amber-300 hover:bg-amber-900/30">
              <TrendingUp className="w-4 h-4 mr-1.5 text-amber-400" /> Trending
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full h-9 px-4 text-cyan-300 hover:bg-cyan-900/30">
              <Zap className="w-4 h-4 mr-1.5 text-cyan-400" /> New
            </Button>
            
            {Array.from(new Set(reelTemplates.map(t => t.category))).map((category) => {
              const colors = {
                'Transitions': 'from-blue-400 to-cyan-400',
                'Text Overlay': 'from-purple-400 to-pink-400',
                'Before/After': 'from-amber-400 to-orange-400',
                'Workout': 'from-rose-400 to-pink-400',
                'Transformation': 'from-emerald-400 to-teal-400',
                'Challenge': 'from-violet-400 to-indigo-400',
                'Showcase': 'from-yellow-400 to-orange-400',
                'Community': 'from-green-400 to-blue-400',
                'Achievement': 'from-red-400 to-pink-400',
                'Featured': 'from-purple-400 to-pink-400',
                'Events': 'from-blue-400 to-cyan-400'
              }[category];
              
              return (
                <Button 
                  key={category} 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full h-9 px-4 bg-gradient-to-r ${colors} bg-clip-text text-transparent hover:bg-opacity-10`}
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reelTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Card 
                className="group bg-gray-800/50 border-gray-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
              >
              <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden">
                {/* Template Preview with Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={template.preview}
                    alt={template.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 h-full w-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={template.isTrending || template.isNew}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                {/* Play Button and Duration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative z-10 bg-black/50 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-10 w-10 text-white/90 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {template.duration}
                  </span>
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {template.isNew && (
                    <span className="bg-emerald-500/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" /> New
                    </span>
                  )}
                  {template.isTrending && (
                    <span className="bg-amber-500/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> Trending
                    </span>
                  )}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <span 
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: `linear-gradient(45deg, ${getCategoryColor(template.category).split(' ')[2]}, ${getCategoryColor(template.category).split(' ')[4]})` }}
                    >
                      {template.category}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60">
                      <Heart className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1 text-rose-400 fill-rose-400" />
                      <span className="mr-3">{template.likes.toLocaleString()}</span>
                      <MessageSquare className="h-3 w-3 mr-1 text-cyan-400" />
                      <span>{template.uses.toLocaleString()} uses</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardHeader className="p-4 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-white line-clamp-1">
                    {template.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 h-10">
                  {template.description}
                </p>
              </CardHeader>
              
              <CardFooter className="p-4 pt-0">
                <Link href={template.category === 'Before/After' ? '/before-after-reel' : 
                               template.title === 'Personal Best' ? '/personal-best-reel' : '#'} 
                      className="w-full">
                  <Button 
                    className="w-full h-9 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all duration-200 group/button"
                    size="sm"
                    disabled={template.category !== 'Before/After' && template.title !== 'Personal Best'}
                  >
                    <PlayCircle className="mr-2 h-4 w-4 group-hover/button:scale-110 transition-transform" />
                    {template.category === 'Before/After' || template.title === 'Personal Best' ? 'Use Template' : 'Coming Soon'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <div className="mt-20 mb-10 text-center relative overflow-hidden rounded-2xl p-8 md:p-12 bg-gradient-to-r from-gray-800/50 via-gray-900/70 to-gray-800/50 border border-gray-700/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              We can create a <span className="text-primary font-medium">custom template</span> that perfectly matches your brand and style
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg"
                className="rounded-full px-8 h-11 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-all group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                Request Custom Template
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-11 border-gray-600 text-gray-200 hover:bg-gray-800/50">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}
