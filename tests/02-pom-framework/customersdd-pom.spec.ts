// Import the core testing functions and assertion utilities from the Playwright Test runner library
import { test, expect } from '@playwright/test';

// Import our custom Page Object classes so the script knows how to interact with the UI
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { CustomerFormPage } from '../../pages/CustomerFormPage';

test.describe('SmartBank Application - Customer Management Workflows @regression', () => {

  // 1. Define the arrays matching your exact title values and Page Object buttons
  const customersTitles = ['Mr.', 'Mrs.', 'Miss', 'Ms.', 'Dr.'];
  const actionButtons = ['Save', 'Save & Add another', 'Cancel'];

  // 2. Outer Loop: Controls the Customer Titles
  for (const title of customersTitles) {
    // 3. Inner Loop: Controls form buttons
    for (const buttonAction of actionButtons) {

      // Dynamically name the test case based on the parameters
      test(`Should handle workflow for Title: "${title}" using Button: "${buttonAction}"`, async ({ page }) => {

        // ========================================================
        // INITIALIZE ALL PAGE OBJECT BLUEPRINTS
        // ========================================================
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const customersPage = new CustomersPage(page);
        const customerFormPage = new CustomerFormPage(page);

        // 2. Generate a unique 7-digit account number for each test run
        const accountNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

        const newCustomerDetails = {
          accountNumber: accountNumber,
          firstName: 'Daniel',
          lastName: 'Klug',
          title: title

        };

        // ========================================================
        // STEP 1: Sign In and Navigate to Dashboard Page
        // ========================================================
        await loginPage.navigateTo();
        await loginPage.enterCredentials('Auburn', 'admin', 'tvogt0305');
        await loginPage.clickSignIn();

        // Use your clean DashboardPage data providers
        const welcomeAdminProfile = await dashboardPage.getWelcomeProfile();
        const branchHeader = await dashboardPage.getBranchHeader();

        await expect(welcomeAdminProfile).toContainText('Welcome admin');
        await expect(branchHeader).toBeVisible();

        // ========================================================
        // STEP 2: Navigate to Customers Page & Verify Room Entry
        // ========================================================
        // Explicitly use DashboardPage action to jump screens
        await dashboardPage.goToCustomers();

        // Explicitly use CustomersPage provider to verify heading
        const customersPageHeading = await customersPage.getCustomersHeader();
        await expect(customersPageHeading).toBeVisible();

        // 👇 INSERT THE NEW PAGINATION METHOD HERE 👇
        // This configures the grid to show all rows before starting form submission actions
        await customersPage.showAllRows();

        // ========================================================
        // STEP 3: Click Add Customer and Verify Form Entry
        // ========================================================
        // Explicitly use CustomersPage action to click the button
        await customersPage.clickAddCustomer();

        // Explicitly use AddCustomerPage provider to scan form header
        const formHeader = await customerFormPage.getPageHeader();
        await expect(formHeader).toBeVisible();

        // ========================================================
        // DATA POPULATION & DYNAMIC FORM ACTION ROUTING
        // ========================================================
        // Run encapsulated workflows depending on the parameters loop
        if (buttonAction === 'Save') {
          await customerFormPage.createCustomerAndSave(newCustomerDetails);

        } else if (buttonAction === 'Save & Add another') {
          await customerFormPage.createCustomerAndAddAnother(newCustomerDetails);

        } else if (buttonAction === 'Cancel') {
          await customerFormPage.createCustomerAndCancel(newCustomerDetails);
        }

        // ========================================================
        // CONDITIONAL ASSERTIONS BASED ON ACTIONS
        // ========================================================
        if (buttonAction === 'Save') {
          // Go to the Customers list, wait for it to load, then show all rows
          await dashboardPage.goToCustomers();
          await expect(customersPageHeading).toBeVisible();
          await customersPage.showAllRows();
          const accountNumberLink = page.getByRole('link', { name: newCustomerDetails.accountNumber, exact: true });
          await expect(accountNumberLink).toBeVisible();

        } else if (buttonAction === 'Save & Add another') {
          // Stays on 'Add Customer' page with fields cleared
          await expect(formHeader).toBeVisible();
          await expect(page.getByLabel('Account #:*')).toHaveValue('');

          // Go to the Customers list, wait for it to load, then show all rows
          await dashboardPage.goToCustomers();
          await expect(customersPageHeading).toBeVisible();
          await customersPage.showAllRows();
          const accountNumberLink = page.getByRole('link', { name: newCustomerDetails.accountNumber, exact: true });
          await expect(accountNumberLink).toBeVisible();

        } else if (buttonAction === 'Cancel') {
          // Back on the Customers list -> show all rows, then make sure the customer is missing
          await expect(customersPageHeading).toBeVisible();
          await customersPage.showAllRows();
          const accountNumberLink = page.getByRole('link', { name: newCustomerDetails.accountNumber, exact: true });
          await expect(accountNumberLink).not.toBeVisible();
        }

        // ========================================================
        // TEARDOWN AND CLEANUP
        // ========================================================
        // Ensure state is normalized before clicking log out
        await dashboardPage.goToDashboard();
        await expect(branchHeader).toBeVisible();

        await dashboardPage.clickLogout();
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

        // ======================================================== 
        // ⏳ ANTI-BRUTE FORCE PACING DELAY 
        // ======================================================== 
        // Pause for 3 seconds to let the SmartBank application firewall cool down 
        // before the next parallel or iterative loop attempts another login. 
        await page.waitForTimeout(3000);
      });

    }
  }
});