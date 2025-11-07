import { PageLayout } from '@/components/layout/PageLayout';
import { useState, useEffect } from 'react';
import { ClientCard } from '@/components/kyp/ClientCard';
import { StatsCards } from '@/components/kyp/StatsCards';
import { fundsData } from '@/data/fundsData';
import cibcLogo from '@/assets/logos/cibc.png';
import tdLogo from '@/assets/logos/td.png';
import manulifeLogo from '@/assets/logos/manulife.png';
import horizonsLogo from '@/assets/logos/horizons.png';
import rbcLogo from '@/assets/logos/rbc.png';
import scotiaLogo from '@/assets/logos/scotia.png';
import agfLogo from '@/assets/logos/agf.png';
import bmoLogo from '@/assets/logos/bmo.png';
import jpmorganLogo from '@/assets/logos/jpmorgan.png';
import evolveLogo from '@/assets/logos/evolve.png';
import invescoLogo from '@/assets/logos/invesco.webp';
import brandesLogo from '@/assets/logos/brandes.png';
import bmgLogo from '@/assets/logos/bmg.png';
import beutelGoodmanLogo from '@/assets/logos/beutel-goodman.jpg';
import iaClaringtonLogo from '@/assets/logos/ia-clarington.png';
import ciLogo from '@/assets/logos/ci.png';
import dynamicLogo from '@/assets/logos/dynamic.png';
import fidelityLogo from '@/assets/logos/fidelity.jpeg';
import canoeLogo from '@/assets/logos/canoe.jpeg';
import mawerLogo from '@/assets/logos/mawer.png';
import mackenzieLogo from '@/assets/logos/mackenzie.jpeg';

export default function KYPTool() {
  const [expandedClient, setExpandedClient] = useState<string | null>('client-1');
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

  // Check for newly reviewed products on component mount
  useEffect(() => {
    const reviewedProduct = sessionStorage.getItem('reviewedProduct');
    if (reviewedProduct) {
      setReviewedProducts(prev => new Set([...prev, reviewedProduct]));
      sessionStorage.removeItem('reviewedProduct');
    }
  }, []);

  // Company logo mapping
  const companyLogos: Record<string, string> = {
    'agf': agfLogo,
    'aim': invescoLogo, // Invesco
    'atl': cibcLogo, // CIBC Asset Management
    'bip': brandesLogo, // Brandes
    'bmg': bmgLogo, // BMG
    'bmo': bmoLogo,
    'btg': beutelGoodmanLogo, // Beutel Goodman
    'ccm': iaClaringtonLogo, // IA Clarington
    'cig': ciLogo, // CI Investments
    'dyn': dynamicLogo, // Dynamic Funds
    'edg': evolveLogo, // EdgePoint
    'fid': fidelityLogo, // Fidelity
    'goc': canoeLogo, // Canoe Financial
    'maw': mawerLogo, // Mawer
    'mfc': mackenzieLogo, // Mackenzie Financial
  };

  const toggleClient = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const toggleCompany = (companyId: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedCompanies(newExpanded);
  };

  // Update product status based on reviewed products
  const clientsWithUpdatedStatus = fundsData.map(client => ({
    ...client,
    companies: client.companies.map(company => ({
      ...company,
      products: company.products.map(product => ({
        ...product,
        status: reviewedProducts.has(product.code) ? 'Reviewed' : product.status
      }))
    }))
  }));

  return (
    <PageLayout title="">
      <div className="space-y-4">
        {clientsWithUpdatedStatus.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            isExpanded={expandedClient === client.id}
            expandedCompanies={expandedCompanies}
            onToggleClient={() => toggleClient(client.id)}
            onToggleCompany={toggleCompany}
            companyLogos={companyLogos}
          />
        ))}
      </div>
    </PageLayout>
  );
}
