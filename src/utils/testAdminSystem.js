/**
 * Admin System Test Utility
 * 
 * This script helps test the admin role-based access control system.
 * Run these tests to verify everything is working correctly.
 */

import { ADMIN_EMAILS, shouldBeAdmin } from './adminSetup';

/**
 * Test the admin email checking function
 */
export const testAdminEmailCheck = () => {
  console.log('🧪 Testing Admin Email Check...');
  
  const testCases = [
    { email: 'divyebhatnagar784@gmail.com', expected: true },
    { email: 'calloutesports@gmail.com', expected: true },
    { email: 'DIVYEBHATNAGAR784@GMAIL.COM', expected: true }, // Case insensitive
    { email: 'regular.user@gmail.com', expected: false },
    { email: 'test@example.com', expected: false },
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach(({ email, expected }) => {
    const result = shouldBeAdmin(email);
    if (result === expected) {
      console.log(`✅ ${email}: ${result} (expected ${expected})`);
      passed++;
    } else {
      console.log(`❌ ${email}: ${result} (expected ${expected})`);
      failed++;
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
};

/**
 * Display current admin configuration
 */
export const showAdminConfig = () => {
  console.log('🔧 Admin System Configuration:');
  console.log('================================');
  console.log('Authorized Admin Emails:');
  ADMIN_EMAILS.forEach((email, index) => {
    console.log(`  ${index + 1}. ${email}`);
  });
  console.log('================================\n');
};

/**
 * Test admin system components
 */
export const testAdminSystem = () => {
  console.log('🚀 Starting Admin System Tests...\n');
  
  showAdminConfig();
  
  const emailTestPassed = testAdminEmailCheck();
  
  if (emailTestPassed) {
    console.log('🎉 All tests passed! Admin system is configured correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the configuration.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy Firestore security rules');
  console.log('2. Have admin users sign up normally');
  console.log('3. Verify admin access in the dashboard');
  console.log('4. Test non-admin user restrictions');
};

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called manually
  window.testAdminSystem = testAdminSystem;
  console.log('💡 Admin system test functions loaded. Run testAdminSystem() to test.');
}