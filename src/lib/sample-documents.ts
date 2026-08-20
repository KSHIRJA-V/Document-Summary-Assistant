import { SampleDocPreset } from "@/types";

export const SAMPLE_DOCUMENTS: SampleDocPreset[] = [
  {
    id: "tech-architecture",
    title: "Distributed Microservices Architecture Blueprint",
    subtitle: "Cloud-Native Scalability & Zero-Trust Security Specification",
    category: "Engineering",
    fileType: "pdf",
    description: "Enterprise software architecture RFC describing an event-driven architecture, Kafka streaming, gRPC communication, Kubernetes orchestration, and disaster recovery SLA.",
    tags: ["Microservices", "Kafka", "Kubernetes", "Architecture"],
    pages: [
      `ARCHITECTURAL SPECIFICATION: ENTERPRISE CLOUD-NATIVE BACKBONE
Document Version: 3.4 | Classification: Technical Confidential
Author: Lead Systems Architect | Approved by: Engineering Steering Committee
Date of Release: Q3 Fiscal Architecture Review

1. EXECUTIVE OVERVIEW & ARCHITECTURAL INTENT
This blueprint defines the target architecture for migrating our monolithic core processing pipeline to an asynchronous, distributed event-driven mesh. The primary objectives are to achieve 99.999% availability, handle peak loads of 150,000 transactions per second (TPS) with p99 latency below 45 milliseconds, and establish zero-trust identity isolation across all microservices.

2. CORE INFRASTRUCTURE & ORCHESTRATION LAYER
2.1 Kubernetes Cluster Topology:
Services will be deployed across three multi-region Kubernetes clusters (AWS us-east-1, eu-central-1, and ap-southeast-1) behind an Anycast Cloudflare Enterprise CDN. Cluster node pools will utilize AMD EPYC c6a.4xlarge compute instances with auto-scaling triggers based on custom CPU, memory, and queue lag metrics.

2.2 Service Mesh & Inter-Service Telemetry:
Istio 1.22 with Ambient Mesh will enforce mutual TLS (mTLS) with SPIFFE/SPIRE cryptographic workload identities. All inter-service remote procedure calls will migrate from REST/JSON to protobuf-based gRPC over HTTP/2, reducing network serialization overhead by 68%.

3. DATA PIPELINE & STATE MANAGEMENT
3.1 Event Streaming Backbone:
Apache Kafka 3.7 with KRaft consensus will serve as the immutable distributed ledger. Topics will be partitioned using composite customer tenant hashing to guarantee in-order delivery. Schema Registry will enforce backward and forward schema compatibility across all avro/protobuf producers.

3.2 Database Strategy:
- Operational OLTP: Distributed PostgreSQL (CockroachDB) with geo-partitioned ranges.
- Caching Layer: Redis 7.2 Cluster with active-active replication and LRU eviction.
- Analytics & Audit Warehouse: ClickHouse columnar store for petabyte-scale real-time telemetry.

4. RESILIENCE, FAULT TOLERANCE & DISASTER RECOVERY
- Recovery Point Objective (RPO): < 0 seconds (synchronous multi-AZ replication).
- Recovery Time Objective (RTO): < 30 seconds automated failover via Global Server Load Balancing (GSLB).
- Circuit Breaker Pattern: Implemented using Envoy rate-limiting filters with exponential backoff and jitter algorithms.

5. ACTIONABLE ROLLOUT TIMELINE & MILESTONES
- Phase 1 (Month 1-2): Deploy Kafka KRaft cluster and baseline Istio Ambient Mesh.
- Phase 2 (Month 3-4): Migrate User Auth, Billing Gateway, and Notification services to gRPC.
- Phase 3 (Month 5-6): Complete CockroachDB cutover and run automated chaos engineering drills with Chaos Mesh.
- Phase 4 (Month 7): Final monolithic decommission and executive retrospective.`,
      `6. SECURITY COMPLIANCE & GOVERNANCE
All data at rest will be encrypted using AWS KMS with customer-managed keys (CMK) utilizing AES-256-GCM. In-transit traffic requires TLS 1.3 with strict cipher suites. SOC 2 Type II, ISO 27001, and HIPAA compliance audits are scheduled for annual renewal in November. Role-Based Access Control (RBAC) and Just-In-Time (JIT) engineer access are strictly enforced via Okta Single Sign-On and Teleport bastion proxy.

7. COST MODELING & INFRASTRUCTURE OPEX
Consolidated monthly cloud infrastructure expenditure is projected at $42,500 during steady state, reflecting a 32% savings compared to legacy reserved EC2 monolithic footprints. Automated spot-instance draining and Karpenter autoscalers are projected to yield an incremental $7,800 monthly dividend.`
    ],
    sampleText: `ARCHITECTURAL SPECIFICATION: ENTERPRISE CLOUD-NATIVE BACKBONE
Document Version: 3.4 | Classification: Technical Confidential
Author: Lead Systems Architect | Approved by: Engineering Steering Committee

1. EXECUTIVE OVERVIEW & ARCHITECTURAL INTENT
This blueprint defines the target architecture for migrating our monolithic core processing pipeline to an asynchronous, distributed event-driven mesh. The primary objectives are to achieve 99.999% availability, handle peak loads of 150,000 transactions per second (TPS) with p99 latency below 45 milliseconds, and establish zero-trust identity isolation across all microservices.

2. CORE INFRASTRUCTURE & ORCHESTRATION LAYER
2.1 Kubernetes Cluster Topology: Services will be deployed across three multi-region Kubernetes clusters (AWS us-east-1, eu-central-1, and ap-southeast-1) behind an Anycast Cloudflare Enterprise CDN. Cluster node pools will utilize AMD EPYC c6a.4xlarge compute instances with auto-scaling triggers based on custom CPU, memory, and queue lag metrics.
2.2 Service Mesh & Inter-Service Telemetry: Istio 1.22 with Ambient Mesh will enforce mutual TLS (mTLS) with SPIFFE/SPIRE cryptographic workload identities. All inter-service remote procedure calls will migrate from REST/JSON to protobuf-based gRPC over HTTP/2, reducing network serialization overhead by 68%.

3. DATA PIPELINE & STATE MANAGEMENT
3.1 Event Streaming Backbone: Apache Kafka 3.7 with KRaft consensus will serve as the immutable distributed ledger. Topics will be partitioned using composite customer tenant hashing to guarantee in-order delivery.
3.2 Database Strategy: Operational OLTP with Distributed PostgreSQL (CockroachDB), Caching via Redis 7.2 Cluster with active-active replication, and petabyte-scale analytics via ClickHouse columnar store.

4. RESILIENCE & DISASTER RECOVERY
- Recovery Point Objective (RPO): < 0 seconds (synchronous multi-AZ replication).
- Recovery Time Objective (RTO): < 30 seconds automated failover via Global Server Load Balancing.
- Circuit Breakers: Implemented using Envoy rate-limiting filters with exponential backoff and jitter algorithms.

5. ACTIONABLE ROLLOUT TIMELINE & MILESTONES
- Phase 1 (Month 1-2): Deploy Kafka KRaft cluster and baseline Istio Ambient Mesh.
- Phase 2 (Month 3-4): Migrate User Auth, Billing Gateway, and Notification services to gRPC.
- Phase 3 (Month 5-6): Complete CockroachDB cutover and run automated chaos engineering drills.
- Phase 4 (Month 7): Monolithic decommission and executive retrospective.

6. SECURITY COMPLIANCE & GOVERNANCE
All data at rest will be encrypted using AWS KMS with customer-managed keys (CMK) utilizing AES-256-GCM. In-transit traffic requires TLS 1.3. SOC 2 Type II, ISO 27001, and HIPAA compliance audits are scheduled for annual renewal in November.

7. COST MODELING & INFRASTRUCTURE OPEX
Consolidated monthly cloud infrastructure expenditure is projected at $42,500 during steady state, reflecting a 32% savings compared to legacy reserved EC2 footprints.`
  },
  {
    id: "business-contract",
    title: "Master Software Services & SLA Agreement",
    subtitle: "Enterprise B2B Technology Partnership & Support Schedule",
    category: "Business",
    fileType: "pdf",
    description: "Comprehensive enterprise MSA governing intellectual property assignment, payment schedules, 99.9% uptime commitments, limitation of liability, and non-disclosure clauses.",
    tags: ["Legal", "Contract", "MSA", "SLA"],
    pages: [
      `MASTER SERVICES AGREEMENT (MSA) & SERVICE LEVEL COMMITMENT
Effective Date: October 1, 2025
Parties: Nexus Global Technologies Inc. ("Provider") and Apex Commerce Corp. ("Client")

1. SCOPE OF SERVICES & DELIVERABLES
Provider agrees to design, engineer, maintain, and support custom cloud logistics software ("Deliverables") as outlined in attached Statement of Work (SOW-2025-09). Provider shall deliver source code, deployment automation pipelines, unit and integration test suites, and operational runbooks.

2. COMPENSATION, FEES & INVOICING SCHEDULE
2.1 Professional Services Retainer: Client shall pay Provider a monthly fixed retainer of $65,000 USD, billed on the 1st of each calendar month with Net 30 payment terms. Late payments accrue interest at 1.5% per month or the statutory maximum.
2.2 Milestone Incentives: Completion of Phase 1 User Acceptance Testing (UAT) by December 15, 2025 triggers a performance incentive bonus of $25,000 USD.

3. SERVICE LEVEL AGREEMENT (SLA) & UPTIME COMMITMENTS
3.1 Platform Availability: Provider guarantees 99.95% monthly system uptime excluding scheduled maintenance windows (Sunday 02:00-04:00 UTC with 7 days advance notice).
3.2 Severity Response Times:
- Severity 1 (Critical Outage affecting >20% users): Response within 15 minutes, hourly executive status updates, resolution target under 4 hours.
- Severity 2 (Major Feature Degraded): Response within 1 hour, resolution target under 12 hours.
- Severity 3 (Minor Bug / Workaround Available): Response within 8 business hours.
3.3 Service Credits: Failure to meet the 99.95% availability threshold in any calendar month entitles Client to a 10% credit against the subsequent month's invoice, scaling to 25% if uptime drops below 99.0%.

4. INTELLECTUAL PROPERTY & PROPRIETARY RIGHTS
4.1 Work Made For Hire: Upon receipt of full payment, all bespoke custom code, user interfaces, workflows, and database schemas developed specifically for Client shall be the sole and exclusive property of Client ("Work Product").
4.2 Background Technology: Provider retains all rights, title, and interest in pre-existing developer toolkits, libraries, core architectural patterns, and utilities ("Provider IP"). Provider grants Client a perpetual, royalty-free, worldwide license to utilize Provider IP embedded within the Deliverables.

5. CONFIDENTIALITY & NON-DISCLOSURE
Each party agrees to maintain the strict confidentiality of all proprietary technical, financial, and business data for a period of 5 years following contract termination. Trade secret protections survive indefinitely.

6. LIMITATION OF LIABILITY
Neither party's aggregate liability arising out of or related to this agreement shall exceed the total amount paid by Client to Provider in the preceding 12 months, except in instances of gross negligence, willful misconduct, or breach of Section 5 (Confidentiality).

7. GOVERNING LAW & JURISDICTION
This agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles.`
    ],
    sampleText: `MASTER SERVICES AGREEMENT (MSA) & SERVICE LEVEL COMMITMENT
Effective Date: October 1, 2025
Parties: Nexus Global Technologies Inc. ("Provider") and Apex Commerce Corp. ("Client")

1. SCOPE OF SERVICES: Provider agrees to engineer, maintain, and support custom cloud logistics software as outlined in SOW-2025-09. Deliverables include source code, deployment automation, test suites, and operational runbooks.
2. COMPENSATION & TERMS: Monthly fixed retainer of $65,000 USD, Net 30 payment terms. Milestone incentive bonus of $25,000 upon Phase 1 UAT signoff by December 15, 2025.
3. SERVICE LEVEL AGREEMENT (SLA):
- Guaranteed 99.95% monthly uptime.
- Severity 1 Critical Outage: 15-minute response, 4-hour target resolution.
- Severity 2 Major Degradation: 1-hour response, 12-hour resolution.
- Service Credits: 10% invoice credit for uptime misses, escalating to 25% below 99.0%.
4. INTELLECTUAL PROPERTY: Work Product is owned exclusively by Client upon payment in full. Provider retains pre-existing tools and grants a perpetual, royalty-free license.
5. CONFIDENTIALITY: 5-year non-disclosure covenant; trade secrets protected indefinitely.
6. LIABILITY CAP: Capped at total fees paid in the prior 12 months, excluding gross negligence or confidentiality breaches.
7. GOVERNING LAW: Delaware jurisdiction.`
  },
  {
    id: "financial-report",
    title: "Q3 Fiscal Performance & Strategic Earnings Summary",
    subtitle: "Consolidated Balance Sheet, ARR Growth & Margin Expansion",
    category: "Finance",
    fileType: "pdf",
    description: "Quarterly corporate earnings statement detailing $148.2M ARR, 124% net revenue retention, EBITDA margin expansion, customer cohort expansion, and FY2026 guidance.",
    tags: ["Financials", "ARR", "EBITDA", "Earnings"],
    pages: [
      `Q3 FISCAL FINANCIAL SUMMARY & INVESTOR BRIEFING
Company: Horizon Enterprise SaaS Inc. | Ticker: HZN (NASDAQ)
Reporting Period: Three Months Ended September 30, 2025
Published: October 24, 2025

1. FINANCIAL HIGHLIGHTS & TOP-LINE MOMENTUM
- Annual Recurring Revenue (ARR): Reached $148.2M, representing 38.4% Year-over-Year (YoY) growth.
- Total Quarterly Revenue: $39.4M, surpassing consensus analyst estimates of $37.8M by 4.2%.
- Net Revenue Retention (NRR): Sustained a premier 124.6% across enterprise cohorts (> $100k ACV).
- Gross Revenue Retention (GRR): Maintained 96.2%, underscoring exceptional customer stickiness.
- Enterprise Customer Count: 842 total enterprise accounts, up from 618 accounts in Q3 of the prior fiscal year (+36.2%).

2. MARGIN EXPANSION & PROFITABILITY METRICS
- GAAP Gross Margin: 78.4%, expanding 210 basis points YoY driven by cloud infrastructure optimizations and serverless adoption.
- Non-GAAP Operating Income: $6.8M, representing a 17.3% operating margin (vs 11.2% in Q3 prior year).
- Adjusted EBITDA: $8.9M, achieving an EBITDA margin of 22.6%.
- Free Cash Flow (FCF): $9.4M generated during the quarter, with FCF margin reaching 23.9%.
- Cash & Equivalents: Balance sheet concluded the quarter with $112.5M in unencumbered cash, cash equivalents, and short-term Treasuries, with zero outstanding long-term debt.

3. SEGMENT PERFORMANCE & CUSTOMER EXPANSION
- North America Enterprise: $26.8M revenue (+34% YoY), driven by financial services and healthcare vertical penetration.
- EMEA Expansion: $9.2M revenue (+48% YoY), marked by landmark multi-year deployments in the United Kingdom and DACH region.
- APAC & Emerging Markets: $3.4M revenue (+41% YoY), representing highest velocity growth pipeline.

4. CAPITAL ALLOCATION & STRATEGIC R&D INVESTMENTS
During Q3, Horizon allocated $11.6M (29.4% of revenue) to Research & Development, with primary capital deployed toward generative AI workflow copilot integrations, sovereign cloud compliance modules, and automated compliance auditing pipelines.

5. FY2026 FORWARD GUIDANCE & OUTLOOK
- Full Year FY2026 Revenue Guidance raised to $164.0M - $166.5M (representing 36-38% YoY growth).
- Full Year Non-GAAP Operating Margin forecasted at 18.0% - 19.5%.
- Target FCF Generation for full fiscal year increased to $38.0M.`
    ],
    sampleText: `Q3 FISCAL FINANCIAL SUMMARY & INVESTOR BRIEFING
Company: Horizon Enterprise SaaS Inc. | Ticker: HZN (NASDAQ)
Reporting Period: Three Months Ended September 30, 2025

1. FINANCIAL HIGHLIGHTS & TOP-LINE MOMENTUM
- Annual Recurring Revenue (ARR): $148.2M (+38.4% YoY).
- Total Quarterly Revenue: $39.4M, beating consensus estimates of $37.8M by 4.2%.
- Net Revenue Retention (NRR): 124.6% enterprise cohort.
- Gross Revenue Retention: 96.2%.
- Enterprise Customers: 842 total accounts (+36.2% YoY).

2. MARGIN EXPANSION & PROFITABILITY
- GAAP Gross Margin: 78.4% (+210 bps YoY).
- Non-GAAP Operating Income: $6.8M (17.3% margin).
- Adjusted EBITDA: $8.9M (22.6% margin).
- Free Cash Flow: $9.4M (23.9% FCF margin).
- Cash Reserves: $112.5M with zero long-term debt.

3. SEGMENT PERFORMANCE
- North America: $26.8M (+34% YoY).
- EMEA: $9.2M (+48% YoY).
- APAC: $3.4M (+41% YoY).

4. STRATEGIC R&D
- $11.6M deployed to R&D (Generative AI copilots, sovereign cloud modules).

5. FY2026 GUIDANCE
- Full Year FY2026 Revenue raised to $164M - $166.5M.
- Non-GAAP Operating Margin forecasted at 18-19.5%.
- FY2026 Target FCF increased to $38.0M.`
  },
  {
    id: "scanned-invoice",
    title: "Scanned Procurement Invoice & Logistics Receipt",
    subtitle: "Optical Character Recognition (OCR) Test Document",
    category: "Operations",
    fileType: "image",
    description: "Simulated scanned enterprise supply-chain invoice featuring line item tables, VAT calculations, shipping tracking numbers, and remittance banking instructions.",
    tags: ["Invoice", "OCR", "Procurement", "Scanned"],
    pages: [
      `ACME INDUSTRIAL SUPPLY CHAIN LOGISTICS CORP
TAX INVOICE / BILL OF LADING
Invoice Number: INV-2025-88491
Invoice Date: August 14, 2025
Due Date: September 13, 2025 (Net 30)
PO Reference Number: PO-99420-APEX
Customer Account ID: CUST-77412-B

BILL TO:
Apex Manufacturing & Distribution Corp
450 Technology Parkway, Suite 300
Austin, TX 78759 USA
Contact: Accounts Payable (ap@apexmanufacturing.com)

SHIP TO:
Apex Fulfillment Distribution Center #4
1200 Logistics Boulevard, Dock 14B
Memphis, TN 38118 USA
Carrier: Freight Express Inc. | Tracking: FX-9941-88219-TN

ITEMIZED CHARGES:
Item 1: Model X-400 High-Capacity Industrial Sensors (Qty: 250 units @ $140.00) = $35,000.00
Item 2: Fiber-Optic Transceiver Modules 100G QSFP28 (Qty: 100 units @ $85.00) = $8,500.00
Item 3: Ruggedized DIN-Rail Power Supply Units 480W (Qty: 40 units @ $215.00) = $8,600.00
Item 4: Expedited Temperature-Controlled Freight Shipping = $2,450.00
Item 5: Customs & Hazardous Material Documentation Fee = $350.00

FINANCIAL RECAP:
Subtotal: $54,900.00
State Sales Tax (8.25%): $4,529.25
Total Amount Due: $59,429.25 USD

REMITTANCE & WIRE INSTRUCTIONS:
Bank Name: First National Commercial Bank
Routing Transit Number (ABA): 021000089
SWIFT/BIC Code: FNCBUSB33
Account Number: 9940-1284-9021
Beneficiary: ACME Supply Chain Logistics Corp
Please reference Invoice # INV-2025-88491 on all ACH/Wire remittances.
Questions? Contact billing@acmelogistics.com or call +1 (800) 555-0199.`
    ],
    sampleText: `ACME INDUSTRIAL SUPPLY CHAIN LOGISTICS CORP
TAX INVOICE / BILL OF LADING
Invoice Number: INV-2025-88491
Invoice Date: August 14, 2025
Due Date: September 13, 2025 (Net 30)
PO Reference: PO-99420-APEX | Customer ID: CUST-77412-B

BILL TO: Apex Manufacturing Corp (Austin, TX)
SHIP TO: Apex Fulfillment Center #4 (Memphis, TN)
Tracking: FX-9941-88219-TN

ITEMIZED LINE ITEMS:
- 250x Model X-400 Industrial Sensors @ $140.00: $35,000.00
- 100x Fiber-Optic Transceiver Modules 100G @ $85.00: $8,500.00
- 40x Ruggedized DIN-Rail Power Supplies @ $215.00: $8,600.00
- Expedited Freight Shipping: $2,450.00
- Documentation Fee: $350.00

FINANCIAL TOTALS:
Subtotal: $54,900.00
Sales Tax (8.25%): $4,529.25
Total Due: $59,429.25 USD

REMITTANCE INSTRUCTIONS:
First National Commercial Bank | ABA: 021000089 | SWIFT: FNCBUSB33 | Account: 9940-1284-9021
Remittance reference: INV-2025-88491 | Contact: billing@acmelogistics.com`
  }
];
