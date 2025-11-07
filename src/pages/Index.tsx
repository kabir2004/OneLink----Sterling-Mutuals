import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, Users, TrendingUp, AlertTriangle, 
  Wallet, ArrowUpRight, ArrowDownRight, CreditCard,
  Plus, Send, Download, ArrowRight,
  CheckCircle2, Calendar, FileText
} from 'lucide-react';

const Index = () => {
  const statsCards = [
    { value: '$1,055,611.55', icon: DollarSign, iconColor: 'text-green-600' },
    { value: '127', icon: Users, iconColor: 'text-blue-600' },
    { value: '23', icon: TrendingUp, iconColor: 'text-orange-600' },
    { value: '3', icon: AlertTriangle, iconColor: 'text-red-600' },
  ];

  const clientAccounts = [
    { name: 'Smith Family Trust', description: 'Conservative Growth Portfolio', amount: '$485,230.80', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Johnson Retirement Fund', description: 'Balanced Income Strategy', amount: '$320,850.00', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Williams Education Savings', description: 'Aggressive Growth Plan', amount: '$125,430.50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Brown Emergency Fund', description: 'High-Yield Savings', amount: '$45,200.00', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { name: 'Davis Tax-Free Account', description: 'Municipal Bond Portfolio', amount: '$78,900.25', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  const transactions = [
    { name: 'Smith Trust - Fund Purchase', time: 'Today, 2:45 PM', amount: '-$25,000.00', isNegative: true, icon: TrendingUp },
    { name: 'Johnson Fund - Dividend', time: 'Today, 9:00 AM', amount: '+$1,250.00', isNegative: false, icon: CreditCard },
    { name: 'Williams Account - Rebalance', time: 'Yesterday', amount: '-$5,500.00', isNegative: true, icon: TrendingUp },
    { name: 'Brown Emergency - Deposit', time: 'Yesterday', amount: '+$10,000.00', isNegative: false, icon: CreditCard },
    { name: 'Davis Account - Fee Payment', time: '2 days ago', amount: '-$150.00', isNegative: true, icon: CreditCard },
    { name: 'Smith Trust - Capital Gain', time: '3 days ago', amount: '+$3,200.00', isNegative: false, icon: CreditCard },
  ];

  const complianceItems = [
    { label: 'KYP Completed', value: '98%', color: 'text-green-600', icon: CheckCircle2 },
    { label: 'Trade Reviews', value: '3 pending', color: 'text-orange-600', icon: AlertTriangle },
    { label: 'Monthly Reports', value: 'Due in 5 days', color: 'text-blue-600', icon: FileText },
  ];

  const upcomingEvents = [
    { 
      title: 'Smith Trust Review', 
      description: 'Quarterly portfolio rebalancing',
      status: 'In-progress',
      statusColor: 'bg-blue-100 text-blue-700',
      progress: 75,
      target: '$485,230.00',
      dueDate: 'Dec 15, 2024'
    },
    { 
      title: 'Johnson Retirement Plan', 
      description: 'Annual contribution optimization',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-700',
      progress: 45,
      target: '$320,850.00',
      dueDate: 'Jan 30, 2025'
    },
  ];

  return (
    <PageLayout title="">
      <div className="space-y-4">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Client Accounts */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="space-y-4 pt-4">
              <div className="rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">$1,055,611.55</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Client Accounts</p>
                {clientAccounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`${account.iconBg} p-2 rounded-lg`}>
                        <ArrowUpRight className={`h-4 w-4 ${account.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.description}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">{account.amount}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs py-2">
                  <Plus className="h-3 w-3 mr-1" />
                  New Client
                </Button>
                <Button variant="outline" className="flex-1 border-gray-300 text-xs py-2">
                  <Send className="h-3 w-3 mr-1" />
                  Transfer
                </Button>
                <Button variant="outline" className="flex-1 border-gray-300 text-xs py-2">
                  <Download className="h-3 w-3 mr-1" />
                  Deposit
                </Button>
                <Button variant="outline" className="flex-1 border-gray-300 text-xs py-2">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-sm text-gray-900">Recent Activity</span>
                  <span className="text-xs text-gray-500 ml-2">(127 transactions)</span>
                </div>
                <span className="text-xs text-gray-500">This Month</span>
              </div>

              <div className="space-y-2">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <transaction.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{transaction.name}</p>
                        <p className="text-xs text-gray-500">{transaction.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm ${transaction.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.amount}
                      </p>
                      {transaction.isNegative ? (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs py-2 mt-2">
                View All Transactions
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Compliance Status */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="space-y-2 pt-4">
              {complianceItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="font-medium text-sm text-gray-900">{item.label}</span>
                  </div>
                  <span className={`font-semibold text-sm ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="space-y-3 pt-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.description}</p>
                      </div>
                    </div>
                    <Badge className={event.statusColor}>{event.status}</Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{event.progress}%</span>
                    </div>
                    <Progress value={event.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{event.target}</span>
                      <span className="text-gray-500 ml-1">target</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {event.dueDate}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-gray-300 text-xs py-2">
                    View Details
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
