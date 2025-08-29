'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Hourglass } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
}

export default function ComingSoon({ title = "敬请期待" }: ComingSoonProps) {

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Clock className="mr-2 h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-6 h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <Hourglass className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">努力开发中</h2>
            <div className="mb-8 py-4 px-8 bg-blue-50 rounded-lg inline-block">
              <p className="text-xl font-semibold text-blue-800">
                预计2025.9.12日前上线
              </p>
            </div>
            

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
