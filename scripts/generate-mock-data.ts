#!/usr/bin/env tsx

import Stripe from 'stripe';
import { config } from 'dotenv';

// Load environment variables
config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Mock data generators
const generateCustomers = () => [
  {
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '+1-555-0123',
    description: 'Leading software solutions provider',
    address: {
      line1: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'US',
    },
  },
  {
    name: 'TechStart Inc',
    email: 'finance@techstart.com',
    phone: '+1-555-0456',
    description: 'Innovative startup in the AI space',
    address: {
      line1: '456 Startup Blvd',
      city: 'Austin',
      state: 'TX',
      postal_code: '78701',
      country: 'US',
    },
  },
  {
    name: 'Global Enterprises LLC',
    email: 'accounts@global.com',
    phone: '+1-555-0789',
    description: 'International consulting firm',
    address: {
      line1: '789 Enterprise Way',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'US',
    },
  },
  {
    name: 'Digital Solutions Co',
    email: 'payments@digitalsolutions.com',
    phone: '+1-555-0321',
    description: 'Digital transformation consultancy',
    address: {
      line1: '321 Digital Dr',
      city: 'Seattle',
      state: 'WA',
      postal_code: '98101',
      country: 'US',
    },
  },
  {
    name: 'Innovation Labs',
    email: 'billing@innovationlabs.com',
    phone: '+1-555-0654',
    description: 'R&D focused technology company',
    address: {
      line1: '654 Innovation Circle',
      city: 'Boston',
      state: 'MA',
      postal_code: '02101',
      country: 'US',
    },
  },
];

const generateProducts = () => [
  {
    name: 'Premium Software License',
    description: 'Annual premium software license with full features',
    unit_amount: 12000, // $120.00
    currency: 'usd',
    recurring: { interval: 'year' },
  },
  {
    name: 'Monthly SaaS Subscription',
    description: 'Monthly subscription to our cloud platform',
    unit_amount: 4900, // $49.00
    currency: 'usd',
    recurring: { interval: 'month' },
  },
  {
    name: 'Consulting Services',
    description: 'Professional consulting services (per hour)',
    unit_amount: 15000, // $150.00
    currency: 'usd',
  },
  {
    name: 'API Usage Credits',
    description: 'Credits for API usage and processing',
    unit_amount: 2500, // $25.00
    currency: 'usd',
  },
  {
    name: 'Enterprise Support',
    description: 'Premium enterprise support package',
    unit_amount: 50000, // $500.00
    currency: 'usd',
    recurring: { interval: 'month' },
  },
  {
    name: 'Data Processing',
    description: 'Bulk data processing and analytics',
    unit_amount: 7500, // $75.00
    currency: 'usd',
  },
  {
    name: 'Custom Integration',
    description: 'Custom integration development',
    unit_amount: 250000, // $2500.00
    currency: 'usd',
  },
];

const generateInvoiceItems = (products: any[]) => {
  const items = [];
  const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per invoice

  for (let i = 0; i < numItems; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity

    items.push({
      price_data: {
        currency: product.currency,
        unit_amount: product.unit_amount,
        product_data: {
          name: product.name,
          description: product.description,
        },
      },
      quantity,
    });
  }

  return items;
};

const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomStatus = () => {
  const statuses = ['open', 'paid', 'uncollectible'];
  const weights = [0.6, 0.3, 0.1]; // 60% open, 30% paid, 10% uncollectible
  const random = Math.random();

  if (random < weights[0]) return 'open';
  if (random < weights[0] + weights[1]) return 'paid';
  return 'uncollectible';
};

async function generateMockData() {
  console.log('🚀 Starting mock data generation...\n');

  try {
    // Create customers
    console.log('👥 Creating customers...');
    const customers = [];
    const customerData = generateCustomers();

    for (const customerInfo of customerData) {
      const customer = await stripe.customers.create(customerInfo);
      customers.push(customer);
      console.log(`   ✅ Created customer: ${customer.name} (${customer.email})`);
    }

    // Create products
    console.log('\n📦 Creating products...');
    const products = [];
    const productData = generateProducts();

    for (const productInfo of productData) {
      const product = await stripe.products.create({
        name: productInfo.name,
        description: productInfo.description,
      });

      const price = await stripe.prices.create({
        unit_amount: productInfo.unit_amount,
        currency: productInfo.currency,
        product: product.id,
        ...(productInfo.recurring && { recurring: productInfo.recurring }),
      });

      products.push({ ...productInfo, id: product.id, price_id: price.id });
      console.log(`   ✅ Created product: ${product.name} - $${(productInfo.unit_amount / 100).toFixed(2)}`);
    }

    // Create invoices
    console.log('\n🧾 Creating invoices...');
    const invoices = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
    const futureDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now

    for (let i = 0; i < 15; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const createdDate = getRandomDate(threeMonthsAgo, now);
      const dueDate = new Date(Math.max(now.getTime() + 7 * 24 * 60 * 60 * 1000, createdDate.getTime() + 30 * 24 * 60 * 60 * 1000)); // At least 7 days from now

      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: 'send_invoice',
        due_date: Math.floor(dueDate.getTime() / 1000),
        description: `Invoice for ${customer.name} - ${createdDate.toLocaleDateString()}`,
        footer: 'Thank you for your business!',
        auto_advance: false,
      });

      // Add line items
      const items = generateInvoiceItems(products);
      for (const item of items) {
        await stripe.invoiceItems.create({
          customer: customer.id,
          invoice: invoice.id,
          amount: item.price_data.unit_amount * item.quantity,
          currency: item.price_data.currency,
          description: `${item.price_data.product_data.name} (${item.quantity}x) - ${item.price_data.product_data.description}`,
        });
      }

      // Finalize invoice
      await stripe.invoices.finalizeInvoice(invoice.id);

      // Randomly mark some as paid or uncollectible
      const status = getRandomStatus();
      if (status === 'uncollectible') {
        await stripe.invoices.markUncollectible(invoice.id);
      }
      // Note: We skip automatic payment to avoid token issues
      // Invoices will remain as 'open' for testing payment flows

      const updatedInvoice = await stripe.invoices.retrieve(invoice.id);
      invoices.push(updatedInvoice);

      const total = (updatedInvoice.total / 100).toFixed(2);
      const actualStatus = updatedInvoice.status;
      const statusEmoji = actualStatus === 'paid' ? '✅' : actualStatus === 'open' ? '⏳' : '❌';
      console.log(`   ${statusEmoji} Created invoice: ${updatedInvoice.number} - $${total} (${actualStatus})`);
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   👥 Customers: ${customers.length}`);
    console.log(`   📦 Products: ${products.length}`);
    console.log(`   🧾 Invoices: ${invoices.length}`);

    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const outstandingAmount = invoices
      .filter(inv => inv.status === 'open')
      .reduce((sum, inv) => sum + inv.total, 0);

    console.log(`   💰 Total Revenue: $${(totalRevenue / 100).toFixed(2)}`);
    console.log(`   📋 Outstanding: $${(outstandingAmount / 100).toFixed(2)}`);

    console.log('\n🎉 Mock data generation completed successfully!');
    console.log('\n💡 Tips:');
    console.log('   - Use Stripe Dashboard to view created data');
    console.log('   - Test payment flows with test card numbers');
    console.log('   - Run your spend-bot to interact with this data');

  } catch (error) {
    console.error('❌ Error generating mock data:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateMockData();
}

export { generateMockData };