import { test, expect } from '@playwright/test';
import { loginToLoanApp, logout, fillAddCustomerFields } from '../functions/authFunctions';

const testCases = [ 
  { account: '1234567', firstName: 'Good', lastName: 'Will', title: 'Mr.' },
  { account: '2345678', firstName: 'June', lastName: 'Smith', title: 'Mrs.' }, 
  { account: '3456790', firstName: 'Johanna', lastName: 'Carpenter', title: 'Miss' }, 
  { account: '4567901', firstName: 'Linda', lastName: 'Johnson', title: 'Ms.' }, 
  { account: '5679012', firstName: 'Olga', lastName: 'Steveston', title: 'Dr.' }
];
   testCases.forEach(({ account, firstName, lastName, title }) => {
     test(`Add Customer valid input - Title: ${title}`,async ({ page}) => {
//Call the reusable login function
await loginToLoanApp(page, 'Auburn', 'admin', 'tvogt0305');  
//Click the Customers link
await page.getByRole('link', { name: 'Customers' }).click();
//Click Add Customer button
await page.getByRole('link', { name: 'Add Customer' }).click();
//Call the reusable fillAddCustomerFields function
await fillAddCustomerFields(page, account, firstName, lastName);
//Validate that the  new Account Number  was created in the Customers table 
await expect(page.locator('tbody')).toContainText(account);
//Click Dashboard link
await page.getByRole('link', { name: 'Dashboard' }).click();
//Click Logout button
await logout(page);
});

});

testCases.forEach(({ account, title }) => {
  test(`Delete Customer - Title: ${title}`, async ({ page }) => {
    //Call the reusable login function
    await loginToLoanApp(page, 'Auburn', 'admin', 'tvogt0305');
    //Click the Customers link
    await page.getByRole('link', { name: 'Customers' }).click();
    //Click the Delete button in the customer's row
    await page.getByRole('row', { name: account }).getByRole('button', { name:'Delete'}).click();
    //Confirm the deletion
    await page.getByRole('button', { name: 'Yes, delete it' }).click();
    //Verify the customer's account link is no longer in the table
    await expect(page.getByRole('link', { name: account })).not.toBeVisible();
    //Click the Dashboard link
    await page.getByRole('link', { name: 'Dashboard' }).click();
    //Call the reusable logout function
    await logout(page);
  });
});