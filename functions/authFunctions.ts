import {Page ,expect} from '@playwright/test';

  //---REUSABLE LOGIN FUNCTION ---
  export async function loginToLoanApp(page: Page, branch: string, user: string,pass:string) {
  //Navigate to the Login Application Area
  await page.goto('https://qa.hitekschool.com/lms/3108/login');

  //Locate Branch text box and enter branch name using getByLabel
  await page.getByLabel( 'Branch Name*').fill(branch);

  //Locate User Name text box and enter username using getByLabel
  await page.getByLabel('User Name*').fill(user);

  //Locate Password text box and enter password using getByLabel
  await page.getByLabel('Password*' ).fill(pass);

  //Click Sign in button(kept as getByRole because it is a button action)
  await page.getByRole('button', { name: 'Sign in' }).click();
 //Assertion to validate successful navigation to Dashboard page
  await expect(page.getByRole('main')).toContainText(`Welcome ${user}`);
  }

  //--- REUSABLE LOGOUT FUNCTION ---
  export async function logout(page: Page) {

  //Click Logout button(kept as getByRole  because it is a button action) 
  await page.getByRole('button', { name: 'Log out' }).click();

  //Assertion to validate successful logout
  await expect(page.getByRole('heading')).toContainText('Sign in to your Branch account');
}
// --- REUSABLE Fill Add User fields FUNCTION ---
export async function fillAddUserFields(page: Page, username: string, password: string, branchRole: string) {

  // Enter the username
  await page.getByLabel('Username*').fill(username);

  // Enter the password
  await page.getByLabel('Password*').fill(password);

  // Select the role from Branch Role DDLB
  await page.getByLabel('Branch Role:*').selectOption(branchRole);

  // Click the Save button
  await page.getByRole('button', { name: 'Save', exact: true }).click();
}
export async function fillAddCustomerFields(page: Page, account: string, firstName: string, lastName: string) {
  //Enter Account#
await page.getByLabel('Account #:*').fill(account);
//Enter First Name
await page.getByLabel('First Name:*').fill(firstName);
//Enter Last Name
await page.getByLabel('Last Name:*').fill(lastName);
//Click the Save button
await page.getByRole('button', { name: 'Save', exact: true }).click();

}
