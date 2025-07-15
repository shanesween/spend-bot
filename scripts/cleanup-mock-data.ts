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

async function cleanupMockData() {
  console.log('🧹 Starting cleanup of mock data...\n');

  try {
    // Delete all invoices
    console.log('🧾 Deleting invoices...');
    const invoices = await stripe.invoices.list({ limit: 100 });
    let invoiceCount = 0;

    for (const invoice of invoices.data) {
      try {
        if (invoice.status === 'draft') {
          await stripe.invoices.del(invoice.id);
        } else {
          await stripe.invoices.voidInvoice(invoice.id);
        }
        invoiceCount++;
        console.log(`   ✅ Deleted invoice: ${invoice.number || invoice.id}`);
      } catch (error) {
        console.log(`   ⚠️  Could not delete invoice ${invoice.id}: ${error.message}`);
      }
    }

    // Delete all customers
    console.log('\n👥 Deleting customers...');
    const customers = await stripe.customers.list({ limit: 100 });
    let customerCount = 0;

    for (const customer of customers.data) {
      try {
        await stripe.customers.del(customer.id);
        customerCount++;
        console.log(`   ✅ Deleted customer: ${customer.name || customer.email || customer.id}`);
      } catch (error) {
        console.log(`   ⚠️  Could not delete customer ${customer.id}: ${error.message}`);
      }
    }

    // Delete all prices first (required before deleting products)
    console.log('\n💰 Deleting prices...');
    const prices = await stripe.prices.list({ limit: 100 });
    let priceCount = 0;
    
    for (const price of prices.data) {
      try {
        await stripe.prices.update(price.id, { active: false });
        priceCount++;
        console.log(`   ✅ Deactivated price: ${price.id}`);
      } catch (error) {
        console.log(`   ⚠️  Could not deactivate price ${price.id}: ${error.message}`);
      }
    }
    
    // Delete all products
    console.log('\n📦 Deleting products...');
    const products = await stripe.products.list({ limit: 100 });
    let productCount = 0;

    for (const product of products.data) {
      try {
        await stripe.products.del(product.id);
        productCount++;
        console.log(`   ✅ Deleted product: ${product.name || product.id}`);
      } catch (error) {
        console.log(`   ⚠️  Could not delete product ${product.id}: ${error.message}`);
      }
    }

    // Summary
    console.log('\n📊 Cleanup Summary:');
    console.log(`   🧾 Invoices deleted: ${invoiceCount}`);
    console.log(`   👥 Customers deleted: ${customerCount}`);
    console.log(`   💰 Prices deactivated: ${priceCount}`);
    console.log(`   📦 Products deleted: ${productCount}`);

    console.log('\n🎉 Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  cleanupMockData();
}

export { cleanupMockData };