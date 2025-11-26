import { useMemo, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Plus, UploadCloud, Eye, Pencil, FileUp, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, ArrowLeftRight, FileText, X, CheckCircle2, Search } from "lucide-react";

type DocumentStatus = "Uploaded" | "Required" | "Missing";
type ClientStatus = "Active" | "Inactive" | "Prospect";
type PlanType = "RRSP" | "RESP" | "TFSA" | "RRIF" | "Non-Registered" | "LIRA" | "LIF";

type Fund = {
  symbol: string;
  name: string;
  company: string;
  category?: string;
};

// Fund database with companies and their funds
const FUND_DATABASE: Fund[] = [
  // Fidelity Funds
  { symbol: "FID001", name: "FIDELITY NORTHSTAR FUND", company: "Fidelity", category: "Equity" },
  { symbol: "FID002", name: "Fidelity Monthly Income Fund - Series B ISC", company: "Fidelity", category: "Income" },
  { symbol: "FID003", name: "Fidelity Canadian Growth Fund", company: "Fidelity", category: "Equity" },
  { symbol: "FID004", name: "Fidelity Global Equity Fund", company: "Fidelity", category: "Equity" },
  { symbol: "FID005", name: "Fidelity Balanced Fund", company: "Fidelity", category: "Balanced" },
  { symbol: "FID006", name: "Fidelity Dividend Fund", company: "Fidelity", category: "Income" },
  { symbol: "FID007", name: "Fidelity International Equity Fund", company: "Fidelity", category: "Equity" },
  { symbol: "FID008", name: "Fidelity Bond Fund", company: "Fidelity", category: "Fixed Income" },
  
  // TD Asset Management Funds
  { symbol: "TD001", name: "TD Monthly Income Fund - Series A", company: "TD Asset Management", category: "Income" },
  { symbol: "TD002", name: "TD Canadian Equity Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD003", name: "TD Balanced Growth Fund", company: "TD Asset Management", category: "Balanced" },
  { symbol: "TD004", name: "TD Global Equity Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD005", name: "TD Dividend Growth Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD006", name: "TD Canadian Bond Fund", company: "TD Asset Management", category: "Fixed Income" },
  { symbol: "TD007", name: "TD International Equity Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD008", name: "TD Money Market Fund", company: "TD Asset Management", category: "Money Market" },
  
  // Vanguard Funds
  { symbol: "VAN001", name: "Vanguard S&P 500 Index ETF", company: "Vanguard", category: "Equity" },
  { symbol: "VAN002", name: "Vanguard FTSE Canada All Cap Index ETF", company: "Vanguard", category: "Equity" },
  { symbol: "VAN003", name: "Vanguard Canadian Aggregate Bond Index ETF", company: "Vanguard", category: "Fixed Income" },
  { symbol: "VAN004", name: "Vanguard Global Equity Index ETF", company: "Vanguard", category: "Equity" },
  { symbol: "VAN005", name: "Vanguard Balanced ETF Portfolio", company: "Vanguard", category: "Balanced" },
  
  // iShares Funds
  { symbol: "ISH001", name: "iShares Core S&P/TSX Capped Composite Index ETF", company: "iShares", category: "Equity" },
  { symbol: "ISH002", name: "iShares Core MSCI All Country World ex Canada Index ETF", company: "iShares", category: "Equity" },
  { symbol: "ISH003", name: "iShares Canadian Corporate Bond Index ETF", company: "iShares", category: "Fixed Income" },
  { symbol: "ISH004", name: "iShares S&P 500 Index ETF", company: "iShares", category: "Equity" },
  
  // BMO Funds
  { symbol: "BMO001", name: "BMO Aggregate Bond Index ETF", company: "BMO", category: "Fixed Income" },
  { symbol: "BMO002", name: "BMO Canadian Equity Fund", company: "BMO", category: "Equity" },
  { symbol: "BMO003", name: "BMO Global Equity Fund", company: "BMO", category: "Equity" },
  { symbol: "BMO004", name: "BMO Balanced Fund", company: "BMO", category: "Balanced" },
  
  // RBC Funds
  { symbol: "RBC001", name: "RBC Canadian Equity Fund", company: "RBC", category: "Equity" },
  { symbol: "RBC002", name: "RBC Global Equity Fund", company: "RBC", category: "Equity" },
  { symbol: "RBC003", name: "RBC Balanced Fund", company: "RBC", category: "Balanced" },
  { symbol: "RBC004", name: "RBC Bond Fund", company: "RBC", category: "Fixed Income" },
  
  // CIBC Funds
  { symbol: "CIBC001", name: "CIBC Canadian Equity Fund", company: "CIBC", category: "Equity" },
  { symbol: "CIBC002", name: "CIBC Global Equity Fund", company: "CIBC", category: "Equity" },
  { symbol: "CIBC003", name: "CIBC Balanced Fund", company: "CIBC", category: "Balanced" },
  
  // Scotia Funds
  { symbol: "SCOT001", name: "Scotia Canadian Equity Fund", company: "Scotia", category: "Equity" },
  { symbol: "SCOT002", name: "Scotia Global Equity Fund", company: "Scotia", category: "Equity" },
  { symbol: "SCOT003", name: "Scotia Balanced Fund", company: "Scotia", category: "Balanced" },
];

type Holding = {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
  assetClass: string;
  sector?: string;
  company?: string;
};

type Plan = {
  id: string;
  type: PlanType;
  accountNumber: string;
  marketValue: number;
  costBasis: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Holding[];
};

type Client = {
  id: string;
  name: string;
  accountNumber: string;
  email: string;
  phone: string;
  status: ClientStatus;
  documents: DocumentStatus;
  assets: string;
  plans: Plan[];
  recentActivity: { label: string; timestamp: string }[];
};

const CLIENTS: Client[] = [
  {
    id: "CL-001",
    name: "Smith Family Trust",
    accountNumber: "A-984512",
    email: "smithfamily@clientmail.com",
    phone: "(416) 555-1032",
    status: "Active",
    documents: "Uploaded",
    assets: "$485,230.80",
    plans: [
      {
        id: "P-001",
        type: "RRSP",
        accountNumber: "RRSP-984512",
        marketValue: 285230.80,
        costBasis: 250000.00,
        totalGainLoss: 35230.80,
        totalGainLossPercent: 14.09,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 450,
            price: 98.50,
            marketValue: 44325.00,
            costBasis: 40000.00,
            gainLoss: 4325.00,
            gainLossPercent: 10.81,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 1200,
            price: 32.15,
            marketValue: 38580.00,
            costBasis: 35000.00,
            gainLoss: 3580.00,
            gainLossPercent: 10.23,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
          {
            symbol: "ZAG.TO",
            name: "BMO Aggregate Bond Index ETF",
            shares: 2500,
            price: 15.82,
            marketValue: 39550.00,
            costBasis: 40000.00,
            gainLoss: -450.00,
            gainLossPercent: -1.13,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 150,
            price: 175.50,
            marketValue: 26325.00,
            costBasis: 22000.00,
            gainLoss: 4325.00,
            gainLossPercent: 19.66,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            shares: 80,
            price: 380.25,
            marketValue: 30420.00,
            costBasis: 28000.00,
            gainLoss: 2420.00,
            gainLossPercent: 8.64,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 800,
            price: 78.90,
            marketValue: 63120.00,
            costBasis: 60000.00,
            gainLoss: 3120.00,
            gainLossPercent: 5.20,
            assetClass: "Equity",
            sector: "International Equity",
          },
          {
            symbol: "VCN.TO",
            name: "Vanguard FTSE Canada All Cap Index ETF",
            shares: 600,
            price: 42.75,
            marketValue: 25650.00,
            costBasis: 25000.00,
            gainLoss: 650.00,
            gainLossPercent: 2.60,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
          {
            symbol: "VAB.TO",
            name: "Vanguard Canadian Aggregate Bond Index ETF",
            shares: 1500,
            price: 27.15,
            marketValue: 40725.00,
            costBasis: 40000.00,
            gainLoss: 725.00,
            gainLossPercent: 1.81,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
        ],
      },
      {
        id: "P-002",
        type: "TFSA",
        accountNumber: "TFSA-984512",
        marketValue: 125000.00,
        costBasis: 100000.00,
        totalGainLoss: 25000.00,
        totalGainLossPercent: 25.00,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 600,
            price: 98.50,
            marketValue: 59100.00,
            costBasis: 50000.00,
            gainLoss: 9100.00,
            gainLossPercent: 18.20,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 1500,
            price: 32.15,
            marketValue: 48225.00,
            costBasis: 40000.00,
            gainLoss: 8225.00,
            gainLossPercent: 20.56,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            shares: 120,
            price: 145.30,
            marketValue: 17436.00,
            costBasis: 10000.00,
            gainLoss: 7436.00,
            gainLossPercent: 74.36,
            assetClass: "Equity",
            sector: "Technology",
          },
        ],
      },
      {
        id: "P-003",
        type: "Non-Registered",
        accountNumber: "NR-984512",
        marketValue: 75000.00,
        costBasis: 70000.00,
        totalGainLoss: 5000.00,
        totalGainLossPercent: 7.14,
        holdings: [
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 500,
            price: 78.90,
            marketValue: 39450.00,
            costBasis: 35000.00,
            gainLoss: 4450.00,
            gainLossPercent: 12.71,
            assetClass: "Equity",
            sector: "International Equity",
          },
          {
            symbol: "VCN.TO",
            name: "Vanguard FTSE Canada All Cap Index ETF",
            shares: 800,
            price: 42.75,
            marketValue: 34200.00,
            costBasis: 35000.00,
            gainLoss: -800.00,
            gainLossPercent: -2.29,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
          {
            symbol: "ZAG.TO",
            name: "BMO Aggregate Bond Index ETF",
            shares: 85,
            price: 15.82,
            marketValue: 1350.00,
            costBasis: 0.00,
            gainLoss: 1350.00,
            gainLossPercent: 0.00,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Fund purchase • $25,000", timestamp: "Today • 2:45 PM" },
      { label: "Portfolio review completed", timestamp: "Oct 29 • 9:12 AM" },
    ],
  },
  {
    id: "CL-002",
    name: "Johnson Retirement Fund",
    accountNumber: "A-572341",
    email: "johnson.retire@clientmail.com",
    phone: "(905) 555-4420",
    status: "Active",
    documents: "Required",
    assets: "$320,850.00",
    plans: [
      {
        id: "P-004",
        type: "RRSP",
        accountNumber: "RRSP-572341",
        marketValue: 220850.00,
        costBasis: 200000.00,
        totalGainLoss: 20850.00,
        totalGainLossPercent: 10.43,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 1200,
            price: 98.50,
            marketValue: 118200.00,
            costBasis: 100000.00,
            gainLoss: 18200.00,
            gainLossPercent: 18.20,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 2000,
            price: 32.15,
            marketValue: 64300.00,
            costBasis: 60000.00,
            gainLoss: 4300.00,
            gainLossPercent: 7.17,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
          {
            symbol: "ZAG.TO",
            name: "BMO Aggregate Bond Index ETF",
            shares: 2400,
            price: 15.82,
            marketValue: 37968.00,
            costBasis: 40000.00,
            gainLoss: -2032.00,
            gainLossPercent: -5.08,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
        ],
      },
      {
        id: "P-005",
        type: "RRIF",
        accountNumber: "RRIF-572341",
        marketValue: 100000.00,
        costBasis: 95000.00,
        totalGainLoss: 5000.00,
        totalGainLossPercent: 5.26,
        holdings: [
          {
            symbol: "VAB.TO",
            name: "Vanguard Canadian Aggregate Bond Index ETF",
            shares: 3000,
            price: 27.15,
            marketValue: 81450.00,
            costBasis: 80000.00,
            gainLoss: 1450.00,
            gainLossPercent: 1.81,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 580,
            price: 32.15,
            marketValue: 18647.00,
            costBasis: 15000.00,
            gainLoss: 3647.00,
            gainLossPercent: 24.31,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Dividend distribution • $1,250", timestamp: "Today • 9:00 AM" },
      { label: "Document package sent for signature", timestamp: "Nov 6 • 1:22 PM" },
    ],
  },
  {
    id: "CL-003",
    name: "Williams Education Savings",
    accountNumber: "A-441205",
    email: "williams.edusave@clientmail.com",
    phone: "(519) 555-8832",
    status: "Inactive",
    documents: "Missing",
    assets: "$125,430.50",
    plans: [
      {
        id: "P-006",
        type: "RESP",
        accountNumber: "RESP-441205",
        marketValue: 125430.50,
        costBasis: 100000.00,
        totalGainLoss: 25430.50,
        totalGainLossPercent: 25.43,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 800,
            price: 98.50,
            marketValue: 78800.00,
            costBasis: 60000.00,
            gainLoss: 18800.00,
            gainLossPercent: 31.33,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 1000,
            price: 32.15,
            marketValue: 32150.00,
            costBasis: 30000.00,
            gainLoss: 2150.00,
            gainLossPercent: 7.17,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 185,
            price: 78.90,
            marketValue: 14480.50,
            costBasis: 10000.00,
            gainLoss: 4480.50,
            gainLossPercent: 44.81,
            assetClass: "Equity",
            sector: "International Equity",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Rebalance executed • -$5,500", timestamp: "Yesterday • 3:35 PM" },
      { label: "Compliance reminder issued", timestamp: "Nov 4 • 8:20 AM" },
    ],
  },
  {
    id: "CL-004",
    name: "Brown Emergency Fund",
    accountNumber: "A-228904",
    email: "brown.emergency@clientmail.com",
    phone: "(647) 555-6624",
    status: "Active",
    documents: "Uploaded",
    assets: "$45,200.00",
    plans: [
      {
        id: "P-007",
        type: "TFSA",
        accountNumber: "TFSA-228904",
        marketValue: 45200.00,
        costBasis: 40000.00,
        totalGainLoss: 5200.00,
        totalGainLossPercent: 13.00,
        holdings: [
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 1400,
            price: 32.15,
            marketValue: 45010.00,
            costBasis: 40000.00,
            gainLoss: 5010.00,
            gainLossPercent: 12.53,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Deposit posted • $10,000", timestamp: "Yesterday • 11:15 AM" },
      { label: "Annual review scheduled", timestamp: "Nov 2 • 4:05 PM" },
    ],
  },
  {
    id: "CL-005",
    name: "Evergreen Wealth Partners",
    accountNumber: "A-663920",
    email: "evergreen.wealth@clientmail.com",
    phone: "(905) 555-1188",
    status: "Prospect",
    documents: "Required",
    assets: "$612,450.00",
    plans: [
      {
        id: "P-008",
        type: "RRSP",
        accountNumber: "RRSP-663920",
        marketValue: 300000.00,
        costBasis: 280000.00,
        totalGainLoss: 20000.00,
        totalGainLossPercent: 7.14,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 2000,
            price: 98.50,
            marketValue: 197000.00,
            costBasis: 180000.00,
            gainLoss: 17000.00,
            gainLossPercent: 9.44,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 3200,
            price: 32.15,
            marketValue: 102880.00,
            costBasis: 100000.00,
            gainLoss: 2880.00,
            gainLossPercent: 2.88,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
      {
        id: "P-009",
        type: "TFSA",
        accountNumber: "TFSA-663920",
        marketValue: 95000.00,
        costBasis: 87500.00,
        totalGainLoss: 7500.00,
        totalGainLossPercent: 8.57,
        holdings: [
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 1200,
            price: 78.90,
            marketValue: 94680.00,
            costBasis: 87500.00,
            gainLoss: 7180.00,
            gainLossPercent: 8.21,
            assetClass: "Equity",
            sector: "International Equity",
          },
        ],
      },
      {
        id: "P-010",
        type: "Non-Registered",
        accountNumber: "NR-663920",
        marketValue: 150000.00,
        costBasis: 140000.00,
        totalGainLoss: 10000.00,
        totalGainLossPercent: 7.14,
        holdings: [
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 500,
            price: 175.50,
            marketValue: 87750.00,
            costBasis: 80000.00,
            gainLoss: 7750.00,
            gainLossPercent: 9.69,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            shares: 150,
            price: 380.25,
            marketValue: 57037.50,
            costBasis: 55000.00,
            gainLoss: 2037.50,
            gainLossPercent: 3.70,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            shares: 35,
            price: 145.30,
            marketValue: 5085.50,
            costBasis: 5000.00,
            gainLoss: 85.50,
            gainLossPercent: 1.71,
            assetClass: "Equity",
            sector: "Technology",
          },
        ],
      },
      {
        id: "P-011",
        type: "LIRA",
        accountNumber: "LIRA-663920",
        marketValue: 67450.00,
        costBasis: 65000.00,
        totalGainLoss: 2450.00,
        totalGainLossPercent: 3.77,
        holdings: [
          {
            symbol: "VAB.TO",
            name: "Vanguard Canadian Aggregate Bond Index ETF",
            shares: 2480,
            price: 27.15,
            marketValue: 67332.00,
            costBasis: 65000.00,
            gainLoss: 2332.00,
            gainLossPercent: 3.59,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Portfolio switch order submitted", timestamp: "Today • 3:05 PM" },
      { label: "Questionnaire reviewed", timestamp: "Nov 7 • 1:48 PM" },
    ],
  },
  {
    id: "CL-006",
    name: "Aurora RESP",
    accountNumber: "A-774512",
    email: "aurora.resp@clientmail.com",
    phone: "(613) 555-4410",
    status: "Active",
    documents: "Uploaded",
    assets: "$89,300.00",
    plans: [
      {
        id: "P-012",
        type: "RESP",
        accountNumber: "RESP-774512",
        marketValue: 89300.00,
        costBasis: 75000.00,
        totalGainLoss: 14300.00,
        totalGainLossPercent: 19.07,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 600,
            price: 98.50,
            marketValue: 59100.00,
            costBasis: 50000.00,
            gainLoss: 9100.00,
            gainLossPercent: 18.20,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 940,
            price: 32.15,
            marketValue: 30221.00,
            costBasis: 25000.00,
            gainLoss: 5221.00,
            gainLossPercent: 20.88,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Contribution posted • $6,000", timestamp: "Nov 6 • 9:44 AM" },
      { label: "Beneficiary update approved", timestamp: "Nov 4 • 5:30 PM" },
    ],
  },
  {
    id: "CL-007",
    name: "Harper Estate Planning",
    accountNumber: "A-990214",
    email: "harper.estate@clientmail.com",
    phone: "(416) 555-7712",
    status: "Inactive",
    documents: "Missing",
    assets: "$742,900.00",
    plans: [
      {
        id: "P-013",
        type: "RRSP",
        accountNumber: "RRSP-990214",
        marketValue: 400000.00,
        costBasis: 350000.00,
        totalGainLoss: 50000.00,
        totalGainLossPercent: 14.29,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 2500,
            price: 98.50,
            marketValue: 246250.00,
            costBasis: 200000.00,
            gainLoss: 46250.00,
            gainLossPercent: 23.13,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 4780,
            price: 32.15,
            marketValue: 153677.00,
            costBasis: 150000.00,
            gainLoss: 3677.00,
            gainLossPercent: 2.45,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
      {
        id: "P-014",
        type: "TFSA",
        accountNumber: "TFSA-990214",
        marketValue: 95000.00,
        costBasis: 87500.00,
        totalGainLoss: 7500.00,
        totalGainLossPercent: 8.57,
        holdings: [
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 1200,
            price: 78.90,
            marketValue: 94680.00,
            costBasis: 87500.00,
            gainLoss: 7180.00,
            gainLossPercent: 8.21,
            assetClass: "Equity",
            sector: "International Equity",
          },
        ],
      },
      {
        id: "P-015",
        type: "Non-Registered",
        accountNumber: "NR-990214",
        marketValue: 200000.00,
        costBasis: 180000.00,
        totalGainLoss: 20000.00,
        totalGainLossPercent: 11.11,
        holdings: [
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 800,
            price: 175.50,
            marketValue: 140400.00,
            costBasis: 120000.00,
            gainLoss: 20400.00,
            gainLossPercent: 17.00,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            shares: 150,
            price: 380.25,
            marketValue: 57037.50,
            costBasis: 60000.00,
            gainLoss: -2962.50,
            gainLossPercent: -4.94,
            assetClass: "Equity",
            sector: "Technology",
          },
        ],
      },
      {
        id: "P-016",
        type: "RRIF",
        accountNumber: "RRIF-990214",
        marketValue: 30000.00,
        costBasis: 28000.00,
        totalGainLoss: 2000.00,
        totalGainLossPercent: 7.14,
        holdings: [
          {
            symbol: "VAB.TO",
            name: "Vanguard Canadian Aggregate Bond Index ETF",
            shares: 1105,
            price: 27.15,
            marketValue: 30000.75,
            costBasis: 28000.00,
            gainLoss: 2000.75,
            gainLossPercent: 7.15,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
        ],
      },
      {
        id: "P-017",
        type: "LIRA",
        accountNumber: "LIRA-990214",
        marketValue: 17900.00,
        costBasis: 17500.00,
        totalGainLoss: 400.00,
        totalGainLossPercent: 2.29,
        holdings: [
          {
            symbol: "ZAG.TO",
            name: "BMO Aggregate Bond Index ETF",
            shares: 1130,
            price: 15.82,
            marketValue: 17876.60,
            costBasis: 17500.00,
            gainLoss: 376.60,
            gainLossPercent: 2.15,
            assetClass: "Fixed Income",
            sector: "Bonds",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Suitability review overdue", timestamp: "Nov 5 • 8:00 AM" },
      { label: "Advisory fee processed • -$325", timestamp: "Nov 3 • 1:10 PM" },
    ],
  },
  {
    id: "CL-008",
    name: "Maple Leaf Holdings",
    accountNumber: "A-552031",
    email: "maple.holdings@clientmail.com",
    phone: "(780) 555-2020",
    status: "Active",
    documents: "Required",
    assets: "$1,102,340.00",
    plans: [
      {
        id: "P-018",
        type: "RRSP",
        accountNumber: "RRSP-552031",
        marketValue: 600000.00,
        costBasis: 550000.00,
        totalGainLoss: 50000.00,
        totalGainLossPercent: 9.09,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 4000,
            price: 98.50,
            marketValue: 394000.00,
            costBasis: 360000.00,
            gainLoss: 34000.00,
            gainLossPercent: 9.44,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 6400,
            price: 32.15,
            marketValue: 205760.00,
            costBasis: 190000.00,
            gainLoss: 15760.00,
            gainLossPercent: 8.29,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
      {
        id: "P-019",
        type: "TFSA",
        accountNumber: "TFSA-552031",
        marketValue: 95000.00,
        costBasis: 87500.00,
        totalGainLoss: 7500.00,
        totalGainLossPercent: 8.57,
        holdings: [
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 1200,
            price: 78.90,
            marketValue: 94680.00,
            costBasis: 87500.00,
            gainLoss: 7180.00,
            gainLossPercent: 8.21,
            assetClass: "Equity",
            sector: "International Equity",
          },
        ],
      },
      {
        id: "P-020",
        type: "Non-Registered",
        accountNumber: "NR-552031",
        marketValue: 407340.00,
        costBasis: 380000.00,
        totalGainLoss: 27340.00,
        totalGainLossPercent: 7.19,
        holdings: [
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 1200,
            price: 175.50,
            marketValue: 210600.00,
            costBasis: 190000.00,
            gainLoss: 20600.00,
            gainLossPercent: 10.84,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            shares: 400,
            price: 380.25,
            marketValue: 152100.00,
            costBasis: 150000.00,
            gainLoss: 2100.00,
            gainLossPercent: 1.40,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            shares: 300,
            price: 145.30,
            marketValue: 43590.00,
            costBasis: 40000.00,
            gainLoss: 3590.00,
            gainLossPercent: 8.98,
            assetClass: "Equity",
            sector: "Technology",
          },
          {
            symbol: "NVDA",
            name: "NVIDIA Corporation",
            shares: 50,
            price: 1210.50,
            marketValue: 60525.00,
            costBasis: 0.00,
            gainLoss: 60525.00,
            gainLossPercent: 0.00,
            assetClass: "Equity",
            sector: "Technology",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Redemption request • -$18,600", timestamp: "Nov 5 • 2:15 PM" },
      { label: "Document update requested", timestamp: "Nov 2 • 10:05 AM" },
    ],
  },
  {
    id: "CL-009",
    name: "Sunrise Portfolio Group",
    accountNumber: "A-336781",
    email: "sunrise.portfolio@clientmail.com",
    phone: "(587) 555-9094",
    status: "Active",
    documents: "Uploaded",
    assets: "$389,780.00",
    plans: [
      {
        id: "P-021",
        type: "RRSP",
        accountNumber: "RRSP-336781",
        marketValue: 250000.00,
        costBasis: 230000.00,
        totalGainLoss: 20000.00,
        totalGainLossPercent: 8.70,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 2000,
            price: 98.50,
            marketValue: 197000.00,
            costBasis: 180000.00,
            gainLoss: 17000.00,
            gainLossPercent: 9.44,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 1650,
            price: 32.15,
            marketValue: 53047.50,
            costBasis: 50000.00,
            gainLoss: 3047.50,
            gainLossPercent: 6.10,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
      {
        id: "P-022",
        type: "TFSA",
        accountNumber: "TFSA-336781",
        marketValue: 139780.00,
        costBasis: 130000.00,
        totalGainLoss: 9780.00,
        totalGainLossPercent: 7.52,
        holdings: [
          {
            symbol: "XAW.TO",
            name: "iShares Core MSCI All Country World ex Canada Index ETF",
            shares: 1770,
            price: 78.90,
            marketValue: 139653.00,
            costBasis: 130000.00,
            gainLoss: 9653.00,
            gainLossPercent: 7.43,
            assetClass: "Equity",
            sector: "International Equity",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Switch order executed • -$12,750", timestamp: "Nov 4 • 4:22 PM" },
      { label: "Document confirmation logged", timestamp: "Nov 1 • 2:40 PM" },
    ],
  },
  {
    id: "CL-010",
    name: "Cedar Ridge Advisory",
    accountNumber: "A-884512",
    email: "cedar.ridge@clientmail.com",
    phone: "(431) 555-0055",
    status: "Prospect",
    documents: "Required",
    assets: "$214,600.00",
    plans: [
      {
        id: "P-023",
        type: "RRSP",
        accountNumber: "RRSP-884512",
        marketValue: 214600.00,
        costBasis: 200000.00,
        totalGainLoss: 14600.00,
        totalGainLossPercent: 7.30,
        holdings: [
          {
            symbol: "VFV.TO",
            name: "Vanguard S&P 500 Index ETF",
            shares: 1500,
            price: 98.50,
            marketValue: 147750.00,
            costBasis: 130000.00,
            gainLoss: 17750.00,
            gainLossPercent: 13.65,
            assetClass: "Equity",
            sector: "Diversified",
          },
          {
            symbol: "XIC.TO",
            name: "iShares Core S&P/TSX Capped Composite Index ETF",
            shares: 2080,
            price: 32.15,
            marketValue: 66872.00,
            costBasis: 70000.00,
            gainLoss: -3128.00,
            gainLossPercent: -4.47,
            assetClass: "Equity",
            sector: "Canadian Equity",
          },
        ],
      },
    ],
    recentActivity: [
      { label: "Document upload requested", timestamp: "Nov 7 • 5:55 PM" },
      { label: "Initial client onboarding started", timestamp: "Nov 6 • 10:30 AM" },
    ],
  },
];

const statusBadgeStyles: Record<ClientStatus, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
  Prospect: "bg-blue-100 text-blue-700",
};

const docBadgeStyles: Record<DocumentStatus, string> = {
  Uploaded: "bg-green-100 text-green-700",
  Required: "bg-yellow-100 text-yellow-700",
  Missing: "bg-red-100 text-red-700",
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showUploadDocs, setShowUploadDocs] = useState(false);
  const [showBuyUnits, setShowBuyUnits] = useState(false);
  const [showSellUnits, setShowSellUnits] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showSellOrderConfirmation, setShowSellOrderConfirmation] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<{ holding: Holding; plan: Plan } | null>(null);
  const [buyOrderData, setBuyOrderData] = useState<{
    investmentAmount: string;
    units: string;
    estimatedCost: number;
    unitsToPurchase: number;
  }>({
    investmentAmount: "",
    units: "",
    estimatedCost: 0,
    unitsToPurchase: 0,
  });
  const [sellOrderData, setSellOrderData] = useState<{
    units: string;
    dollarAmount: string;
    estimatedProceeds: number;
    unitsToSell: number;
  }>({
    units: "",
    dollarAmount: "",
    estimatedProceeds: 0,
    unitsToSell: 0,
  });
  const [orderConfirmationData, setOrderConfirmationData] = useState<{
    symbol: string;
    name: string;
    units: number;
    price: number;
    totalCost: number;
  } | null>(null);
  const [sellOrderConfirmationData, setSellOrderConfirmationData] = useState<{
    symbol: string;
    name: string;
    units: number;
    price: number;
    totalProceeds: number;
  } | null>(null);
  const [showSwitchFund, setShowSwitchFund] = useState(false);
  const [showConvertFund, setShowConvertFund] = useState(false);
  const [isConvertMode, setIsConvertMode] = useState(false);
  const [showSwitchConfirmation, setShowSwitchConfirmation] = useState(false);
  const [showConvertConfirmation, setShowConvertConfirmation] = useState(false);
  const [switchData, setSwitchData] = useState<{
    units: string;
    selectedCompany: string;
    selectedFund: string;
    selectedFundSymbol?: string;
    estimatedValue: number;
  }>({
    units: "",
    selectedCompany: "",
    selectedFund: "",
    selectedFundSymbol: "",
    estimatedValue: 0,
  });
  const [convertData, setConvertData] = useState<{
    units: string;
    selectedCompany: string;
    selectedFund: string;
    selectedFundSymbol?: string;
    estimatedValue: number;
  }>({
    units: "",
    selectedCompany: "",
    selectedFund: "",
    selectedFundSymbol: "",
    estimatedValue: 0,
  });
  const [fundSearchResults, setFundSearchResults] = useState<Fund[]>([]);
  const [showFundSuggestions, setShowFundSuggestions] = useState(false);
  const [switchConfirmationData, setSwitchConfirmationData] = useState<{
    fromFund: string;
    toFund: string;
    units: number;
    estimatedValue: number;
  } | null>(null);
  const [convertConfirmationData, setConvertConfirmationData] = useState<{
    fromFund: string;
    toFund: string;
    units: number;
    estimatedValue: number;
  } | null>(null);
  const [editFormValues, setEditFormValues] = useState({
    // Personal Information
    name: "",
    accountNumber: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    ssnTin: "",
    passport: "",
    occupation: "",
    employmentStatus: "",
    maritalStatus: "",
    dependents: "",
    healthConsiderations: "",
    lifeStage: "",
    taxStatus: "",
    // Financial Information
    annualIncome: "",
    expectedFutureIncome: "",
    netWorth: "",
    assets: "",
    liabilities: "",
    liquidityNeeds: "",
    cashFlowPatterns: "",
    investableFunds: "",
    // Investment Objectives
    primaryObjective: "",
    timeHorizon: "",
    assetAllocation: "",
    diversificationStrategy: "",
    rebalancingRules: "",
    investmentStrategy: "",
    // Risk Tolerance
    riskProfile: "",
    riskAttitude: "",
    investmentExperience: "",
    yearsInvesting: "",
    knowledgeLevel: "",
    // Beneficiaries
    status: "Prospect" as ClientStatus,
    beneficiary: "",
    contingentBeneficiary: "",
    accountType: "",
    accountOwnership: "",
    relationshipRoles: "",
    clientType: "",
  });
  const [statusFilter, setStatusFilter] = useState<Record<ClientStatus, boolean>>({
    Active: false,
    Inactive: false,
    Prospect: false,
  });
  const [docFilter, setDocFilter] = useState<Record<DocumentStatus, boolean>>({
    Uploaded: false,
    Required: false,
    Missing: false,
  });
  const [formValues, setFormValues] = useState({
    name: "",
    accountNumber: "",
    email: "",
    phone: "",
    status: "Prospect" as ClientStatus,
    beneficiary: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());

  const activeStatusFilters = Object.entries(statusFilter)
    .filter(([, checked]) => checked)
    .map(([status]) => status as ClientStatus);
  const activeDocFilters = Object.entries(docFilter)
    .filter(([, checked]) => checked)
    .map(([status]) => status as DocumentStatus);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        !searchTerm ||
        [
          client.name,
          client.accountNumber,
          client.email,
          client.status,
          client.documents,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        activeStatusFilters.length === 0 ||
        activeStatusFilters.includes(client.status);

      const matchesDocs =
        activeDocFilters.length === 0 ||
        activeDocFilters.includes(client.documents);

      return matchesSearch && matchesStatus && matchesDocs;
    });
    }, [clients, searchTerm, activeStatusFilters, activeDocFilters]);

  const toggleStatusFilter = (status: ClientStatus) =>
    setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));

  const toggleDocFilter = (status: DocumentStatus) =>
    setDocFilter((prev) => ({ ...prev, [status]: !prev[status] }));

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    if (Array.isArray(client.plans)) {
      setExpandedPlans(new Set(client.plans.map(p => p.id)));
    } else {
      setExpandedPlans(new Set());
    }
    setShowDetails(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditFormValues({
      // Personal Information
      name: client.name,
      accountNumber: client.accountNumber,
      email: client.email,
      phone: client.phone,
      dateOfBirth: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      ssnTin: "",
      passport: "",
      occupation: "",
      employmentStatus: "",
      maritalStatus: "",
      dependents: "",
      healthConsiderations: "",
      lifeStage: "",
      taxStatus: "",
      // Financial Information
      annualIncome: "",
      expectedFutureIncome: "",
      netWorth: "",
      assets: "",
      liabilities: "",
      liquidityNeeds: "",
      cashFlowPatterns: "",
      investableFunds: "",
      // Investment Objectives
      primaryObjective: "",
      timeHorizon: "",
      assetAllocation: "",
      diversificationStrategy: "",
      rebalancingRules: "",
      investmentStrategy: "",
      // Risk Tolerance
      riskProfile: "",
      riskAttitude: "",
      investmentExperience: "",
      yearsInvesting: "",
      knowledgeLevel: "",
      // Beneficiaries
      status: client.status,
      beneficiary: "",
      contingentBeneficiary: "",
      accountType: "",
      accountOwnership: "",
      relationshipRoles: "",
      clientType: "",
    });
    setShowEditClient(true);
  };

  const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedClient) return;

    if (!editFormValues.name.trim() || !editFormValues.accountNumber.trim()) {
      setFormError("Client name and account number are required.");
      return;
    }

    setClients((prev) =>
      prev.map((client) =>
        client.id === selectedClient.id
          ? {
              ...client,
              name: editFormValues.name,
              accountNumber: editFormValues.accountNumber,
              email: editFormValues.email || "Not provided",
              phone: editFormValues.phone || "Not provided",
              status: editFormValues.status,
            }
          : client
      )
    );

    // Update selected client if it's the one being edited
    if (selectedClient) {
      setSelectedClient({
        ...selectedClient,
        name: editFormValues.name,
        accountNumber: editFormValues.accountNumber,
        email: editFormValues.email || "Not provided",
        phone: editFormValues.phone || "Not provided",
        status: editFormValues.status,
      });
    }

    setShowEditClient(false);
    setFormError(null);
  };

  const togglePlan = (planId: string) => {
    setExpandedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };

  // Helper function to extract company from fund name
  const getCompanyFromFundName = (fundName: string): string => {
    // First try to find in fund database
    const fund = FUND_DATABASE.find(f => 
      f.name.toUpperCase() === fundName.toUpperCase() ||
      fundName.toUpperCase().includes(f.name.toUpperCase()) ||
      f.name.toUpperCase().includes(fundName.toUpperCase())
    );
    if (fund) return fund.company;
    
    // Fallback to pattern matching
    const name = fundName.toUpperCase();
    if (name.includes("FIDELITY")) return "Fidelity";
    if (name.includes("TD")) return "TD Asset Management";
    if (name.includes("VANGUARD")) return "Vanguard";
    if (name.includes("ISHARES")) return "iShares";
    if (name.includes("BMO")) return "BMO";
    if (name.includes("RBC")) return "RBC";
    if (name.includes("CIBC")) return "CIBC";
    if (name.includes("SCOTIA")) return "Scotia";
    // Default extraction - try to get first word or common pattern
    const words = fundName.split(" ");
    return words[0] || "Unknown";
  };

  // Search funds in database
  const searchFunds = (query: string): Fund[] => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return FUND_DATABASE.filter(fund =>
      fund.name.toLowerCase().includes(lowerQuery) ||
      fund.symbol.toLowerCase().includes(lowerQuery) ||
      fund.company.toLowerCase().includes(lowerQuery) ||
      (fund.category && fund.category.toLowerCase().includes(lowerQuery))
    ).slice(0, 10); // Limit to 10 results
  };

  // Get company from fund search
  const getCompanyFromFundSearch = (fundName: string): string | null => {
    const fund = FUND_DATABASE.find(f => 
      f.name.toUpperCase() === fundName.toUpperCase()
    );
    return fund ? fund.company : null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateTotalHoldings = (plans: Plan[]) => {
    const totalMarketValue = plans.reduce((sum, plan) => sum + plan.marketValue, 0);
    const totalCostBasis = plans.reduce((sum, plan) => sum + plan.costBasis, 0);
    const totalGainLoss = totalMarketValue - totalCostBasis;
    const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
    return { totalMarketValue, totalCostBasis, totalGainLoss, totalGainLossPercent };
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((client) => client.id !== clientId));
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
      setShowDetails(false);
    }
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      accountNumber: "",
      email: "",
      phone: "",
      status: "Prospect" as ClientStatus,
      beneficiary: "",
    });
    setFormError(null);
  };

  const handleAddClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.name.trim() || !formValues.accountNumber.trim()) {
      setFormError("Client name and account number are required.");
      return;
    }

    const newClient: Client = {
      id: `CL-${(clients.length + 1).toString().padStart(3, "0")}`,
      name: formValues.name,
      accountNumber: formValues.accountNumber,
      email: formValues.email || "Not provided",
      phone: formValues.phone || "Not provided",
      status: formValues.status,
      documents: "Required",
      assets: "$0.00",
      plans: [],
      recentActivity: [{ label: "Client record created", timestamp: "Just now" }],
    };

    setClients((prev) => [newClient, ...prev]);
    setShowAddClient(false);
    resetForm();
  };

  return (
    <>
      <PageLayout title="">
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Client Directory
                </CardTitle>

                <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-start lg:justify-end">
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by client, account, or status"
                    className="text-sm lg:w-72 xl:w-96"
                  />

                  <div className="flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[150px] justify-between text-sm font-normal"
                        >
                          {(() => {
                            const selectedCount = Object.values(statusFilter).filter(Boolean).length;
                            if (selectedCount === 0) return "All Statuses";
                            if (selectedCount === 1) {
                              return Object.entries(statusFilter).find(([, checked]) => checked)?.[0] || "All Statuses";
                            }
                            return `${selectedCount} selected`;
                          })()}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[150px] p-2" align="start">
                        <div className="space-y-1">
                          {(["Active", "Inactive", "Prospect"] as ClientStatus[]).map(
                        (status) => (
                          <label
                            key={status}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded cursor-pointer"
                          >
                            <Checkbox
                                  checked={statusFilter[status]}
                                  onCheckedChange={() => toggleStatusFilter(status)}
                                  className="h-4 w-4"
                            />
                            <span>{status}</span>
                          </label>
                        )
                      )}
                    </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[150px] justify-between text-sm font-normal"
                        >
                          {(() => {
                            const selectedCount = Object.values(docFilter).filter(Boolean).length;
                            if (selectedCount === 0) return "All Documents";
                            if (selectedCount === 1) {
                              return Object.entries(docFilter).find(([, checked]) => checked)?.[0] || "All Documents";
                            }
                            return `${selectedCount} selected`;
                          })()}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[150px] p-2" align="start">
                        <div className="space-y-1">
                          {(["Uploaded", "Required", "Missing"] as DocumentStatus[]).map(
                            (status) => (
                        <label
                          key={status}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <Checkbox
                            checked={docFilter[status]}
                            onCheckedChange={() => toggleDocFilter(status)}
                                  className="h-4 w-4"
                          />
                          <span>{status}</span>
                        </label>
                            )
                          )}
                    </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button onClick={() => setShowAddClient(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading clients…
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="py-16 text-center">
                  <h3 className="text-base font-semibold text-gray-900">
                    No clients found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {clients.length === 0
                      ? 'No clients yet. Click “Add Client” to create your first record.'
                      : "No clients match your filters. Try adjusting your search."}
                  </p>
                  <Button onClick={() => setShowAddClient(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Account #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>AUA</TableHead>
                        <TableHead>Plans</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {client.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {client.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {client.accountNumber}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeStyles[client.status]}`}
                            >
                              {client.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${docBadgeStyles[client.documents]}`}
                            >
                              {client.documents}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700">
                            {client.assets}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {client.plans.length} plan(s)
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-300 h-8 w-8 p-0"
                                onClick={() => handleViewClient(client)}
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-300 h-8 w-8 p-0"
                                title="Edit"
                                onClick={() => handleEditClient(client)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-300 h-8 w-8 p-0"
                                title="Upload Docs"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowUploadDocs(true);
                                }}
                              >
                                <FileUp className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageLayout>

      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="right" className="!w-[50vw] !max-w-[50vw] overflow-y-auto bg-gray-50">
          {selectedClient ? (
            <>
              <SheetHeader className="pb-4 border-b border-gray-200">
                <SheetTitle className="text-xl font-semibold text-gray-900">
                  {selectedClient.name}
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-600 mt-1">
                  Account {selectedClient.accountNumber}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                {/* Top Section: Profile Summary and Total Holdings Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Profile Summary */}
                <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        Profile Summary
                      </CardTitle>
                  </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge
                          className={statusBadgeStyles[selectedClient.status]}
                        >
                          {selectedClient.status}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300">
                        Documents: {selectedClient.documents}
                      </Badge>
                        <Badge variant="outline" className="border-gray-300">
                          Plans: {Array.isArray(selectedClient.plans) ? selectedClient.plans.length : 0}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300">
                          AUA: {selectedClient.assets}
                        </Badge>
                    </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Account ID
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                        {selectedClient.accountNumber}
                          </span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Email
                          </span>
                          <span className="text-xs text-gray-900">
                            {selectedClient.email}
                          </span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Phone
                          </span>
                          <span className="text-sm text-gray-900">
                            {selectedClient.phone}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Account Holdings */}
                  {Array.isArray(selectedClient.plans) && selectedClient.plans.length > 0 && (() => {
                    const totals = calculateTotalHoldings(selectedClient.plans);
                    return (
                      <Card className="border border-gray-200 shadow-sm bg-white">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-semibold text-gray-900">
                            Total Account Holdings
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            Combined value across all accounts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm text-gray-600">Market Value</span>
                            <span className="text-2xl font-semibold text-gray-900">
                              {formatCurrency(totals.totalMarketValue)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Total Gain/Loss</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(totals.totalCostBasis)} invested
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {totals.totalGainLoss >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`text-sm font-semibold ${totals.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(totals.totalGainLoss)} ({totals.totalGainLoss >= 0 ? '+' : ''}{totals.totalGainLossPercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </div>

                {/* Plans & Holdings */}
                {Array.isArray(selectedClient.plans) && selectedClient.plans.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">Accounts & Holdings</h3>
                    {selectedClient.plans.map((plan) => {
                    const isExpanded = expandedPlans.has(plan.id);
                    return (
                      <Card key={plan.id} className="border border-gray-200 shadow-sm bg-white">
                        <CardHeader 
                          className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => togglePlan(plan.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                {plan.type}
                                <span className="text-xs font-normal text-gray-500">
                                  {plan.accountNumber}
                                </span>
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-500 mt-1">
                                {plan.holdings.length} holding{plan.holdings.length !== 1 ? 's' : ''}
                              </CardDescription>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          {!isExpanded && (
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Market Value</span>
                                <span className="text-lg font-semibold text-gray-900">
                                  {formatCurrency(plan.marketValue)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <span className={`text-[11px] font-medium ${plan.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(plan.totalGainLoss)} ({plan.totalGainLoss >= 0 ? '+' : ''}{plan.totalGainLossPercent.toFixed(2)}%)
                                  </span>
                                  {plan.totalGainLoss >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardHeader>
                        {isExpanded && (
                          <CardContent className="pt-0 pb-2">
                            <div className="overflow-x-auto">
                              <Table className="text-xs">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-sm">Symbol</TableHead>
                                    <TableHead className="text-sm">Product</TableHead>
                                    <TableHead className="text-sm text-right">Shares</TableHead>
                                    <TableHead className="text-sm text-right">Price</TableHead>
                                    <TableHead className="text-sm text-right">Market Value</TableHead>
                                    <TableHead className="text-sm text-center">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {plan.holdings.map((holding, idx) => (
                                    <TableRow key={idx} className="hover:bg-gray-50">
                                      <TableCell className="font-medium text-sm">
                                        {holding.symbol}
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-700">
                                        <div className="flex flex-col">
                                          <span>{holding.name}</span>
                                          <span className="text-xs text-gray-500">
                                            {holding.assetClass} {holding.sector && `• ${holding.sector}`}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-right text-gray-700">
                                        {holding.shares.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-sm text-right text-gray-700">
                                        <div className="flex flex-col items-end">
                                          <span>{formatCurrency(holding.price)}</span>
                                          <span className={`text-[10px] leading-tight ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ({holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%)
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-right font-medium text-gray-900">
                                        <div className="flex flex-col items-end">
                                          <span>{formatCurrency(holding.marketValue)}</span>
                                          <span className={`text-[10px] leading-tight ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {holding.gainLoss >= 0 ? '+' : ''}{formatCurrency(holding.gainLoss)}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                                            title="Add"
                                            onClick={() => {
                                              setSelectedHolding({ holding, plan });
                                              setShowBuyUnits(true);
                                              setBuyOrderData({
                                                investmentAmount: "",
                                                units: "",
                                                estimatedCost: 0,
                                                unitsToPurchase: 0,
                                              });
                                            }}
                                          >
                                            <Plus className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                                            title="Remove"
                                            onClick={() => {
                                              setSelectedHolding({ holding, plan });
                                              setShowSellUnits(true);
                                              setSellOrderData({
                                                units: "",
                                                dollarAmount: "",
                                                estimatedProceeds: 0,
                                                unitsToSell: 0,
                                              });
                                            }}
                                          >
                                            <Minus className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                                            title="Switch"
                                            onClick={() => {
                                              setSelectedHolding({ holding, plan });
                                              const currentCompany = getCompanyFromFundName(holding.name);
                                              setIsConvertMode(false);
                                              setShowSwitchFund(true);
                                              setSwitchData({
                                                units: "",
                                                selectedCompany: currentCompany,
                                                selectedFund: "",
                                                selectedFundSymbol: "",
                                                estimatedValue: 0,
                                              });
                                              setConvertData({
                                                units: "",
                                                selectedCompany: "",
                                                selectedFund: "",
                                                selectedFundSymbol: "",
                                                estimatedValue: 0,
                                              });
                                              setFundSearchResults([]);
                                              setShowFundSuggestions(false);
                                            }}
                                          >
                                            <ArrowLeftRight className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* Plan Summary */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-1">Net Invested</p>
                                  <p className="text-base font-semibold text-gray-900">
                                    {formatCurrency(plan.costBasis)}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-1">Total Market Value</p>
                                  <p className="text-base font-semibold text-gray-900">
                                    {formatCurrency(plan.marketValue)}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-1">Total Book Value</p>
                                  <p className="text-base font-semibold text-gray-900">
                                    {formatCurrency(plan.costBasis)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Trust Account Cards */}
                            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                              <Card className="border border-blue-200 bg-blue-50">
                                <CardContent className="pt-2.5 pb-2.5">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-medium text-gray-700">Trust Account CAD</span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {formatCurrency(0)}
                                    </div>
                                    <div className="flex gap-2 text-[9px] text-gray-600 pt-1 border-t border-blue-200">
                                      <span>Settled: {formatCurrency(0)}</span>
                                      <span>Unsettled: {formatCurrency(0)}</span>
                                    </div>
                    </div>
                  </CardContent>
                </Card>

                              <Card className="border border-blue-200 bg-blue-50">
                                <CardContent className="pt-2.5 pb-2.5">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-medium text-gray-700">Trust Account USD</span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {formatCurrency(0)}
                                    </div>
                                    <div className="flex gap-2 text-[9px] text-gray-600 pt-1 border-t border-blue-200">
                                      <span>Settled: {formatCurrency(0)}</span>
                                      <span>Unsettled: {formatCurrency(0)}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                  </div>
                ) : (
                <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardContent className="py-8 text-center">
                      <p className="text-sm text-gray-500">No accounts or holdings available</p>
                    </CardContent>
                  </Card>
                )}

                {/* Documents & Recent Activity Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Documents & Uploads */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        Documents & Uploads
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Submit suitability and supporting files.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50">
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        Drag & drop files here
                      </p>
                        <p className="text-xs text-gray-500 mt-1">
                        PDF, DOCX, JPG up to 25 MB
                      </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                        Browse files
                      </Button>
                    </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-gray-300 text-xs"
                      >
                      View existing documents
                    </Button>
                  </CardContent>
                </Card>

                  {/* Recent Activity */}
                <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                      Latest trades, deposits, and compliance updates.
                      </CardDescription>
                  </CardHeader>
                    <CardContent className="pt-3">
                      <ScrollArea className="h-48 pr-2">
                        <div className="space-y-2">
                        {selectedClient.recentActivity.map((item, index) => (
                          <div
                            key={index}
                              className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:border-gray-200 transition-colors"
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {item.label}
                            </p>
                              <span className="text-xs text-gray-500 mt-1 block">
                              {item.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No client selected</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Client Sheet */}
      <Sheet open={showEditClient} onOpenChange={setShowEditClient}>
        <SheetContent side="right" className="!w-[50vw] !max-w-[50vw] overflow-y-auto bg-gray-50">
          {selectedClient ? (
            <form onSubmit={handleSaveEdit}>
              <SheetHeader className="pb-4 border-b border-gray-200">
                <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Pencil className="h-5 w-5" />
                  Edit Client
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                <div className="mt-6 space-y-5">
                  {/* 1. Personal and Demographic Information */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        1. Personal and Demographic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-name"
                          value={editFormValues.name}
                          onChange={(e) => setEditFormValues({ ...editFormValues, name: e.target.value })}
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-account" className="text-sm font-medium text-gray-700">
                          Account Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-account"
                          value={editFormValues.accountNumber}
                          onChange={(e) => setEditFormValues({ ...editFormValues, accountNumber: e.target.value })}
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editFormValues.email}
                            onChange={(e) => setEditFormValues({ ...editFormValues, email: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">
                            Phone
                          </Label>
                          <Input
                            id="edit-phone"
                            type="tel"
                            value={editFormValues.phone}
                            onChange={(e) => setEditFormValues({ ...editFormValues, phone: e.target.value })}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-dob" className="text-sm font-medium text-gray-700">
                            Date of Birth
                          </Label>
                          <Input
                            id="edit-dob"
                            type="date"
                            value={editFormValues.dateOfBirth}
                            onChange={(e) => setEditFormValues({ ...editFormValues, dateOfBirth: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-marital" className="text-sm font-medium text-gray-700">
                            Marital Status
                          </Label>
                          <Select
                            value={editFormValues.maritalStatus}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, maritalStatus: value })}
                          >
                            <SelectTrigger id="edit-marital" className="w-full">
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                              <SelectItem value="Common-Law">Common-Law</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-address" className="text-sm font-medium text-gray-700">
                          Address
                        </Label>
                        <Input
                          id="edit-address"
                          value={editFormValues.address}
                          onChange={(e) => setEditFormValues({ ...editFormValues, address: e.target.value })}
                          className="w-full"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-city" className="text-sm font-medium text-gray-700">
                            City
                          </Label>
                          <Input
                            id="edit-city"
                            value={editFormValues.city}
                            onChange={(e) => setEditFormValues({ ...editFormValues, city: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-province" className="text-sm font-medium text-gray-700">
                            Province
                          </Label>
                          <Input
                            id="edit-province"
                            value={editFormValues.province}
                            onChange={(e) => setEditFormValues({ ...editFormValues, province: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-postal" className="text-sm font-medium text-gray-700">
                            Postal Code
                          </Label>
                          <Input
                            id="edit-postal"
                            value={editFormValues.postalCode}
                            onChange={(e) => setEditFormValues({ ...editFormValues, postalCode: e.target.value })}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-ssn" className="text-sm font-medium text-gray-700">
                            SSN/TIN
                          </Label>
                          <Input
                            id="edit-ssn"
                            value={editFormValues.ssnTin}
                            onChange={(e) => setEditFormValues({ ...editFormValues, ssnTin: e.target.value })}
                            className="w-full"
                            placeholder="Social Security Number / Tax ID"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-passport" className="text-sm font-medium text-gray-700">
                            Passport Number
                          </Label>
                          <Input
                            id="edit-passport"
                            value={editFormValues.passport}
                            onChange={(e) => setEditFormValues({ ...editFormValues, passport: e.target.value })}
                            className="w-full"
                            placeholder="For non-residents"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-occupation" className="text-sm font-medium text-gray-700">
                            Occupation
                          </Label>
                          <Input
                            id="edit-occupation"
                            value={editFormValues.occupation}
                            onChange={(e) => setEditFormValues({ ...editFormValues, occupation: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-employment" className="text-sm font-medium text-gray-700">
                            Employment Status
                          </Label>
                          <Select
                            value={editFormValues.employmentStatus}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, employmentStatus: value })}
                          >
                            <SelectTrigger id="edit-employment" className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Employed">Employed</SelectItem>
                              <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                              <SelectItem value="Retired">Retired</SelectItem>
                              <SelectItem value="Unemployed">Unemployed</SelectItem>
                              <SelectItem value="Student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-dependents" className="text-sm font-medium text-gray-700">
                            Number of Dependents
                          </Label>
                          <Input
                            id="edit-dependents"
                            type="number"
                            min="0"
                            value={editFormValues.dependents}
                            onChange={(e) => setEditFormValues({ ...editFormValues, dependents: e.target.value })}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-lifestage" className="text-sm font-medium text-gray-700">
                            Life Stage
                          </Label>
                          <Select
                            value={editFormValues.lifeStage}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, lifeStage: value })}
                          >
                            <SelectTrigger id="edit-lifestage" className="w-full">
                              <SelectValue placeholder="Select life stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Young Professional">Young Professional</SelectItem>
                              <SelectItem value="Mid-Career">Mid-Career</SelectItem>
                              <SelectItem value="Pre-Retirement">Pre-Retirement</SelectItem>
                              <SelectItem value="Retiree">Retiree</SelectItem>
                              <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-tax" className="text-sm font-medium text-gray-700">
                            Tax Status
                          </Label>
                          <Select
                            value={editFormValues.taxStatus}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, taxStatus: value })}
                          >
                            <SelectTrigger id="edit-tax" className="w-full">
                              <SelectValue placeholder="Select tax status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Resident">Resident</SelectItem>
                              <SelectItem value="Non-Resident">Non-Resident</SelectItem>
                              <SelectItem value="Part-Year Resident">Part-Year Resident</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-health" className="text-sm font-medium text-gray-700">
                            Health Considerations
                          </Label>
                          <Input
                            id="edit-health"
                            value={editFormValues.healthConsiderations}
                            onChange={(e) => setEditFormValues({ ...editFormValues, healthConsiderations: e.target.value })}
                            className="w-full"
                            placeholder="If relevant to financial planning"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-status" className="text-sm font-medium text-gray-700">
                          Client Status
                        </Label>
                        <Select
                          value={editFormValues.status}
                          onValueChange={(value) => setEditFormValues({ ...editFormValues, status: value as ClientStatus })}
                        >
                          <SelectTrigger id="edit-status" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Prospect">Prospect</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Financial Circumstances and Profile */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        2. Financial Circumstances and Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-annual-income" className="text-sm font-medium text-gray-700">
                            Annual Income
                          </Label>
                          <Input
                            id="edit-annual-income"
                            type="number"
                            value={editFormValues.annualIncome}
                            onChange={(e) => setEditFormValues({ ...editFormValues, annualIncome: e.target.value })}
                            className="w-full"
                            placeholder="$0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-future-income" className="text-sm font-medium text-gray-700">
                            Expected Future Income
                          </Label>
                          <Input
                            id="edit-future-income"
                            type="number"
                            value={editFormValues.expectedFutureIncome}
                            onChange={(e) => setEditFormValues({ ...editFormValues, expectedFutureIncome: e.target.value })}
                            className="w-full"
                            placeholder="$0.00"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-networth" className="text-sm font-medium text-gray-700">
                            Net Worth
                          </Label>
                          <Input
                            id="edit-networth"
                            type="number"
                            value={editFormValues.netWorth}
                            onChange={(e) => setEditFormValues({ ...editFormValues, netWorth: e.target.value })}
                            className="w-full"
                            placeholder="$0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-investable" className="text-sm font-medium text-gray-700">
                            Investable Funds
                          </Label>
                          <Input
                            id="edit-investable"
                            type="number"
                            value={editFormValues.investableFunds}
                            onChange={(e) => setEditFormValues({ ...editFormValues, investableFunds: e.target.value })}
                            className="w-full"
                            placeholder="$0.00"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-assets" className="text-sm font-medium text-gray-700">
                            Total Assets
                          </Label>
                          <Input
                            id="edit-assets"
                            type="number"
                            value={editFormValues.assets}
                            onChange={(e) => setEditFormValues({ ...editFormValues, assets: e.target.value })}
                            className="w-full"
                            placeholder="Real estate, savings, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-liabilities" className="text-sm font-medium text-gray-700">
                            Total Liabilities
                          </Label>
                          <Input
                            id="edit-liabilities"
                            type="number"
                            value={editFormValues.liabilities}
                            onChange={(e) => setEditFormValues({ ...editFormValues, liabilities: e.target.value })}
                            className="w-full"
                            placeholder="Debts, mortgages, etc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-liquidity" className="text-sm font-medium text-gray-700">
                            Liquidity Needs
                          </Label>
                          <Input
                            id="edit-liquidity"
                            type="number"
                            value={editFormValues.liquidityNeeds}
                            onChange={(e) => setEditFormValues({ ...editFormValues, liquidityNeeds: e.target.value })}
                            className="w-full"
                            placeholder="Cash reserves for emergencies"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-cashflow" className="text-sm font-medium text-gray-700">
                            Cash Flow Patterns
                          </Label>
                          <Input
                            id="edit-cashflow"
                            value={editFormValues.cashFlowPatterns}
                            onChange={(e) => setEditFormValues({ ...editFormValues, cashFlowPatterns: e.target.value })}
                            className="w-full"
                            placeholder="Additions/withdrawals pattern"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 3. Investment Objectives and Portfolio Plans */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        3. Investment Objectives and Portfolio Plans
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-objective" className="text-sm font-medium text-gray-700">
                          Primary Investment Objective
                        </Label>
                        <Select
                          value={editFormValues.primaryObjective}
                          onValueChange={(value) => setEditFormValues({ ...editFormValues, primaryObjective: value })}
                        >
                          <SelectTrigger id="edit-objective" className="w-full">
                            <SelectValue placeholder="Select primary objective" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Capital Appreciation">Capital Appreciation (Growth Funds)</SelectItem>
                            <SelectItem value="Income Generation">Income Generation (Bond/Dividend Funds)</SelectItem>
                            <SelectItem value="Preservation of Capital">Preservation of Capital (Money Market Funds)</SelectItem>
                            <SelectItem value="Balanced Approach">Balanced Approach</SelectItem>
                            <SelectItem value="Tax Efficiency">Tax Efficiency</SelectItem>
                            <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-horizon" className="text-sm font-medium text-gray-700">
                            Time Horizon
                          </Label>
                          <Select
                            value={editFormValues.timeHorizon}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, timeHorizon: value })}
                          >
                            <SelectTrigger id="edit-horizon" className="w-full">
                              <SelectValue placeholder="Select time horizon" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Short-term (1-5 years)">Short-term (1-5 years)</SelectItem>
                              <SelectItem value="Medium-term (5-10 years)">Medium-term (5-10 years)</SelectItem>
                              <SelectItem value="Long-term (10-20 years)">Long-term (10-20 years)</SelectItem>
                              <SelectItem value="Very Long-term (20+ years)">Very Long-term (20+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-strategy" className="text-sm font-medium text-gray-700">
                            Investment Strategy
                          </Label>
                          <Select
                            value={editFormValues.investmentStrategy}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, investmentStrategy: value })}
                          >
                            <SelectTrigger id="edit-strategy" className="w-full">
                              <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active Management">Active Management</SelectItem>
                              <SelectItem value="Passive Management">Passive Management</SelectItem>
                              <SelectItem value="Sector Focus">Sector Focus</SelectItem>
                              <SelectItem value="ESG Focus">ESG (Environmental, Social, Governance)</SelectItem>
                              <SelectItem value="International Focus">International Focus</SelectItem>
                              <SelectItem value="Mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-allocation" className="text-sm font-medium text-gray-700">
                          Asset Allocation
                        </Label>
                        <Input
                          id="edit-allocation"
                          value={editFormValues.assetAllocation}
                          onChange={(e) => setEditFormValues({ ...editFormValues, assetAllocation: e.target.value })}
                          className="w-full"
                          placeholder="e.g., 60% Stocks, 30% Bonds, 10% Cash"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-diversification" className="text-sm font-medium text-gray-700">
                          Diversification Strategy
                        </Label>
                        <Input
                          id="edit-diversification"
                          value={editFormValues.diversificationStrategy}
                          onChange={(e) => setEditFormValues({ ...editFormValues, diversificationStrategy: e.target.value })}
                          className="w-full"
                          placeholder="Describe diversification approach"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-rebalancing" className="text-sm font-medium text-gray-700">
                          Rebalancing Rules
                        </Label>
                        <Input
                          id="edit-rebalancing"
                          value={editFormValues.rebalancingRules}
                          onChange={(e) => setEditFormValues({ ...editFormValues, rebalancingRules: e.target.value })}
                          className="w-full"
                          placeholder="Frequency and thresholds for rebalancing"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 4. Risk Tolerance and Experience */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        4. Risk Tolerance and Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-risk-profile" className="text-sm font-medium text-gray-700">
                            Risk Profile
                          </Label>
                          <Select
                            value={editFormValues.riskProfile}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, riskProfile: value })}
                          >
                            <SelectTrigger id="edit-risk-profile" className="w-full">
                              <SelectValue placeholder="Select risk profile" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Conservative">Conservative (Low Risk)</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Aggressive">Aggressive (High Risk)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-risk-attitude" className="text-sm font-medium text-gray-700">
                            Attitude Toward Risk
                          </Label>
                          <Input
                            id="edit-risk-attitude"
                            value={editFormValues.riskAttitude}
                            onChange={(e) => setEditFormValues({ ...editFormValues, riskAttitude: e.target.value })}
                            className="w-full"
                            placeholder="Willingness to accept losses, volatility tolerance"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-experience" className="text-sm font-medium text-gray-700">
                            Investment Experience
                          </Label>
                          <Select
                            value={editFormValues.investmentExperience}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, investmentExperience: value })}
                          >
                            <SelectTrigger id="edit-experience" className="w-full">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Novice">Novice</SelectItem>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Sophisticated">Sophisticated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-years" className="text-sm font-medium text-gray-700">
                            Years Investing
                          </Label>
                          <Input
                            id="edit-years"
                            type="number"
                            min="0"
                            value={editFormValues.yearsInvesting}
                            onChange={(e) => setEditFormValues({ ...editFormValues, yearsInvesting: e.target.value })}
                            className="w-full"
                            placeholder="Number of years"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-knowledge" className="text-sm font-medium text-gray-700">
                          Knowledge Level
                        </Label>
                        <Input
                          id="edit-knowledge"
                          value={editFormValues.knowledgeLevel}
                          onChange={(e) => setEditFormValues({ ...editFormValues, knowledgeLevel: e.target.value })}
                          className="w-full"
                          placeholder="Familiarity with mutual funds and investments"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 5. Beneficiaries and Account Relationship Factors */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        5. Beneficiaries and Account Relationship Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-beneficiary" className="text-sm font-medium text-gray-700">
                            Primary Beneficiary
                          </Label>
                          <Input
                            id="edit-beneficiary"
                            value={editFormValues.beneficiary}
                            onChange={(e) => setEditFormValues({ ...editFormValues, beneficiary: e.target.value })}
                            className="w-full"
                            placeholder="Primary beneficiary name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-contingent" className="text-sm font-medium text-gray-700">
                            Contingent Beneficiary
                          </Label>
                          <Input
                            id="edit-contingent"
                            value={editFormValues.contingentBeneficiary}
                            onChange={(e) => setEditFormValues({ ...editFormValues, contingentBeneficiary: e.target.value })}
                            className="w-full"
                            placeholder="Contingent beneficiary name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-account-type" className="text-sm font-medium text-gray-700">
                            Account Type
                          </Label>
                          <Select
                            value={editFormValues.accountType}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, accountType: value })}
                          >
                            <SelectTrigger id="edit-account-type" className="w-full">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Individual">Individual</SelectItem>
                              <SelectItem value="Joint">Joint (with rights of survivorship)</SelectItem>
                              <SelectItem value="Trust">Trust</SelectItem>
                              <SelectItem value="Custodial">Custodial (for minors)</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="IRA">IRA</SelectItem>
                              <SelectItem value="401k">401(k)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-ownership" className="text-sm font-medium text-gray-700">
                            Account Ownership
                          </Label>
                          <Input
                            id="edit-ownership"
                            value={editFormValues.accountOwnership}
                            onChange={(e) => setEditFormValues({ ...editFormValues, accountOwnership: e.target.value })}
                            className="w-full"
                            placeholder="Ownership details"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-relationship" className="text-sm font-medium text-gray-700">
                            Relationship Roles
                          </Label>
                          <Input
                            id="edit-relationship"
                            value={editFormValues.relationshipRoles}
                            onChange={(e) => setEditFormValues({ ...editFormValues, relationshipRoles: e.target.value })}
                            className="w-full"
                            placeholder="POA, trustee, proxy voting preferences"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-client-type" className="text-sm font-medium text-gray-700">
                            Client Type
                          </Label>
                          <Select
                            value={editFormValues.clientType}
                            onValueChange={(value) => setEditFormValues({ ...editFormValues, clientType: value })}
                          >
                            <SelectTrigger id="edit-client-type" className="w-full">
                              <SelectValue placeholder="Select client type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Individual">Individual</SelectItem>
                              <SelectItem value="Pension Fund">Pension Fund</SelectItem>
                              <SelectItem value="Family Office">Family Office</SelectItem>
                              <SelectItem value="Institution">Institution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* Form Error */}
                {formError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-600">{formError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditClient(false)}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Save Changes
                  </Button>
                </div>
                </div>
              </ScrollArea>
            </form>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No client selected</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Upload Documents Sheet */}
      <Sheet open={showUploadDocs} onOpenChange={setShowUploadDocs}>
        <SheetContent side="right" className="!w-[50vw] !max-w-[50vw] overflow-y-auto bg-gray-50">
          {selectedClient ? (
            <>
              <SheetHeader className="pb-4 border-b border-gray-200">
                <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileUp className="h-5 w-5" />
                  Upload Documents
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-600 mt-1">
                  {selectedClient.name} • Account {selectedClient.accountNumber}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                <div className="mt-6 space-y-5">
                  {/* Document Category 1 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        1. Beneficiary Designation or Change Form
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Beneficiary_Designation_Form_2024.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Oct 15, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 2 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        2. Successor Holder/Annuitant Election Form
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Successor_Holder_Election_TFSA.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Nov 2, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 3 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        3. Estate Planning or Will-Related Supporting Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Will_Executor_Designation.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Sep 28, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Trust_Agreement_2024.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Sep 28, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 4 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        4. Proof of Identity and Relationship Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Drivers_License_Front.jpg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Oct 10, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Marriage_Certificate.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Oct 10, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 5 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        5. Account Ownership Change Form
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">Joint_Account_Ownership_Form.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Nov 5, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 6 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        6. Power of Attorney (POA) or Third-Party Authorization Form
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">POA_Financial_Authorization.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Oct 22, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 7 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        7. Death Notification and Claim Forms
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">T4RSP_Claim_Form_2024.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Sep 10, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Category 8 */}
                  <Card className="border border-gray-200 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        8. Tax and Compliance Updates Related to Beneficiaries
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                        <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG up to 25 MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-gray-300 text-xs">
                          Browse files
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-2">Uploaded Documents:</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">CRA_RC240_TFSA_Form.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Oct 30, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-700">NR301_NonResident_Form.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500">Oct 30, 2024</span>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No client selected</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={showAddClient}
        onOpenChange={(open) => {
          setShowAddClient(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleAddClient}>
            <DialogHeader>
              <DialogTitle>Add Client</DialogTitle>
              <DialogDescription>
                Capture the essential client information.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    value={formValues.name}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Smith Family Trust"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    value={formValues.accountNumber}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, accountNumber: e.target.value }))
                    }
                    placeholder="e.g. A-123456"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formValues.email}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="name@clientmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formValues.phone}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beneficiary">Beneficiary</Label>
                  <Input
                    id="beneficiary"
                    value={formValues.beneficiary}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, beneficiary: e.target.value }))
                    }
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formValues.status}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        status: event.target.value as ClientStatus,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Prospect">Prospect</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center">
                    <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Attach initial document package
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX up to 10 MB</p>
                    <Button variant="outline" size="sm" className="mt-3 border-gray-300">
                      Browse files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300"
                onClick={() => {
                  setShowAddClient(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Buy More Units Dialog */}
      <Dialog open={showBuyUnits} onOpenChange={setShowBuyUnits}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Plus className="h-5 w-5 text-green-600" />
              Buy More Units
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Purchase additional units of {selectedHolding?.holding.name || ""}
            </DialogDescription>
          </DialogHeader>

          {selectedHolding && (
            <div className="space-y-6 py-4">
              {/* Account Balance */}
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Account Balance</span>
                      <span className="text-sm font-semibold text-blue-700">
                        {selectedHolding.plan.type} CAD
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(selectedHolding.plan.marketValue)}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600 pt-2 border-t border-blue-200">
                      <span>Settled: {formatCurrency(selectedHolding.plan.marketValue)}</span>
                      <span>Unsettled: {formatCurrency(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Holdings */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    Current Holdings ({selectedHolding.plan.type})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Units</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedHolding.holding.shares.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedHolding.holding.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Market Value</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedHolding.holding.marketValue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount" className="text-sm font-medium text-gray-700">
                    Investment Amount ($)
                  </Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    placeholder="Enter amount to invest"
                    value={buyOrderData.investmentAmount}
                    onChange={(e) => {
                      const amount = e.target.value;
                      setBuyOrderData({
                        ...buyOrderData,
                        investmentAmount: amount,
                        units: amount
                          ? (
                              parseFloat(amount) / selectedHolding.holding.price
                            ).toFixed(4)
                          : "",
                        estimatedCost: amount ? parseFloat(amount) : 0,
                        unitsToPurchase: amount
                          ? parseFloat(amount) / selectedHolding.holding.price
                          : 0,
                      });
                    }}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units" className="text-sm font-medium text-gray-700">
                    Or Number of Units
                  </Label>
                  <Input
                    id="units"
                    type="number"
                    step="0.0001"
                    placeholder="Enter number of units"
                    value={buyOrderData.units}
                    onChange={(e) => {
                      const units = e.target.value;
                      const unitsNum = parseFloat(units) || 0;
                      setBuyOrderData({
                        ...buyOrderData,
                        units: units,
                        investmentAmount: unitsNum
                          ? (unitsNum * selectedHolding.holding.price).toFixed(2)
                          : "",
                        estimatedCost: unitsNum * selectedHolding.holding.price,
                        unitsToPurchase: unitsNum,
                      });
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Estimated Cost */}
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Estimated Cost</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(buyOrderData.estimatedCost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Units to purchase:</span>
                      <span className="font-medium">
                        {buyOrderData.unitsToPurchase.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-blue-200">
                      Based on avg. cost {formatCurrency(selectedHolding.holding.price)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyUnits(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedHolding && buyOrderData.estimatedCost > 0) {
                  setOrderConfirmationData({
                    symbol: selectedHolding.holding.symbol,
                    name: selectedHolding.holding.name,
                    units: buyOrderData.unitsToPurchase,
                    price: selectedHolding.holding.price,
                    totalCost: buyOrderData.estimatedCost,
                  });
                  setShowBuyUnits(false);
                  setShowOrderConfirmation(true);
                }
              }}
              disabled={buyOrderData.estimatedCost === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Place Buy Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Order Confirmation
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-600">
              Your buy order has been placed successfully
            </DialogDescription>
          </DialogHeader>

          {orderConfirmationData && (
            <div className="space-y-4 py-4">
              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Product</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {orderConfirmationData.symbol} - {orderConfirmationData.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units</p>
                        <p className="text-sm font-medium text-gray-900">
                          {orderConfirmationData.units.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(orderConfirmationData.price)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Cost</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(orderConfirmationData.totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowOrderConfirmation(false);
                setOrderConfirmationData(null);
                setBuyOrderData({
                  investmentAmount: "",
                  units: "",
                  estimatedCost: 0,
                  unitsToPurchase: 0,
                });
              }}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Units Dialog */}
      <Dialog open={showSellUnits} onOpenChange={setShowSellUnits}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-red-600">
              <Minus className="h-5 w-5 text-red-600" />
              Sell Units
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Sell units of {selectedHolding?.holding.name || ""}
            </DialogDescription>
          </DialogHeader>

          {selectedHolding && (
            <div className="space-y-6 py-4">
              {/* Current Holdings */}
              <Card className="border border-gray-200 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    Current Holdings ({selectedHolding.plan.type})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Units Available</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedHolding.holding.shares.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedHolding.holding.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Market Value</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedHolding.holding.marketValue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sell Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sellUnits" className="text-sm font-medium text-gray-700">
                    Number of Units to Sell
                  </Label>
                  <div className="relative">
                    <Input
                      id="sellUnits"
                      type="number"
                      step="0.0001"
                      placeholder={`Max: ${selectedHolding.holding.shares.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                      value={sellOrderData.units}
                      onChange={(e) => {
                        const units = e.target.value;
                        const unitsNum = parseFloat(units) || 0;
                        const maxUnits = selectedHolding.holding.shares;
                        const validUnits = unitsNum > maxUnits ? maxUnits : unitsNum;
                        setSellOrderData({
                          ...sellOrderData,
                          units: units,
                          dollarAmount: validUnits
                            ? (validUnits * selectedHolding.holding.price).toFixed(2)
                            : "",
                          estimatedProceeds: validUnits * selectedHolding.holding.price,
                          unitsToSell: validUnits,
                        });
                      }}
                      className="w-full pr-20"
                      max={selectedHolding.holding.shares}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseFloat(sellOrderData.units) || 0;
                          const newValue = Math.min(current + 1, selectedHolding.holding.shares);
                          setSellOrderData({
                            ...sellOrderData,
                            units: newValue.toString(),
                            dollarAmount: (newValue * selectedHolding.holding.price).toFixed(2),
                            estimatedProceeds: newValue * selectedHolding.holding.price,
                            unitsToSell: newValue,
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseFloat(sellOrderData.units) || 0;
                          const newValue = Math.max(current - 1, 0);
                          setSellOrderData({
                            ...sellOrderData,
                            units: newValue > 0 ? newValue.toString() : "",
                            dollarAmount: newValue > 0 ? (newValue * selectedHolding.holding.price).toFixed(2) : "",
                            estimatedProceeds: newValue * selectedHolding.holding.price,
                            unitsToSell: newValue,
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellDollarAmount" className="text-sm font-medium text-gray-700">
                    Or Dollar Amount ($)
                  </Label>
                  <Input
                    id="sellDollarAmount"
                    type="number"
                    placeholder="Enter dollar amount"
                    value={sellOrderData.dollarAmount}
                    onChange={(e) => {
                      const amount = e.target.value;
                      const amountNum = parseFloat(amount) || 0;
                      const maxAmount = selectedHolding.holding.marketValue;
                      const validAmount = amountNum > maxAmount ? maxAmount : amountNum;
                      const unitsFromAmount = validAmount / selectedHolding.holding.price;
                      setSellOrderData({
                        ...sellOrderData,
                        dollarAmount: amount,
                        units: validAmount > 0 ? unitsFromAmount.toFixed(4) : "",
                        estimatedProceeds: validAmount,
                        unitsToSell: unitsFromAmount,
                      });
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Estimated Proceeds */}
              <Card className="border border-yellow-200 bg-yellow-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Estimated Proceeds</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(sellOrderData.estimatedProceeds)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Units to sell:</span>
                      <span className="font-medium">
                        {sellOrderData.unitsToSell.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-yellow-200">
                      Before fees and taxes • Based on avg. cost {formatCurrency(selectedHolding.holding.price)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSellUnits(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedHolding && sellOrderData.estimatedProceeds > 0) {
                  setSellOrderConfirmationData({
                    symbol: selectedHolding.holding.symbol,
                    name: selectedHolding.holding.name,
                    units: sellOrderData.unitsToSell,
                    price: selectedHolding.holding.price,
                    totalProceeds: sellOrderData.estimatedProceeds,
                  });
                  setShowSellUnits(false);
                  setShowSellOrderConfirmation(true);
                }
              }}
              disabled={sellOrderData.estimatedProceeds === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Place Sell Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Order Confirmation Dialog */}
      <Dialog open={showSellOrderConfirmation} onOpenChange={setShowSellOrderConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Order Confirmation
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-600">
              Your sell order has been placed successfully
            </DialogDescription>
          </DialogHeader>

          {sellOrderConfirmationData && (
            <div className="space-y-4 py-4">
              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Product</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {sellOrderConfirmationData.symbol} - {sellOrderConfirmationData.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units</p>
                        <p className="text-sm font-medium text-gray-900">
                          {sellOrderConfirmationData.units.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(sellOrderConfirmationData.price)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Proceeds</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(sellOrderConfirmationData.totalProceeds)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowSellOrderConfirmation(false);
                setSellOrderConfirmationData(null);
                setSellOrderData({
                  units: "",
                  dollarAmount: "",
                  estimatedProceeds: 0,
                  unitsToSell: 0,
                });
              }}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch/Convert Fund Dialog */}
      <Dialog open={showSwitchFund || showConvertFund} onOpenChange={(open) => {
        if (!open) {
          setShowSwitchFund(false);
          setShowConvertFund(false);
          setIsConvertMode(false);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 text-xl font-semibold ${isConvertMode ? "text-orange-600" : "text-blue-600"}`}>
              <ArrowLeftRight className={`h-5 w-5 ${isConvertMode ? "text-orange-600" : "text-blue-600"}`} />
              {isConvertMode ? "Convert Fund" : "Switch Fund"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {isConvertMode 
                ? `Convert from ${selectedHolding?.holding.name || ""} (${selectedHolding && getCompanyFromFundName(selectedHolding.holding.name)}) to a ${convertData.selectedCompany || "different company"} fund`
                : `Switch from ${selectedHolding?.holding.name || ""} to another ${selectedHolding && getCompanyFromFundName(selectedHolding.holding.name)} fund`
              }
            </DialogDescription>
          </DialogHeader>

          {selectedHolding && (
            <div className="space-y-6 py-4">
              {/* Current Fund */}
              <Card className="border border-gray-200 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    Current Fund ({selectedHolding.plan.type})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {selectedHolding.holding.name}
                    </p>
                    <p className="text-xs text-gray-600">Company: {getCompanyFromFundName(selectedHolding.holding.name)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Units Available</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedHolding.holding.shares.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Market Value</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedHolding.holding.marketValue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Select Fund Company */}
              <div className="space-y-2">
                <Label htmlFor="switchCompany" className="text-sm font-medium text-gray-700">
                  Select Fund Company
                </Label>
                <Select
                  value={isConvertMode ? convertData.selectedCompany : switchData.selectedCompany}
                  onValueChange={(value) => {
                    const currentCompany = getCompanyFromFundName(selectedHolding.holding.name);
                    const isSameCompany = value === currentCompany;
                    
                    if (!isSameCompany) {
                      // Different company - switch to convert mode seamlessly
                      setIsConvertMode(true);
                      setConvertData({
                        units: switchData.units,
                        selectedCompany: value,
                        selectedFund: "",
                        selectedFundSymbol: "",
                        estimatedValue: 0,
                      });
                    } else {
                      // Same company - switch to switch mode
                      setIsConvertMode(false);
                      setSwitchData({
                        ...switchData,
                        selectedCompany: value,
                        selectedFund: "",
                        selectedFundSymbol: "",
                        estimatedValue: 0,
                      });
                    }
                  }}
                >
                  <SelectTrigger id="switchCompany" className="w-full">
                    <SelectValue placeholder="Select fund company" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(FUND_DATABASE.map(f => f.company))).map((company) => {
                      const currentCompany = getCompanyFromFundName(selectedHolding.holding.name);
                      const isSameCompany = company === currentCompany;
                      return (
                        <SelectItem key={company} value={company}>
                          <div className="flex items-center justify-between w-full">
                            <span>{company}</span>
                            {isSameCompany && (
                              <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Switch</Badge>
                            )}
                            {!isSameCompany && (
                              <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">Convert</Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {(isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={isConvertMode ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-blue-100 text-blue-700 border-blue-200"}>
                      {isConvertMode ? "Conversion" : "Switch"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ({selectedHolding.holding.name}) → ({isConvertMode ? convertData.selectedCompany : switchData.selectedCompany})
                    </span>
                  </div>
                )}
              </div>

              {/* Select Fund to Switch/Convert to */}
              {(isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) && (
                <div className="space-y-2">
                  <Label htmlFor="switchFund" className="text-sm font-medium text-gray-700">
                    Select Fund to {isConvertMode ? "Convert" : "Switch"} to
                  </Label>
                  <Select
                    value={isConvertMode ? convertData.selectedFund : switchData.selectedFund}
                    onValueChange={(value) => {
                      const selectedFund = FUND_DATABASE.find(f => f.name === value);
                      if (selectedFund) {
                        const units = isConvertMode ? convertData.units : switchData.units;
                        const unitsNum = parseFloat(units) || 0;
                        const estimatedValue = unitsNum > 0 ? unitsNum * selectedHolding.holding.price : 0;
                        
                        if (isConvertMode) {
                          setConvertData({
                            ...convertData,
                            selectedFund: selectedFund.name,
                            selectedFundSymbol: selectedFund.symbol,
                            estimatedValue: estimatedValue,
                          });
                        } else {
                          setSwitchData({
                            ...switchData,
                            selectedFund: selectedFund.name,
                            selectedFundSymbol: selectedFund.symbol,
                            estimatedValue: estimatedValue,
                          });
                        }
                      }
                    }}
                  >
                    <SelectTrigger id="switchFund" className="w-full">
                      <SelectValue placeholder={`Select ${isConvertMode ? convertData.selectedCompany : switchData.selectedCompany} fund`} />
                    </SelectTrigger>
                    <SelectContent>
                      {FUND_DATABASE.filter(f => f.company === (isConvertMode ? convertData.selectedCompany : switchData.selectedCompany)).map((fund) => (
                        <SelectItem key={fund.symbol} value={fund.name}>
                          <div className="flex flex-col">
                            <span className="font-medium">{fund.name}</span>
                            <span className="text-xs text-gray-500">{fund.symbol} • {fund.category || "N/A"}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Units to Switch/Convert */}
              <div className="space-y-2">
                <Label htmlFor="switchUnits" className="text-sm font-medium text-gray-700">
                  Units to {isConvertMode ? "Convert" : "Switch"}
                </Label>
                <div className="relative">
                  <Input
                    id="switchUnits"
                    type="number"
                    step="0.0001"
                    placeholder={`Max: ${selectedHolding.holding.shares.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                    value={isConvertMode ? convertData.units : switchData.units}
                    onChange={(e) => {
                      const units = e.target.value;
                      const unitsNum = parseFloat(units) || 0;
                      const maxUnits = selectedHolding.holding.shares;
                      const validUnits = unitsNum > maxUnits ? maxUnits : unitsNum;
                      const estimatedValue = validUnits * selectedHolding.holding.price;
                      
                      if (isConvertMode) {
                        setConvertData({
                          ...convertData,
                          units: units,
                          estimatedValue: estimatedValue,
                        });
                      } else {
                        setSwitchData({
                          ...switchData,
                          units: units,
                          estimatedValue: estimatedValue,
                        });
                      }
                    }}
                    className="w-full pr-20"
                    max={selectedHolding.holding.shares}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        const current = parseFloat(isConvertMode ? convertData.units : switchData.units) || 0;
                        const newValue = Math.min(current + 1, selectedHolding.holding.shares);
                        const estimatedValue = newValue * selectedHolding.holding.price;
                        
                        if (isConvertMode) {
                          setConvertData({
                            ...convertData,
                            units: newValue.toString(),
                            estimatedValue: estimatedValue,
                          });
                        } else {
                          setSwitchData({
                            ...switchData,
                            units: newValue.toString(),
                            estimatedValue: estimatedValue,
                          });
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const current = parseFloat(isConvertMode ? convertData.units : switchData.units) || 0;
                        const newValue = Math.max(current - 1, 0);
                        const estimatedValue = newValue * selectedHolding.holding.price;
                        
                        if (isConvertMode) {
                          setConvertData({
                            ...convertData,
                            units: newValue > 0 ? newValue.toString() : "",
                            estimatedValue: estimatedValue,
                          });
                        } else {
                          setSwitchData({
                            ...switchData,
                            units: newValue > 0 ? newValue.toString() : "",
                            estimatedValue: estimatedValue,
                          });
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Switch/Convert Preview */}
              <Card className={isConvertMode ? "border border-orange-200 bg-orange-50" : "border border-blue-200 bg-blue-50"}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={isConvertMode ? "bg-orange-600 text-white" : "bg-blue-600 text-white"}>
                        {isConvertMode ? "CONVERSION" : "SWITCH"}
                      </Badge>
                      <span className={`text-sm font-medium ${isConvertMode ? "text-orange-700" : "text-blue-700"}`}>
                        ({selectedHolding.holding.name}) → ({(isConvertMode ? convertData.selectedFund : switchData.selectedFund) || (isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) || "Select fund"})
                      </span>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${isConvertMode ? "text-orange-700" : "text-blue-700"}`}>
                      <span>Units to {isConvertMode ? "convert" : "switch"}:</span>
                      <span className="font-medium">
                        {parseFloat(isConvertMode ? convertData.units : switchData.units) || 0}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${isConvertMode ? "text-orange-700" : "text-blue-700"}`}>
                      <span>Estimated value:</span>
                      <span className="font-medium">
                        {formatCurrency(isConvertMode ? convertData.estimatedValue : switchData.estimatedValue)}
                      </span>
                    </div>
                    <div className={`text-xs pt-2 border-t ${isConvertMode ? "text-orange-600 border-orange-200" : "text-blue-600 border-blue-200"}`}>
                      This will {isConvertMode ? "convert" : "switch"} {selectedHolding.holding.name} to {(isConvertMode ? convertData.selectedFund : switchData.selectedFund) || (isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) || "selected fund"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowSwitchFund(false);
              setShowConvertFund(false);
              setIsConvertMode(false);
            }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (isConvertMode) {
                  if (selectedHolding && convertData.estimatedValue > 0 && convertData.selectedFund) {
                    setConvertConfirmationData({
                      fromFund: selectedHolding.holding.name,
                      toFund: convertData.selectedFund,
                      units: parseFloat(convertData.units) || 0,
                      estimatedValue: convertData.estimatedValue,
                    });
                    setShowSwitchFund(false);
                    setShowConvertFund(false);
                    setIsConvertMode(false);
                    setShowConvertConfirmation(true);
                  }
                } else {
                  if (selectedHolding && switchData.estimatedValue > 0 && switchData.selectedFund) {
                    setSwitchConfirmationData({
                      fromFund: selectedHolding.holding.name,
                      toFund: switchData.selectedFund,
                      units: parseFloat(switchData.units) || 0,
                      estimatedValue: switchData.estimatedValue,
                    });
                    setShowSwitchFund(false);
                    setShowConvertFund(false);
                    setIsConvertMode(false);
                    setShowSwitchConfirmation(true);
                  }
                }
              }}
              disabled={(isConvertMode ? convertData.estimatedValue : switchData.estimatedValue) === 0 || !(isConvertMode ? convertData.selectedFund : switchData.selectedFund)}
              className={isConvertMode ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
            >
              Execute {isConvertMode ? "Conversion" : "Switch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Fund Dialog - REMOVED - Now using unified dialog above that handles both Switch and Convert */}

      {/* Switch Confirmation Dialog */}
      <Dialog open={showSwitchConfirmation} onOpenChange={setShowSwitchConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Switch Confirmation
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-600">
              Your switch order has been executed successfully
            </DialogDescription>
          </DialogHeader>

          {switchConfirmationData && (
            <div className="space-y-4 py-4">
              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">From Fund</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {switchConfirmationData.fromFund}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">To Fund</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {switchConfirmationData.toFund}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units Switched</p>
                        <p className="text-sm font-medium text-gray-900">
                          {switchConfirmationData.units.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(switchConfirmationData.estimatedValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowSwitchConfirmation(false);
                setSwitchConfirmationData(null);
                setSwitchData({
                  units: "",
                  selectedCompany: "",
                  selectedFund: "",
                  estimatedValue: 0,
                });
              }}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Confirmation Dialog */}
      <Dialog open={showConvertConfirmation} onOpenChange={setShowConvertConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Conversion Confirmation
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-600">
              Your conversion order has been executed successfully
            </DialogDescription>
          </DialogHeader>

          {convertConfirmationData && (
            <div className="space-y-4 py-4">
              <Card className="border border-gray-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">From Fund</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {convertConfirmationData.fromFund}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">To Fund</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {convertConfirmationData.toFund}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units Converted</p>
                        <p className="text-sm font-medium text-gray-900">
                          {convertConfirmationData.units.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(convertConfirmationData.estimatedValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowConvertConfirmation(false);
                setConvertConfirmationData(null);
                setConvertData({
                  units: "",
                  selectedCompany: "",
                  selectedFund: "",
                  estimatedValue: 0,
                });
              }}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Clients;
