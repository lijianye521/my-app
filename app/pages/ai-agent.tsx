'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Zap } from 'lucide-react';

export default function AIAgent() {

  // 特性项组件
  const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start p-4 bg-indigo-50 rounded-lg">
      <div className="mr-4 bg-indigo-100 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-indigo-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Sparkles className="mr-2 h-6 w-6" />
            AI 智能助手
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-6 h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
              <Brain className="h-12 w-12 text-indigo-600 animate-pulse" />
            </div>
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">努力开发中</h2>
            <div className="mb-8 py-4 px-8 bg-indigo-50 rounded-lg inline-block">
              <p className="text-xl font-semibold text-indigo-800">
                预计2025.9.12日前上线
              </p>
            </div>
            

            

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
