// Import the core testing functions and assertion utilities from the Playwright Test runner
import { test, expect } from '@playwright/test';

// Import our custom Page Object classes
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';

// Create a logical test suite block to group all customer management test scenarios together
  test.describe('SmartBank Application - Customer Management Workflows @smoke @regression', () => {
  // Run the tests one after another: Add -> Edit -> Delete  
  // test.describe.configure({ mode: 'serial' });
  // Page objects shared by all three tests
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let customersPage: CustomersPage;

  // Creates a unique 7-digit account number so tests never clash with old data
  const uniqueAccount = () => Math.floor(1000000 + Math.random() * 9000000).toString();

  // ============================================================
  // RUNS BEFORE EACH TEST: Sign in and navigate to Customers Page
  // ============================================================
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    customersPage = new CustomersPage(page);

    await loginPage.navigateTo();
    await loginPage.enterCredentials('Auburn', 'admin', 'tvogt0305');
    await loginPage.clickSignIn();

    // Click on the 'Customers' link in the side menu
    await dashboardPage.goToCustomers();

    // NAVIGATION ASSERTION: Verify we reached the Customers page
    await expect(await customersPage.getCustomersHeader()).toBeVisible();

    // Show all rows so new customers are never hidden on page 2
    await customersPage.showAllRows();
  });

  // ============================================================
  // TEST 1: ADD CUSTOMER
  // ============================================================
  test('Add Customer', async () => {
    const accountNumber = uniqueAccount();

    // Fluent Interface: clicking Add Customer hands us the form page object
    const customerForm = await customersPage.clickAddCustomer();

    // FORM ASSERTION: Verify the Add Customer form opened
    await expect(await customerForm.getPageHeader()).toContainText('Add Customer');

    // Fill the form and click Save
    await customerForm.createCustomerAndSave({
      accountNumber: accountNumber,
      firstName: 'Leslie',
      lastName: 'Kern',
      city: 'Toronto',
      phone: '(416)555-0101',
      email: 'leslie.kern@example.com',
    });

    // Return to the Customers list and show all rows
    await dashboardPage.goToCustomers();
    await customersPage.showAllRows();

    // FINAL ASSERTION: The new customer's row is in the table
    await expect(customersPage.getCustomerRow('Fake button')).toBeVisible();
  });

  // ============================================================
  // TEST 2: EDIT CUSTOMER
  // ============================================================
  test('Edit Customer', async ({ page }) => {
    const accountNumber = uniqueAccount();

    // SETUP: Create a customer to edit
    const addForm = await customersPage.clickAddCustomer();
    await addForm.createCustomerAndSave({
      accountNumber: accountNumber,
      firstName: 'Daniel',
      lastName: 'Hepkins',
    });
    await dashboardPage.goToCustomers();
    await customersPage.showAllRows();

    // Locator Chaining: click Edit in THIS customer's row
    const editForm = await customersPage.clickEditCustomer(accountNumber);

    // FORM ASSERTION: Verify the Edit Customer form opened
    await expect(await editForm.getPageHeader()).toContainText('Edit Customer');

    // Modify only  the last name, then click "Save changes"
    await editForm.updateCustomerDetails({
      lastName: 'Miller',
    });
       // Navigate back to the Customers list on its own
    await dashboardPage.goToCustomers();
    await customersPage.showAllRows();

    // FINAL ASSERTION: The customer's row (found by its unique account number)
    // shows the updated last name 
    const updatedRow = customersPage.getCustomerRow(accountNumber);
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText('Miller');
  });

  // ============================================================
  // TEST 3: DELETE CUSTOMER
  // ============================================================
  test('Delete Customer', async () => {
    const accountNumber = uniqueAccount();

    // SETUP: Create a customer to delete
    const addForm = await customersPage.clickAddCustomer();
    await addForm.createCustomerAndSave({
      accountNumber: accountNumber,
      firstName: 'Laura',
      lastName: 'Green',
    });
    await dashboardPage.goToCustomers();
    await customersPage.showAllRows();

    // PRE-CHECK: The customer exists before deleting
    await expect(customersPage.getCustomerRow(accountNumber)).toBeVisible();

    // Locator Chaining: click Delete in THIS customer's row, then confirm
    await customersPage.clickDeleteCustomer(accountNumber);
    await customersPage.confirmDelete();

    // FINAL ASSERTION: The customer's row is gone
    await expect(customersPage.getCustomerRow(accountNumber)).toHaveCount(0);
  });
});
