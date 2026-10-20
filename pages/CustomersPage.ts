// Import the necessary building blocks (types) from the Playwright testing framework
import { Page, Locator } from '@playwright/test';

// Import the form page object so we can return it (Fluent Interface)
import { CustomerFormPage } from './CustomerFormPage';

// Define and export our blueprint class so our test files can use it
export class CustomersPage {
  
  // ==========================================
  // 1. PROPERTIES (The Blueprint Dimensions)
  // ==========================================
  // Holds the reference to the active browser window/tab instance
  private page: Page;
  
  // Declares the variable for the main page header text element
  private customersHeader: Locator;
  
  // Declares the variable for the blue "Add Customer" action button
  private addcustomerButton: Locator;

  // Declares the variables for the pagination selection dropdown menu 
  private paginationDropdown: Locator;

  // ==========================================
  // 2. CONSTRUCTOR (The Electrical Wiring)
  // ==========================================
  
  // Runs automatically the moment a test script creates a 'new CustomersPage(page)' instance
  constructor(page: Page) {
    
    // Saves the active browser window to our internal property for future actions
    this.page = page;

    // Locates the specific text heading on the page to confirm we are in the right room
    this.customersHeader = page.getByRole('heading', { name: "Customers - 'Auburn' Branch",exact:true });

    // Locates the physical "Add Customer" link using its role and text label
    this.addcustomerButton = page.getByRole('link', { name: 'Add customer' });

    // Locate the pagination dropdown menu 
    this.paginationDropdown = page.getByLabel('Per page 5 10 25 50 All');
  }

  // ==========================================
  // 3. METHODS (The Homeowner Actions)
  // ==========================================

  // FLUENT INTERFACE: Clicks "Add Customer" and returns a fresh CustomerFormPage instance
async clickAddCustomer(): Promise<CustomerFormPage> {

  // Command the browser to wait for and click our pre-wired "Add Customer" button
  await this.addcustomerButton.click();

  // Automatically instantiate and hand back the form page object
  return new CustomerFormPage(this.page);
}

  // A data provider method that hands the header element back to the main test script
  async getCustomersHeader() {
    
    // Returns the raw locator block so the test script can verify its visibility on screen
    return this.customersHeader;
  }
// An action method that forces the table display settings to reveal all record rows
  async showAllRows() {
    if (await this.paginationDropdown.isVisible()) {
      await this.paginationDropdown.selectOption('all');
    } else {
      console.log('Pagination dropdown not visible (Empty state table). Skipping "Show All" configuration.');
    }
  }

  // LOCATOR CHAINING: Finds the one table row that contains this unique account number
  getCustomerRow(accountNumber: string): Locator {
    return this.page.getByRole('row').filter({ hasText: accountNumber });
  }

  // Clicks "Edit" inside that customer's row and returns the form page object (Fluent Interface)
  async clickEditCustomer(accountNumber: string): Promise<CustomerFormPage> {
    await this.getCustomerRow(accountNumber).getByRole('link', { name: 'Edit' }).click();
    return new CustomerFormPage(this.page);
  }

  // Clicks "Delete" inside that customer's row
  async clickDeleteCustomer(accountNumber: string) {
    await this.getCustomerRow(accountNumber).getByRole('button', { name: 'Delete' }).click();
  }

  // Clicks the confirm "Delete" button inside the confirmation popup
  async confirmDelete() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  }

}
